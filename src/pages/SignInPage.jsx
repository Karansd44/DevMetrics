import { useAuth } from '../context/AuthContext.jsx'
import { Github, BarChart2, Star, GitCommit, Users, Zap, Lock, TrendingUp } from 'lucide-react'

const FEATURES = [
  { icon: <BarChart2 size={18} />, title: 'Repo Analytics', desc: 'Stars, forks, language breakdown across all your repositories.' },
  { icon: <GitCommit size={18} />, title: 'Commit Activity', desc: 'Visualize your commit streaks and contribution patterns.' },
  { icon: <Zap size={18} />, title: 'AI Insights', desc: 'GPT-powered career tips based on your coding activity.' },
  { icon: <TrendingUp size={18} />, title: 'Growth Metrics', desc: 'Track followers, stars and repo growth over time.' },
]

export default function SignInPage() {
  const { login } = useAuth()

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: '#0d1117', color: '#e6edf3', fontFamily: 'inherit' }}>
      <style>{`
        @keyframes pulse-ring {
          0% { transform: scale(0.95); opacity: 0.7; }
          50% { transform: scale(1.05); opacity: 0.3; }
          100% { transform: scale(0.95); opacity: 0.7; }
        }
        @keyframes drift {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .gh-btn {
          all: unset;
          display: flex; align-items: center; justify-content: center; gap: 10px;
          width: 100%; padding: 14px 0; border-radius: 8px; cursor: pointer;
          font-size: 0.95rem; font-weight: 600; box-sizing: border-box;
          background: #238636; color: #fff;
          border: 1px solid rgba(240,246,252,0.1);
          transition: background 0.15s, box-shadow 0.15s, transform 0.15s;
        }
        .gh-btn:hover {
          background: #2ea043;
          transform: translateY(-1px);
          box-shadow: 0 4px 20px rgba(35,134,54,0.4);
        }
        .gh-btn:active { transform: translateY(0); background: #1e7e2f; }
        .feature-card {
          display: flex; gap: 14px; align-items: flex-start;
          padding: 16px; border-radius: 10px;
          background: rgba(22,27,34,0.8);
          border: 1px solid #30363d;
          transition: border-color 0.2s, background 0.2s;
          animation: fade-up 0.5s ease-out both;
        }
        .feature-card:hover { border-color: #58a6ff; background: rgba(56,139,253,0.04); }
        .scope-pill {
          display: inline-flex; align-items: center; gap: 6px;
          background: rgba(56,139,253,0.1); border: 1px solid rgba(56,139,253,0.3);
          color: #58a6ff; border-radius: 20px;
          padding: 4px 12px; font-size: 0.75rem; font-weight: 500;
        }
        .brand-glow { animation: pulse-ring 4s ease-in-out infinite; }
        .hero-icon { animation: drift 6s ease-in-out infinite; }
        .card-anim { animation: fade-up 0.45s ease-out both; }
        .divider { height: 1px; background: #30363d; margin: 20px 0; }
        .back-link { color: #8b949e; text-decoration: none; font-size: 0.82rem; transition: color 0.2s; }
        .back-link:hover { color: #58a6ff; }
        @media (min-width: 900px) { .left-panel { display: flex !important; } }
      `}</style>

      {/* ── Left panel — branding ── */}
      <div className="left-panel" style={{
        flex: 1, display: 'none',
        flexDirection: 'column', justifyContent: 'center', padding: '60px',
        background: 'linear-gradient(160deg, #161b22 0%, #0d1117 100%)',
        borderRight: '1px solid #30363d',
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '48px' }}>
          <div className="brand-glow" style={{
            width: '48px', height: '48px', borderRadius: '14px',
            background: 'linear-gradient(135deg, #238636, #58a6ff)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 24px rgba(35,134,54,0.35)',
          }}>
            <BarChart2 size={24} color="#fff" />
          </div>
          <span style={{ fontSize: '1.6rem', fontWeight: 800, letterSpacing: '-0.03em', color: '#e6edf3' }}>
            Dev<span style={{ color: '#58a6ff' }}>Metrics</span>
          </span>
        </div>

        {/* Headline */}
        <h1 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', fontWeight: 800, lineHeight: 1.2, marginBottom: '16px', letterSpacing: '-0.03em' }}>
          Your GitHub stats,<br />
          <span style={{ background: 'linear-gradient(90deg, #238636, #58a6ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            beautifully visualized.
          </span>
        </h1>
        <p style={{ color: '#8b949e', fontSize: '1rem', lineHeight: 1.7, maxWidth: '440px', marginBottom: '48px' }}>
          Connect your GitHub account for a live dashboard of your contributions, repositories, languages and AI-powered career insights.
        </p>

        {/* Feature cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '480px' }}>
          {FEATURES.map((f, i) => (
            <div key={f.title} className="feature-card" style={{ animationDelay: `${i * 0.1}s` }}>
              <div style={{
                flexShrink: 0, width: '36px', height: '36px', borderRadius: '8px',
                background: 'rgba(56,139,253,0.12)', display: 'flex', alignItems: 'center',
                justifyContent: 'center', color: '#58a6ff',
              }}>
                {f.icon}
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '2px', color: '#e6edf3' }}>{f.title}</div>
                <div style={{ fontSize: '0.8rem', color: '#8b949e', lineHeight: 1.5 }}>{f.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Stat badges */}
        <div style={{ display: 'flex', gap: '12px', marginTop: '36px', flexWrap: 'wrap' }}>
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '40px', justifyContent: 'center' }}>
          <div style={{
            width: '40px', height: '40px', borderRadius: '12px',
            background: 'linear-gradient(135deg, #238636, #58a6ff)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <BarChart2 size={20} color="#fff" />
          </div>
          <span style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.03em' }}>
            Dev<span style={{ color: '#58a6ff' }}>Metrics</span>
          </span>
        </div>

        {/* Card */}
        <div className="card-anim" style={{
          background: '#161b22', border: '1px solid #30363d',
          borderRadius: '14px', padding: '36px 32px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        }}>
          {/* GitHub mark */}
          <div className="hero-icon" style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              width: '72px', height: '72px', borderRadius: '50%',
              background: '#21262d', border: '1px solid #30363d',
            }}>
              <Github size={38} color="#e6edf3" />
            </div>
          </div>

          <h2 style={{ textAlign: 'center', fontSize: '1.35rem', fontWeight: 700, marginBottom: '8px', color: '#e6edf3' }}>
            Sign in to DevMetrics
          </h2>
          <p style={{ textAlign: 'center', color: '#8b949e', fontSize: '0.88rem', marginBottom: '28px', lineHeight: 1.6 }}>
            We use your GitHub account to read your public stats.<br />No data is stored permanently.
          </p>

          {/* Sign in button */}
          <button className="gh-btn" onClick={login}>
            <Github size={20} />
            Continue with GitHub
          </button>

          <div className="divider" />

          {/* Permissions */}
          <p style={{ fontSize: '0.75rem', color: '#6e7681', textAlign: 'center', marginBottom: '12px', fontWeight: 600, letterSpacing: '0.05em' }}>
            PERMISSIONS REQUESTED
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[
              'read:user — Basic profile info',
              'user:email — Email address (not displayed)',
              'repo — Read-only access to repositories',
            ].map((s) => (
              <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#8b949e', fontSize: '0.8rem' }}>
                <Lock size={12} color="#3fb950" style={{ flexShrink: 0 }} />
                {s}
              </div>
            ))}
          </div>

          <div className="divider" />

          <p style={{ textAlign: 'center', fontSize: '0.73rem', color: '#6e7681', lineHeight: 1.6 }}>
            DevMetrics only reads your GitHub data and never writes or stores it beyond your session.
          </p>
        </div>

        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <a href="/" className="back-link">← Back to home</a>
        </div>
      </div>
    </div>
  )
}
