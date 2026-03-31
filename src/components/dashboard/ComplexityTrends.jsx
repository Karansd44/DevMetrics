import React from 'react'
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, BarChart, Bar,
} from 'recharts'
import { tooltipStyle, CHART_COLORS, PURPLE } from './constants'
import { TrendingUp, Activity } from 'lucide-react'

export default function ComplexityTrends({ complexityTrends }) {
  if (!complexityTrends?.length) return null

  // Calculate average complexity
  const avgComplexity = Math.round(
    complexityTrends.reduce((s, d) => s + d.avgLines, 0) / complexityTrends.length
  )
  const maxComplexity = Math.max(...complexityTrends.map(d => d.avgLines))
  const trend = complexityTrends.length >= 3
    ? complexityTrends[complexityTrends.length - 1].avgLines - complexityTrends[0].avgLines
    : 0
  const trendLabel = trend > 20 ? 'Increasing' : trend < -20 ? 'Decreasing' : 'Stable'
  const trendColor = trend > 20 ? 'var(--amber)' : trend < -20 ? 'var(--blue)' : 'var(--green)'

  return (
    <div className="bento-4 card card-padded" id="complexity-section">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          <h2 className="section-title">Complexity Trends</h2>
          <p className="section-subtitle">How complex your work is over time</p>
        </div>
        <span style={{
          fontSize: '0.72rem', fontWeight: 600, color: trendColor,
          background: trend > 20 ? 'var(--amber-light)' : trend < -20 ? 'var(--blue-light)' : 'var(--green-light)',
          padding: '4px 12px', borderRadius: '100px',
          display: 'flex', alignItems: 'center', gap: '4px',
        }}>
          <TrendingUp size={12} />
          {trendLabel}
        </span>
      </div>

      {/* Chart */}
      <div style={{ height: '200px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={complexityTrends}>
            <defs>
              <linearGradient id="complexGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={PURPLE} stopOpacity={0.2} />
                <stop offset="100%" stopColor={PURPLE} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} vertical={false} />
            <XAxis
              dataKey="date"
              stroke={CHART_COLORS.axis}
              tick={{ fontSize: 10, fill: CHART_COLORS.axis }}
              tickLine={false}
              axisLine={{ stroke: CHART_COLORS.axisLine }}
            />
            <YAxis
              stroke={CHART_COLORS.axis}
              tick={{ fontSize: 10, fill: CHART_COLORS.axis }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={tooltipStyle}
              formatter={(value, name) => {
                if (name === 'avgLines') return [`${value} lines`, 'Avg Lines/Commit']
                if (name === 'commits') return [value, 'Commits']
                if (name === 'files') return [value, 'Files Changed']
                return [value, name]
              }}
            />
            <Area
              type="monotone"
              dataKey="avgLines"
              stroke={PURPLE}
              strokeWidth={2.5}
              fill="url(#complexGrad)"
              dot={false}
              activeDot={{ r: 4, fill: PURPLE, strokeWidth: 0 }}
              name="avgLines"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Summary stats */}
      <div style={{ display: 'flex', gap: '12px', marginTop: '14px' }}>
        <div style={{
          flex: 1, padding: '10px 14px', borderRadius: '8px',
          background: 'var(--bg-page)', textAlign: 'center',
        }}>
          <div style={{ fontSize: '1rem', fontWeight: 700, color: PURPLE }}>{avgComplexity}</div>
          <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '2px' }}>Avg Lines/Commit</div>
        </div>
        <div style={{
          flex: 1, padding: '10px 14px', borderRadius: '8px',
          background: 'var(--bg-page)', textAlign: 'center',
        }}>
          <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--blue)' }}>{maxComplexity}</div>
          <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '2px' }}>Peak Complexity</div>
        </div>
        <div style={{
          flex: 1, padding: '10px 14px', borderRadius: '8px',
          background: 'var(--bg-page)', textAlign: 'center',
        }}>
          <div style={{ fontSize: '1rem', fontWeight: 700, color: trendColor }}>{trendLabel}</div>
          <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '2px' }}>Trend Direction</div>
        </div>
      </div>
    </div>
  )
}
