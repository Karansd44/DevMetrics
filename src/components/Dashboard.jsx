import { useEffect, useState, useMemo, useCallback } from 'react'
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
import ProfileCard from './dashboard/ProfileCard.jsx'
import ImpactScore from './dashboard/ImpactScore.jsx'
import AuthenticityScore from './dashboard/AuthenticityScore.jsx'
import PrivateContributions from './dashboard/PrivateContributions.jsx'
import DataFreshness from './dashboard/DataFreshness.jsx'
import ReviewDepth from './dashboard/ReviewDepth.jsx'
import ComplexityTrends from './dashboard/ComplexityTrends.jsx'
import AIIntegrityCard from './dashboard/AIIntegrityCard.jsx'

import { DashboardSkeleton } from './SkeletonLoaders.jsx'

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
  const [cacheInfo, setCacheInfo] = useState(null)

  const fetchData = useCallback((forceRefresh = false) => {
    const url = forceRefresh
      ? `/api/github/stats?nocache=1&t=${Date.now()}`
      : `/api/github/stats?t=${Date.now()}`
    fetch(url, { credentials: 'include', cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        setStats(data.stats)
        setUser(data.user)
        setRecentRepos(data.recentRepos || [])
        setActivityTimeline(data.activityTimeline || [])
        setEventTypes(data.eventTypes || [])
        setImpactMetrics(data.impactMetrics || null)
        setContributionCalendar(data.contributionCalendar || null)
        setCacheInfo(data._cache || null)
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    fetchData(true) // First load always fetches fresh
  }, [fetchData])

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
  const authenticity = impactMetrics?.authenticity
  const reviewDepth = impactMetrics?.reviewDepth
  const complexityTrends = impactMetrics?.complexityTrends
  const privateWork = impactMetrics?.privateWork

  if (!stats) {
    return (
      <>
        <Sidebar user={authUser} />
        <main className="main-content">
          <div className="page-header">
            <h1 className="page-title">Dashboard</h1>
            <p className="page-subtitle">Loading your metrics...</p>
          </div>
          <div className="bento-grid">
            <DashboardSkeleton />
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
          <p className="page-subtitle">Your open-source proof of work — quality over quantity</p>
        </div>

        {/* ═══════ BENTO GRID ═══════ */}
        <div className="bento-grid">
          {/* Row 0: Data Freshness / Source of Truth bar */}
          <DataFreshness cacheInfo={cacheInfo} onRefresh={() => fetchData(true)} />

          {/* Row 1: Impact Score — the headline metric */}
          <ImpactScore impactMetrics={impactMetrics} />

          {/* Row 2: Key metric cards (3+3+3+3) */}
          <MetricCards collab={collab} churn={churn} quality={quality} />

          {/* Row 3: Profile | Heatmap | Languages (3-6-3) */}
          <ProfileCard user={user || authUser} stats={stats} totalContributions={totalContributions} langData={langData} quality={quality} collab={collab} churn={churn} />
          <ContributionHeatmap heatmapWeeks={heatmapWeeks} totalContributions={totalContributions} />
          <TopLanguages langData={langData} />

          {/* Row 4: Overview | Commit Activity | Recent Repos (3-6-3) */}
          <OverviewStats stats={stats} />
          <CommitActivity activityTimeline={activityTimeline} churn={churn} />
          <RecentRepos recentRepos={recentRepos} />

          {/* Row 5: Authenticity | Code Churn | Quality (4-4-4) */}
          <AuthenticityScore authenticity={authenticity} />
          <CodeChurnChart churn={churn} />
          <CommitQuality quality={quality} />

          {/* Row 5.5: AI Integrity (4) */}
          <AIIntegrityCard
            aiMetrics={{
              currentScore: 35,
              trend: [
                { date: '7d', score: 38 },
                { date: '5d', score: 36 },
                { date: '3d', score: 34 },
                { date: '1d', score: 35 },
              ],
              suspiciousIndicators: [
                {
                  label: 'Comment Density',
                  description: 'Slightly high ratio of comments to code (28%)',
                  severity: 'low',
                },
                {
                  label: 'Naming Consistency',
                  description: 'High adherence to conventions (18 out of 20 checks)',
                  severity: 'low',
                },
                {
                  label: 'Defensive Patterns',
                  description: 'Moderate null-checking overhead detected',
                  severity: 'low',
                },
              ],
              classification: 'Minimal AI Assistance',
              lastAnalyzed: new Date().toLocaleDateString(),
            }}
          />

          {/* Row 6: Review Depth | Complexity | Private Work (4-4-4) */}
          <ReviewDepth reviewDepth={reviewDepth} collab={collab} />
          <ComplexityTrends complexityTrends={complexityTrends} />
          <PrivateContributions privateWork={privateWork} stats={stats} />

          {/* Row 7: Commit Patterns | Collaboration (8-4) */}
          <CommitPatterns quality={quality} />
          <CollaborationCard collab={collab} />
        </div>
      </main>
    </>
  )
}
