import { useEffect, useState, useMemo } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import Sidebar from './Sidebar.jsx'
import { LANG_COLORS } from './dashboard/constants'
import MetricCards from './dashboard/MetricCards.jsx'
import CommitActivity from './dashboard/CommitActivity.jsx'
import OverviewStats from './dashboard/OverviewStats.jsx'
import ContributionHeatmap from './dashboard/ContributionHeatmap.jsx'
import TopLanguages from './dashboard/TopLanguages.jsx'
import CodeChurnChart from './dashboard/CodeChurnChart.jsx'
import CommitQuality from './dashboard/CommitQuality.jsx'
import CollaborationCard from './dashboard/CollaborationCard.jsx'
import RecentRepos from './dashboard/RecentRepos.jsx'
import CommitPatterns from './dashboard/CommitPatterns.jsx'

/* ═══════════════════════════════════════════
   Dashboard
   ═══════════════════════════════════════════ */
export default function Dashboard() {
  const { user: authUser, logout } = useAuth()
  const [stats, setStats] = useState(null)
  const [user, setUser] = useState(null)
  const [recentRepos, setRecentRepos] = useState([])
  const [activityTimeline, setActivityTimeline] = useState([])
  const [eventTypes, setEventTypes] = useState([])
  const [impactMetrics, setImpactMetrics] = useState(null)
  const [contributionCalendar, setContributionCalendar] = useState(null)

  useEffect(() => {
    fetch(`/api/github/stats?nocache=1&t=${Date.now()}`, {
      credentials: 'include',
      cache: 'no-store',
    })
      .then((res) => res.json())
      .then((data) => {
        setStats(data.stats)
        setUser(data.user)
        setRecentRepos(data.recentRepos || [])
        setActivityTimeline(data.activityTimeline || [])
        setEventTypes(data.eventTypes || [])
        setImpactMetrics(data.impactMetrics || null)
        setContributionCalendar(data.contributionCalendar || null)
      })
      .catch(() => {})
  }, [])

  /* Heatmap data from real GitHub contribution calendar */
  const heatmapWeeks = useMemo(() => {
    if (!contributionCalendar?.weeks?.length) return []
    let maxCount = 0
    contributionCalendar.weeks.forEach((week) =>
      week.contributionDays.forEach((day) => {
        if (day.contributionCount > maxCount) maxCount = day.contributionCount
      })
    )
    const q1 = Math.max(1, Math.ceil(maxCount * 0.25))
    const q2 = Math.max(2, Math.ceil(maxCount * 0.50))
    const q3 = Math.max(3, Math.ceil(maxCount * 0.75))
    return contributionCalendar.weeks.map((week) =>
      week.contributionDays.map((day) => {
        const count = day.contributionCount
        const level = count === 0 ? 0 : count <= q1 ? 1 : count <= q2 ? 2 : count <= q3 ? 3 : 4
        return { date: day.date, count, level, weekday: day.weekday }
      })
    )
  }, [contributionCalendar])

  const totalContributions = contributionCalendar?.totalContributions ?? 0

  /* Language percentages */
  const langTotal = stats?.topLanguages?.reduce((s, l) => s + l.count, 0) || 1
  const langData = stats?.topLanguages?.slice(0, 6).map((l, i) => ({
    ...l,
    pct: Math.round((l.count / langTotal) * 100),
    color: LANG_COLORS[i % LANG_COLORS.length],
  })) || []

  const quality = impactMetrics?.quality
  const churn = impactMetrics?.codeChurn
  const collab = impactMetrics?.collaboration

  if (!stats) {
    return (
      <>
        <Sidebar user={authUser} />
        <main className="main-content">
          <div className="spinner-container" style={{ minHeight: '60vh' }}>
            <div className="spinner"></div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>Loading your metrics...</p>
          </div>
        </main>
      </>
    )
  }

  return (
    <>
      <Sidebar user={user || authUser} />

      <main className="main-content">
        {/* Page Header */}
        <div className="page-header">
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Here's what you've been building</p>
        </div>

        {/* ═══════ BENTO GRID ═══════ */}
        <div className="bento-grid">
          {/* Row 1: Key metric cards */}
          <MetricCards collab={collab} churn={churn} quality={quality} />

          {/* Row 2: Commit Activity + Overview Stats */}
          <CommitActivity activityTimeline={activityTimeline} churn={churn} />
          <OverviewStats stats={stats} />

          {/* Row 3: Heatmap + Top Languages */}
          <ContributionHeatmap heatmapWeeks={heatmapWeeks} totalContributions={totalContributions} />
          <TopLanguages langData={langData} />

          {/* Row 4: Code Churn + Commit Quality */}
          <CodeChurnChart churn={churn} />
          <CommitQuality quality={quality} />

          {/* Row 5: Collaboration + Recent Repos */}
          <CollaborationCard collab={collab} />
          <RecentRepos recentRepos={recentRepos} />

          {/* Row 6: Commit Pattern Breakdown */}
          <CommitPatterns quality={quality} />
        </div>
      </main>
    </>
  )
}
