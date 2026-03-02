export default function MonthlyBreakdownTable({ monthlyTrends, projections }) {
  if (!monthlyTrends || monthlyTrends.length === 0) return null

  const { elapsedDays, daysInMonth, dailyRate, leadsProjected, currentYM, currentMonthLabel } = projections || {}
  const daysLeft = daysInMonth && elapsedDays ? Math.max(0, daysInMonth - elapsedDays) : 0

  // Is the current month already represented as a data row?
  const currentMonthInData = currentYM && monthlyTrends.some(row => row.ym === currentYM)

  return (
    <div style={{ background: '#16213e', border: '1px solid #2a2d4a', borderRadius: '16px', padding: '28px' }}>
      <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '20px', fontWeight: 600, color: '#fff', marginBottom: '6px' }}>
        Monthly Breakdown
      </h2>
      <p style={{ color: '#a0a8b8', fontSize: '13px', marginBottom: '20px' }}>
        Leads and daily pace by month
      </p>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #2a2d4a' }}>
              {['Month', 'Leads', '/Day', 'vs Prev'].map((h, i) => (
                <th key={h} style={{
                  textAlign: i === 0 ? 'left' : 'right',
                  fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.2px',
                  color: '#a0a8b8', fontWeight: 600, padding: '10px 14px',
                }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {monthlyTrends.map((row, i) => {
              const isCurrentMonth = row.ym === currentYM
              // Use elapsed days for the in-progress current month; full days for past months
              const days     = isCurrentMonth && elapsedDays ? elapsedDays : (row.days || 30)
              const rate     = (row.leads / days).toFixed(2)
              const prev     = i > 0 ? monthlyTrends[i - 1].leads : null
              const pctChg   = prev ? Math.round((row.leads - prev) / prev * 100) : null
              const isRecent = i >= monthlyTrends.length - 2

              let trendEl = <span style={{ color: '#a0a8b8' }}>—</span>
              if (pctChg !== null) {
                if (pctChg > 0)      trendEl = <span style={{ color: '#2ecc71', fontWeight: 600 }}>+{pctChg}%</span>
                else if (pctChg < 0) trendEl = <span style={{ color: '#f87171', fontWeight: 600 }}>{pctChg}%</span>
                else                 trendEl = <span style={{ color: '#fbbf24', fontWeight: 600 }}>0%</span>
              }

              return (
                <tr key={row.ym || row.month} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', fontWeight: isRecent ? 600 : 400 }}>
                  <td style={{ padding: '14px', color: '#fff' }}>
                    {row.month}{isCurrentMonth ? ' *' : ''}
                  </td>
                  <td style={{ padding: '14px', textAlign: 'right', color: '#fff', fontVariantNumeric: 'tabular-nums' }}>
                    {row.leads}
                  </td>
                  <td style={{ padding: '14px', textAlign: 'right', color: '#a0a8b8', fontVariantNumeric: 'tabular-nums' }}>
                    {rate}
                  </td>
                  <td style={{ padding: '14px', textAlign: 'right' }}>
                    {trendEl}
                  </td>
                </tr>
              )
            })}

            {/* Projected row: current month end-of-month estimate (only when days remain) */}
            {daysLeft > 0 && leadsProjected > 0 && (
              <tr style={{ background: 'rgba(46,204,113,0.06)' }}>
                <td style={{ padding: '14px', color: '#2ecc71', fontStyle: 'italic' }}>
                  {currentMonthInData
                    ? `${currentMonthLabel} projected`
                    : `${currentMonthLabel} *`}
                </td>
                <td style={{ padding: '14px', textAlign: 'right', color: '#2ecc71', fontStyle: 'italic', fontVariantNumeric: 'tabular-nums' }}>
                  {leadsProjected}
                </td>
                <td style={{ padding: '14px', textAlign: 'right', color: '#2ecc71', fontStyle: 'italic' }}>
                  {dailyRate ? dailyRate.toFixed(2) : '—'}+
                </td>
                <td style={{ padding: '14px', textAlign: 'right', color: '#2ecc71', fontStyle: 'italic' }}>—</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p style={{ color: '#a0a8b8', fontSize: '11px', marginTop: '12px' }}>
        {elapsedDays && daysInMonth
          ? `* Through day ${elapsedDays} of ${daysInMonth} · ${daysLeft} days remaining`
          : '* Current month'}
      </p>
    </div>
  )
}
