import { Share2 } from 'lucide-react'

/* ── DevScore Gauge — cyan → indigo gradient ring ── */
function DevScoreRing({ score, size = 80 }) {
  const strokeWidth = 6
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference

  return (
    <div className="dev-score-container">
      <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          <defs>
            <linearGradient id="devScoreGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#5AC8FA" />
              <stop offset="100%" stopColor="#BF5AF2" />
            </linearGradient>
          </defs>
          <circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none" stroke="#F3F4F6" strokeWidth={strokeWidth}
          />
          <circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none" stroke="url(#devScoreGrad)" strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 1s ease' }}
          />
        </svg>
        <div style={{ position: 'absolute', textAlign: 'center' }}>
          <div style={{
            fontSize: '1.2rem', fontWeight: 800, color: '#111827',
            lineHeight: 1, fontFamily: 'var(--mono)',
          }}>
            {score}
          </div>
        </div>
      </div>
      <div className="dev-score-label">DevScore</div>
    </div>
  )
}

/* ── Shareable Profile Card ── */
export default function ProfileCard({ user, stats, totalContributions, langData, quality, collab, churn }) {
  // Composite DevScore (0-100)
  const qualityScore = quality?.overallScore ?? 50
  const collabNorm = collab?.score ? Math.min((collab.score / 30) * 100, 100) : 50
  const retention = churn?.retention ?? 80
  const contribNorm = Math.min((Math.log10((totalContributions || 0) + 1) / 4) * 100, 100)
  const devScore = Math.round(
    qualityScore * 0.35 + collabNorm * 0.25 + retention * 0.20 + contribNorm * 0.20
  )

  const displayName = user?.name || user?.login || 'Developer'
  const handle = user?.login || 'dev'

  return (
    <div className="bento-4 card card-padded profile-share-card">
      {/* Identity */}
      <div className="profile-share-header">
        {user?.avatarUrl ? (
          <img src={user.avatarUrl} alt={displayName} className="profile-share-avatar" />
        ) : (
          <div className="profile-share-avatar" style={{
            background: 'var(--purple-gradient)', display: 'flex',
            alignItems: 'center', justifyContent: 'center', color: '#fff',
            fontWeight: 700, fontSize: '1rem',
          }}>
            {displayName.charAt(0).toUpperCase()}
          </div>
        )}
        <div>
          <div className="profile-share-name">{displayName}</div>
          <div className="profile-share-handle">@{handle}</div>
        </div>
      </div>

      {/* DevScore gauge */}
      <DevScoreRing score={devScore} />

      {/* Language DNA bar */}
      {langData?.length > 0 && (
        <div>
          <div style={{
            fontSize: '0.68rem', fontWeight: 600, textTransform: 'uppercase',
            letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: '8px',
          }}>
            Language DNA
          </div>
          <div className="lang-dna-bar">
            {langData.map((l) => (
              <div
                key={l.language}
                style={{ flex: l.pct, background: l.color, minWidth: l.pct > 2 ? undefined : '2px' }}
              />
            ))}
          </div>
          <div className="lang-dna-legend">
            {langData.slice(0, 4).map((l) => (
              <div key={l.language} className="lang-dna-item">
                <div className="lang-dna-dot" style={{ background: l.color }} />
                <span>{l.language} {l.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Share action */}
      <button
        className="share-btn"
        onClick={() => {
          if (navigator.share) {
            navigator.share({ title: `${displayName} — DevMetrics`, url: window.location.href })
          } else {
            navigator.clipboard?.writeText(window.location.href)
          }
        }}
      >
        <Share2 size={14} />
        Share Profile
      </button>
    </div>
  )
}
