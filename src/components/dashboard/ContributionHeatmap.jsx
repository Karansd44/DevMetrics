import { PURPLE } from './constants'

export default function ContributionHeatmap({ heatmapWeeks, totalContributions }) {
  return (
    <div className="bento-8 card card-padded">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          <h2 className="section-title">Contribution Heatmap</h2>
          <p className="section-subtitle">Your activity over the past year</p>
        </div>
        <span style={{
          fontSize: '0.72rem', fontWeight: 600, color: PURPLE,
          background: 'var(--purple-light)', padding: '4px 10px', borderRadius: '100px',
        }}>
          {totalContributions.toLocaleString()} contributions
        </span>
      </div>
      <div className="heatmap-container">
        {/* Month labels */}
        <div className="heatmap-months">
          {(() => {
            if (!heatmapWeeks.length) return null
            const months = []
            let lastMonth = ''
            heatmapWeeks.forEach((week, wi) => {
              const firstDay = week[0]
              if (!firstDay) return
              const d = new Date(firstDay.date + 'T00:00:00')
              const m = d.toLocaleString('en-US', { month: 'short' })
              if (m !== lastMonth) {
                months.push({ label: m, col: wi })
                lastMonth = m
              }
            })
            return months.map((m) => (
              <span key={m.col} className="heatmap-month-label" style={{ gridColumn: m.col + 1 }}>{m.label}</span>
            ))
          })()}
        </div>
        {/* Day labels + grid */}
        <div className="heatmap-body">
          <div className="heatmap-day-labels">
            <span></span><span>Mon</span><span></span><span>Wed</span><span></span><span>Fri</span><span></span>
          </div>
          <div className="heatmap-grid">
            {heatmapWeeks.map((week, wi) => (
              <div key={wi} className="heatmap-col">
                {week.map((day, di) => (
                  <div
                    key={di}
                    className={`heatmap-cell heatmap-level-${day.level}`}
                    title={`${day.date}: ${day.count} contribution${day.count !== 1 ? 's' : ''}`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="heatmap-legend">
        <span className="heatmap-legend-label">Less</span>
        {[0, 1, 2, 3, 4].map((lvl) => (
          <div key={lvl} className={`heatmap-legend-cell heatmap-level-${lvl}`} />
        ))}
        <span className="heatmap-legend-label">More</span>
      </div>
    </div>
  )
}
