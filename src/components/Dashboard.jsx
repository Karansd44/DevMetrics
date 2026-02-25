import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, AreaChart, Area,
} from 'recharts'
import {
  Star, GitFork, Code2, Sparkles, Eye, AlertCircle,
  Users, UserPlus, Calendar, ExternalLink, Lock, Globe,
} from 'lucide-react'
import Navbar from './Navbar.jsx'
import { DashboardSkeleton } from './SkeletonLoaders.jsx'

const COLORS = ['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ec4899', '#f97316']

const tooltipStyle = {
  backgroundColor: '#ffffff',
  border: '1px solid rgba(0,0,0,0.08)',
  borderRadius: '10px',
  color: '#111827',
  fontSize: '0.85rem',
  boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
}

export default function Dashboard() {
  const { user: authUser } = useAuth()
  const [stats, setStats] = useState(null)
  const [user, setUser] = useState(null)
  const [recentRepos, setRecentRepos] = useState([])
  const [activityTimeline, setActivityTimeline] = useState([])
  const [eventTypes, setEventTypes] = useState([])
  const [insight, setInsight] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/github/stats', { credentials: 'include' })
      .then((res) => res.json())
      .then((data) => {
        setStats(data.stats)
        setUser(data.user)
        setRecentRepos(data.recentRepos || [])
        setActivityTimeline(data.activityTimeline || [])
        setEventTypes(data.eventTypes || [])
        setLoading(false)
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
      .catch(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <>
        <Navbar
          userName={user?.name || authUser?.name}
          userLogin={user?.login || authUser?.login}
          avatarUrl={user?.avatarUrl || authUser?.avatarUrl}
        />
        <DashboardSkeleton />
      </>
    )
  }

  const joinDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
    : ''

  return (
    <>
      <Navbar
        userName={user?.name || authUser?.name}
        userLogin={user?.login || authUser?.login}
        avatarUrl={user?.avatarUrl || authUser?.avatarUrl}
      />

      <div className="dashboard-container" style={{ paddingTop: '80px' }}>
        {/* Header */}
        <header className="dashboard-header">
          <div>
            <h1 className="dashboard-title">Dashboard</h1>
            <p className="dashboard-subtitle">Here's what you've been building</p>
          </div>
        </header>

        {/* Profile + Stats Row */}
        <div className="dashboard-top-row">
          {/* Profile Card */}
          <div className="glass-card profile-card">
            <div className="profile-avatar-wrapper">
              <img src={user?.avatarUrl} alt={user?.name || 'Avatar'} className="profile-avatar" />
              <div className="profile-status-dot"></div>
            </div>
            <h2 className="profile-name">{user?.name || user?.login}</h2>
            <a href={user?.htmlUrl} target="_blank" rel="noopener noreferrer" className="profile-handle">
              @{user?.login} <ExternalLink size={12} />
            </a>
            {user?.bio && <p className="profile-bio">{user.bio}</p>}
            <div className="profile-meta">
              <div className="profile-meta-item">
                <Users size={14} /> <strong>{user?.followers}</strong> followers
              </div>
              <div className="profile-meta-item">
                <UserPlus size={14} /> <strong>{user?.following}</strong> following
              </div>
              <div className="profile-meta-item">
                <Calendar size={14} /> Joined {joinDate}
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="stats-grid">
            <StatCard title="Stars Earned" value={stats?.totalStars ?? 0} icon={<Star size={22} />} color="#f59e0b" bg="rgba(245,158,11,0.1)" />
            <StatCard title="Total Forks" value={stats?.totalForks ?? 0} icon={<GitFork size={22} />} color="#3b82f6" bg="rgba(59,130,246,0.1)" />
            <StatCard title="Repositories" value={stats?.totalRepos ?? 0} icon={<Code2 size={22} />} color="#10b981" bg="rgba(16,185,129,0.1)" />
            <StatCard title="Watchers" value={stats?.totalWatchers ?? 0} icon={<Eye size={22} />} color="#8b5cf6" bg="rgba(139,92,246,0.1)" />
            <StatCard title="Open Issues" value={stats?.totalOpenIssues ?? 0} icon={<AlertCircle size={22} />} color="#ec4899" bg="rgba(236,72,153,0.1)" />
            <StatCard title="Public Repos" value={user?.publicRepos ?? 0} icon={<Globe size={22} />} color="#06b6d4" bg="rgba(6,182,212,0.1)" />
          </div>
        </div>

        {/* Activity Timeline */}
        {activityTimeline.length > 0 && (
          <div className="glass-card chart-card">
            <h2 className="section-title">Recent Activity</h2>
            <div style={{ height: '220px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={activityTimeline}>
                  <defs>
                    <linearGradient id="activityGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                  <XAxis dataKey="date" stroke="#5b6390" tick={{ fontSize: 11 }} />
                  <YAxis stroke="#5b6390" tick={{ fontSize: 11 }} allowDecimals={false} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Area type="monotone" dataKey="events" stroke="#3b82f6" strokeWidth={2.5} fill="url(#activityGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Charts Row */}
        <div className="charts-row">
          {/* Language Distribution Pie */}
          <div className="glass-card chart-card">
            <h2 className="section-title">Language Distribution</h2>
            <div style={{ height: '280px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats?.topLanguages}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={95}
                    paddingAngle={3}
                    dataKey="count"
                    label={({ payload, percent }) => payload ? `${payload.language} ${(percent * 100).toFixed(0)}%` : ''}
                    labelLine={false}
                  >
                    {stats?.topLanguages.map((_entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Language Bar Chart */}
          <div className="glass-card chart-card">
            <h2 className="section-title">Repos by Language</h2>
            <div style={{ height: '280px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats?.topLanguages} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                  <XAxis type="number" stroke="#5b6390" tick={{ fontSize: 11 }} allowDecimals={false} />
                  <YAxis dataKey="language" type="category" stroke="#5b6390" tick={{ fontSize: 11 }} width={80} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                    {stats?.topLanguages.map((_entry, index) => (
                      <Cell key={`bar-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Event Types + AI Insight Row */}
        <div className="charts-row">
          {eventTypes.length > 0 && (
            <div className="glass-card chart-card">
              <h2 className="section-title">Event Breakdown</h2>
              <div className="event-list">
                {eventTypes.map((event, i) => (
                  <div key={event.type} className="event-item">
                    <div className="event-bar-container">
                      <span className="event-label">{event.type}</span>
                      <div className="event-bar-bg">
                        <div
                          className="event-bar-fill"
                          style={{
                            width: `${(event.count / eventTypes[0].count) * 100}%`,
                            background: COLORS[i % COLORS.length],
                          }}
                        />
                      </div>
                      <span className="event-count">{event.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AI Insight */}
          <div className="glass-card chart-card ai-insight-card">
            <div className="ai-insight-header">
              <Sparkles size={20} />
              <h2>AI Insight</h2>
            </div>
            <p className="ai-insight-text">
              {insight || `Based on your recent activity, you are highly active in ${stats?.topLanguages?.[0]?.language ?? 'multiple languages'}. Your code consistency has increased this month.`}
            </p>
          </div>
        </div>

        {/* Recent Repos */}
        {recentRepos.length > 0 && (
          <div className="repos-section">
            <h2 className="section-title" style={{ marginBottom: '20px' }}>Recent Repositories</h2>
            <div className="repos-grid">
              {recentRepos.map((repo) => (
                <a
                  key={repo.name}
                  href={repo.htmlUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass-card repo-card"
                >
                  <div className="repo-card-header">
                    <span className="repo-name">
                      {repo.isPrivate ? <Lock size={14} /> : <Globe size={14} />}
                      {repo.name}
                    </span>
                    <ExternalLink size={14} className="repo-link-icon" />
                  </div>
                  {repo.description && <p className="repo-description">{repo.description}</p>}
                  <div className="repo-meta">
                    {repo.language && (
                      <span className="repo-lang">
                        <span className="repo-lang-dot" style={{ background: COLORS[0] }}></span>
                        {repo.language}
                      </span>
                    )}
                    <span className="repo-stat"><Star size={13} /> {repo.stars}</span>
                    <span className="repo-stat"><GitFork size={13} /> {repo.forks}</span>
                    <span className="repo-stat">
                      {new Date(repo.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  )
}

function StatCard({ title, value, icon, color, bg }) {
  return (
    <div className="glass-card stat-card">
      <div className="stat-icon" style={{ background: bg, color }}>
        {icon}
      </div>
      <div>
        <p className="stat-label">{title}</p>
        <p className="stat-value">{value.toLocaleString()}</p>
      </div>
    </div>
  )
}
