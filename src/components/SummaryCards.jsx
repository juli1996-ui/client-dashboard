export default function SummaryCards({ data, projections }) {
  const leadsPerDay = data.leadsPerDay
  const monthLabel = projections?.currentMonthLabel || 'This Month'
  const daysInMonth = projections?.daysInMonth || 31
  const conservative = leadsPerDay ? Math.round(leadsPerDay * daysInMonth) : null
  const optimistic   = conservative ? Math.round(conservative * 1.35) : null
  const forecastRange = conservative
    ? `${conservative}–${optimistic}`
    : '—'

  const cards = [
    {
      value: data.totalLeads?.toLocaleString() ?? '—',
      label: 'Total Leads',
      badge: 'All campaigns',
      color: '#3B82F6',
      glowBg: 'rgba(59,130,246,0.1)',
    },
    {
      value: leadsPerDay != null ? leadsPerDay.toFixed(2) : '—',
      label: 'Leads / Day',
      badge: 'Current pace',
      color: '#10B981',
      glowBg: 'rgba(16,185,129,0.1)',
    },
    {
      value: forecastRange,
      label: `${monthLabel} Forecast`,
      badge: 'At current pace',
      color: '#8B5CF6',
      glowBg: 'rgba(139,92,246,0.1)',
    },
  ]

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
      {cards.map(card => (
        <div key={card.label} style={{
          background: 'rgba(255,255,255,0.03)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: '16px',
          padding: '22px 18px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        }}>
          {/* Accent glow top */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0,
            height: '2px',
            background: `linear-gradient(90deg, transparent, ${card.color}, transparent)`,
            opacity: 0.6,
          }} />

          <p style={{
            fontSize: '36px', fontWeight: 800, color: '#fff',
            lineHeight: 1, marginBottom: '6px', marginTop: '4px',
            letterSpacing: '-1px',
          }}>
            {card.value}
          </p>
          <p style={{
            fontSize: '11px', color: '#525252',
            textTransform: 'uppercase', letterSpacing: '1.5px',
            fontWeight: 600, margin: '0 0 10px',
          }}>
            {card.label}
          </p>
          <span style={{
            display: 'inline-block',
            fontSize: '11px', fontWeight: 600,
            padding: '3px 10px', borderRadius: '20px',
            background: card.glowBg,
            color: card.color,
          }}>
            {card.badge}
          </span>
        </div>
      ))}
    </div>
  )
}
