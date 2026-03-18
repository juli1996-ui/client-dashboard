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
    <div className="glass" style={{ padding: '28px' }}>
      <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', marginBottom: '4px', letterSpacing: '-0.3px' }}>
        Monthly Breakdown
      </h2>
      <p style={{ color: '#525252', fontSize: '13px', marginBottom: '20px' }}>
        Leads and daily pace by month
      </p>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              {['Month', 'Leads', '/Day', 'vs Prev'].map((h, i) => (
                <th key={h} style={{
                  textAlign: i === 0 ? 'left' : 'right',
                  fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.5px',
                  color: '#525252', fontWeight: 600, padding: '10px 14px',
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

              let trendEl = <span style={{ color: '#2A2A3A' }}>—</span>
              if (pctChg !== null) {
                if (pctChg > 0)      trendEl = <span style={{ color: '#10B981', fontWeight: 600 }}>+{pctChg}%</span>
                else if (pctChg < 0) trendEl = <span style={{ color: '#EF4444', fontWeight: 600 }}>{pctChg}%</span>
                else                 trendEl = <span style={{ color: '#F59E0B', fontWeight: 600 }}>0%</span>
              }

              return (
                <tr key={row.ym || row.month} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', fontWeight: isRecent ? 600 : 400 }}>
                  <td style={{ padding: '14px', color: '#fff' }}>
                    {row.month}{isCurrentMonth ? ' *' : ''}
                  </td>
                  <td style={{ padding: '14px', textAlign: 'right', color: '#fff', fontVariantNumeric: 'tabular-nums' }}>
                    {row.leads}
                  </td>
                  <td style={{ padding: '14px', textAlign: 'right', color: '#A3A3A3', fontVariantNumeric: 'tabular-nums' }}>
                    {rate}
                  </td>
                  <td style={{ padding: '14px', textAlign: 'right' }}>
                    {trendEl}
                  </td>
                </tr>
              )
            })}

            {daysLeft > 0 && leadsProjected > 0 && (
              <tr style={{ background: 'rgba(16,185,129,0.04)' }}>
                <td style={{ padding: '14px', color: '#10B981', fontStyle: 'italic' }}>
                  {currentMonthInData ? `${todayLabel} projected` : `${todayLabel} *`}
                </td>
                <td style={{ padding: '14px', textAlign: 'right', color: '#10B981', fontStyle: 'italic', fontVariantNumeric: 'tabular-nums' }}>
                  {leadsProjected}
                </td>
                <td style={{ padding: '14px', textAlign: 'right', color: '#10B981', fontStyle: 'italic' }}>
                  {dailyRate ? dailyRate.toFixed(2) : '—'}+
                </td>
                <td style={{ padding: '14px', textAlign: 'right', color: '#10B981', fontStyle: 'italic' }}>—</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p style={{ color: '#2A2A3A', fontSize: '11px', marginTop: '12px' }}>
        * Through day {todayDay} of {daysInTodayMonth} · {daysLeft} days remaining
      </p>
    </div>
  )
}
