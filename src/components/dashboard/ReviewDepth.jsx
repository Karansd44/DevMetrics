import { GitPullRequest, MessageCircle, Eye, Heart, Clock } from 'lucide-react'
import { PURPLE } from './constants'

function DepthStat({ icon, label, value, desc, color, bg }) {
  return (
    <div style={{
      padding: '16px', borderRadius: 'var(--radius-md)',
      border: '1px solid var(--border)', background: 'var(--bg-card)', textAlign: 'center',
    }}>
      <div style={{
        width: '36px', height: '36px', borderRadius: '10px',
        background: bg, color, display: 'flex',
        alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px',
      }}>
        {icon}
      </div>
      <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '2px' }}>{value}</div>
      <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-primary)' }}>{label}</div>
      <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '2px' }}>{desc}</div>
    </div>
  )
}

export default function ReviewDepth({ reviewDepth, collab }) {
  if (!reviewDepth && !collab) return null

  const depth = reviewDepth || {}
  const helpScore = Math.round(depth.helpfulness || 0)
  const helpLevel = helpScore >= 50 ? 'Team Pillar' : helpScore >= 20 ? 'Active Helper' : helpScore >= 5 ? 'Contributor' : 'Getting Started'
  const helpColor = helpScore >= 50 ? 'var(--green)' : helpScore >= 20 ? 'var(--blue)' : helpScore >= 5 ? 'var(--amber)' : 'var(--text-muted)'

  return (
    <div className="bento-4 card card-padded" id="review-section">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          <h2 className="section-title">Review Depth</h2>
          <p className="section-subtitle">How much time you spend helping others</p>
        </div>
        <span style={{
          fontSize: '0.72rem', fontWeight: 600, color: helpColor,
          background: helpScore >= 20 ? 'var(--green-light)' : 'var(--bg-page)',
          padding: '4px 12px', borderRadius: '100px',
        }}>
          {helpLevel}
        </span>
      </div>

      {/* Helpfulness gauge */}
      <div style={{
        padding: '16px', borderRadius: 'var(--radius-md)',
        background: 'var(--bg-page)', textAlign: 'center', marginBottom: '16px',
      }}>
        <div style={{ fontSize: '0.68rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', marginBottom: '6px' }}>
          Helpfulness Score
        </div>
        <div style={{ fontSize: '2rem', fontWeight: 800, color: helpColor, fontFamily: 'var(--mono)' }}>
          {helpScore}
        </div>
        <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '4px' }}>
          Based on reviews, comments & mentorship activity
        </div>
      </div>

      {/* Stat grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
        <DepthStat
          icon={<Eye size={18} />}
          label="PRs Reviewed"
          value={depth.totalReviews ?? collab?.reviewCount ?? 0}
          desc="Code reviews completed"
          color={PURPLE}
          bg="var(--purple-light)"
        />
        <DepthStat
          icon={<MessageCircle size={18} />}
          label="Review Comments"
          value={depth.reviewComments ?? collab?.reviewComments ?? 0}
          desc="Inline code feedback"
          color="var(--blue)"
          bg="var(--blue-light)"
        />
        <DepthStat
          icon={<Heart size={18} />}
          label="Issues Helped"
          value={depth.issuesHelped ?? collab?.issueComments ?? 0}
          desc="Community issues answered"
          color="var(--amber)"
          bg="var(--amber-light)"
        />
        <DepthStat
          icon={<Clock size={18} />}
          label="Weekly Reviews"
          value={depth.avgReviewsPerWeek ?? 0}
          desc="Average per week"
          color="var(--green)"
          bg="var(--green-light)"
        />
      </div>

      {/* Recent review activity */}
      {depth.recentReviews?.length > 0 && (
        <div style={{ marginTop: '16px' }}>
          <div style={{
            fontSize: '0.68rem', fontWeight: 600, textTransform: 'uppercase',
            letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: '8px',
          }}>
            Recent Reviews
          </div>
          {depth.recentReviews.slice(0, 4).map((r, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '6px 0', fontSize: '0.72rem',
              borderBottom: i < 3 ? '1px solid var(--border)' : 'none',
            }}>
              <GitPullRequest size={12} style={{ color: PURPLE, flexShrink: 0 }} />
              <span style={{ flex: 1, color: 'var(--text-primary)', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {r.repo?.split('/').pop() || r.repo}
              </span>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.68rem', flexShrink: 0 }}>
                {new Date(r.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
