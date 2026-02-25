import { useEffect, useState, useMemo } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip,
} from 'recharts'
import {
  Star, GitFork, Code2, Sparkles, Eye, AlertCircle,
  Lock, Globe, TrendingUp, TrendingDown, GitPullRequest,
  MessageSquare, Award, Target, CheckCircle, ShieldAlert,
  Zap, Activity, ExternalLink, ArrowUpRight,
} from 'lucide-react'
import Sidebar from './Sidebar.jsx'

/* ─── Color palette ─── */
const PURPLE = '#BF5AF2'
const LANG_COLORS = ['#BF5AF2', '#007AFF', '#34C759', '#FF9500', '#FF3B30', '#5AC8FA', '#AF52DE']

const tooltipStyle = {
  backgroundColor: '#fff',
  border: '1px solid #E5E7EB',
  borderRadius: '10px',
  color: '#111827',
  fontSize: '0.8rem',
  boxShadow: 'none',
}

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
  const [insight, setInsight] = useState('')

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
        return fetch('/api/ai/insight', {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ stats: data.stats }),
        })
      })
      .then((res) => res?.json())
      .then((data) => {
        if (data?.insight) setInsight(data.insight)
      })
      .catch(() => {})
  }, [])

  /* Heatmap data from real GitHub contribution calendar */
  const heatmapWeeks = useMemo(() => {
    if (!contributionCalendar?.weeks?.length) return []
    // Find the max contribution to scale levels dynamically
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

          {/* ── Row 1: Key metric cards (4 small) ── */}
          <div className="bento-3 card metric-card">
            <div className="metric-header">
              <span className="metric-label">Total PRs</span>
              <div className="metric-icon" style={{ background: 'var(--purple-light)', color: PURPLE }}>
                <GitPullRequest size={17} />
              </div>
            </div>
            <div className="metric-value">{collab?.reviewCount ?? 0}</div>
          </div>

          <div className="bento-3 card metric-card">
            <div className="metric-header">
              <span className="metric-label">Code Churn</span>
              <div className="metric-icon" style={{ background: 'var(--amber-light)', color: 'var(--amber)' }}>
                <TrendingDown size={17} />
              </div>
            </div>
            <div className="metric-value">{churn?.churnRate ?? 0}%</div>
          </div>

          <div className="bento-3 card metric-card">
            <div className="metric-header">
              <span className="metric-label">Avg Lines/Commit</span>
              <div className="metric-icon" style={{ background: 'var(--blue-light)', color: 'var(--blue)' }}>
                <Code2 size={17} />
              </div>
            </div>
            <div className="metric-value">{churn?.avgLinesPerCommit ?? 0}</div>
          </div>

          <div className="bento-3 card metric-card">
            <div className="metric-header">
              <span className="metric-label">Quality Score</span>
              <div className="metric-icon" style={{ background: 'var(--green-light)', color: 'var(--green)' }}>
                <Award size={17} />
              </div>
            </div>
            <div className="metric-value">
              {quality?.overallScore ?? 0}
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>/100</span>
            </div>
          </div>

          {/* ── Row 2: Commit Activity (8) + Stats sidebar (4) ── */}
          <div id="analytics-section" className="bento-8 card card-padded">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div>
                <h2 className="section-title">Commit Activity</h2>
                <p className="section-subtitle">Recent contribution frequency</p>
              </div>
              {churn && (
                <span style={{
                  fontSize: '0.72rem', fontWeight: 600, color: 'var(--green)',
                  background: 'var(--green-light)', padding: '4px 10px', borderRadius: '100px',
                }}>
                  {churn.commitCount} commits
                </span>
              )}
            </div>
            <div style={{ height: '240px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={activityTimeline}>
                  <defs>
                    <linearGradient id="purpleGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={PURPLE} stopOpacity={0.2} />
                      <stop offset="100%" stopColor={PURPLE} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                  <XAxis
                    dataKey="date"
                    stroke="#9CA3AF"
                    tick={{ fontSize: 11, fill: '#9CA3AF' }}
                    axisLine={{ stroke: '#E5E7EB' }}
                    tickLine={false}
                  />
                  <YAxis
                    stroke="#9CA3AF"
                    tick={{ fontSize: 11, fill: '#9CA3AF' }}
                    axisLine={false}
                    tickLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Area
                    type="monotone"
                    dataKey="events"
                    stroke={PURPLE}
                    strokeWidth={2.5}
                    fill="url(#purpleGrad)"
                    dot={false}
                    activeDot={{ r: 4, fill: PURPLE, strokeWidth: 0 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Stats sidebar */}
          <div className="bento-4 card card-padded" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h2 className="section-title">Overview</h2>
            <StatRow icon={<Star size={16} />} label="Stars" value={stats.totalStars} color="var(--amber)" bg="var(--amber-light)" />
            <StatRow icon={<Code2 size={16} />} label="Repositories" value={stats.totalRepos} color="var(--green)" bg="var(--green-light)" />
            <StatRow icon={<Lock size={16} />} label="Private" value={stats.privateRepos} color="var(--purple)" bg="var(--purple-light)" />
            <StatRow icon={<GitFork size={16} />} label="Forked" value={stats.forkedRepos} color="var(--blue)" bg="var(--blue-light)" />
            <StatRow icon={<Eye size={16} />} label="Watchers" value={stats.totalWatchers} color="var(--cyan)" bg="rgba(90,200,250,0.1)" />
            <StatRow icon={<AlertCircle size={16} />} label="Open Issues" value={stats.totalOpenIssues} color="var(--red)" bg="var(--red-light)" />
          </div>

          {/* ── Row 3: Heatmap (8) + Top Languages (4) ── */}
          <div className="bento-8 card card-padded">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div>
                <h2 className="section-title">Contribution Heatmap</h2>
                <p className="section-subtitle">Your activity over the past year</p>
              </div>
              <span style={{
                fontSize: '0.72rem', fontWeight: 600, color: PURPLE,
                background: 'var(--purple-light)', padding: '4px 10px', borderRadius: '100px',
              }}>
                {totalContributions.toLocaleString()} contributions
              </span>
            </div>
            <div className="heatmap-container">
              {/* Month labels */}
              <div className="heatmap-months">
                {(() => {
                  if (!heatmapWeeks.length) return null
                  const months = []
                  let lastMonth = ''
                  heatmapWeeks.forEach((week, wi) => {
                    const firstDay = week[0]
                    if (!firstDay) return
                    const d = new Date(firstDay.date + 'T00:00:00')
                    const m = d.toLocaleString('en-US', { month: 'short' })
                    if (m !== lastMonth) {
                      months.push({ label: m, col: wi })
                      lastMonth = m
                    }
                  })
                  return months.map((m) => (
                    <span key={m.col} className="heatmap-month-label" style={{ gridColumn: m.col + 1 }}>{m.label}</span>
                  ))
                })()}
              </div>
              {/* Day labels + grid */}
              <div className="heatmap-body">
                <div className="heatmap-day-labels">
                  <span></span><span>Mon</span><span></span><span>Wed</span><span></span><span>Fri</span><span></span>
                </div>
                <div className="heatmap-grid">
                  {heatmapWeeks.map((week, wi) => (
                    <div key={wi} className="heatmap-col">
                      {week.map((day, di) => (
                        <div
                          key={di}
                          className={`heatmap-cell heatmap-level-${day.level}`}
                          title={`${day.date}: ${day.count} contribution${day.count !== 1 ? 's' : ''}`}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="heatmap-legend">
              <span className="heatmap-legend-label">Less</span>
              {[0, 1, 2, 3, 4].map((lvl) => (
                <div key={lvl} className={`heatmap-legend-cell heatmap-level-${lvl}`} />
              ))}
              <span className="heatmap-legend-label">More</span>
            </div>
          </div>

          <div className="bento-4 card card-padded">
            <h2 className="section-title" style={{ marginBottom: '4px' }}>Top Languages</h2>
            <p className="section-subtitle" style={{ marginBottom: '8px' }}>By repository count</p>
            <div className="lang-ring-list">
              {langData.map((lang) => (
                <LanguageRing
                  key={lang.language}
                  language={lang.language}
                  percentage={lang.pct}
                  color={lang.color}
                />
              ))}
            </div>
          </div>

          {/* ── Row 4: Code Churn Timeline (6) + Commit Quality (6) ── */}
          {churn?.timeline?.length > 0 && (
            <div className="bento-6 card card-padded">
              <div style={{ marginBottom: '16px' }}>
                <h2 className="section-title">Code Churn</h2>
                <p className="section-subtitle">Lines added vs deleted</p>
              </div>
              <div style={{ height: '200px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={churn.timeline}>
                    <defs>
                      <linearGradient id="addGrad2" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#34C759" stopOpacity={0.2} />
                        <stop offset="100%" stopColor="#34C759" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="delGrad2" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#FF3B30" stopOpacity={0.2} />
                        <stop offset="100%" stopColor="#FF3B30" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                    <XAxis dataKey="date" stroke="#9CA3AF" tick={{ fontSize: 10, fill: '#9CA3AF' }} tickLine={false} axisLine={{ stroke: '#E5E7EB' }} />
                    <YAxis stroke="#9CA3AF" tick={{ fontSize: 10, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Area type="monotone" dataKey="additions" stroke="#34C759" strokeWidth={2} fill="url(#addGrad2)" name="Added" dot={false} />
                    <Area type="monotone" dataKey="deletions" stroke="#FF3B30" strokeWidth={2} fill="url(#delGrad2)" name="Deleted" dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              {/* Retention / Churn mini badges */}
              <div style={{ display: 'flex', gap: '12px', marginTop: '14px' }}>
                <MiniStat label="Retention" value={`${churn.retention}%`} color="var(--green)" />
                <MiniStat label="Churn" value={`${churn.churnRate}%`} color="var(--amber)" />
                <MiniStat label="Net Change" value={`${churn.netChange >= 0 ? '+' : ''}${churn.netChange.toLocaleString()}`} color={churn.netChange >= 0 ? 'var(--green)' : 'var(--red)'} />
              </div>
            </div>
          )}

          {/* Commit Quality */}
          {quality && (
            <div className="bento-6 card card-padded">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div>
                  <h2 className="section-title">Commit Quality</h2>
                  <p className="section-subtitle">Analysis of {quality.totalAnalyzed} recent commits</p>
                </div>
                <span className={`quality-badge ${quality.grade === 'Excellent' ? 'excellent' : quality.grade === 'Good' ? 'good' : quality.grade === 'Fair' ? 'fair' : 'poor'}`}>
                  {quality.grade}
                </span>
              </div>

              {/* Score ring centered */}
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                <ScoreRing score={quality.overallScore} size={100} />
              </div>

              {/* Patterns */}
              <div>
                <div className="pattern-row">
                  <div className="pattern-icon" style={{ background: 'var(--green-light)', color: 'var(--green)' }}>
                    <CheckCircle size={16} />
                  </div>
                  <div className="pattern-info">
                    <div className="pattern-name">Meaningful</div>
                    <div className="pattern-desc">{quality.meaningfulRatio}% of commits</div>
                  </div>
                  <div className="pattern-count">{quality.meaningfulCommits}</div>
                </div>
                <div className="pattern-row">
                  <div className="pattern-icon" style={{ background: 'var(--amber-light)', color: 'var(--amber)' }}>
                    <AlertCircle size={16} />
                  </div>
                  <div className="pattern-info">
                    <div className="pattern-name">Trivial</div>
                    <div className="pattern-desc">Minor tweaks / small fixes</div>
                  </div>
                  <div className="pattern-count">{quality.trivialCommits}</div>
                </div>
                <div className="pattern-row">
                  <div className="pattern-icon" style={{ background: 'var(--red-light)', color: 'var(--red)' }}>
                    <ShieldAlert size={16} />
                  </div>
                  <div className="pattern-info">
                    <div className="pattern-name">Suspicious</div>
                    <div className="pattern-desc">Potential noise</div>
                  </div>
                  <div className="pattern-count">{quality.suspiciousCommits}</div>
                </div>
              </div>
            </div>
          )}

          {/* ── Row 5: Collaboration (4) + AI Insight (4) + Repos (4) ── */}
          {collab && (
            <div className="bento-4 card card-padded">
              <h2 className="section-title" style={{ marginBottom: '16px' }}>Collaboration</h2>
              <CollabBar label="PR Reviews" value={collab.reviewCount} max={20} color={PURPLE} />
              <CollabBar label="Review Comments" value={collab.reviewComments} max={30} color="var(--blue)" />
              <CollabBar label="Issue Comments" value={collab.issueComments} max={40} color="var(--amber)" />
              <div style={{
                marginTop: '16px', padding: '12px', borderRadius: 'var(--radius-sm)',
                background: 'var(--purple-light)', textAlign: 'center',
              }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: PURPLE }}>{collab.score}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 500 }}>Collaboration Score</div>
              </div>
            </div>
          )}

          <div className="bento-4 card card-padded ai-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <Sparkles size={18} color={PURPLE} />
              <h2 className="section-title">AI Insight</h2>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
              {insight || `Based on your recent activity, you are highly active in ${stats?.topLanguages?.[0]?.language ?? 'multiple languages'}. Your code consistency has improved.`}
            </p>
          </div>

          <div id="repos-section" className="bento-4 card card-padded">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <h2 className="section-title">Recent Repos</h2>
              <ArrowUpRight size={14} style={{ color: 'var(--text-muted)' }} />
            </div>
            <div className="repo-list">
              {recentRepos.slice(0, 5).map((repo) => (
                <a
                  key={repo.name}
                  href={repo.htmlUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="repo-list-item"
                >
                  <div className="repo-list-icon">
                    {repo.isPrivate ? <Lock size={15} /> : <Code2 size={15} />}
                  </div>
                  <div className="repo-list-info">
                    <div className="repo-list-name">{repo.name}</div>
                    {repo.description && (
                      <div className="repo-list-desc">{repo.description}</div>
                    )}
                  </div>
                  <div className="repo-list-meta">
                    {repo.language && <span>{repo.language}</span>}
                    <span><Star size={11} /> {repo.stars}</span>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* ── Row 6: Quality Distribution (full width) ── */}
          {quality && (
            <div className="bento-full card card-padded">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div>
                  <h2 className="section-title">Commit Pattern Breakdown</h2>
                  <p className="section-subtitle">Distribution of your coding patterns</p>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
                <PatternCard
                  icon={<Zap size={18} />}
                  label="Substantial Work"
                  desc="20-500 lines"
                  count={quality.patterns.substantialWork}
                  total={quality.totalAnalyzed}
                  color={PURPLE}
                  bg="var(--purple-light)"
                />
                <PatternCard
                  icon={<AlertCircle size={18} />}
                  label="Minor Tweaks"
                  desc="< 5 lines"
                  count={quality.patterns.minorTweaks}
                  total={quality.totalAnalyzed}
                  color="var(--amber)"
                  bg="var(--amber-light)"
                />
                <PatternCard
                  icon={<TrendingUp size={18} />}
                  label="Bulk Changes"
                  desc="1000+ lines"
                  count={quality.patterns.bulkChanges}
                  total={quality.totalAnalyzed}
                  color="var(--blue)"
                  bg="var(--blue-light)"
                />
                <DistCard label="High Quality" count={quality.distribution.highQuality} color="var(--green)" total={quality.totalAnalyzed} />
                <DistCard label="Medium" count={quality.distribution.medium} color="var(--blue)" total={quality.totalAnalyzed} />
                <DistCard label="Low Quality" count={quality.distribution.lowQuality} color="var(--red)" total={quality.totalAnalyzed} />
              </div>
            </div>
          )}

        </div>
      </main>
    </>
  )
}

/* ═══════════════════════════════════════════
   Sub-components
   ═══════════════════════════════════════════ */

function StatRow({ icon, label, value, color, bg }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <div style={{
        width: '32px', height: '32px', borderRadius: '8px',
        background: bg, color, display: 'flex',
        alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        {icon}
      </div>
      <span style={{ flex: 1, fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: 500 }}>{label}</span>
      <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>
        {typeof value === 'number' ? value.toLocaleString() : value}
      </span>
    </div>
  )
}

function MiniStat({ label, value, color }) {
  return (
    <div style={{
      flex: 1, padding: '8px 12px', borderRadius: '8px',
      background: 'var(--bg-page)', textAlign: 'center',
    }}>
      <div style={{ fontSize: '0.95rem', fontWeight: 700, color }}>{value}</div>
      <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '2px' }}>{label}</div>
    </div>
  )
}

function CollabBar({ label, value, max, color }) {
  const pct = Math.min((value / max) * 100, 100)
  return (
    <div style={{ marginBottom: '14px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
        <span style={{ fontSize: '0.78rem', fontWeight: 500, color: 'var(--text-secondary)' }}>{label}</span>
        <span style={{ fontSize: '0.78rem', fontWeight: 700, color }}>{value}</span>
      </div>
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  )
}

/* Circular score ring */
function ScoreRing({ score, size = 100 }) {
  const strokeWidth = 8
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference
  const color = score >= 75 ? '#34C759' : score >= 60 ? '#007AFF' : score >= 45 ? '#FF9500' : '#FF3B30'

  return (
    <div className="score-ring-container" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke="#F3F4F6" strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke={color} strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1s ease' }}
        />
      </svg>
      <div className="score-ring-text">
        <span className="score-ring-value" style={{ color }}>{score}</span>
        <span className="score-ring-label">/100</span>
      </div>
    </div>
  )
}

/* Language circular progress ring */
function LanguageRing({ language, percentage, color }) {
  const size = 64
  const strokeWidth = 5
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (percentage / 100) * circumference

  return (
    <div className="lang-ring-item">
      <svg className="lang-ring-svg" width={size} height={size}>
        <circle className="lang-ring-bg" cx={size / 2} cy={size / 2} r={radius} strokeWidth={strokeWidth} />
        <circle
          className="lang-ring-fill"
          cx={size / 2} cy={size / 2} r={radius}
          strokeWidth={strokeWidth}
          stroke={color}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
        <text
          x="50%" y="50%"
          textAnchor="middle"
          dominantBaseline="central"
          style={{
            fontSize: '0.7rem', fontWeight: 700, fill: color,
            transform: 'rotate(90deg)', transformOrigin: 'center',
          }}
        >
          {percentage}%
        </text>
      </svg>
      <span className="lang-ring-label">{language}</span>
    </div>
  )
}

function PatternCard({ icon, label, desc, count, total, color, bg }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0
  return (
    <div style={{
      padding: '16px', borderRadius: 'var(--radius-md)',
      border: '1px solid var(--border)', background: 'var(--bg-card)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
        <div style={{
          width: '28px', height: '28px', borderRadius: '6px',
          background: bg, color, display: 'flex',
          alignItems: 'center', justifyContent: 'center',
        }}>
          {icon}
        </div>
        <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-primary)' }}>{label}</span>
      </div>
      <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '4px' }}>{count}</div>
      <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{desc} · {pct}%</div>
      <div className="progress-bar" style={{ marginTop: '8px' }}>
        <div className="progress-fill" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  )
}

function DistCard({ label, count, color, total }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0
  return (
    <div style={{
      padding: '16px', borderRadius: 'var(--radius-md)',
      border: '1px solid var(--border)', background: 'var(--bg-card)',
      textAlign: 'center',
    }}>
      <div style={{ fontSize: '1.8rem', fontWeight: 800, color, marginBottom: '4px' }}>{count}</div>
      <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-primary)' }}>{label}</div>
      <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '2px' }}>{pct}%</div>
      <div className="progress-bar" style={{ marginTop: '8px' }}>
        <div className="progress-fill" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  )
}
