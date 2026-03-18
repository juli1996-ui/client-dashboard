export default function MarchForecast({ summary, projections }) {
  const leadsPerDay = summary?.leadsPerDay
  if (!leadsPerDay || !projections) return null

  const { leadsProjected, prevMonthLeads, currentMonthLabel } = projections
  const monthLabel = currentMonthLabel || 'This Month'

  const conservative = Math.round(leadsPerDay * 31)
  const baseline     = prevMonthLeads ? Math.round((prevMonthLeads + leadsProjected) / 2) : conservative
  const optimistic   = Math.round(conservative * 1.35)

  const maxVal = optimistic * 1.1
  const barPct = v => Math.min(97, Math.round((v / maxVal) * 100))

  const bars = [
    { label: 'Conservative (current pace)', value: conservative, gradient: 'linear-gradient(90deg,rgba(59,130,246,0.15),#3B82F6)', textColor: '#fff' },
    { label: 'Baseline (avg of last 2 months)', value: baseline, gradient: 'linear-gradient(90deg,rgba(16,185,129,0.15),#10B981)', textColor: '#fff' },
    { label: 'Optimistic (new campaign ramps)', value: optimistic, gradient: 'linear-gradient(90deg,rgba(245,158,11,0.15),#F59E0B)', textColor: '#0A0A0F' },
  ]

  return (
    <div className="glass" style={{ padding: '28px' }}>
      <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', marginBottom: '4px', letterSpacing: '-0.3px' }}>
        {monthLabel} 2026 Forecast
      </h2>
      <p style={{ color: '#525252', fontSize: '13px', marginBottom: '24px' }}>
        At {leadsPerDay.toFixed(2)} leads/day — projected range across 3 scenarios
      </p>

      <div style={{ marginBottom: '24px' }}>
        {bars.map((bar, i) => (
          <div key={bar.label} style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
            <div style={{
              fontSize: '13px', color: i === 0 ? '#A3A3A3' : i === 1 ? '#10B981' : '#F59E0B',
              fontWeight: i > 0 ? 600 : 400, minWidth: '220px', flexShrink: 0,
            }}>
              {bar.label}
            </div>
            <div style={{ flex: 1, height: '32px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', overflow: 'hidden' }}>
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
        background: 'rgba(245,158,11,0.04)',
        border: '1px solid rgba(245,158,11,0.1)',
        borderRadius: '12px', padding: '14px 18px',
        fontSize: '13px', lineHeight: 1.7,
      }}>
        <strong style={{ color: '#F59E0B' }}>New campaign ramp effect</strong><br />
        <span style={{ color: '#A3A3A3' }}>
          The optimistic scenario (+35%) assumes newer campaigns are still ramping. As send volume increases through March, the daily pace could rise significantly above the current {leadsPerDay.toFixed(2)} leads/day baseline.
        </span>
      </div>
    </div>
  )
}
