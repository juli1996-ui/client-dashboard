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
      color: '#C2653C',
      glowBg: 'rgba(194,101,60,0.08)',
    },
    {
      value: leadsPerDay != null ? leadsPerDay.toFixed(2) : '—',
      label: 'Leads / Day',
      badge: 'Current pace',
      color: '#4A7C59',
      glowBg: 'rgba(74,124,89,0.08)',
    },
    {
      value: forecastRange,
      label: `${monthLabel} Forecast`,
      badge: 'At current pace',
      color: '#B8860B',
      glowBg: 'rgba(184,134,11,0.08)',
    },
  ]

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
      {cards.map(card => (
        <div key={card.label} style={{
          background: '#FFFFFF',
          border: '1px solid #E8E4DE',
          borderRadius: '16px',
          padding: '22px 18px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: '0 1px 3px rgba(45,42,38,0.04)',
        }}>
          {/* Accent glow top */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0,
            height: '2px',
            background: `linear-gradient(90deg, transparent, ${card.color}, transparent)`,
            opacity: 0.6,
          }} />

          <p style={{
            fontSize: '36px', fontWeight: 800, color: '#2D2A26',
            fontFamily: "'Fraunces', Georgia, serif",
            lineHeight: 1, marginBottom: '6px', marginTop: '4px',
            letterSpacing: '-1px',
          }}>
            {card.value}
          </p>
          <p style={{
            fontSize: '11px', color: '#B5B0AA',
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
