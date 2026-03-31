import React from 'react'
import { AlertCircle, CheckCircle2 } from 'lucide-react'
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'

export default function AIIntegrityCard({ aiMetrics = null }) {
  if (!aiMetrics) return null

  const {
    currentScore = 35,
    trend = [],
    suspiciousIndicators = [],
    classification = 'Minimal AI Assistance',
    lastAnalyzed = new Date().toLocaleDateString(),
  } = aiMetrics

  // Color logic based on score
  const getScoreColor = (score) => {
    if (score < 20) return { bg: '#059669', light: 'rgba(5, 150, 105, 0.1)', text: '#059669' }
    if (score < 40) return { bg: '#0EA5E9', light: 'rgba(14, 165, 233, 0.1)', text: '#0EA5E9' }
    if (score < 60) return { bg: '#F59E0B', light: 'rgba(245, 158, 11, 0.1)', text: '#F59E0B' }
    if (score < 80) return { bg: '#F97316', light: 'rgba(249, 115, 22, 0.1)', text: '#F97316' }
    return { bg: '#EF4444', light: 'rgba(239, 68, 68, 0.1)', text: '#EF4444' }
  }

  const colors = getScoreColor(currentScore)

  // Mini sparkline trend data
  const trendData = trend.length > 0 ? trend : [
    { date: '7d', score: currentScore - 5 },
    { date: '5d', score: currentScore - 2 },
    { date: '3d', score: currentScore + 1 },
    { date: '1d', score: currentScore },
  ]

  return (
    <div
      className="bento-4 card card-padded"
      style={{
        borderColor: `${colors.bg}40`,
        position: 'relative',
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h2 className="section-title">AI Integrity</h2>
          <p className="section-subtitle">Code authenticity analysis</p>
        </div>
        <div
          style={{
            padding: '6px 12px',
            borderRadius: '6px',
            background: colors.light,
            color: colors.text,
            fontSize: '0.75rem',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}
        >
          {currentScore < 20 ? 'Pure' : currentScore < 40 ? 'Minimal' : currentScore < 60 ? 'Moderate' : currentScore < 80 ? 'Heavy' : 'Predominant'}
        </div>
      </div>

      {/* Main Score Display */}
      <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', alignItems: 'center' }}>
        {/* Large Score Ring */}
        <div style={{ position: 'relative', width: '100px', height: '100px', flexShrink: 0 }}>
          <svg width="100" height="100" style={{ transform: 'rotate(-90deg)' }}>
            <circle cx="50" cy="50" r="45" fill="none" stroke="var(--bg-page)" strokeWidth="6" />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke={colors.bg}
              strokeWidth="6"
              strokeDasharray={`${(currentScore / 100) * 283} 283`}
              style={{ transition: 'stroke-dasharray 0.3s ease' }}
            />
          </svg>
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: colors.text }}>{currentScore}</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px' }}>out of 100</div>
          </div>
        </div>

        {/* Trend Chart */}
        <div style={{ flex: 1, height: '80px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={colors.bg} stopOpacity={0.2} />
                  <stop offset="100%" stopColor={colors.bg} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
              <YAxis hide domain={[0, 100]} />
              <Tooltip
                contentStyle={{
                  background: 'var(--bg-elevated)',
                  border: `1px solid ${colors.bg}40`,
                  borderRadius: '8px',
                  padding: '8px 12px',
                }}
                formatter={(value) => [`${value}%`, 'Score']}
              />
              <Area type="monotone" dataKey="score" stroke={colors.bg} strokeWidth={2} fill="url(#trendGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Classification */}
      <div
        style={{
          padding: '12px 0',
          borderTop: '1px solid var(--border-color)',
          borderBottom: '1px solid var(--border-color)',
          marginBottom: '16px',
        }}
      >
        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Classification</div>
        <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>{classification}</div>
      </div>

      {/* Suspicious Indicators */}
      <div>
        <div
          style={{
            fontSize: '0.85rem',
            fontWeight: 600,
            color: 'var(--text-muted)',
            marginBottom: '10px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}
        >
          Top Indicators
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {suspiciousIndicators && suspiciousIndicators.length > 0 ? (
            suspiciousIndicators.slice(0, 3).map((indicator, i) => (
              <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', fontSize: '0.85rem' }}>
                <AlertCircle
                  size={16}
                  style={{
                    color: indicator.severity === 'high' ? '#EF4444' : '#F59E0B',
                    marginTop: '2px',
                    flexShrink: 0,
                  }}
                />
                <div>
                  <div style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{indicator.label}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>{indicator.description}</div>
                </div>
              </div>
            ))
          ) : (
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              <CheckCircle2 size={16} style={{ color: '#059669' }} />
              No significant indicators detected
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          marginTop: '12px',
          paddingTop: '12px',
          borderTop: '1px solid var(--border-color)',
          fontSize: '0.7rem',
          color: 'var(--text-muted)',
        }}
      >
        Last analyzed: {lastAnalyzed}
      </div>
    </div>
  )
}
