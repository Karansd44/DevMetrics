import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip,
} from 'recharts'
import { PURPLE, tooltipStyle, CHART_COLORS } from './constants'

export default function CommitActivity({ activityTimeline, churn }) {
  return (
    <div id="analytics-section" className="bento-8 card card-padded">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div>
          <h2 className="section-title">Commit Activity</h2>
          <p className="section-subtitle">Recent contribution frequency</p>
        </div>
        {churn && (
          <span style={{
            fontSize: '0.72rem', fontWeight: 600, color: 'var(--green)',
            background: 'var(--green-light)', padding: '4px 10px', borderRadius: '100px',
          }}>
            {churn.commitCount} commits
          </span>
        )}
      </div>
      <div style={{ height: '240px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={activityTimeline}>
            <defs>
              <linearGradient id="purpleGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={PURPLE} stopOpacity={0.2} />
                <stop offset="100%" stopColor={PURPLE} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} vertical={false} />
            <XAxis
              dataKey="date"
              stroke={CHART_COLORS.axis}
              tick={{ fontSize: 11, fill: CHART_COLORS.axis }}
              axisLine={{ stroke: CHART_COLORS.axisLine }}
              tickLine={false}
            />
            <YAxis
              stroke={CHART_COLORS.axis}
              tick={{ fontSize: 11, fill: CHART_COLORS.axis }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
            />
            <Tooltip contentStyle={tooltipStyle} />
            <Area
              type="monotone"
              dataKey="events"
              stroke={PURPLE}
              strokeWidth={2.5}
              fill="url(#purpleGrad)"
              dot={false}
              activeDot={{ r: 4, fill: PURPLE, strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
