export default function ProjectionsChart({ data }) {
  const { leadsActual, leadsProjected, prevMonthLeads, elapsedDays, daysInMonth, dailyRate } = data
  const daysLeft = daysInMonth && elapsedDays ? Math.max(0, daysInMonth - elapsedDays) : 0

  const maxBar = Math.max(prevMonthLeads || 0, leadsProjected || 0, 1)
  const barPct = v => Math.min(97, Math.round((v / maxBar) * 100))

  const bars = [
    {
      label: 'Previous month (actual)',
      value: prevMonthLeads,
      style: { background: 'linear-gradient(90deg,rgba(74,144,217,0.3),#4a90d9)' },
    },
    {
      label: 'Current month — so far',
      value: leadsActual,
      style: { background: 'linear-gradient(90deg,rgba(74,144,217,0.3),#4a90d9)' },
    },
    {
      label: 'Current month — at current pace',
      value: leadsProjected,
      style: { background: 'linear-gradient(90deg,rgba(46,204,113,0.3),#2ecc71)' },
      labelColor: '#2ecc71',
      fontWeight: 600,
    },
  ]

  return (
    <div style={{ background: '#16213e', border: '1px solid #2a2d4a', borderRadius: '16px', padding: '32px' }}>
      <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '20px', fontWeight: 600, color: '#fff', marginBottom: '6px' }}>
        Monthly Projection
        {daysLeft > 0 && (
          <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', fontWeight: 400, color: '#a0a8b8', marginLeft: '10px' }}>
            {daysLeft} days remaining
          </span>
        )}
      </h2>
      <p style={{ color: '#a0a8b8', fontSize: '13px', marginBottom: '24px' }}>
        How this month is tracking vs last month
      </p>

      <div style={{ marginBottom: '20px' }}>
        {bars.map((bar, i) => (
          <div key={bar.label} style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
            <div style={{
              fontSize: '13px',
              color: bar.labelColor || '#a0a8b8',
              fontWeight: bar.fontWeight || 400,
              minWidth: '210px', flexShrink: 0,
            }}>
              {bar.label}
            </div>
            <div style={{ flex: 1, height: '28px', background: 'rgba(255,255,255,0.04)', borderRadius: '8px', overflow: 'hidden' }}>
              <div style={{
                ...bar.style,
                width: `${barPct(bar.value || 0)}%`,
                height: '100%', borderRadius: '8px',
                display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
                paddingRight: '10px', fontSize: '12px', fontWeight: 700, color: '#fff',
                transition: 'width 0.8s ease', minWidth: '40px',
              }}>
                {bar.value ?? '—'}
              </div>
            </div>
          </div>
        ))}
      </div>

      {dailyRate > 0 && daysLeft > 0 && (
        <p style={{ fontSize: '12px', color: '#a0a8b8' }}>
          At {dailyRate.toFixed(2)} leads/day × {daysLeft} remaining days
          = ~{Math.round(dailyRate * daysLeft)} more · Projected total: {leadsProjected}
        </p>
      )}
    </div>
  )
}
