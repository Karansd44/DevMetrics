import React from 'react'
import { Lock, Globe, Code2, HardDrive, GitFork } from 'lucide-react'

function PrivateStatRow({ icon, label, value, color, bg }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 0' }}>
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

export default function PrivateContributions({ privateWork, stats }) {
  if (!privateWork) return null

  const { totalPrivateRepos, totalPublicRepos, privatePercentage, privateLanguages, totalPrivateSize, recentPrivateActivity } = privateWork

  // Format size (KB to MB or GB)
  const formatSize = (kb) => {
    if (kb >= 1048576) return `${(kb / 1048576).toFixed(1)} GB`
    if (kb >= 1024) return `${(kb / 1024).toFixed(1)} MB`
    return `${kb} KB`
  }

  return (
    <div className="bento-4 card card-padded" id="private-section">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          <h2 className="section-title">Private Work</h2>
          <p className="section-subtitle">Your hidden professional contributions</p>
        </div>
        <span style={{
          fontSize: '0.72rem', fontWeight: 600, color: 'var(--purple)',
          background: 'var(--purple-light)', padding: '4px 12px', borderRadius: '100px',
        }}>
          {privatePercentage}% private
        </span>
      </div>

      {/* Visual split bar */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{
          display: 'flex', height: '12px', borderRadius: '6px', overflow: 'hidden',
          border: '1px solid var(--border)',
        }}>
          <div style={{
            width: `${privatePercentage}%`, background: 'var(--purple)',
            transition: 'width 0.8s ease',
          }} />
          <div style={{
            width: `${100 - privatePercentage}%`, background: 'var(--bg-page)',
            transition: 'width 0.8s ease',
          }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.68rem', color: 'var(--text-muted)' }}>
            <Lock size={10} /> Private ({totalPrivateRepos})
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.68rem', color: 'var(--text-muted)' }}>
            <Globe size={10} /> Public ({totalPublicRepos})
          </div>
        </div>
      </div>

      {/* Stats */}
      <div>
        <PrivateStatRow icon={<Lock size={16} />} label="Private Repos" value={totalPrivateRepos} color="var(--purple)" bg="var(--purple-light)" />
        <div style={{ borderTop: '1px solid var(--border)' }} />
        <PrivateStatRow icon={<HardDrive size={16} />} label="Private Code Size" value={formatSize(totalPrivateSize)} color="var(--blue)" bg="var(--blue-light)" />
        <div style={{ borderTop: '1px solid var(--border)' }} />
        <PrivateStatRow icon={<GitFork size={16} />} label="Total Repos" value={(totalPrivateRepos + totalPublicRepos)} color="var(--green)" bg="var(--green-light)" />
      </div>

      {/* Private languages */}
      {privateLanguages?.length > 0 && (
        <div style={{ marginTop: '16px' }}>
          <div style={{
            fontSize: '0.68rem', fontWeight: 600, textTransform: 'uppercase',
            letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: '8px',
          }}>
            Professional Stack
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {privateLanguages.map((l) => (
              <span key={l.language} style={{
                display: 'inline-flex', alignItems: 'center', gap: '4px',
                padding: '4px 10px', borderRadius: '100px',
                background: 'var(--purple-light)', color: 'var(--purple)',
                fontSize: '0.72rem', fontWeight: 600,
              }}>
                <Code2 size={10} />
                {l.language} ({l.count})
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Recent private activity */}
      {recentPrivateActivity?.length > 0 && (
        <div style={{ marginTop: '16px' }}>
          <div style={{
            fontSize: '0.68rem', fontWeight: 600, textTransform: 'uppercase',
            letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: '8px',
          }}>
            Recent Private Activity
          </div>
          {recentPrivateActivity.map((r) => (
            <div key={r.name} style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '8px 0', fontSize: '0.78rem',
            }}>
              <Lock size={12} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{r.name}</span>
              {r.language && <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>· {r.language}</span>}
            </div>
          ))}
        </div>
      )}

      {/* Disclaimer */}
      <div style={{
        marginTop: '16px', padding: '10px 14px', borderRadius: 'var(--radius-sm)',
        background: 'var(--bg-page)', fontSize: '0.68rem', color: 'var(--text-muted)',
        lineHeight: 1.5,
      }}>
        <Lock size={10} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
        No private code is ever exposed. Only metadata (repo names, languages, sizes) is displayed.
      </div>
    </div>
  )
}
