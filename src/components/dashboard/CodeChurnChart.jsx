import React from 'react'
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip,
} from 'recharts'
import { tooltipStyle, CHART_COLORS } from './constants'

function MiniStat({ label, value, color }) {
  return (
    <div style={{
      flex: 1, padding: '8px 12px', borderRadius: '8px',
      background: 'var(--bg-page)', textAlign: 'center',
    }}>
      <div style={{ fontSize: '0.95rem', fontWeight: 700, color }}>{value}</div>
      <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '2px' }}>{label}</div>
    </div>
  )
}

export default function CodeChurnChart({ churn }) {
  if (!churn?.timeline?.length) return null

  return (
    <div className="bento-4 card card-padded">
      <div style={{ marginBottom: '16px' }}>
        <h2 className="section-title">Code Churn</h2>
        <p className="section-subtitle">Lines added vs deleted</p>
      </div>
      <div style={{ height: '200px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={churn.timeline}>
            <defs>
              <linearGradient id="addGrad2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#059669" stopOpacity={0.15} />
                <stop offset="100%" stopColor="#059669" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="delGrad2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#64748B" stopOpacity={0.15} />
                <stop offset="100%" stopColor="#64748B" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} vertical={false} />
            <XAxis dataKey="date" stroke={CHART_COLORS.axis} tick={{ fontSize: 10, fill: CHART_COLORS.axis }} tickLine={false} axisLine={{ stroke: CHART_COLORS.axisLine }} />
            <YAxis stroke={CHART_COLORS.axis} tick={{ fontSize: 10, fill: CHART_COLORS.axis }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={tooltipStyle} />
            <Area type="monotone" dataKey="additions" stroke="#059669" strokeWidth={2} fill="url(#addGrad2)" name="Added" dot={false} />
            <Area type="monotone" dataKey="deletions" stroke="#64748B" strokeWidth={2} fill="url(#delGrad2)" name="Deleted" dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div style={{ display: 'flex', gap: '8px', marginTop: '14px' }}>
        <MiniStat label="Retention" value={`${churn.retention}%`} color="#059669" />
        <MiniStat label="Churn" value={`${churn.churnRate}%`} color="#64748B" />
        <MiniStat label="Net" value={`${churn.netChange >= 0 ? '+' : ''}${churn.netChange.toLocaleString()}`} color={churn.netChange >= 0 ? '#059669' : '#DC2626'} />
      </div>
    </div>
  )
}
