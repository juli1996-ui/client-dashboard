export default function MarchForecast({ summary, projections }) {
  const leadsPerDay = summary?.leadsPerDay
  if (!leadsPerDay || !projections) return null

  const { leadsProjected, prevMonthLeads, currentMonthLabel, daysInMonth } = projections
  const monthLabel = currentMonthLabel || 'This Month'

  const conservative = Math.round(leadsPerDay * (daysInMonth || 30))
  const baseline     = prevMonthLeads ? Math.round((prevMonthLeads + leadsProjected) / 2) : conservative
  const optimistic   = Math.round(conservative * 1.35)

  const maxVal = optimistic * 1.1
  const barPct = v => Math.min(97, Math.round((v / maxVal) * 100))

  const bars = [
    { label: 'Conservative (current pace)', value: conservative, gradient: 'linear-gradient(90deg,rgba(45,42,38,0.08),#2D2A26)', textColor: '#FFFFFF' },
    { label: 'Baseline (avg of last 2 months)', value: baseline, gradient: 'linear-gradient(90deg,rgba(74,124,89,0.08),#4A7C59)', textColor: '#FFFFFF' },
    { label: 'Optimistic (new campaign ramps)', value: optimistic, gradient: 'linear-gradient(90deg,rgba(194,101,60,0.08),#C2653C)', textColor: '#FFFFFF' },
  ]

  return (
    <div style={{ background: '#FFFFFF', border: '1px solid #E8E4DE', borderRadius: '16px', padding: '28px' }}>
      <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#2D2A26', marginBottom: '4px', letterSpacing: '-0.3px', fontFamily: "'Fraunces', Georgia, serif" }}>
        {monthLabel} 2026 Forecast
      </h2>
      <p style={{ color: '#8A8580', fontSize: '13px', marginBottom: '24px', fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}>
        At {leadsPerDay.toFixed(2)} leads/day — projected range across 3 scenarios
      </p>

      <div style={{ marginBottom: '24px' }}>
        {bars.map((bar, i) => (
          <div key={bar.label} style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
            <div style={{
              fontSize: '13px', color: i === 0 ? '#8A8580' : i === 1 ? '#4A7C59' : '#C2653C',
              fontWeight: i > 0 ? 600 : 400, minWidth: '220px', flexShrink: 0,
              fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
            }}>
              {bar.label}
            </div>
            <div style={{ flex: 1, height: '32px', background: '#FAF8F5', borderRadius: '8px', overflow: 'hidden' }}>
              <div style={{
                background: bar.gradient,
                width: `${barPct(bar.value)}%`,
                height: '100%', borderRadius: '8px',
                display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
                paddingRight: '12px', fontSize: '13px', fontWeight: 700,
                color: bar.textColor,
                transition: 'width 0.9s cubic-bezier(0.4, 0, 0.2, 1)', minWidth: '60px',
              }}>
                {bar.value} leads
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{
        background: 'rgba(194,101,60,0.08)',
        border: '1px solid rgba(194,101,60,0.15)',
        borderRadius: '12px', padding: '14px 18px',
        fontSize: '13px', lineHeight: 1.7,
      }}>
        <strong style={{ color: '#C2653C' }}>New campaign ramp effect</strong><br />
        <span style={{ color: '#8A8580' }}>
          The optimistic scenario (+35%) assumes newer campaigns are still ramping. As send volume increases through {monthLabel}, the daily pace could rise significantly above the current {leadsPerDay.toFixed(2)} leads/day baseline.
        </span>
      </div>
    </div>
  )
}
