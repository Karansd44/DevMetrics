import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { LANG_COLORS, tooltipStyle } from './constants'

export default function TopLanguages({ langData }) {
  if (!langData?.length) return null

  return (
    <div className="bento-3 card card-padded">
      <h2 className="section-title" style={{ marginBottom: '2px' }}>Languages</h2>
      <p className="section-subtitle" style={{ marginBottom: '8px' }}>Distribution by repo count</p>

      {/* Donut chart */}
      <div style={{ height: '130px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={langData}
              dataKey="pct"
              nameKey="language"
              cx="50%"
              cy="50%"
              innerRadius={32}
              outerRadius={55}
              paddingAngle={2}
              strokeWidth={0}
            >
              {langData.map((entry, i) => (
                <Cell key={entry.language} fill={LANG_COLORS[i % LANG_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={tooltipStyle}
              formatter={(v, name) => [`${v}%`, name]}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend — horizontal bar indicators */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {langData.slice(0, 5).map((lang, i) => (
          <div key={lang.language} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '8px', height: '8px', borderRadius: '2px', flexShrink: 0,
              background: LANG_COLORS[i % LANG_COLORS.length],
            }} />
            <span style={{ flex: 1, fontSize: '0.72rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
              {lang.language}
            </span>
            <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'var(--mono)' }}>
              {lang.pct}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
