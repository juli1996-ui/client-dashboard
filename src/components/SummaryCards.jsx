export default function SummaryCards({ data, projections }) {
  const leadsPerDay = data.leadsPerDay
  const marchConservative = leadsPerDay ? Math.round(leadsPerDay * 31) : null
  const marchOptimistic   = marchConservative ? Math.round(marchConservative * 1.35) : null
  const marchRange = marchConservative
    ? `${marchConservative}–${marchOptimistic}`
    : '—'

  const cards = [
    {
      value: data.totalLeads?.toLocaleString() ?? '—',
      label: 'Total Leads',
      badge: 'All campaigns',
      colorClass: 'blue',
      color: '#4a90d9',
      glowBg: 'rgba(74,144,217,0.15)',
      gradTop: 'linear-gradient(90deg,#4a90d9,#7bc3ff)',
    },
    {
      value: leadsPerDay != null ? leadsPerDay.toFixed(2) : '—',
      label: 'Leads / Day',
      badge: 'Current pace',
      colorClass: 'green',
      color: '#2ecc71',
      glowBg: 'rgba(46,204,113,0.12)',
      gradTop: 'linear-gradient(90deg,#2ecc71,#7fffc4)',
    },
    {
      value: data.meetingsScheduled ?? '—',
      label: 'Meeting Requests',
      badge: 'High intent',
      colorClass: 'amber',
      color: '#fbbf24',
      glowBg: 'rgba(251,191,36,0.12)',
      gradTop: 'linear-gradient(90deg,#fbbf24,#ffe066)',
    },
    {
      value: marchRange,
      label: 'March Forecast',
      badge: 'At current pace',
      colorClass: 'purple',
      color: '#a78bfa',
      glowBg: 'rgba(167,139,250,0.12)',
      gradTop: 'linear-gradient(90deg,#a78bfa,#c4b5fd)',
    },
  ]

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
      {cards.map(card => (
        <div key={card.label} style={{
          background: '#16213e',
          border: '1px solid #2a2d4a',
          borderRadius: '14px',
          padding: '22px 18px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* gradient top bar */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0,
            height: '3px', opacity: 0.7,
            background: card.gradTop,
          }} />

          <p style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: '36px', fontWeight: 700, color: '#fff',
            lineHeight: 1, marginBottom: '6px', marginTop: '4px',
          }}>
            {card.value}
          </p>
          <p style={{
            fontSize: '12px', color: '#a0a8b8',
            textTransform: 'uppercase', letterSpacing: '1px',
            fontWeight: 500, margin: '0 0 8px',
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
