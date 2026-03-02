import { RefreshCw, CheckCircle, Clock, Zap, Database } from 'lucide-react'

export default function DataFreshness({ cacheInfo, onRefresh }) {
  if (!cacheInfo) return null

  const { hit, cachedAt, ttl, age } = cacheInfo
  const cachedDate = new Date(cachedAt)
  const timeAgo = age < 1000 ? 'just now'
    : age < 60000 ? `${Math.round(age / 1000)}s ago`
    : age < 3600000 ? `${Math.round(age / 60000)}m ago`
    : `${Math.round(age / 3600000)}h ago`
  
  const freshness = age < 60000 ? 'Fresh' : age < ttl * 0.5 ? 'Recent' : age < ttl ? 'Aging' : 'Stale'
  const freshnessColor = freshness === 'Fresh' ? 'var(--green)' : freshness === 'Recent' ? 'var(--blue)' : freshness === 'Aging' ? 'var(--amber)' : 'var(--red)'
  const freshnessBg = freshness === 'Fresh' ? 'var(--green-light)' : freshness === 'Recent' ? 'var(--blue-light)' : freshness === 'Aging' ? 'var(--amber-light)' : 'var(--red-light)'
  
  // TTL progress
  const ttlProgress = Math.max(0, Math.min(100, ((ttl - age) / ttl) * 100))

  return (
    <div className="bento-full card" style={{ padding: '14px 24px' }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: '12px',
      }}>
        {/* Left: Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '28px', height: '28px', borderRadius: '8px',
              background: freshnessBg, color: freshnessColor,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {hit ? <Database size={14} /> : <Zap size={14} />}
            </div>
            <div>
              <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                Source of Truth
                <span style={{
                  fontSize: '0.62rem', fontWeight: 600, color: freshnessColor,
                  background: freshnessBg, padding: '2px 8px', borderRadius: '100px',
                }}>
                  {freshness}
                </span>
              </div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                {hit ? 'Served from cache' : 'Fresh from GitHub API'} · Updated {timeAgo}
              </div>
            </div>
          </div>

          {/* TTL bar */}
          <div style={{ width: '120px' }}>
            <div style={{
              height: '4px', background: '#F3F4F6', borderRadius: '2px', overflow: 'hidden',
            }}>
              <div style={{
                height: '100%', width: `${ttlProgress}%`,
                background: freshnessColor, borderRadius: '2px',
                transition: 'width 0.5s ease',
              }} />
            </div>
            <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', marginTop: '2px', textAlign: 'center' }}>
              {Math.round((ttl - age) / 1000)}s until refresh
            </div>
          </div>
        </div>

        {/* Right: Indicators + Refresh */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            <CheckCircle size={12} style={{ color: 'var(--green)' }} />
            Direct API connection
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            <Clock size={12} />
            {cachedDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
          </div>
          {onRefresh && (
            <button
              onClick={onRefresh}
              style={{
                display: 'flex', alignItems: 'center', gap: '4px',
                padding: '6px 12px', borderRadius: '8px',
                border: '1px solid var(--border)', background: 'var(--bg-card)',
                color: 'var(--text-secondary)', fontSize: '0.72rem', fontWeight: 600,
                cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--purple)'; e.currentTarget.style.color = 'var(--purple)' }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)' }}
            >
              <RefreshCw size={12} />
              Refresh
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
