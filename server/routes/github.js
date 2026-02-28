import { Router } from 'express'

const router = Router()

// ═══════════ CACHE SYSTEM (Solves "Slow Loading" Problem) ═══════════
// In-memory cache with 5-minute TTL to reduce GitHub API calls and improve speed
const statsCache = new Map()
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

// Clear cache endpoint for debugging
router.get('/clear-cache', (req, res) => {
  statsCache.clear()
  res.json({ message: 'Cache cleared', timestamp: Date.now() })
})

function getCachedStats(username) {
  const cached = statsCache.get(username)
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data
  }
  return null
}

function setCachedStats(username, data) {
  statsCache.set(username, { data, timestamp: Date.now() })
  
  // Clean up old cache entries (older than 30 minutes)
  for (const [key, value] of statsCache.entries()) {
    if (Date.now() - value.timestamp > 30 * 60 * 1000) {
      statsCache.delete(key)
    }
  }
}

router.get('/stats', async (req, res) => {
  if (!req.session?.accessToken) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const headers = { Authorization: `Bearer ${req.session.accessToken}` }

  try {
    const userData = await fetch('https://api.github.com/user', { headers }).then((r) => r.json())

    // Check cache first (5-minute TTL) - skip cache if ?nocache=1 is provided
    const skipCache = req.query.nocache === '1'
    if (!skipCache) {
      const cachedData = getCachedStats(userData.login)
      if (cachedData) {
        console.log('[GitHub Stats] Returning cached data for:', userData.login)
        res.set('X-Cache', 'HIT')
        return res.json(cachedData)
      }
    }

    console.log('[GitHub Stats] Fetching fresh data for:', userData.login)

    // Verify token scopes by making a HEAD request
    const scopeCheck = await fetch('https://api.github.com/user', { headers })
    const tokenScopes = scopeCheck.headers.get('x-oauth-scopes') || 'none'
    console.log('[GitHub Stats] Token scopes:', tokenScopes)

    // Fetch fresh data — use visibility + affiliation (NOT type, which is deprecated and conflicts)
    const contributionQuery = `query {
      user(login: "${userData.login}") {
        contributionsCollection {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                contributionCount
                date
                weekday
              }
            }
          }
        }
      }
    }`

    const [reposRes, events, searchCommits, graphqlRes, prsReviewed, issuesCommented, prsAuthored] = await Promise.all([
      fetch('https://api.github.com/user/repos?per_page=100&sort=updated&visibility=all&affiliation=owner,collaborator,organization_member', { headers }),
      fetch(`https://api.github.com/users/${userData.login}/events?per_page=100`, { headers }).then((r) => r.json()),
      fetch(`https://api.github.com/search/commits?q=author:${userData.login}&sort=author-date&order=desc&per_page=100`, { 
        headers: { ...headers, Accept: 'application/vnd.github.cloak-preview' } 
      }).then((r) => r.json()).catch(() => ({ items: [] })),
      fetch('https://api.github.com/graphql', {
        method: 'POST',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: contributionQuery }),
      }).then((r) => r.json()).catch((err) => {
        console.error('[GitHub Stats] GraphQL fetch error:', err.message)
        return null
      }),
      // Collaboration: PRs the user reviewed (not authored)
      fetch(`https://api.github.com/search/issues?q=reviewed-by:${userData.login}+is:pr+-author:${userData.login}&per_page=1`, { headers })
        .then((r) => r.json()).catch(() => ({ total_count: 0 })),
      // Collaboration: Issues the user commented on
      fetch(`https://api.github.com/search/issues?q=commenter:${userData.login}+is:issue+-author:${userData.login}&per_page=1`, { headers })
        .then((r) => r.json()).catch(() => ({ total_count: 0 })),
      // PRs authored by the user
      fetch(`https://api.github.com/search/issues?q=author:${userData.login}+is:pr&per_page=1`, { headers })
        .then((r) => r.json()).catch(() => ({ total_count: 0 })),
    ])

    console.log('[GitHub Stats] Collaboration search results:', {
      prsReviewed: prsReviewed?.total_count,
      issuesCommented: issuesCommented?.total_count,
      prsAuthored: prsAuthored?.total_count,
    })

    // Extract contribution calendar from GraphQL
    let contributionCalendar = null
    if (graphqlRes?.errors) {
      console.error('[GitHub Stats] GraphQL errors:', JSON.stringify(graphqlRes.errors))
    }
    if (graphqlRes?.data?.user?.contributionsCollection?.contributionCalendar) {
      contributionCalendar = graphqlRes.data.user.contributionsCollection.contributionCalendar
      console.log('[GitHub Stats] Contribution calendar fetched — total:', contributionCalendar.totalContributions, 'weeks:', contributionCalendar.weeks?.length)
    } else {
      console.log('[GitHub Stats] GraphQL response (no calendar):', JSON.stringify(graphqlRes)?.substring(0, 500))
      // Fallback: build a contribution calendar from events data
      console.log('[GitHub Stats] Building fallback contribution calendar from events...')
      const eventsByDate = {}
      if (Array.isArray(events)) {
        events.forEach((event) => {
          const dateStr = new Date(event.created_at).toISOString().split('T')[0]
          eventsByDate[dateStr] = (eventsByDate[dateStr] || 0) + 1
        })
      }
      // Also count commits from search results
      if (searchCommits?.items && Array.isArray(searchCommits.items)) {
        searchCommits.items.forEach((c) => {
          const dateStr = c.commit?.author?.date ? new Date(c.commit.author.date).toISOString().split('T')[0] : null
          if (dateStr) {
            eventsByDate[dateStr] = (eventsByDate[dateStr] || 0) + 1
          }
        })
      }
      // Build 52 weeks of data
      const now = new Date()
      const weeks = []
      // Find the start: go back ~52 weeks to the nearest Sunday
      const start = new Date(now)
      start.setDate(start.getDate() - (52 * 7) - start.getDay())
      let totalFallback = 0
      for (let w = 0; w < 53; w++) {
        const week = { contributionDays: [] }
        for (let d = 0; d < 7; d++) {
          const day = new Date(start)
          day.setDate(start.getDate() + w * 7 + d)
          if (day > now) break
          const iso = day.toISOString().split('T')[0]
          const count = eventsByDate[iso] || 0
          totalFallback += count
          week.contributionDays.push({
            contributionCount: count,
            date: iso,
            weekday: d,
          })
        }
        if (week.contributionDays.length > 0) weeks.push(week)
      }
      contributionCalendar = { totalContributions: totalFallback, weeks }
      console.log('[GitHub Stats] Fallback calendar built — total:', totalFallback, 'weeks:', weeks.length)
    }

    // Log repo response scopes to confirm private access
    const repoScopes = reposRes.headers.get('x-oauth-scopes') || 'none'
    console.log('[GitHub Stats] Repo endpoint scopes:', repoScopes)
    const repos = await reposRes.json()

    // Ensure repos is an array
    if (!Array.isArray(repos)) {
      console.error('[GitHub Stats] Repos is not an array:', repos)
      return res.status(500).json({ error: 'Failed to fetch repositories', details: repos })
    }

    console.log('[GitHub Stats] Total repos fetched:', repos.length)
    console.log('[GitHub Stats] ALL repos:', repos.map(r => ({ name: r.name, private: r.private, visibility: r.visibility, owner: r.owner?.login })))

    let totalStars = 0, totalForks = 0, totalWatchers = 0, totalOpenIssues = 0
    const languageMap = {}, languageSizeMap = {}
    let privateRepos = 0, publicRepos = 0, forkedRepos = 0

    repos.forEach((repo) => {
      totalStars += repo.stargazers_count
      totalForks += repo.forks_count
      totalWatchers += repo.watchers_count
      totalOpenIssues += repo.open_issues_count
      
      // Count forked repos (repos you've forked from others)
      if (repo.fork) {
        forkedRepos++
        console.log('[GitHub Stats] Found forked repo:', repo.name, 'from', repo.parent?.full_name || 'unknown')
      }
      
      // Count private vs public repos
      if (repo.private) {
        privateRepos++
        console.log('[GitHub Stats] Found private repo:', repo.name)
      } else {
        publicRepos++
      }
      
      if (repo.language) {
        languageMap[repo.language] = (languageMap[repo.language] || 0) + 1
        languageSizeMap[repo.language] = (languageSizeMap[repo.language] || 0) + (repo.size || 0)
      }
    })

    const topLanguages = Object.keys(languageMap)
      .map((lang) => ({ language: lang, count: languageMap[lang], size: languageSizeMap[lang] }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 7)

    const recentRepos = repos.slice(0, 6).map((repo) => ({
      name: repo.name,
      fullName: repo.full_name,
      description: repo.description,
      language: repo.language,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      updatedAt: repo.updated_at,
      htmlUrl: repo.html_url,
      isPrivate: repo.private,
    }))

    const activityMap = {}, eventTypeMap = {}
    if (Array.isArray(events)) {
      events.forEach((event) => {
        const date = new Date(event.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        activityMap[date] = (activityMap[date] || 0) + 1
        const type = event.type?.replace('Event', '') || 'Other'
        eventTypeMap[type] = (eventTypeMap[type] || 0) + 1
      })
    }

    const activityTimeline = Object.entries(activityMap)
      .map(([date, count]) => ({ date, events: count }))
      .reverse()
      .slice(-14)

    // ─────── FETCH INDIVIDUAL COMMIT DETAILS (Search API doesn't include stats) ───────
    // The /search/commits endpoint does NOT return additions/deletions stats.
    // We must fetch each commit individually to get the real stats.
    let commitDetails = []
    if (searchCommits.items && Array.isArray(searchCommits.items)) {
      const commitUrls = searchCommits.items.slice(0, 30).map(c => c.url).filter(Boolean)
      console.log('[GitHub Stats] Fetching individual details for', commitUrls.length, 'commits...')
      
      const detailResults = await Promise.allSettled(
        commitUrls.map(url => fetch(url, { headers }).then(r => r.json()))
      )
      commitDetails = detailResults
        .filter(r => r.status === 'fulfilled' && r.value?.sha)
        .map(r => r.value)
      
      console.log('[GitHub Stats] Got detailed stats for', commitDetails.length, 'commits')
      // Log a sample to verify stats are present
      if (commitDetails.length > 0) {
        const sample = commitDetails[0]
        console.log('[GitHub Stats] Sample commit stats:', {
          sha: sample.sha?.substring(0, 7),
          message: sample.commit?.message?.substring(0, 50),
          additions: sample.stats?.additions,
          deletions: sample.stats?.deletions,
          total: sample.stats?.total,
        })
      }
    }

    // ─────── IMPACT METRICS ───────
    // 1. Code Churn Analysis (using individually-fetched commit stats)
    let totalAdditions = 0, totalDeletions = 0, commitCount = 0
    const churnTimeline = {}
    
    commitDetails.forEach((commit) => {
      // stats is at the ROOT level of individual commit responses, NOT inside commit.commit
      const stats = commit.stats || {}
      const commitDate = commit.commit?.author?.date || commit.commit?.committer?.date
      if (commitDate) {
        totalAdditions += stats.additions || 0
        totalDeletions += stats.deletions || 0
        commitCount++
        
        const weekKey = new Date(commitDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        if (!churnTimeline[weekKey]) {
          churnTimeline[weekKey] = { date: weekKey, additions: 0, deletions: 0, net: 0 }
        }
        churnTimeline[weekKey].additions += stats.additions || 0
        churnTimeline[weekKey].deletions += stats.deletions || 0
        churnTimeline[weekKey].net += (stats.additions || 0) - (stats.deletions || 0)
      }
    })

    const netCodeChange = totalAdditions - totalDeletions
    const churnRate = totalAdditions > 0 ? (totalDeletions / totalAdditions * 100).toFixed(1) : 0
    const codeRetention = totalAdditions > 0 ? ((netCodeChange / totalAdditions) * 100).toFixed(1) : 100

    // 2. Review Activity & Collaboration Depth
    // Use GitHub Search API counts (reliable, not limited to 90-day events window)
    const prReviewCount = prsReviewed?.total_count || 0
    const issueCommentCount = issuesCommented?.total_count || 0
    const prAuthoredCount = prsAuthored?.total_count || 0
    
    // Supplement with review comment count from events (recent activity)
    let prCommentCount = 0
    if (Array.isArray(events)) {
      events.forEach((event) => {
        if (event.type === 'PullRequestReviewCommentEvent') prCommentCount++
      })
    }

    const collaborationScore = prReviewCount + (prCommentCount * 0.5) + (issueCommentCount * 0.3) + (prAuthoredCount * 0.2)

    // 3. Complexity Indicators
    const avgLinesPerCommit = commitCount > 0 ? Math.round((totalAdditions + totalDeletions) / commitCount) : 0
    const complexityLevel = avgLinesPerCommit > 300 ? 'High' : avgLinesPerCommit > 100 ? 'Medium' : 'Low'

    // ─────── COMMIT QUALITY ANALYSIS (Anti-AI Noise) ───────
    let meaningfulCommits = 0, trivialCommits = 0, suspiciousCommits = 0
    const qualityScores = []
    const commitPatterns = { substantialWork: 0, minorTweaks: 0, bulkChanges: 0 }

    commitDetails.forEach((commit) => {
      const message = commit.commit?.message || ''
      // stats is at ROOT level for individual commit API responses
      const stats = commit.stats || {}
      const additions = stats.additions || 0
      const deletions = stats.deletions || 0
      const totalLines = additions + deletions

      // Quality indicators
      let qualityScore = 50 // Start at neutral
      let isSuspicious = false

      // 1. Commit size analysis (Goldilocks zone: 20-500 lines is ideal)
      if (totalLines === 0) {
        qualityScore -= 30 // Empty commit
        isSuspicious = true
      } else if (totalLines < 5) {
        qualityScore -= 15 // Trivial change
        trivialCommits++
        commitPatterns.minorTweaks++
      } else if (totalLines >= 20 && totalLines <= 500) {
        qualityScore += 25 // Ideal size
        meaningfulCommits++
        commitPatterns.substantialWork++
      } else if (totalLines > 1000) {
        qualityScore += 10 // Large refactor (give some credit but not full)
        commitPatterns.bulkChanges++
        meaningfulCommits++
      } else {
        // 5-19 lines — small but real
        meaningfulCommits++
      }

      // 2. Commit message quality (indicates thoughtfulness)
      const msgLength = message.split('\n')[0].length
      if (msgLength < 10) {
        qualityScore -= 10 // Lazy message like "fix" or "update"
      } else if (msgLength >= 30 && msgLength <= 100) {
        qualityScore += 15 // Descriptive message
      }

      // Detect AI-generated patterns
      const aiKeywords = ['copilot', 'ai generated', 'auto-generated', 'automated commit', 'minor fix', 'typo fix', 'formatting only']
      const hasAIPattern = aiKeywords.some(kw => message.toLowerCase().includes(kw))
      if (hasAIPattern && totalLines < 10) {
        qualityScore -= 20
        isSuspicious = true
      }

      // Count suspicious only once per commit
      if (isSuspicious) suspiciousCommits++

      // 3. Problem-solving indicators (keywords in commit message)
      const complexKeywords = ['refactor', 'optimize', 'implement', 'algorithm', 'fix bug', 'resolve', 'enhance', 'improve performance', 'feature', 'add support']
      const hasComplexWork = complexKeywords.some(kw => message.toLowerCase().includes(kw))
      if (hasComplexWork && totalLines >= 10) {
        qualityScore += 20 // Bonus for solving real problems
      }

      // 4. Balance between additions and deletions (good refactoring has both)
      const balance = Math.min(additions, deletions) / Math.max(additions, deletions, 1)
      if (balance > 0.3 && totalLines >= 50) {
        qualityScore += 10 // Thoughtful refactoring
      }

      // Clamp score between 0-100
      qualityScore = Math.max(0, Math.min(100, qualityScore))
      qualityScores.push(qualityScore)
    })

    // Calculate aggregate quality metrics
    const avgQualityScore = qualityScores.length > 0 
      ? Math.round(qualityScores.reduce((a, b) => a + b, 0) / qualityScores.length)
      : 0

    const meaningfulRatio = commitCount > 0 
      ? Math.round((meaningfulCommits / commitCount) * 100)
      : 0

    const qualityGrade = avgQualityScore >= 75 ? 'Excellent' 
      : avgQualityScore >= 60 ? 'Good'
      : avgQualityScore >= 45 ? 'Fair'
      : 'Needs Improvement'

    const qualityMetrics = {
      overallScore: avgQualityScore,
      grade: qualityGrade,
      meaningfulCommits,
      trivialCommits,
      suspiciousCommits,
      meaningfulRatio,
      totalAnalyzed: qualityScores.length,
      patterns: commitPatterns,
      distribution: {
        highQuality: qualityScores.filter(s => s >= 70).length,
        medium: qualityScores.filter(s => s >= 40 && s < 70).length,
        lowQuality: qualityScores.filter(s => s < 40).length,
      },
    }

    const impactMetrics = {
      codeChurn: {
        totalAdditions,
        totalDeletions,
        netChange: netCodeChange,
        churnRate: parseFloat(churnRate),
        retention: parseFloat(codeRetention),
        avgLinesPerCommit,
        commitCount,
        complexityLevel,
        timeline: Object.values(churnTimeline).slice(-14),
      },
      collaboration: {
        reviewCount: prReviewCount,
        reviewComments: prCommentCount,
        issueComments: issueCommentCount,
        prsAuthored: prAuthoredCount,
        score: Math.round(collaborationScore),
      },
      quality: qualityMetrics,
    }

    console.log('[GitHub Stats] Impact metrics:', {
      additions: totalAdditions, deletions: totalDeletions, commits: commitCount,
      churnRate, retention: codeRetention, avgLines: avgLinesPerCommit,
      quality: avgQualityScore, grade: qualityGrade,
      meaningful: meaningfulCommits, trivial: trivialCommits, suspicious: suspiciousCommits,
    })

    const responseData = {
      user: {
        login: userData.login,
        name: userData.name,
        avatarUrl: userData.avatar_url,
        bio: userData.bio,
        publicRepos: userData.public_repos,
        followers: userData.followers,
        following: userData.following,
        createdAt: userData.created_at,
        htmlUrl: userData.html_url,
      },
      stats: {
        totalStars,
        totalForks,
        forkedRepos,
        totalRepos: repos.length,
        publicRepos,
        privateRepos,
        totalWatchers,
        totalOpenIssues,
        topLanguages,
      },
      recentRepos,
      activityTimeline,
      contributionCalendar,
      eventTypes: Object.entries(eventTypeMap)
        .map(([type, count]) => ({ type, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 6),
      impactMetrics,
    }

    console.log('[GitHub Stats] Final counts - Total:', repos.length, 'Public:', publicRepos, 'Private:', privateRepos, 'Forked:', forkedRepos)

    // Cache the response for 5 minutes
    setCachedStats(userData.login, responseData)
    
    res.set('X-Cache', 'MISS')
    res.set('Cache-Control', 'private, max-age=300') // 5 minutes client-side cache
    res.json(responseData)
  } catch (error) {
    console.error('[GitHub] Stats error:', error)
    res.status(500).json({ error: 'Failed to fetch GitHub data' })
  }
})

export default router
