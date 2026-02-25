import { useAuth } from '../context/AuthContext.jsx'
import { Github, BarChart2, Star, GitCommit, Users, Lock, TrendingUp } from 'lucide-react'

const FEATURES = [
  { icon: <BarChart2 size={18} />, title: 'Repo Analytics', desc: 'Stars, forks, language breakdown across all your repositories.' },
  { icon: <GitCommit size={18} />, title: 'Commit Activity', desc: 'Visualize your commit streaks and contribution patterns.' },
  { icon: <TrendingUp size={18} />, title: 'Growth Metrics', desc: 'Track followers, stars and repo growth over time.' },
]

export default function SignInPage() {
  const { login } = useAuth()

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: '#f6f8fa', color: '#1f2328', fontFamily: 'inherit' }}>
      <style>{`
        @keyframes drift {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes orb-float {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(20px, -20px); }
        }
        .gh-btn {
          all: unset;
          display: flex; align-items: center; justify-content: center; gap: 10px;
          width: 100%; padding: 13px 0; border-radius: 8px; cursor: pointer;
          font-size: 0.95rem; font-weight: 600; box-sizing: border-box;
          background: #1f2328; color: #fff;
          border: 1px solid #1f2328;
          transition: background 0.15s, box-shadow 0.15s, transform 0.15s;
        }
        .gh-btn:hover {
          background: #2d333b;
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(31,35,40,0.2);
        }
        .gh-btn:active { transform: translateY(0); background: #1f2328; }
        .feature-card {
          display: flex; gap: 14px; align-items: flex-start;
          padding: 14px 16px; border-radius: 10px;
          background: #fff;
          border: 1px solid #d0d7de;
          transition: border-color 0.2s, box-shadow 0.2s;
          animation: fade-up 0.5s ease-out both;
        }
        .feature-card:hover { border-color: #0969da; box-shadow: 0 2px 12px rgba(9,105,218,0.08); }
        .scope-pill {
          display: inline-flex; align-items: center; gap: 6px;
          background: #ddf4ff; border: 1px solid #54aeff66;
          color: #0969da; border-radius: 20px;
          padding: 4px 12px; font-size: 0.75rem; font-weight: 500;
        }
        .hero-icon { animation: drift 6s ease-in-out infinite; }
        .card-anim { animation: fade-up 0.4s ease-out both; }
        .lp-anim { animation: fade-up 0.5s ease-out both; }
        .divider { height: 1px; background: #d0d7de; margin: 20px 0; }
        .back-link { color: #57606a; text-decoration: none; font-size: 0.82rem; transition: color 0.2s; }
        .back-link:hover { color: #0969da; text-decoration: underline; }
        @media (min-width: 900px) { .left-panel { display: flex !important; } }
      `}</style>

      {/* ── Left panel — branding ── */}
      <div className="left-panel" style={{
        flex: 1, display: 'none',
        flexDirection: 'column', justifyContent: 'center', padding: '64px',
        background: 'linear-gradient(150deg, #ffffff 0%, #f0f6ff 60%, #f6f8fa 100%)',
        borderRight: '1px solid #d0d7de',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Background orbs */}
        <div style={{
          position: 'absolute', top: '-60px', right: '-60px',
          width: '320px', height: '320px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(9,105,218,0.07) 0%, transparent 70%)',
          animation: 'orb-float 12s ease-in-out infinite', pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: '40px', left: '-40px',
          width: '260px', height: '260px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(130,80,223,0.06) 0%, transparent 70%)',
          animation: 'orb-float 16s ease-in-out infinite reverse', pointerEvents: 'none',
        }} />

        {/* Logo */}
        <div className="lp-anim" style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '44px' }}>
          <div style={{
            width: '46px', height: '46px', borderRadius: '12px',
            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 16px rgba(59,130,246,0.25)',
          }}>
            <BarChart2 size={24} color="#fff" />
          </div>
          <span style={{ fontSize: '1.6rem', fontWeight: 800, letterSpacing: '-0.03em', color: '#1f2328' }}>
            Dev<span style={{ background: 'linear-gradient(135deg,#3b82f6,#8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Metrics</span>
          </span>
        </div>

        {/* Headline */}
        <h1 className="lp-anim" style={{ fontSize: 'clamp(1.8rem, 2.8vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2, marginBottom: '14px', letterSpacing: '-0.03em', color: '#1f2328', animationDelay: '0.05s' }}>
          Your GitHub stats,<br />
          <span style={{ background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            beautifully visualized.
          </span>
        </h1>
        <p className="lp-anim" style={{ color: '#57606a', fontSize: '1rem', lineHeight: 1.7, maxWidth: '420px', marginBottom: '44px', animationDelay: '0.1s' }}>
          Connect your GitHub account for a live dashboard of contributions, repositories and languages.
        </p>

        {/* Feature cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '460px' }}>
          {FEATURES.map((f, i) => (
            <div key={f.title} className="feature-card" style={{ animationDelay: `${0.15 + i * 0.08}s` }}>
              <div style={{
                flexShrink: 0, width: '34px', height: '34px', borderRadius: '8px',
                background: 'linear-gradient(135deg, #eff6ff, #f0ebff)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6',
              }}>
                {f.icon}
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.88rem', marginBottom: '2px', color: '#1f2328' }}>{f.title}</div>
                <div style={{ fontSize: '0.78rem', color: '#57606a', lineHeight: 1.5 }}>{f.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Stat badges */}
        <div style={{ display: 'flex', gap: '10px', marginTop: '32px', flexWrap: 'wrap' }}>
          {[
            { icon: <Star size={13} />, label: 'Repo Stars' },
            { icon: <GitCommit size={13} />, label: 'Commit Activity' },
            { icon: <Users size={13} />, label: 'Followers' },
          ].map((b) => (
            <div key={b.label} className="scope-pill">
              {b.icon} {b.label}
            </div>
          ))}
        </div>
      </div>

      {/* ── Right panel — sign in ── */}
      <div style={{
        width: '100%', maxWidth: '480px', margin: '0 auto',
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        padding: '40px 32px',
      }}>
        {/* Mobile logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '36px', justifyContent: 'center' }}>
          <div style={{
            width: '38px', height: '38px', borderRadius: '10px',
            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(59,130,246,0.2)',
          }}>
            <BarChart2 size={19} color="#fff" />
          </div>
          <span style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.03em', color: '#1f2328' }}>
            Dev<span style={{ background: 'linear-gradient(135deg,#3b82f6,#8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Metrics</span>
          </span>
        </div>

        {/* Card */}
        <div className="card-anim" style={{
          background: '#fff', border: '1px solid #d0d7de',
          borderRadius: '12px', padding: '36px 32px',
          boxShadow: '0 4px 24px rgba(31,35,40,0.06)',
        }}>
          {/* GitHub mark */}
          <div className="hero-icon" style={{ textAlign: 'center', marginBottom: '20px' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              width: '68px', height: '68px', borderRadius: '50%',
              background: '#f6f8fa', border: '1px solid #d0d7de',
            }}>
              <Github size={36} color="#1f2328" />
            </div>
          </div>

          <h2 style={{ textAlign: 'center', fontSize: '1.3rem', fontWeight: 700, marginBottom: '8px', color: '#1f2328' }}>
            Sign in to DevMetrics
          </h2>
          <p style={{ textAlign: 'center', color: '#57606a', fontSize: '0.87rem', marginBottom: '26px', lineHeight: 1.6 }}>
            We use your GitHub account to read your public stats.<br />No data is stored permanently.
          </p>

          {/* Sign in button */}
          <button className="gh-btn" onClick={login}>
            <Github size={20} />
            Continue with GitHub
          </button>

          <div className="divider" />

          {/* Permissions */}
          <p style={{ fontSize: '0.72rem', color: '#57606a', textAlign: 'center', marginBottom: '12px', fontWeight: 600, letterSpacing: '0.06em' }}>
            PERMISSIONS REQUESTED
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[
              'read:user — Basic profile info',
              'user:email — Email address (not displayed)',
              'repo — Read-only access to repositories',
            ].map((s) => (
              <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#57606a', fontSize: '0.8rem' }}>
                <Lock size={12} color="#1a7f37" style={{ flexShrink: 0 }} />
                {s}
              </div>
            ))}
          </div>

          <div className="divider" />

          <p style={{ textAlign: 'center', fontSize: '0.72rem', color: '#6e7781', lineHeight: 1.6 }}>
            DevMetrics only reads your GitHub data and never writes or stores it beyond your session.
          </p>
        </div>

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <a href="/" className="back-link">← Back to home</a>
        </div>
      </div>
    </div>
  )
}
