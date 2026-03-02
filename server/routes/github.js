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
    return { data: cached.data, cachedAt: cached.timestamp, ttl: CACHE_TTL }
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
      const cached = getCachedStats(userData.login)
      if (cached) {
        console.log('[GitHub Stats] Returning cached data for:', userData.login)
        res.set('X-Cache', 'HIT')
        return res.json({
          ...cached.data,
          _cache: { hit: true, cachedAt: cached.cachedAt, ttl: cached.ttl, age: Date.now() - cached.cachedAt },
        })
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

    const [reposRes, events, searchCommits, graphqlRes, prsReviewed, issuesCommented, prsAuthored, prCommentsSearch] = await Promise.all([
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
      // PR comments by user (review comments on PRs, all-time via Search API)
      fetch(`https://api.github.com/search/issues?q=commenter:${userData.login}+is:pr+-author:${userData.login}&per_page=1`, { headers })
        .then((r) => r.json()).catch(() => ({ total_count: 0 })),
    ])

    console.log('[GitHub Stats] Collaboration search results:', {
      prsReviewed: prsReviewed?.total_count,
      issuesCommented: issuesCommented?.total_count,
      prsAuthored: prsAuthored?.total_count,
      prCommentsSearch: prCommentsSearch?.total_count,
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
    
    // Track per-commit complexity for trend analysis
    const complexityTimeline = {}
    
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
        
        // Complexity per day — track avg lines changed & file count
        const totalLines = (stats.additions || 0) + (stats.deletions || 0)
        const filesChanged = commit.files?.length || 0
        if (!complexityTimeline[weekKey]) {
          complexityTimeline[weekKey] = { date: weekKey, avgLines: 0, commits: 0, totalLines: 0, files: 0 }
        }
        complexityTimeline[weekKey].totalLines += totalLines
        complexityTimeline[weekKey].files += filesChanged
        complexityTimeline[weekKey].commits++
        complexityTimeline[weekKey].avgLines = Math.round(complexityTimeline[weekKey].totalLines / complexityTimeline[weekKey].commits)
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
    
    // PR comment count: prefer Search API (all-time) over events (90-day window)
    const prCommentCountSearch = prCommentsSearch?.total_count || 0
    let prCommentCountEvents = 0
    if (Array.isArray(events)) {
      events.forEach((event) => {
        if (event.type === 'PullRequestReviewCommentEvent') prCommentCountEvents++
      })
    }
    // Use the higher value — Search API gives all-time PRs commented on, events gives recent inline comments
    const prCommentCount = Math.max(prCommentCountSearch, prCommentCountEvents)

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

    const totalAnalyzedCommits = qualityScores.length
    const meaningfulRatio = totalAnalyzedCommits > 0 
      ? Math.round((meaningfulCommits / totalAnalyzedCommits) * 100)
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

    // ─────── AUTHENTICITY SCORE (Anti-AI-Noise Detection) ───────
    const authenticityScore = (() => {
      if (totalAnalyzedCommits === 0) return 50 // No data = neutral
      let score = 100
      // Penalize high ratio of trivial commits (use totalAnalyzedCommits for consistency)
      const trivialRatio = trivialCommits / totalAnalyzedCommits
      score -= Math.round(trivialRatio * 40)
      // Penalize suspicious activity
      const suspiciousRatio = suspiciousCommits / totalAnalyzedCommits
      score -= Math.round(suspiciousRatio * 30)
      // Reward high-quality work
      if (avgQualityScore >= 70) score += 10
      else if (avgQualityScore >= 55) score += 5
      // Reward good commit messages
      const goodMessages = commitDetails.filter(c => (c.commit?.message?.split('\n')[0]?.length || 0) >= 30).length
      if (totalAnalyzedCommits > 0 && (goodMessages / totalAnalyzedCommits) > 0.5) score += 5
      // Reward balanced add/delete (refactoring indicator)
      if (totalAdditions > 0 && totalDeletions > 0) {
        const ratio = Math.min(totalAdditions, totalDeletions) / Math.max(totalAdditions, totalDeletions)
        if (ratio > 0.2) score += 5
      }
      // Reward high meaningful ratio
      if (meaningfulRatio >= 80) score += 5
      return Math.max(0, Math.min(100, score))
    })()

    const authenticityGrade = authenticityScore >= 85 ? 'Verified'
      : authenticityScore >= 70 ? 'Likely Authentic'
      : authenticityScore >= 50 ? 'Mixed Signals'
      : 'Review Needed'

    // ─────── REVIEW DEPTH  ───────
    // Analyze review events to estimate depth
    let reviewEventsDetailed = []
    if (Array.isArray(events)) {
      events.forEach((event) => {
        if (event.type === 'PullRequestReviewEvent' || event.type === 'PullRequestReviewCommentEvent') {
          reviewEventsDetailed.push({
            type: event.type,
            date: event.created_at,
            repo: event.repo?.name || 'unknown',
            action: event.payload?.action || 'reviewed',
          })
        }
      })
    }
    // Calculate weekly average using account age (more accurate than event-window division)
    const accountAgeWeeks = Math.max(1, Math.round((Date.now() - new Date(userData.created_at).getTime()) / (7 * 24 * 60 * 60 * 1000)))
    // Use the last year at most for weekly average (52 weeks)
    const weeksDivisor = Math.min(accountAgeWeeks, 52)
    const totalReviewActivity = prReviewCount + prCommentCount
    const avgReviewsPerWeek = totalReviewActivity > 0
      ? Math.round((totalReviewActivity / weeksDivisor) * 10) / 10
      : 0

    const helpfulnessScore = Math.round(
      (prReviewCount * 3) + (prCommentCount * 2) + (issueCommentCount * 1.5) + (reviewEventsDetailed.length * 0.5)
    )

    console.log('[GitHub Stats] Review Depth raw data:', {
      prReviewCount, prCommentCount, prCommentCountSearch, prCommentCountEvents,
      issueCommentCount, reviewEventsDetailed: reviewEventsDetailed.length,
      accountAgeWeeks, weeksDivisor, avgReviewsPerWeek, helpfulnessScore,
    })

    const reviewDepth = {
      totalReviews: prReviewCount,
      recentReviewActivity: reviewEventsDetailed.length,
      reviewComments: prCommentCount,
      issuesHelped: issueCommentCount,
      avgReviewsPerWeek,
      helpfulness: helpfulnessScore,
      recentReviews: reviewEventsDetailed.slice(0, 10),
    }

    // ─────── COMPLEXITY TRENDS ───────
    const complexityTrends = Object.values(complexityTimeline).slice(-14).map((d) => ({
      ...d,
      complexity: d.avgLines > 300 ? 'High' : d.avgLines > 100 ? 'Medium' : 'Low',
      complexityNum: d.avgLines > 300 ? 3 : d.avgLines > 100 ? 2 : 1,
    }))

    // ─────── PRIVATE WORK SUMMARY ───────
    const privateReposList = repos.filter(r => r.private)
    const privateWorkSummary = {
      totalPrivateRepos: privateRepos,
      totalPublicRepos: publicRepos,
      privatePercentage: repos.length > 0 ? Math.round((privateRepos / repos.length) * 100) : 0,
      privateStars: privateReposList.reduce((s, r) => s + r.stargazers_count, 0),
      privateForks: privateReposList.reduce((s, r) => s + r.forks_count, 0),
      privateLanguages: (() => {
        const langMap = {}
        privateReposList.forEach(r => {
          if (r.language) langMap[r.language] = (langMap[r.language] || 0) + 1
        })
        return Object.entries(langMap).map(([lang, count]) => ({ language: lang, count })).sort((a, b) => b.count - a.count).slice(0, 5)
      })(),
      recentPrivateActivity: privateReposList.slice(0, 3).map(r => ({
        name: r.name,
        language: r.language,
        updatedAt: r.updated_at,
        size: r.size,
      })),
      totalPrivateSize: privateReposList.reduce((s, r) => s + (r.size || 0), 0),
    }

    // ─────── OVERALL IMPACT SCORE ───────
    // Composite score that represents REAL impact, not vanity metrics
    const impactScore = (() => {
      const qualityWeight = 0.30
      const retentionWeight = 0.20
      const collaborationWeight = 0.20
      const authenticityWeight = 0.15
      const consistencyWeight = 0.15

      const qualityNorm = avgQualityScore
      const retentionNorm = Math.max(0, Math.min(parseFloat(codeRetention) || 0, 100))
      const collabNorm = Math.min((collaborationScore / 30) * 100, 100)
      const authNorm = authenticityScore
      // Consistency: how many days had activity in the contribution calendar
      const activeDays = contributionCalendar?.weeks?.reduce((sum, week) => 
        sum + week.contributionDays.filter(d => d.contributionCount > 0).length, 0) || 0
      const totalDays = contributionCalendar?.weeks?.reduce((sum, week) => sum + week.contributionDays.length, 0) || 365
      const consistencyNorm = Math.min((activeDays / totalDays) * 200, 100)

      const raw = Math.round(
        qualityNorm * qualityWeight +
        retentionNorm * retentionWeight +
        collabNorm * collaborationWeight +
        authNorm * authenticityWeight +
        consistencyNorm * consistencyWeight
      )
      return Math.max(0, Math.min(100, raw))
    })()

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
      authenticity: {
        score: authenticityScore,
        grade: authenticityGrade,
        signals: {
          trivialRatio: totalAnalyzedCommits > 0 ? Math.round((trivialCommits / totalAnalyzedCommits) * 100) : 0,
          suspiciousRatio: totalAnalyzedCommits > 0 ? Math.round((suspiciousCommits / totalAnalyzedCommits) * 100) : 0,
          goodMessageRatio: totalAnalyzedCommits > 0 ? Math.round((commitDetails.filter(c => (c.commit?.message?.split('\n')[0]?.length || 0) >= 30).length / totalAnalyzedCommits) * 100) : 0,
          avgLinesPerCommit,
        },
      },
      reviewDepth,
      complexityTrends,
      privateWork: privateWorkSummary,
      impactScore,
    }

    console.log('[GitHub Stats] Impact metrics:', {
      additions: totalAdditions, deletions: totalDeletions, commits: commitCount,
      churnRate, retention: codeRetention, avgLines: avgLinesPerCommit,
      quality: avgQualityScore, grade: qualityGrade,
      meaningful: meaningfulCommits, trivial: trivialCommits, suspicious: suspiciousCommits,
      authenticityScore, authenticityGrade, impactScore,
      privateRepos, complexityTrends: complexityTrends.length,
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
    const now = Date.now()
    setCachedStats(userData.login, responseData)
    
    res.set('X-Cache', 'MISS')
    res.set('Cache-Control', 'private, max-age=300') // 5 minutes client-side cache
    res.json({
      ...responseData,
      _cache: { hit: false, cachedAt: now, ttl: CACHE_TTL, age: 0 },
    })
  } catch (error) {
    console.error('[GitHub] Stats error:', error)
    res.status(500).json({ error: 'Failed to fetch GitHub data' })
  }
})

export default router
