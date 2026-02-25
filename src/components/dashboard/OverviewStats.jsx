import {
  Star, Code2, Lock, GitFork, Eye, AlertCircle,
} from 'lucide-react'

function StatRow({ icon, label, value, color, bg }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <div style={{
        width: '32px', height: '32px', borderRadius: '8px',
        background: bg, color, display: 'flex',
        alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        {icon}
      </div>
      <span style={{ flex: 1, fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: 500 }}>{label}</span>
      <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>
        {typeof value === 'number' ? value.toLocaleString() : value}
      </span>
    </div>
  )
}

export default function OverviewStats({ stats }) {
  return (
    <div className="bento-4 card card-padded" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <h2 className="section-title">Overview</h2>
      <StatRow icon={<Star size={16} />} label="Stars" value={stats.totalStars} color="var(--amber)" bg="var(--amber-light)" />
      <StatRow icon={<Code2 size={16} />} label="Repositories" value={stats.totalRepos} color="var(--green)" bg="var(--green-light)" />
      <StatRow icon={<Lock size={16} />} label="Private" value={stats.privateRepos} color="var(--purple)" bg="var(--purple-light)" />
      <StatRow icon={<GitFork size={16} />} label="Forked" value={stats.forkedRepos} color="var(--blue)" bg="var(--blue-light)" />
      <StatRow icon={<Eye size={16} />} label="Watchers" value={stats.totalWatchers} color="var(--cyan)" bg="rgba(90,200,250,0.1)" />
      <StatRow icon={<AlertCircle size={16} />} label="Open Issues" value={stats.totalOpenIssues} color="var(--red)" bg="var(--red-light)" />
    </div>
  )
}
