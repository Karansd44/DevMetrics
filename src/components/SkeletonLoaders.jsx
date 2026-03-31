import React from 'react'

/* ── Skeleton building blocks ── */
function Bone({ w, h, r = '6px', mb, mt, mx }) {
  return (
    <div
      className="skeleton"
      style={{
        width: w, height: h, borderRadius: r,
        ...(mb && { marginBottom: mb }),
        ...(mt && { marginTop: mt }),
        ...(mx && { marginLeft: mx, marginRight: mx }),
      }}
    />
  )
}

function CardSkel({ span = 3, children, style }) {
  return (
    <div className={`bento-${span} card card-padded`} style={{ ...style }}>
      {children}
    </div>
  )
}

export function DashboardSkeleton() {
  return (
    <>
      {/* Hero skeleton */}
      <div className="bento-full card card-padded" style={{ minHeight: '100px' }}>
        <Bone w="200px" h="14px" mb="12px" />
        <Bone w="340px" h="10px" mb="20px" />
        <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
          <Bone w="100px" h="100px" r="50%" />
          <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <Bone w="100%" h="48px" r="8px" />
            <Bone w="100%" h="48px" r="8px" />
            <Bone w="100%" h="48px" r="8px" />
            <Bone w="100%" h="48px" r="8px" />
          </div>
        </div>
      </div>

      {/* KPI cards */}
      {[1, 2, 3, 4].map((i) => (
        <CardSkel key={`kpi-${i}`} span={3}>
          <Bone w="80px" h="10px" mb="14px" />
          <Bone w="100px" h="28px" />
        </CardSkel>
      ))}

      {/* Row: Profile | Heatmap | Languages */}
      <CardSkel span={3} style={{ minHeight: '260px' }}>
        <Bone w="56px" h="56px" r="50%" mx="auto" mb="12px" />
        <Bone w="100px" h="12px" mx="auto" mb="6px" />
        <Bone w="70px" h="10px" mx="auto" mb="16px" />
        <Bone w="64px" h="64px" r="50%" mx="auto" />
      </CardSkel>
      <CardSkel span={6} style={{ minHeight: '260px' }}>
        <Bone w="160px" h="12px" mb="16px" />
        <Bone w="100%" h="180px" />
      </CardSkel>
      <CardSkel span={3} style={{ minHeight: '260px' }}>
        <Bone w="100px" h="12px" mb="12px" />
        <Bone w="100%" h="120px" r="50%" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px' }}>
          <Bone w="100%" h="10px" />
          <Bone w="100%" h="10px" />
          <Bone w="80%" h="10px" />
        </div>
      </CardSkel>

      {/* Row: Stats | Activity | Repos */}
      <CardSkel span={3} style={{ minHeight: '240px' }}>
        <Bone w="80px" h="12px" mb="14px" />
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '12px' }}>
            <Bone w="32px" h="32px" r="8px" />
            <Bone w="80px" h="10px" />
          </div>
        ))}
      </CardSkel>
      <CardSkel span={6} style={{ minHeight: '240px' }}>
        <Bone w="140px" h="12px" mb="16px" />
        <Bone w="100%" h="180px" />
      </CardSkel>
      <CardSkel span={3} style={{ minHeight: '240px' }}>
        <Bone w="100px" h="12px" mb="12px" />
        {[1, 2, 3, 4].map((i) => (
          <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '12px' }}>
            <Bone w="28px" h="28px" r="6px" />
            <div style={{ flex: 1 }}>
              <Bone w="90%" h="10px" mb="4px" />
              <Bone w="60%" h="8px" />
            </div>
          </div>
        ))}
      </CardSkel>
    </>
  )
}

/* Empty state placeholder */
export function EmptyState({ icon, title, description }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '32px 16px', textAlign: 'center', color: '#94A3B8',
    }}>
      {icon && <div style={{ marginBottom: '12px', opacity: 0.5 }}>{icon}</div>}
      {title && <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>{title}</div>}
      {description && <div style={{ fontSize: '0.72rem', lineHeight: 1.5 }}>{description}</div>}
    </div>
  )
}
