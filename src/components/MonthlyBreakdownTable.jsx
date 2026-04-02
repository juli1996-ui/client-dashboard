export default function MonthlyBreakdownTable({ monthlyTrends, projections }) {
  if (!monthlyTrends || monthlyTrends.length === 0) return null

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

  const { dailyRate, leadsProjected } = projections || {}
  const daysLeft = Math.max(0, daysInTodayMonth - todayDay)
  const currentMonthInData = monthlyTrends.some(row => row.ym === todayYM)

  return (
    <div style={{ background: '#FFFFFF', border: '1px solid #E8E4DE', borderRadius: '16px', padding: '28px' }}>
      <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#2D2A26', marginBottom: '4px', letterSpacing: '-0.3px', fontFamily: "'Fraunces', Georgia, serif" }}>
        Monthly Breakdown
      </h2>
      <p style={{ color: '#8A8580', fontSize: '13px', marginBottom: '20px', fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}>
        Leads and daily pace by month
      </p>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #F0ECE6' }}>
              {['Month', 'Leads', '/Day', 'vs Prev'].map((h, i) => (
                <th key={h} style={{
                  textAlign: i === 0 ? 'left' : 'right',
                  fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.5px',
                  color: '#B5B0AA', fontWeight: 600, padding: '10px 14px',
                  fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
                }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {monthlyTrends.map((row, i) => {
              const isCurrentMonth = row.ym === todayYM
              const days     = isCurrentMonth ? todayDay : (row.days || 30)
              const rate     = (row.leads / days).toFixed(2)
              const prev     = i > 0 ? monthlyTrends[i - 1].leads : null
              const pctChg   = prev ? Math.round((row.leads - prev) / prev * 100) : null
              const isRecent = i >= monthlyTrends.length - 2

              let trendEl = <span style={{ color: '#B5B0AA' }}>—</span>
              if (pctChg !== null) {
                if (pctChg > 0)      trendEl = <span style={{ color: '#4A7C59', fontWeight: 600 }}>+{pctChg}%</span>
                else if (pctChg < 0) trendEl = <span style={{ color: '#B85450', fontWeight: 600 }}>{pctChg}%</span>
                else                 trendEl = <span style={{ color: '#B8860B', fontWeight: 600 }}>0%</span>
              }

              return (
                <tr key={row.ym || row.month} style={{
                  borderBottom: '1px solid #F0ECE6',
                  fontWeight: isRecent ? 600 : 400,
                  background: i % 2 === 1 ? '#FAF8F5' : 'transparent',
                }}>
                  <td style={{ padding: '14px', color: '#2D2A26' }}>
                    {row.month}{isCurrentMonth ? ' *' : ''}
                  </td>
                  <td style={{ padding: '14px', textAlign: 'right', color: '#2D2A26', fontVariantNumeric: 'tabular-nums' }}>
                    {row.leads}
                  </td>
                  <td style={{ padding: '14px', textAlign: 'right', color: '#8A8580', fontVariantNumeric: 'tabular-nums' }}>
                    {rate}
                  </td>
                  <td style={{ padding: '14px', textAlign: 'right' }}>
                    {trendEl}
                  </td>
                </tr>
              )
            })}

            {daysLeft > 0 && leadsProjected > 0 && (
              <tr style={{ background: 'rgba(74,124,89,0.04)' }}>
                <td style={{ padding: '14px', color: '#4A7C59', fontStyle: 'italic' }}>
                  {currentMonthInData ? `${todayLabel} projected` : `${todayLabel} *`}
                </td>
                <td style={{ padding: '14px', textAlign: 'right', color: '#4A7C59', fontStyle: 'italic', fontVariantNumeric: 'tabular-nums' }}>
                  {leadsProjected}
                </td>
                <td style={{ padding: '14px', textAlign: 'right', color: '#4A7C59', fontStyle: 'italic' }}>
                  {dailyRate ? dailyRate.toFixed(2) : '—'}+
                </td>
                <td style={{ padding: '14px', textAlign: 'right', color: '#4A7C59', fontStyle: 'italic' }}>—</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p style={{ color: '#B5B0AA', fontSize: '11px', marginTop: '12px' }}>
        * Through day {todayDay} of {daysInTodayMonth} · {daysLeft} days remaining
      </p>
    </div>
  )
}
