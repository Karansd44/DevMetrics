import { useNavigate } from 'react-router-dom'
import {
  BarChart3, Code2, ArrowRight, Github, Globe,
  Zap, Flame, GitBranch, Users, TrendingUp, Activity,
  Star, GitPullRequest, CheckCircle2
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
            Deep-dive into your GitHub activity with beautiful, shareable insights.
            Commit velocity, language proficiency, and contribution heatmaps —
            all in one place.
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
            Six dimensions of your developer footprint — quantified and exportable.
          </p>
        </div>

        <div className="lw-metrics-grid">
          {[
            { icon: <Globe size={20} />, label: 'Global Rank', value: 'Top 5%', desc: 'Percentile among all indexed developers' },
            { icon: <Zap size={20} />, label: 'Commit Velocity', value: '4.2 / day', desc: 'Average commits per active coding day' },
            { icon: <Code2 size={20} />, label: 'Languages', value: '8', desc: 'Proficiency breakdown with depth scoring' },
            { icon: <Flame size={20} />, label: 'Active Streak', value: '365 days', desc: 'Longest consecutive contribution streak' },
            { icon: <Users size={20} />, label: 'Collaboration', value: '92 / 100', desc: 'PRs reviewed · issues triaged · team impact' },
            { icon: <Activity size={20} />, label: 'Growth Index', value: 'A+', desc: 'Year-over-year trajectory score' },
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
          <h2 className="lw-h2">Built for developers who value clarity</h2>
          <p className="lw-section-sub">
            No noise. Just the data you need to understand your open-source impact.
          </p>
        </div>

        <div className="lw-features-grid">
          <div className="lw-feature-card">
            <div className="lw-feature-icon"><BarChart3 size={22} /></div>
            <h3>Real-Time Analytics</h3>
            <p>
              Stars, forks, commit frequency, and code churn deployed into
              one shareable dashboard.
            </p>
          </div>
          <div className="lw-feature-card">
            <div className="lw-feature-icon"><GitBranch size={22} /></div>
            <h3>Developer DNA</h3>
            <p>
              A comprehensive profile of your coding identity — language
              preferences, peak hours, and contribution patterns.
            </p>
          </div>
          <div className="lw-feature-card">
            <div className="lw-feature-icon"><TrendingUp size={22} /></div>
            <h3>Growth Trajectory</h3>
            <p>
              Trend analysis showing how your skills and output have evolved.
              Built for reviews and recruiter outreach.
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
