import { PURPLE } from './constants'

function CollabBar({ label, value, max, color }) {
  const pct = Math.min((value / max) * 100, 100)
  return (
    <div style={{ marginBottom: '14px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
        <span style={{ fontSize: '0.78rem', fontWeight: 500, color: 'var(--text-secondary)' }}>{label}</span>
        <span style={{ fontSize: '0.78rem', fontWeight: 700, color }}>{value}</span>
      </div>
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  )
}

export default function CollaborationCard({ collab }) {
  if (!collab) return null

  return (
    <div className="bento-4 card card-padded">
      <h2 className="section-title" style={{ marginBottom: '16px' }}>Collaboration</h2>
      <CollabBar label="PRs Authored" value={collab.prsAuthored || 0} max={50} color={PURPLE} />
      <CollabBar label="PRs Reviewed" value={collab.reviewCount} max={30} color="var(--blue)" />
      <CollabBar label="Issues Commented" value={collab.issueComments} max={40} color="var(--amber)" />
      <CollabBar label="Review Comments" value={collab.reviewComments} max={20} color="var(--green)" />
      <div style={{
        marginTop: '16px', padding: '12px', borderRadius: 'var(--radius-sm)',
        background: 'var(--purple-light)', textAlign: 'center',
      }}>
        <div style={{ fontSize: '1.5rem', fontWeight: 800, color: PURPLE }}>{collab.score}</div>
        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 500 }}>Collaboration Score</div>
      </div>
    </div>
  )
}
