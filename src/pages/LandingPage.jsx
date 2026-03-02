import { useNavigate } from 'react-router-dom'
import {
  BarChart3, Code2, ArrowRight, Github, Globe,
  Zap, Flame, GitBranch, Users, TrendingUp, Activity,
  Star, GitPullRequest, CheckCircle2, Shield, Lock, Eye, Target,
} from 'lucide-react'

export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="landing-white">
      {/* ── Navbar ── */}
      <nav className="lw-navbar">
        <div className="lw-navbar-brand">DevMetrics</div>
        <div className="lw-navbar-links">
          <a href="#preview" className="lw-nav-link">Product</a>
          <a href="#features" className="lw-nav-link">Features</a>
          <a href="#metrics" className="lw-nav-link">Metrics</a>
          <button
            onClick={() => navigate('/auth/signin')}
            className="lw-btn-primary lw-btn-sm"
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="lw-hero">
        <div className="lw-hero-inner">
          <p className="lw-hero-eyebrow">Open-source contribution analytics</p>

          <h1 className="lw-hero-h1">
            Your coding legacy,<br />quantified.
          </h1>

          <p className="lw-hero-sub">
            Go beyond green squares. See code churn, authenticity scoring, 
            review depth, and private work — real impact metrics that prove
            what you actually built.
          </p>

          <div className="lw-hero-ctas">
            <button
              onClick={() => navigate('/auth/signin')}
              className="lw-btn-primary"
            >
              <Github size={18} />
              Analyze My Profile
              <ArrowRight size={16} />
            </button>
            <a href="#preview" className="lw-btn-outline">
              View Demo
            </a>
          </div>

          {/* Trust bar */}
          <div className="lw-trust-bar">
            <div className="lw-trust-item">
              <CheckCircle2 size={14} />
              <span>Free &amp; open-source</span>
            </div>
            <div className="lw-trust-sep" />
            <div className="lw-trust-item">
              <Star size={14} />
              <span>12k+ developers</span>
            </div>
            <div className="lw-trust-sep" />
            <div className="lw-trust-item">
              <GitPullRequest size={14} />
              <span>No token required</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Product Preview ── */}
      <section className="lw-preview" id="preview">
        <div className="lw-preview-inner">
          <div className="lw-preview-window">
            <div className="lw-preview-bar">
              <span className="lw-dot" /><span className="lw-dot" /><span className="lw-dot" />
            </div>
            <div className="lw-preview-grid">
              {/* Stat cards row */}
              <div className="lw-stat-card">
                <div className="lw-stat-label">Total Stars</div>
                <div className="lw-stat-value">2,847</div>
              </div>
              <div className="lw-stat-card">
                <div className="lw-stat-label">Repositories</div>
                <div className="lw-stat-value">134</div>
              </div>
              <div className="lw-stat-card">
                <div className="lw-stat-label">Contributions</div>
                <div className="lw-stat-value">8,291</div>
              </div>
              <div className="lw-stat-card">
                <div className="lw-stat-label">Global Rank</div>
                <div className="lw-stat-value">Top 3%</div>
              </div>
              {/* Mini heatmap placeholder */}
              <div className="lw-stat-card lw-stat-wide">
                <div className="lw-stat-label">Contribution Heatmap</div>
                <div className="lw-mini-heatmap" aria-hidden="true">
                  {Array.from({ length: 52 }).map((_, w) => (
                    <div key={w} className="lw-hm-col">
                      {Array.from({ length: 7 }).map((_, d) => {
                        const level = Math.floor(Math.random() * 5)
                        return <div key={d} className={`lw-hm-cell lw-hm-l${level}`} />
                      })}
                    </div>
                  ))}
                </div>
              </div>
              {/* Language breakdown */}
              <div className="lw-stat-card lw-stat-wide">
                <div className="lw-stat-label">Language Breakdown</div>
                <div className="lw-lang-bars">
                  {[
                    { name: 'TypeScript', pct: 42, color: '#3178C6' },
                    { name: 'Python', pct: 28, color: '#3572A5' },
                    { name: 'Go', pct: 16, color: '#00ADD8' },
                    { name: 'Rust', pct: 9, color: '#DEA584' },
                    { name: 'Other', pct: 5, color: '#9CA3AF' },
                  ].map((l) => (
                    <div key={l.name} className="lw-lang-row">
                      <span className="lw-lang-name">{l.name}</span>
                      <div className="lw-lang-track">
                        <div className="lw-lang-fill" style={{ width: `${l.pct}%`, background: l.color }} />
                      </div>
                      <span className="lw-lang-pct">{l.pct}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Metrics Bento ── */}
      <section className="lw-metrics" id="metrics">
        <div className="lw-section-header">
          <h2 className="lw-h2">Every metric that matters</h2>
          <p className="lw-section-sub">
            Six dimensions that separate real builders from green-square farmers.
          </p>
        </div>

        <div className="lw-metrics-grid">
          {[
            { icon: <Target size={20} />, label: 'Impact Score', value: '86 / 100', desc: 'Quality-weighted measure of real contribution — not just green squares' },
            { icon: <Shield size={20} />, label: 'Authenticity', value: 'Verified', desc: 'AI noise detection — prove your work is genuine and thoughtful' },
            { icon: <Code2 size={20} />, label: 'Code Retention', value: '78%', desc: 'How much of your code stays vs gets deleted — real productivity' },
            { icon: <Eye size={20} />, label: 'Review Depth', value: '42', desc: 'PRs reviewed · inline comments · issues helped — your mentorship impact' },
            { icon: <Lock size={20} />, label: 'Private Work', value: '12 repos', desc: 'Professional contributions counted without exposing private code' },
            { icon: <TrendingUp size={20} />, label: 'Complexity', value: 'High', desc: 'Avg lines per commit over time — solving hard problems, not making typo fixes' },
          ].map((m) => (
            <div key={m.label} className="lw-metric-card">
              <div className="lw-metric-icon">{m.icon}</div>
              <span className="lw-metric-label">{m.label}</span>
              <span className="lw-metric-value">{m.value}</span>
              <span className="lw-metric-desc">{m.desc}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section className="lw-features" id="features">
        <div className="lw-section-header">
          <h2 className="lw-h2">Built for developers tired of vanity metrics</h2>
          <p className="lw-section-sub">
            No noise. Real impact data that proves what you actually built — not how many squares you colored.
          </p>
        </div>

        <div className="lw-features-grid">
          <div className="lw-feature-card">
            <div className="lw-feature-icon"><Shield size={22} /></div>
            <h3>Anti-AI Noise Detection</h3>
            <p>
              Spot fake activity instantly. Our authenticity score separates genuine 
              problem-solving from 100 tiny, auto-generated commits.
            </p>
          </div>
          <div className="lw-feature-card">
            <div className="lw-feature-icon"><Target size={22} /></div>
            <h3>Impact Over Vanity</h3>
            <p>
              A 2,000-line refactor matters more than 10 typo fixes. See code
              churn, retention rates, and complexity trends — real impact metrics.
            </p>
          </div>
          <div className="lw-feature-card">
            <div className="lw-feature-icon"><Lock size={22} /></div>
            <h3>Private Work Counts</h3>
            <p>
              Your best work happens in private repos. See your total impact 
              across all repositories without exposing any private code.
            </p>
          </div>
          <div className="lw-feature-card">
            <div className="lw-feature-icon"><Zap size={22} /></div>
            <h3>Blazing Fast</h3>
            <p>
              Smart caching means your dashboard loads instantly. No more
              staring at loading spinners — data served in milliseconds.
            </p>
          </div>
          <div className="lw-feature-card">
            <div className="lw-feature-icon"><Eye size={22} /></div>
            <h3>Source of Truth</h3>
            <p>
              GitHub's contribution graph can be glitchy. DevMetrics connects
              directly to your account for accurate, verified activity data.
            </p>
          </div>
          <div className="lw-feature-card">
            <div className="lw-feature-icon"><GitBranch size={22} /></div>
            <h3>Review Depth</h3>
            <p>
              Show how much time you spend helping others — PRs reviewed,
              issues triaged, and inline feedback that makes teams stronger.
            </p>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="lw-cta">
        <h2 className="lw-h2">Your contribution story starts here.</h2>
        <p className="lw-section-sub">
          Generate a shareable analytics report in under 30 seconds. Free, forever.
        </p>
        <button onClick={() => navigate('/auth/signin')} className="lw-btn-primary" style={{ marginTop: 20 }}>
          <Github size={18} />
          Analyze Profile
          <ArrowRight size={16} />
        </button>
      </section>

      {/* ── Footer ── */}
      <footer className="lw-footer">
        <span>DevMetrics</span>
        <span className="lw-footer-sep">·</span>
        <span>Open-source contribution analytics</span>
      </footer>
    </div>
  )
}
