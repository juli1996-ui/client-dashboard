export default function MonthlyBreakdownTable({ monthlyTrends, projections }) {
  if (!monthlyTrends || monthlyTrends.length === 0) return null

  // Always derive the current month from the system clock — never trust data-driven heuristics
  const now = new Date()
  const currentYear = now.getFullYear()
  const currentMonthNum = now.getMonth() + 1
  const todayYM = `${currentYear}-${String(currentMonthNum).padStart(2, '0')}`
  const todayDay = now.getDate()
  const daysInTodayMonth = new Date(currentYear, currentMonthNum, 0).getDate()

  const NUM_TO_LABEL = {
    1: 'Jan', 2: 'Feb', 3: 'Mar', 4: 'Apr', 5: 'May', 6: 'Jun',
    7: 'Jul', 8: 'Aug', 9: 'Sep', 10: 'Oct', 11: 'Nov', 12: 'Dec',
  }
  const todayLabel = NUM_TO_LABEL[currentMonthNum]

  // projections carries the daily rate and projected totals (computed in parseSheet.js)
  const { dailyRate, leadsProjected } = projections || {}

  // Days remaining in the current month as of today
  const daysLeft = Math.max(0, daysInTodayMonth - todayDay)

  // Is the current month already represented as a data row in the table?
  const currentMonthInData = monthlyTrends.some(row => row.ym === todayYM)

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
              const isCurrentMonth = row.ym === todayYM
              // For the in-progress current month use elapsed days; for past months use full month
              const days     = isCurrentMonth ? todayDay : (row.days || 30)
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
                    {/* * only on the actual current calendar month */}
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

            {/* Projection row — only shown when today's month still has days remaining */}
            {daysLeft > 0 && leadsProjected > 0 && (
              <tr style={{ background: 'rgba(46,204,113,0.06)' }}>
                <td style={{ padding: '14px', color: '#2ecc71', fontStyle: 'italic' }}>
                  {/* "Mar projected" when March is in the data; "Mar *" when it has no entries yet */}
                  {currentMonthInData ? `${todayLabel} projected` : `${todayLabel} *`}
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
        * Through day {todayDay} of {daysInTodayMonth} · {daysLeft} days remaining
      </p>
    </div>
  )
}
