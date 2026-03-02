import { ShieldCheck, ShieldAlert, AlertTriangle, CheckCircle, MessageSquare, FileCode } from 'lucide-react'

function SignalRow({ icon, label, value, status }) {
  const colors = {
    good: { color: 'var(--green)', bg: 'var(--green-light)' },
    warning: { color: 'var(--amber)', bg: 'var(--amber-light)' },
    bad: { color: 'var(--red)', bg: 'var(--red-light)' },
    neutral: { color: 'var(--blue)', bg: 'var(--blue-light)' },
  }
  const c = colors[status] || colors.neutral

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '12px',
      padding: '10px 0',
    }}>
      <div style={{
        width: '30px', height: '30px', borderRadius: '8px',
        background: c.bg, color: c.color,
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        {icon}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-primary)' }}>{label}</div>
      </div>
      <div style={{ fontSize: '0.85rem', fontWeight: 700, color: c.color }}>{value}</div>
    </div>
  )
}

function AuthRing({ score, size = 90 }) {
  const strokeWidth = 7
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference
  const color = score >= 85 ? '#047857' : score >= 70 ? '#059669' : score >= 50 ? '#D97706' : '#DC2626'

  return (
    <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#F1F5F9" strokeWidth={strokeWidth} />
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke={color} strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1s ease' }}
        />
      </svg>
      <div style={{ position: 'absolute', textAlign: 'center' }}>
        <div style={{ fontSize: '1.4rem', fontWeight: 800, color, lineHeight: 1, fontFamily: 'var(--mono)' }}>{score}</div>
      </div>
    </div>
  )
}

export default function AuthenticityScore({ authenticity }) {
  if (!authenticity) return null

  const { score, grade, signals } = authenticity
  const gradeColor = score >= 85 ? 'var(--green)' : score >= 70 ? 'var(--blue)' : score >= 50 ? 'var(--amber)' : 'var(--red)'
  const gradeBg = score >= 85 ? 'var(--green-light)' : score >= 70 ? 'var(--blue-light)' : score >= 50 ? 'var(--amber-light)' : 'var(--red-light)'
  const GradeIcon = score >= 70 ? ShieldCheck : score >= 50 ? ShieldAlert : AlertTriangle

  return (
    <div className="bento-4 card card-padded">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          <h2 className="section-title">Authenticity Score</h2>
          <p className="section-subtitle">AI noise & fake activity detection</p>
        </div>
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: '4px',
          fontSize: '0.72rem', fontWeight: 600, color: gradeColor,
          background: gradeBg, padding: '4px 12px', borderRadius: '100px',
        }}>
          <GradeIcon size={12} />
          {grade}
        </span>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
        <AuthRing score={score} />
      </div>

      <div style={{ fontSize: '0.72rem', textAlign: 'center', color: 'var(--text-muted)', marginBottom: '16px' }}>
        {score >= 85 ? 'Your commits show strong signals of genuine, thoughtful work.'
          : score >= 70 ? 'Most of your activity appears authentic with some minor noise.'
          : score >= 50 ? 'Mixed signals detected — some commits may be low-effort or automated.'
          : 'High proportion of trivial or suspicious commits detected.'}
      </div>

      <div>
        <SignalRow
          icon={<CheckCircle size={14} />}
          label="Meaningful commits"
          value={`${100 - (signals?.trivialRatio || 0)}%`}
          status={(100 - (signals?.trivialRatio || 0)) >= 70 ? 'good' : (100 - (signals?.trivialRatio || 0)) >= 50 ? 'warning' : 'bad'}
        />
        <div style={{ borderTop: '1px solid var(--border)' }} />
        <SignalRow
          icon={<AlertTriangle size={14} />}
          label="Suspicious activity"
          value={`${signals?.suspiciousRatio || 0}%`}
          status={(signals?.suspiciousRatio || 0) <= 5 ? 'good' : (signals?.suspiciousRatio || 0) <= 15 ? 'warning' : 'bad'}
        />
        <div style={{ borderTop: '1px solid var(--border)' }} />
        <SignalRow
          icon={<MessageSquare size={14} />}
          label="Descriptive messages"
          value={`${signals?.goodMessageRatio || 0}%`}
          status={(signals?.goodMessageRatio || 0) >= 60 ? 'good' : (signals?.goodMessageRatio || 0) >= 30 ? 'warning' : 'bad'}
        />
        <div style={{ borderTop: '1px solid var(--border)' }} />
        <SignalRow
          icon={<FileCode size={14} />}
          label="Avg lines / commit"
          value={signals?.avgLinesPerCommit || 0}
          status={(signals?.avgLinesPerCommit || 0) >= 20 ? 'good' : (signals?.avgLinesPerCommit || 0) >= 5 ? 'warning' : 'bad'}
        />
      </div>
    </div>
  )
}
