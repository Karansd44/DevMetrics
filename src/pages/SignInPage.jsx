import { useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { Github, Lock, ArrowLeft, Shield, Eye, Loader2 } from 'lucide-react'

export default function SignInPage() {
  const { login } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleLogin = () => {
    setError(null)
    setLoading(true)
    try {
      login()
    } catch {
      setError('Authentication failed. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="si-page">
      <div className="si-container">
        {/* ── Back link ── */}
        <a href="/" className="si-back">
          <ArrowLeft size={14} />
          Home
        </a>

        {/* ── Card ── */}
        <div className="si-card">
          {/* Brand */}
          <div className="si-brand">DevMetrics</div>

          {/* Welcome copy */}
          <h1 className="si-heading">Welcome back</h1>
          <p className="si-subtext">
            Sign in to view your GitHub insights and contribution analytics.
          </p>

          {/* Error state */}
          {error && (
            <div className="si-error">
              <span>{error}</span>
            </div>
          )}

          {/* Primary CTA — GitHub OAuth */}
          <button
            className={`si-github-btn${loading ? ' si-github-btn--loading' : ''}`}
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <Loader2 size={18} className="si-spinner-icon" />
            ) : (
              <Github size={18} />
            )}
            {loading ? 'Connecting…' : 'Continue with GitHub'}
          </button>

          {/* Divider */}
          <div className="si-divider">
            <span>Permissions &amp; privacy</span>
          </div>

          {/* Scopes */}
          <div className="si-scopes">
            {[
              { icon: <Eye size={13} />, text: 'read:user — Public profile information' },
              { icon: <Lock size={13} />, text: 'repo — Read-only repository access' },
              { icon: <Shield size={13} />, text: 'No data is written or stored permanently' },
            ].map((s) => (
              <div key={s.text} className="si-scope-row">
                <span className="si-scope-icon">{s.icon}</span>
                <span>{s.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <p className="si-footer">
          By continuing, you agree to DevMetrics reading your public GitHub data.
        </p>
      </div>
    </div>
  )
}
