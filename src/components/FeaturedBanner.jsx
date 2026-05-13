const C = {
  text: '#2D2A26', muted: '#8A8580', faint: '#B5B0AA',
  accent: '#C2653C', success: '#4A7C59',
  surface: '#FFFFFF', border: '#E8E4DE',
}
const FONT_DISPLAY = "'Fraunces', Georgia, serif"

// Map any sheet month spelling (Spanish or English) → English display name
const MONTH_EN = {
  'Enero': 'January', 'Febrero': 'February', 'Marzo': 'March',
  'Abril': 'April', 'Mayo': 'May', 'Junio': 'June',
  'Julio': 'July', 'Agosto': 'August', 'Septiembre': 'September',
  'Octubre': 'October', 'Noviembre': 'November', 'Diciembre': 'December',
  'January': 'January', 'February': 'February', 'March': 'March',
  'April': 'April', 'May': 'May', 'June': 'June',
  'July': 'July', 'August': 'August', 'September': 'September',
  'October': 'October', 'November': 'November', 'December': 'December',
  'Jan': 'January', 'Feb': 'February', 'Mar': 'March', 'Apr': 'April',
  'Jun': 'June', 'Jul': 'July', 'Aug': 'August', 'Sep': 'September',
  'Oct': 'October', 'Nov': 'November', 'Dec': 'December',
}

const MONTH_NUM_EN = {
  1: 'January', 2: 'February', 3: 'March', 4: 'April', 5: 'May', 6: 'June',
  7: 'July', 8: 'August', 9: 'September', 10: 'October', 11: 'November', 12: 'December',
}

function ordinal(n) {
  if (n >= 11 && n <= 13) return `${n}th`
  const s = ['th', 'st', 'nd', 'rd']
  const v = n % 10
  return `${n}${s[v] || 'th'}`
}

export default function FeaturedBanner({ monthlyTrends, sinceActivation }) {
  // Mode 1: campaign activation tracking (preferred when configured)
  if (sinceActivation && sinceActivation.total > 0) {
    const { total, days, firstDay, lastDay, activationDay, activationMonth, lastMonth, isCrossMonth } = sinceActivation
    const activationMonthName = MONTH_NUM_EN[activationMonth] || ''
    const lastMonthName = MONTH_NUM_EN[lastMonth] || activationMonthName
    const perDay = (total / days).toFixed(1)
    const range = isCrossMonth
      ? `${activationMonthName} ${firstDay} – ${lastMonthName} ${lastDay}`
      : (lastDay && lastDay !== firstDay
          ? `${activationMonthName} ${firstDay}–${lastDay}`
          : `${activationMonthName} ${firstDay}`)
    const title = isCrossMonth
      ? `${total} positive responses since ${activationMonthName} ${ordinal(activationDay)}`
      : `${total} positive responses in ${activationMonthName} since ${activationMonthName} ${ordinal(activationDay)}`
    return (
      <Banner
        big={total}
        title={title}
        body={
          <>Campaigns went live on <strong style={{ color: C.accent }}>{activationMonthName} {ordinal(activationDay)}</strong>.
          {' '}Accumulated in <strong style={{ color: C.text }}>{days} {days === 1 ? 'day' : 'days'}</strong>
          {' '}({range}) — averaging
          {' '}<strong style={{ color: C.text }}>{perDay} responses/day</strong>.</>
        }
      />
    )
  }

  // Mode 2: latest month with partial-month context
  if (!monthlyTrends || monthlyTrends.length === 0) return null
  const latest = monthlyTrends[monthlyTrends.length - 1]
  if (!latest || !latest.leads) return null

  const monthName = MONTH_EN[latest.month] || latest.month
  const isPartial = latest.firstDay && latest.firstDay > 1
  const days = isPartial && latest.activeDays ? latest.activeDays : (latest.days || 30)
  const perDay = (latest.leads / days).toFixed(1)
  const sinceText = isPartial
    ? `since ${monthName} ${ordinal(latest.firstDay)}`
    : `in ${monthName}`

  return (
    <Banner
      big={latest.leads}
      title={`${latest.leads} positive responses ${sinceText}`}
      body={
        isPartial ? (
          <>Campaigns went live on <strong style={{ color: C.accent }}>{monthName} {ordinal(latest.firstDay)}</strong>.
          {' '}Accumulated in <strong style={{ color: C.text }}>{days} {days === 1 ? 'day' : 'days'}</strong>
          {' '}({monthName} {latest.firstDay}–{latest.lastDay}) — averaging
          {' '}<strong style={{ color: C.text }}>{perDay} responses/day</strong>.</>
        ) : (
          <>Across the month — averaging <strong style={{ color: C.text }}>{perDay} responses/day</strong>.</>
        )
      }
    />
  )
}

function Banner({ big, title, body }) {
  return (
    <section style={{
      background: C.surface,
      border: `1px solid ${C.border}`,
      borderLeft: `4px solid ${C.accent}`,
      borderRadius: '16px',
      padding: '28px 32px',
      boxShadow: '0 1px 3px rgba(45,42,38,0.04)',
      display: 'flex',
      alignItems: 'center',
      gap: '32px',
      flexWrap: 'wrap',
    }}>
      <div style={{ flex: '0 0 auto' }}>
        <div style={{
          fontFamily: FONT_DISPLAY, fontWeight: 900, fontSize: '72px',
          color: C.accent, lineHeight: 1, letterSpacing: '-2px',
          fontVariantNumeric: 'tabular-nums',
        }}>
          {big}
        </div>
      </div>

      <div style={{ flex: 1, minWidth: '280px' }}>
        <p style={{
          fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
          fontSize: '11px', fontWeight: 700,
          textTransform: 'uppercase', letterSpacing: '2px',
          color: C.faint, margin: '0 0 8px',
        }}>
          Positive responses
        </p>
        <h2 style={{
          fontFamily: FONT_DISPLAY, fontSize: '24px', fontWeight: 700,
          color: C.text, margin: '0 0 6px', letterSpacing: '-0.4px',
        }}>
          {title}
        </h2>
        <p style={{ fontSize: '14px', color: C.muted, margin: 0, lineHeight: 1.6 }}>
          {body}
        </p>
      </div>
    </section>
  )
}
