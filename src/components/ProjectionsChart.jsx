export default function ProjectionsChart({ data }) {
  const { leadsActual, leadsProjected, prevMonthLeads, elapsedDays, daysInMonth, dailyRate } = data
  const daysLeft = daysInMonth && elapsedDays ? Math.max(0, daysInMonth - elapsedDays) : 0

  const maxBar = Math.max(prevMonthLeads || 0, leadsProjected || 0, 1)
  const barPct = v => Math.min(97, Math.round((v / maxBar) * 100))

  const bars = [
    {
      label: 'Previous month (actual)',
      value: prevMonthLeads,
      gradient: 'linear-gradient(90deg,rgba(194,101,60,0.08),#C2653C)',
    },
    {
      label: 'Current month — so far',
      value: leadsActual,
      gradient: 'linear-gradient(90deg,rgba(194,101,60,0.08),#C2653C)',
    },
    {
      label: 'Current month — at current pace',
      value: leadsProjected,
      gradient: 'linear-gradient(90deg,rgba(74,124,89,0.08),#4A7C59)',
      labelColor: '#4A7C59',
      fontWeight: 600,
    },
  ]

  return (
    <div style={{ background: '#FFFFFF', border: '1px solid #E8E4DE', borderRadius: '16px', padding: '28px' }}>
      <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#2D2A26', marginBottom: '4px', letterSpacing: '-0.3px', fontFamily: "'Fraunces', Georgia, serif" }}>
        Monthly Projection
        {daysLeft > 0 && (
          <span style={{ fontSize: '13px', fontWeight: 400, color: '#8A8580', marginLeft: '10px' }}>
            {daysLeft} days remaining
          </span>
        )}
      </h2>
      <p style={{ color: '#8A8580', fontSize: '13px', marginBottom: '24px', fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}>
        How this month is tracking vs last month
      </p>

      <div style={{ marginBottom: '20px' }}>
        {bars.map((bar, i) => (
          <div key={bar.label} style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
            <div style={{
              fontSize: '13px',
              color: bar.labelColor || '#8A8580',
              fontWeight: bar.fontWeight || 400,
              minWidth: '210px', flexShrink: 0,
              fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
            }}>
              {bar.label}
            </div>
            <div style={{ flex: 1, height: '28px', background: '#FAF8F5', borderRadius: '8px', overflow: 'hidden' }}>
              <div style={{
                background: bar.gradient,
                width: `${barPct(bar.value || 0)}%`,
                height: '100%', borderRadius: '8px',
                display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
                paddingRight: '10px', fontSize: '12px', fontWeight: 700, color: '#FFFFFF',
                transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)', minWidth: '40px',
              }}>
                {bar.value ?? '—'}
              </div>
            </div>
          </div>
        ))}
      </div>

      {dailyRate > 0 && daysLeft > 0 && (
        <p style={{ fontSize: '12px', color: '#8A8580' }}>
          At {dailyRate.toFixed(2)} leads/day × {daysLeft} remaining days
          = ~{Math.round(dailyRate * daysLeft)} more · Projected total: {leadsProjected}
        </p>
      )}
    </div>
  )
}
