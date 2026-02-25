import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import {
  LayoutDashboard, GitFork, BarChart3, Settings,
  LogOut, Activity, Github, Code2, ExternalLink,
} from 'lucide-react'

export default function Sidebar({ user, activePage = 'dashboard' }) {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const displayName = user?.name || user?.login || 'Developer'
  const handle = user?.login || ''

  const scrollTo = (id) => {
    navigate('/dashboard')
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)
  }

  return (
    <aside className="sidebar">
      {/* Brand */}
      <div className="sidebar-brand">
        <div className="sidebar-brand-icon">
          <Activity size={16} />
        </div>
        <span>DevMetrics</span>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <div className="sidebar-section-label">Overview</div>
        <button
          className={`sidebar-link ${activePage === 'dashboard' ? 'active' : ''}`}
          onClick={() => navigate('/dashboard')}
        >
          <span className="icon"><LayoutDashboard size={18} /></span>
          Dashboard
        </button>
        <button
          className={`sidebar-link ${activePage === 'repos' ? 'active' : ''}`}
          onClick={() => scrollTo('repos-section')}
        >
          <span className="icon"><Code2 size={18} /></span>
          Repositories
        </button>
        <button
          className={`sidebar-link ${activePage === 'analytics' ? 'active' : ''}`}
          onClick={() => scrollTo('analytics-section')}
        >
          <span className="icon"><BarChart3 size={18} /></span>
          Analytics
        </button>

        <div className="sidebar-section-label">Account</div>
        <a
          className="sidebar-link"
          href={`https://github.com/${handle}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="icon"><Github size={18} /></span>
          GitHub Profile
          <ExternalLink size={12} style={{ marginLeft: 'auto', opacity: 0.4 }} />
        </a>
        <a
          className="sidebar-link"
          href={`https://github.com/settings`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="icon"><Settings size={18} /></span>
          Settings
          <ExternalLink size={12} style={{ marginLeft: 'auto', opacity: 0.4 }} />
        </a>
      </nav>

      {/* Profile footer */}
      <div className="sidebar-profile">
        {user?.avatarUrl ? (
          <img src={user.avatarUrl} alt={displayName} className="sidebar-avatar" />
        ) : (
          <div className="sidebar-avatar" style={{
            background: 'var(--purple-gradient)', color: 'white',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 700, fontSize: '0.82rem',
          }}>
            {displayName.charAt(0).toUpperCase()}
          </div>
        )}
        <div className="sidebar-profile-info">
          <div className="sidebar-profile-name">{displayName}</div>
          <div className="sidebar-profile-handle">@{handle}</div>
        </div>
        <button className="sidebar-logout" onClick={logout} title="Sign out">
          <LogOut size={16} />
        </button>
      </div>
    </aside>
  )
}
