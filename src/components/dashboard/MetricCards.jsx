import {
  GitPullRequest, TrendingDown, Code2, Award,
} from 'lucide-react'
import { PURPLE } from './constants'

export default function MetricCards({ collab, churn, quality }) {
  return (
    <>
      <div className="bento-3 card metric-card">
        <div className="metric-header">
          <span className="metric-label">Total PRs</span>
          <div className="metric-icon" style={{ background: 'var(--purple-light)', color: PURPLE }}>
            <GitPullRequest size={17} />
          </div>
        </div>
        <div className="metric-value">{collab?.reviewCount ?? 0}</div>
      </div>

      <div className="bento-3 card metric-card">
        <div className="metric-header">
          <span className="metric-label">Code Churn</span>
          <div className="metric-icon" style={{ background: 'var(--amber-light)', color: 'var(--amber)' }}>
            <TrendingDown size={17} />
          </div>
        </div>
        <div className="metric-value">{churn?.churnRate ?? 0}%</div>
      </div>

      <div className="bento-3 card metric-card">
        <div className="metric-header">
          <span className="metric-label">Avg Lines/Commit</span>
          <div className="metric-icon" style={{ background: 'var(--blue-light)', color: 'var(--blue)' }}>
            <Code2 size={17} />
          </div>
        </div>
        <div className="metric-value">{churn?.avgLinesPerCommit ?? 0}</div>
      </div>

      <div className="bento-3 card metric-card">
        <div className="metric-header">
          <span className="metric-label">Quality Score</span>
          <div className="metric-icon" style={{ background: 'var(--green-light)', color: 'var(--green)' }}>
            <Award size={17} />
          </div>
        </div>
        <div className="metric-value">
          {quality?.overallScore ?? 0}
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>/100</span>
        </div>
      </div>
    </>
  )
}
