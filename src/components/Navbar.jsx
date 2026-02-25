import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { LogOut, ChevronDown, LayoutDashboard, Github, Activity } from 'lucide-react'

export default function Navbar({ userName, userLogin, avatarUrl }) {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)
  const { logout } = useAuth()

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const displayName = userName?.split(' ')[0] || userLogin || 'User'

  return (
    <nav style={{
      position: 'fixed',
      top: 0, left: 0, right: 0,
      zIndex: 100,
      height: '64px',
      padding: '0 28px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      background: 'rgba(255,255,255,0.88)',
      backdropFilter: 'blur(24px)',
      WebkitBackdropFilter: 'blur(24px)',
      borderBottom: '1px solid rgba(0,0,0,0.07)',
      fontFamily: 'inherit',
    }}>
      {/* Left side */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0px' }}>
        <a href="/" style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          textDecoration: 'none', color: '#111827',
          fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.03em',
        }}>
          <Activity size={22} style={{ color: '#3b82f6' }} />
          <span className="gradient-text">DevMetrics</span>
        </a>

        <div style={{ width: '1px', height: '28px', background: 'rgba(0,0,0,0.1)', margin: '0 20px' }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <a href="/dashboard" style={{
            display: 'flex', alignItems: 'center', gap: '7px',
            padding: '8px 16px', fontSize: '0.85rem', fontWeight: 600,
            color: '#3b82f6', background: 'rgba(59,130,246,0.08)',
            borderRadius: '8px', textDecoration: 'none',
          }}>
            <LayoutDashboard size={16} />
            Dashboard
          </a>
          <a href={`https://github.com/${userLogin}`} target="_blank" rel="noopener noreferrer" style={{
            display: 'flex', alignItems: 'center', gap: '7px',
            padding: '8px 16px', fontSize: '0.85rem', fontWeight: 500,
            color: '#9ca3af', borderRadius: '8px', textDecoration: 'none',
          }}>
            <Github size={16} />
            GitHub
          </a>
        </div>
      </div>

      {/* Right side — profile dropdown */}
      <div style={{ position: 'relative' }} ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '6px 14px 6px 6px',
            background: dropdownOpen ? 'rgba(0,0,0,0.04)' : 'none',
            border: dropdownOpen ? '1px solid rgba(0,0,0,0.08)' : '1px solid transparent',
            borderRadius: '100px', cursor: 'pointer', color: '#111827',
            fontFamily: 'inherit', fontSize: '0.88rem', fontWeight: 600,
            transition: 'all 0.2s',
          }}
        >
          {avatarUrl ? (
            <img src={avatarUrl} alt={displayName} style={{
              width: '32px', height: '32px', borderRadius: '50%',
              objectFit: 'cover', border: '2px solid rgba(59,130,246,0.15)',
            }} />
          ) : (
            <div style={{
              width: '32px', height: '32px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
              color: 'white', display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontWeight: 700, fontSize: '0.85rem',
            }}>
              {displayName.charAt(0).toUpperCase()}
            </div>
          )}
          <span>{displayName}</span>
          <ChevronDown size={14} style={{
            color: '#9ca3af', transition: 'transform 0.2s',
            transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
          }} />
        </button>

        {dropdownOpen && (
          <div style={{
            position: 'absolute', top: 'calc(100% + 8px)', right: 0,
            width: '260px', background: '#ffffff',
            border: '1px solid rgba(0,0,0,0.08)', borderRadius: '14px',
            boxShadow: '0 12px 40px rgba(0,0,0,0.1), 0 2px 8px rgba(0,0,0,0.04)',
            padding: '6px', animation: 'dropdown-in 0.15s ease-out', zIndex: 200,
          }}>
            {/* Profile header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 14px' }}>
              {avatarUrl && (
                <img src={avatarUrl} alt={displayName} style={{
                  width: '38px', height: '38px', borderRadius: '50%',
                  objectFit: 'cover', border: '2px solid rgba(59,130,246,0.12)',
                }} />
              )}
              <div>
                <p style={{ fontSize: '0.9rem', fontWeight: 700, color: '#111827', margin: 0 }}>
                  {userName || userLogin}
                </p>
                <p style={{ fontSize: '0.78rem', color: '#9ca3af', margin: '2px 0 0 0' }}>
                  @{userLogin}
                </p>
              </div>
            </div>

            <div style={{ height: '1px', background: 'rgba(0,0,0,0.06)', margin: '4px 8px' }} />

            <a
              href={`https://github.com/${userLogin}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '10px 14px', fontSize: '0.85rem', fontWeight: 500,
                color: '#6b7280', textDecoration: 'none', borderRadius: '10px',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(0,0,0,0.04)'; e.currentTarget.style.color = '#111827' }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#6b7280' }}
            >
              <Github size={15} />
              View GitHub Profile
            </a>

            <div style={{ height: '1px', background: 'rgba(0,0,0,0.06)', margin: '4px 8px' }} />

            <button
              onClick={logout}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '10px 14px', fontSize: '0.85rem', fontWeight: 500,
                color: '#6b7280', borderRadius: '10px', border: 'none',
                background: 'none', width: '100%', cursor: 'pointer',
                fontFamily: 'inherit',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; e.currentTarget.style.color = '#ef4444' }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#6b7280' }}
            >
              <LogOut size={15} />
              Sign Out
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}
