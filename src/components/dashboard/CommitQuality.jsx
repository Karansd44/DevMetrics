import { CheckCircle, AlertCircle, ShieldAlert } from 'lucide-react'

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

export default function CommitQuality({ quality }) {
  if (!quality) return null

  return (
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

      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
        <ScoreRing score={quality.overallScore} size={100} />
      </div>

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
  )
}
