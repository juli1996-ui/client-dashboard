export default function MarchForecast({ summary, projections }) {
  const leadsPerDay = summary?.leadsPerDay
  if (!leadsPerDay || !projections) return null

  const { leadsProjected, prevMonthLeads } = projections

  const conservative = Math.round(leadsPerDay * 31)
  const baseline     = prevMonthLeads ? Math.round((prevMonthLeads + leadsProjected) / 2) : conservative
  const optimistic   = Math.round(conservative * 1.35)

  const maxVal = optimistic * 1.1
  const barPct = v => Math.min(97, Math.round((v / maxVal) * 100))

  const bars = [
    { label: 'Conservative (current pace)', value: conservative, colorClass: 'blue', style: { background: 'linear-gradient(90deg,rgba(74,144,217,0.3),#4a90d9)', color: '#fff' } },
    { label: 'Baseline (avg of last 2 months)', value: baseline, colorClass: 'green', style: { background: 'linear-gradient(90deg,rgba(46,204,113,0.3),#2ecc71)', color: '#fff' } },
    { label: 'Optimistic (new campaign ramps)', value: optimistic, colorClass: 'amber', style: { background: 'linear-gradient(90deg,rgba(251,191,36,0.3),#fbbf24)', color: '#1a1a2e' } },
  ]

  return (
    <div style={{ background: '#16213e', border: '1px solid #2a2d4a', borderRadius: '16px', padding: '32px' }}>
      <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '20px', fontWeight: 600, color: '#fff', marginBottom: '6px' }}>
        March 2026 Forecast
      </h2>
      <p style={{ color: '#a0a8b8', fontSize: '13px', marginBottom: '24px' }}>
        At {leadsPerDay.toFixed(2)} leads/day — projected range across 3 scenarios
      </p>

      <div style={{ marginBottom: '24px' }}>
        {bars.map((bar, i) => (
          <div key={bar.label} style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
            <div style={{
              fontSize: '13px', color: i === 0 ? '#a0a8b8' : i === 1 ? '#2ecc71' : '#fbbf24',
              fontWeight: i > 0 ? 600 : 400, minWidth: '220px', flexShrink: 0,
            }}>
              {bar.label}
            </div>
            <div style={{ flex: 1, height: '32px', background: 'rgba(255,255,255,0.04)', borderRadius: '8px', overflow: 'hidden' }}>
              <div style={{
                ...bar.style,
                width: `${barPct(bar.value)}%`,
                height: '100%', borderRadius: '8px',
                display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
                paddingRight: '12px', fontSize: '13px', fontWeight: 700,
                transition: 'width 0.9s ease', minWidth: '60px',
              }}>
                {bar.value} leads
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{
        background: 'rgba(251,191,36,0.06)',
        border: '1px solid rgba(251,191,36,0.2)',
        borderRadius: '10px', padding: '14px 18px',
        fontSize: '13px', lineHeight: 1.7,
      }}>
        <strong style={{ color: '#fbbf24' }}>✦ New campaign ramp effect</strong><br />
        <span style={{ color: '#a0a8b8' }}>
          The optimistic scenario (+35%) assumes newer campaigns are still ramping. As send volume increases through March, the daily pace could rise significantly above the current {leadsPerDay.toFixed(2)} leads/day baseline.
        </span>
      </div>
    </div>
  )
}
