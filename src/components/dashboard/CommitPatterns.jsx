import { Zap, AlertCircle, TrendingUp } from 'lucide-react'
import { PURPLE } from './constants'

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

export default function CommitPatterns({ quality }) {
  if (!quality) return null

  return (
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
  )
}
