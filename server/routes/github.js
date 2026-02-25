import { Router } from 'express'

const router = Router()

router.get('/stats', async (req, res) => {
  if (!req.session?.accessToken) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const headers = { Authorization: `Bearer ${req.session.accessToken}` }

  try {
    const userData = await fetch('https://api.github.com/user', { headers }).then((r) => r.json())

    const [repos, events] = await Promise.all([
      fetch('https://api.github.com/user/repos?per_page=100&sort=updated&affiliation=owner', { headers }).then((r) => r.json()),
      fetch(`https://api.github.com/users/${userData.login}/events?per_page=30`, { headers }).then((r) => r.json()),
    ])

    let totalStars = 0, totalForks = 0, totalWatchers = 0, totalOpenIssues = 0
    const languageMap = {}, languageSizeMap = {}

    repos.forEach((repo) => {
      totalStars += repo.stargazers_count
      totalForks += repo.forks_count
      totalWatchers += repo.watchers_count
      totalOpenIssues += repo.open_issues_count
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

    res.json({
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
        totalRepos: repos.length,
        totalWatchers,
        totalOpenIssues,
        topLanguages,
      },
      recentRepos,
      activityTimeline,
      eventTypes: Object.entries(eventTypeMap)
        .map(([type, count]) => ({ type, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 6),
    })
  } catch (error) {
    console.error('[GitHub] Stats error:', error)
    res.status(500).json({ error: 'Failed to fetch GitHub data' })
  }
})

export default router
