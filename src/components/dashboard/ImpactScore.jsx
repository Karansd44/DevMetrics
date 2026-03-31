import React from 'react'
import { Shield, TrendingUp, Zap, Target } from 'lucide-react'

/* ── Impact Score Ring — gradient ring showing real impact ── */
function ImpactRing({ score, size = 120 }) {
  const strokeWidth = 10
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference

  return (
    <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <defs>
          <linearGradient id="impactScoreGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#047857" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke="#F1F5F9" strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke="url(#impactScoreGrad)" strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1.2s ease' }}
        />
      </svg>
      <div style={{ position: 'absolute', textAlign: 'center' }}>
        <div style={{
          fontSize: '2rem', fontWeight: 700, color: '#0F172A',
          lineHeight: 1, fontFamily: 'var(--mono)',
        }}>
          {score}
        </div>
        <div style={{ fontSize: '0.62rem', color: '#94A3B8', marginTop: '2px', fontWeight: 600, letterSpacing: '0.08em' }}>
          IMPACT
        </div>
      </div>
    </div>
  )
}

function MiniMetric({ icon, label, value, color, bg }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '10px',
      padding: '10px 14px', borderRadius: 'var(--radius-sm)',
      border: '1px solid var(--border)', background: 'var(--bg-card)',
    }}>
      <div style={{
        width: '32px', height: '32px', borderRadius: '8px',
        background: bg, color, display: 'flex',
        alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        {icon}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 500 }}>{label}</div>
        <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>{value}</div>
      </div>
    </div>
  )
}

export default function ImpactScore({ impactMetrics }) {
  if (!impactMetrics) return null

  const score = impactMetrics.impactScore ?? 0
  const quality = impactMetrics.quality
  const churn = impactMetrics.codeChurn
  const auth = impactMetrics.authenticity

  const level = score >= 75 ? 'Outstanding'
    : score >= 55 ? 'Strong'
    : score >= 35 ? 'Growing'
    : 'Getting Started'

  const levelColor = score >= 55 ? '#059669' : '#64748B'
  const levelBg = score >= 55 ? '#ECFDF5' : '#F1F5F9'

  return (
    <div className="bento-full card card-padded" id="impact-section">
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '8px' }}>
        <div>
          <h2 className="section-title" style={{ fontSize: '1rem' }}>Impact Score</h2>
          <p className="section-subtitle">Quality-weighted measure of your real contribution — not just green squares</p>
        </div>
        <span style={{
          fontSize: '0.72rem', fontWeight: 600,
          color: levelColor,
          background: levelBg,
          padding: '4px 12px', borderRadius: '100px',
        }}>
          {level}
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '32px', alignItems: 'center' }}>
        {/* Score ring */}
        <div style={{ textAlign: 'center' }}>
          <ImpactRing score={score} />
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '8px' }}>
            Based on quality, retention, collaboration, authenticity & consistency
          </div>
        </div>

        {/* Breakdown mini-metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
          <MiniMetric
            icon={<Target size={16} />}
            label="Code Quality"
            value={`${quality?.overallScore ?? 0}/100`}
            color="#059669"
            bg="#ECFDF5"
          />
          <MiniMetric
            icon={<Shield size={16} />}
            label="Authenticity"
            value={`${auth?.score ?? 0}/100`}
            color="#047857"
            bg="#ECFDF5"
          />
          <MiniMetric
            icon={<TrendingUp size={16} />}
            label="Code Retention"
            value={`${churn?.retention ?? 0}%`}
            color="#10B981"
            bg="#ECFDF5"
          />
          <MiniMetric
            icon={<Zap size={16} />}
            label="Meaningful Work"
            value={`${quality?.meaningfulRatio ?? 0}%`}
            color="#065F46"
            bg="#ECFDF5"
          />
        </div>
      </div>
    </div>
  )
}
