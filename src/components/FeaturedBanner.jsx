const C = {
  text: '#2D2A26', muted: '#8A8580', faint: '#B5B0AA',
  accent: '#C2653C', success: '#4A7C59',
  surface: '#FFFFFF', border: '#E8E4DE',
}
const FONT_DISPLAY = "'Fraunces', Georgia, serif"

const MONTH_ES = {
  'Enero': 'enero', 'Febrero': 'febrero', 'Marzo': 'marzo',
  'Abril': 'abril', 'Mayo': 'mayo', 'Junio': 'junio',
  'Julio': 'julio', 'Agosto': 'agosto', 'Septiembre': 'septiembre',
  'Octubre': 'octubre', 'Noviembre': 'noviembre', 'Diciembre': 'diciembre',
  'January': 'enero', 'February': 'febrero', 'March': 'marzo',
  'April': 'abril', 'May': 'mayo', 'June': 'junio',
  'July': 'julio', 'August': 'agosto', 'September': 'septiembre',
  'October': 'octubre', 'November': 'noviembre', 'December': 'diciembre',
}

const MONTH_NUM_ES = {
  1: 'enero', 2: 'febrero', 3: 'marzo', 4: 'abril', 5: 'mayo', 6: 'junio',
  7: 'julio', 8: 'agosto', 9: 'septiembre', 10: 'octubre', 11: 'noviembre', 12: 'diciembre',
}

export default function FeaturedBanner({ monthlyTrends, sinceActivation }) {
  // Mode 1: campaign activation tracking (preferred when configured)
  if (sinceActivation && sinceActivation.total > 0) {
    const { total, days, activationDay, activationMonth } = sinceActivation
    const monthName = MONTH_NUM_ES[activationMonth] || ''
    const perDay = (total / days).toFixed(1)
    return (
      <Banner
        big={total}
        title={`${total} respuestas positivas desde el ${activationDay} de ${monthName}`}
        body={
          <>Las campañas se activaron el <strong style={{ color: C.accent }}>{activationDay} de {monthName}</strong>.
          {' '}Acumuladas en <strong style={{ color: C.text }}>{days} {days === 1 ? 'día' : 'días'}</strong> de actividad —
          {' '}promedio de <strong style={{ color: C.text }}>{perDay} respuestas/día</strong>.</>
        }
      />
    )
  }

  // Mode 2: latest month with partial-month context
  if (!monthlyTrends || monthlyTrends.length === 0) return null
  const latest = monthlyTrends[monthlyTrends.length - 1]
  if (!latest || !latest.leads) return null

  const monthName = MONTH_ES[latest.month] || latest.month.toLowerCase()
  const isPartial = latest.firstDay && latest.firstDay > 1
  const days = isPartial && latest.activeDays ? latest.activeDays : (latest.days || 30)
  const perDay = (latest.leads / days).toFixed(1)
  const sinceText = isPartial ? `desde el ${latest.firstDay} de ${monthName}` : `en ${monthName}`

  return (
    <Banner
      big={latest.leads}
      title={`${latest.leads} respuestas positivas ${sinceText}`}
      body={
        isPartial ? (
          <>Las campañas se activaron el <strong style={{ color: C.accent }}>{latest.firstDay} de {monthName}</strong>.
          {' '}Acumuladas en <strong style={{ color: C.text }}>{days} {days === 1 ? 'día' : 'días'}</strong>
          {' '}({latest.firstDay}–{latest.lastDay} de {monthName}) — promedio de
          {' '}<strong style={{ color: C.text }}>{perDay} respuestas/día</strong>.</>
        ) : (
          <>A lo largo del mes — promedio de <strong style={{ color: C.text }}>{perDay} respuestas/día</strong>.</>
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
          Respuestas positivas
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
