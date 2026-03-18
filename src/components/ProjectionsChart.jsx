export default function ProjectionsChart({ data }) {
  const { leadsActual, leadsProjected, prevMonthLeads, elapsedDays, daysInMonth, dailyRate } = data
  const daysLeft = daysInMonth && elapsedDays ? Math.max(0, daysInMonth - elapsedDays) : 0

  const maxBar = Math.max(prevMonthLeads || 0, leadsProjected || 0, 1)
  const barPct = v => Math.min(97, Math.round((v / maxBar) * 100))

  const bars = [
    {
      label: 'Previous month (actual)',
      value: prevMonthLeads,
      gradient: 'linear-gradient(90deg,rgba(59,130,246,0.15),#3B82F6)',
    },
    {
      label: 'Current month — so far',
      value: leadsActual,
      gradient: 'linear-gradient(90deg,rgba(59,130,246,0.15),#3B82F6)',
    },
    {
      label: 'Current month — at current pace',
      value: leadsProjected,
      gradient: 'linear-gradient(90deg,rgba(16,185,129,0.15),#10B981)',
      labelColor: '#10B981',
      fontWeight: 600,
    },
  ]

  return (
    <div className="glass" style={{ padding: '28px' }}>
      <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', marginBottom: '4px', letterSpacing: '-0.3px' }}>
        Monthly Projection
        {daysLeft > 0 && (
          <span style={{ fontSize: '13px', fontWeight: 400, color: '#525252', marginLeft: '10px' }}>
            {daysLeft} days remaining
          </span>
        )}
      </h2>
      <p style={{ color: '#525252', fontSize: '13px', marginBottom: '24px' }}>
        How this month is tracking vs last month
      </p>

      <div style={{ marginBottom: '20px' }}>
        {bars.map((bar, i) => (
          <div key={bar.label} style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
            <div style={{
              fontSize: '13px',
              color: bar.labelColor || '#A3A3A3',
              fontWeight: bar.fontWeight || 400,
              minWidth: '210px', flexShrink: 0,
            }}>
              {bar.label}
            </div>
            <div style={{ flex: 1, height: '28px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', overflow: 'hidden' }}>
              <div style={{
                background: bar.gradient,
                width: `${barPct(bar.value || 0)}%`,
                height: '100%', borderRadius: '8px',
                display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
                paddingRight: '10px', fontSize: '12px', fontWeight: 700, color: '#fff',
                transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)', minWidth: '40px',
              }}>
                {bar.value ?? '—'}
              </div>
            </div>
          </div>
        ))}
      </div>

      {dailyRate > 0 && daysLeft > 0 && (
        <p style={{ fontSize: '12px', color: '#A3A3A3' }}>
          At {dailyRate.toFixed(2)} leads/day × {daysLeft} remaining days
          = ~{Math.round(dailyRate * daysLeft)} more · Projected total: {leadsProjected}
        </p>
      )}
    </div>
  )
}
