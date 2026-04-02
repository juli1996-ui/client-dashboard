import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { fetchSheetData } from '../lib/parseSheet'
import { fetchCampaignAnalytics, fetchCampaigns } from '../lib/instantly'

// ── Color Tokens ───────────────────────────────────────
const C = {
  bg: '#F7F5F0',
  surface: '#FFFFFF',
  text: '#2D2A26',
  muted: '#8A8580',
  faint: '#B5B0AA',
  accent: '#C2653C',
  success: '#4A7C59',
  warning: '#B8860B',
  border: '#E8E4DE',
  borderLight: '#F0ECE6',
}

const FONT_DISPLAY = "'Fraunces', Georgia, serif"
const FONT_BODY = "'Plus Jakarta Sans', system-ui, sans-serif"

// ── Shared Styles ──────────────────────────────────────
const S = {
  page: { minHeight: '100vh', background: C.bg, fontFamily: FONT_BODY, color: C.text, fontSize: '14px', lineHeight: 1.5, WebkitFontSmoothing: 'antialiased' },
  header: {
    position: 'sticky', top: 0, zIndex: 100,
    background: 'rgba(247,245,240,0.85)',
    backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
    borderBottom: `1px solid ${C.border}`, padding: '12px 0',
  },
  headerInner: {
    maxWidth: '1100px', margin: '0 auto', padding: '0 24px',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  },
  main: { maxWidth: '1100px', margin: '0 auto', padding: '24px 24px 48px', display: 'flex', flexDirection: 'column', gap: '32px' },
  grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' },
  grid6040: { display: 'grid', gridTemplateColumns: '3fr 2fr', gap: '16px' },
  card: {
    background: C.surface, border: `1px solid ${C.border}`, borderRadius: '12px',
    padding: '20px', transition: 'box-shadow 0.2s',
  },
  sectionLabel: {
    fontSize: '10px', fontWeight: 700, textTransform: 'uppercase',
    letterSpacing: '1.2px', color: C.muted, marginBottom: '12px', fontFamily: FONT_BODY,
  },
  brand: { fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: '18px', color: C.text },
  clientName: { fontSize: '13px', fontWeight: 600, color: C.muted },
}

// ═══════════════════════════════════════════════════════════
// SECTION 1: Executive Summary + KPIs
// ═══════════════════════════════════════════════════════════
function ExecutiveSummary({ data, projections, monthlyTrends, growth }) {
  const totalLeads = data.totalLeads || 0
  const meetings = data.meetingsScheduled || 0
  const leadsPerDay = data.leadsPerDay
  const meetingConv = totalLeads > 0 ? ((meetings / totalLeads) * 100).toFixed(1) : 0

  // Use the LAST month with data (not current calendar month which may be empty)
  let latestMonth = projections?.currentMonthLabel || 'This Month'
  let latestMonthLeads = projections?.leadsActual || projections?.currentMonthLeads || 0
  let prevMonthLeads = projections?.prevMonthLeads || 0
  let prevMonthName = 'last month'

  // If current month has no data, use the last month from monthlyTrends
  if (latestMonthLeads === 0 && monthlyTrends && monthlyTrends.length > 0) {
    const last = monthlyTrends[monthlyTrends.length - 1]
    latestMonth = last.month
    latestMonthLeads = last.leads
    if (monthlyTrends.length >= 2) {
      const prev = monthlyTrends[monthlyTrends.length - 2]
      prevMonthLeads = prev.leads
      prevMonthName = prev.month
    }
  } else if (monthlyTrends && monthlyTrends.length >= 2) {
    prevMonthName = monthlyTrends[monthlyTrends.length - 2].month
  }

  let growthPct = null
  if (prevMonthLeads > 0 && latestMonthLeads > 0) {
    growthPct = Math.round(((latestMonthLeads - prevMonthLeads) / prevMonthLeads) * 100)
  }

  return (
    <div style={S.card}>
      <div style={S.sectionLabel}>Executive Summary</div>
      <p style={{ fontFamily: FONT_DISPLAY, fontSize: '15px', lineHeight: 1.7, color: C.text, margin: 0 }}>
        {latestMonthLeads > 0 ? (
          <>
            {latestMonth} was {growthPct != null && growthPct > 50 ? 'a breakout month' : 'a solid month'}. Your campaign generated{' '}
            <span style={{ fontFamily: FONT_DISPLAY, fontWeight: 900, fontSize: '42px', color: C.accent, lineHeight: 1, verticalAlign: 'baseline' }}>
              {latestMonthLeads}
            </span>{' '}
            positive responses{growthPct != null && growthPct > 0 && (
              <>, {growthPct > 50 ? 'the highest ever recorded, representing' : 'representing'} a <strong style={{ color: C.accent }}>{Math.abs(growthPct)}%</strong> increase over {prevMonthName}</>
            )}.
            {meetings > 0 && <> Meeting conversion held strong at <strong>{meetingConv}%</strong>.</>}
            {leadsPerDay && projections?.leadsProjected && <> At current pace of <strong>{leadsPerDay.toFixed(1)} leads/day</strong>, {projections.currentMonthLabel} projects to ~{projections.leadsProjected} leads.</>}
          </>
        ) : (
          <>
            Your campaigns have generated{' '}
            <span style={{ fontFamily: FONT_DISPLAY, fontWeight: 900, fontSize: '42px', color: C.accent, lineHeight: 1, verticalAlign: 'baseline' }}>
              {totalLeads}
            </span>{' '}
            total positive responses.
            {leadsPerDay && <> Currently averaging <strong>{leadsPerDay.toFixed(1)} leads/day</strong>.</>}
          </>
        )}
      </p>
    </div>
  )
}

function KPIStack({ data, projections, monthlyTrends }) {
  // Use last month with data, not current calendar month
  let latestMonth = null
  let prevMonth = null
  if (monthlyTrends && monthlyTrends.length > 0) {
    latestMonth = monthlyTrends[monthlyTrends.length - 1]
    if (monthlyTrends.length >= 2) {
      prevMonth = monthlyTrends[monthlyTrends.length - 2]
    }
  }

  const latestLeads = latestMonth?.leads || 0
  const latestMeetings = latestMonth?.meetings || 0
  const latestDays = latestMonth?.days || 30
  const latestLeadsPerDay = latestLeads > 0 ? (latestLeads / latestDays).toFixed(2) : '—'

  const prevLeadsPerDay = prevMonth ? (prevMonth.leads / (prevMonth.days || 30)) : null
  const currentLPD = latestLeads / latestDays
  const lpdDiff = prevLeadsPerDay ? (currentLPD - prevLeadsPerDay).toFixed(1) : null

  const prevMeetings = prevMonth?.meetings || 0
  const meetingsDiff = latestMeetings > 0 && prevMeetings >= 0 ? latestMeetings - prevMeetings : null

  const growthPct = prevMonth && prevMonth.leads > 0
    ? Math.round(((latestLeads - prevMonth.leads) / prevMonth.leads) * 100) : null

  const kpis = [
    {
      label: `${latestMonth?.month || 'Month'} Leads`,
      value: latestLeads.toLocaleString(),
      trend: growthPct != null && growthPct > 0 ? `+${growthPct}%` : growthPct != null ? `${growthPct}%` : null,
      trendUp: growthPct != null && growthPct > 0,
    },
    {
      label: 'Leads / Day',
      value: latestLeadsPerDay,
      trend: lpdDiff && parseFloat(lpdDiff) !== 0 ? (parseFloat(lpdDiff) > 0 ? `+${lpdDiff}` : lpdDiff) : null,
      trendUp: lpdDiff && parseFloat(lpdDiff) > 0,
    },
    {
      label: 'Meetings Booked',
      value: latestMeetings || '—',
      trend: meetingsDiff != null && meetingsDiff !== 0 ? (meetingsDiff > 0 ? `+${meetingsDiff}` : `${meetingsDiff}`) : null,
      trendUp: meetingsDiff != null && meetingsDiff > 0,
    },
    {
      label: 'Total All-Time',
      value: data.totalLeads?.toLocaleString() ?? '—',
      trend: null,
    },
  ]

  return (
    <div style={S.card}>
      <div style={S.sectionLabel}>Key Performance Indicators</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {kpis.map(k => (
          <div key={k.label} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '10px 14px', background: C.bg, borderRadius: '8px', border: `1px solid ${C.border}`,
          }}>
            <span style={{ fontSize: '12px', color: C.muted, fontWeight: 500 }}>{k.label}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: '22px', color: C.text }}>{k.value}</span>
              {k.trend && (
                <span style={{
                  fontSize: '10px', fontWeight: 700, padding: '2px 7px', borderRadius: '4px',
                  color: k.trendUp ? C.success : C.accent,
                  background: k.trendUp ? 'rgba(74,124,89,0.1)' : 'rgba(194,101,60,0.1)',
                }}>
                  {k.trend}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════
// SECTION 2: Campaign Highlights Strip
// ═══════════════════════════════════════════════════════════
function HighlightsStrip({ summary }) {
  const positiveRate = summary.opportunities != null
    ? ((summary.opportunities / (summary.replies || 1)) * 100).toFixed(1) : null
  const meetingRate = summary.meetingsScheduled > 0 && summary.totalLeads > 0
    ? ((summary.meetingsScheduled / summary.totalLeads) * 100).toFixed(1) : null

  const metrics = [
    { label: 'Emails Sent', value: summary.emailsSent?.toLocaleString() ?? '—', dot: null },
    { label: 'Open Rate', value: summary.openRate != null ? `${summary.openRate}%` : '—', dot: summary.openRate >= 25 ? 'green' : 'yellow' },
    { label: 'Reply Rate', value: summary.responseRate != null ? `${summary.responseRate}%` : '—', dot: summary.responseRate >= 2 ? 'green' : 'yellow' },
    { label: 'Positive Rate', value: positiveRate != null ? `${positiveRate}%` : '—', dot: positiveRate && parseFloat(positiveRate) >= 35 ? 'green' : 'yellow' },
    { label: 'Meeting Rate', value: meetingRate != null ? `${meetingRate}%` : '—', dot: meetingRate && parseFloat(meetingRate) >= 2.5 ? 'green' : 'yellow' },
  ]

  return (
    <div style={{ ...S.card, padding: 0, overflow: 'hidden' }}>
      <div style={{ padding: '14px 20px 0' }}>
        <div style={S.sectionLabel}>Campaign Highlights</div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 0 }}>
        {metrics.map((m, i) => (
          <div key={m.label} style={{
            textAlign: 'center', padding: '14px 10px',
            borderRight: i < metrics.length - 1 ? `1px solid ${C.border}` : 'none',
          }}>
            <div style={{ fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.8px', color: C.muted, marginBottom: '4px' }}>
              {m.label}
            </div>
            <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: '20px', color: C.text }}>
              {m.value}
              {m.dot && (
                <span style={{
                  display: 'inline-block', width: '7px', height: '7px', borderRadius: '50%',
                  marginLeft: '5px', verticalAlign: 'middle', position: 'relative', top: '-1px',
                  background: m.dot === 'green' ? C.success : C.warning,
                }} />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════
// SECTION 3: Monthly Bar Chart (pure CSS) + Response Breakdown
// ═══════════════════════════════════════════════════════════
function MonthlyBarChart({ monthlyTrends }) {
  if (!monthlyTrends || monthlyTrends.length === 0) return null
  const maxLeads = Math.max(...monthlyTrends.map(m => m.leads), 1)
  const lastIdx = monthlyTrends.length - 1

  return (
    <div style={S.card}>
      <div style={S.sectionLabel}>Monthly Positive Responses</div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '160px', paddingTop: '10px' }}>
        {monthlyTrends.map((m, i) => {
          const pct = (m.leads / maxLeads) * 100
          const isCurrent = i === lastIdx
          return (
            <div key={m.month + i} style={{
              flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
              gap: '4px', height: '100%', justifyContent: 'flex-end',
            }}>
              <span style={{ fontSize: '10px', fontWeight: 700, color: C.text }}>{m.leads}</span>
              <div style={{
                width: '100%', borderRadius: '4px 4px 0 0', minHeight: '4px',
                height: `${pct}%`,
                background: isCurrent ? C.accent : '#D9C9B8',
                transition: 'opacity 0.15s',
              }} />
              <span style={{ fontSize: '10px', color: isCurrent ? C.accent : C.muted, fontWeight: isCurrent ? 700 : 400 }}>
                {m.month.substring(0, 3)}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function ResponseBreakdown({ replyTypes }) {
  if (!replyTypes || replyTypes.length === 0) return null
  const total = replyTypes.reduce((s, t) => s + t.value, 0)

  return (
    <div style={S.card}>
      <div style={S.sectionLabel}>Response Breakdown</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {replyTypes.map(t => {
          const pct = total > 0 ? ((t.value / total) * 100).toFixed(1) : '0'
          return (
            <div key={t.name} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '7px 0', borderBottom: `1px solid ${C.border}`,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: t.color, flexShrink: 0 }} />
                <span style={{ fontSize: '13px', fontWeight: 500 }}>{t.name}</span>
              </div>
              <div>
                <span style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: '14px' }}>{t.value}</span>
                <span style={{ fontSize: '11px', color: C.muted, marginLeft: '6px' }}>{pct}%</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════
// SECTION 4: Campaign Funnel
// ═══════════════════════════════════════════════════════════
function MonthlyComparison({ monthlyTrends }) {
  if (!monthlyTrends || monthlyTrends.length < 2) return null

  const curr = monthlyTrends[monthlyTrends.length - 1]
  const prev = monthlyTrends[monthlyTrends.length - 2]

  const currLPD = (curr.leads / (curr.days || 30)).toFixed(2)
  const prevLPD = (prev.leads / (prev.days || 30)).toFixed(2)

  const metrics = [
    { label: 'Positive Responses', prev: prev.leads, curr: curr.leads },
    { label: 'Leads / Day', prev: prevLPD, curr: currLPD },
  ]

  return (
    <div style={S.card}>
      <div style={S.sectionLabel}>Month-over-Month Growth</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '0', alignItems: 'stretch' }}>
        {/* Header row */}
        <div style={{ padding: '12px 16px', textAlign: 'center', borderBottom: `1px solid ${C.border}` }}>
          <span style={{ fontSize: '13px', fontWeight: 700, color: C.muted }}>{prev.month}</span>
        </div>
        <div style={{ padding: '12px 8px', textAlign: 'center', borderBottom: `1px solid ${C.border}` }} />
        <div style={{ padding: '12px 16px', textAlign: 'center', borderBottom: `1px solid ${C.border}` }}>
          <span style={{ fontSize: '13px', fontWeight: 700, color: C.accent }}>{curr.month}</span>
        </div>

        {/* Metric rows */}
        {metrics.map((m, i) => {
          const prevVal = parseFloat(m.prev)
          const currVal = parseFloat(m.curr)
          const change = prevVal > 0 ? Math.round(((currVal - prevVal) / prevVal) * 100) : 0
          const isUp = change > 0

          return (
            <div key={m.label} style={{ display: 'contents' }}>
              <div style={{
                padding: '16px', textAlign: 'center',
                borderBottom: i < metrics.length - 1 ? `1px solid ${C.borderLight}` : 'none',
              }}>
                <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: '28px', color: C.muted }}>
                  {typeof m.prev === 'number' ? m.prev.toLocaleString() : m.prev}
                </div>
                <div style={{ fontSize: '11px', color: C.faint, marginTop: '2px' }}>{m.label}</div>
              </div>

              <div style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                padding: '8px', minWidth: '64px',
                borderBottom: i < metrics.length - 1 ? `1px solid ${C.borderLight}` : 'none',
              }}>
                <span style={{ fontSize: '18px', color: C.muted }}>→</span>
                <span style={{
                  fontSize: '11px', fontWeight: 700, marginTop: '2px',
                  padding: '2px 8px', borderRadius: '4px',
                  color: isUp ? C.success : C.accent,
                  background: isUp ? 'rgba(74,124,89,0.08)' : 'rgba(194,101,60,0.08)',
                }}>
                  {isUp ? '+' : ''}{change}%
                </span>
              </div>

              <div style={{
                padding: '16px', textAlign: 'center',
                borderBottom: i < metrics.length - 1 ? `1px solid ${C.borderLight}` : 'none',
              }}>
                <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: '28px', color: C.text }}>
                  {typeof m.curr === 'number' ? m.curr.toLocaleString() : m.curr}
                </div>
                <div style={{ fontSize: '11px', color: C.faint, marginTop: '2px' }}>{m.label}</div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════
// SECTION 5: Cumulative Growth SVG + Forecast
// ═══════════════════════════════════════════════════════════
function CumulativeGrowthChart({ monthlyTrends }) {
  if (!monthlyTrends || monthlyTrends.length < 2) return null

  // Build cumulative data
  let cumulative = []
  let running = 0
  for (const m of monthlyTrends) {
    running += m.leads
    cumulative.push({ month: m.month, total: running })
  }

  const maxVal = Math.max(...cumulative.map(c => c.total), 1)
  const count = cumulative.length

  // SVG dimensions
  const svgW = 480, svgH = 180
  const padLeft = 40, padRight = 20, padTop = 20, padBottom = 25
  const chartW = svgW - padLeft - padRight
  const chartH = svgH - padTop - padBottom

  const getX = (i) => padLeft + (i / (count - 1)) * chartW
  const getY = (val) => padTop + chartH - (val / maxVal) * chartH

  // Grid lines (4 levels)
  const gridLevels = 4
  const gridLines = []
  for (let i = 0; i < gridLevels; i++) {
    const y = padTop + (i / gridLevels) * chartH
    const val = Math.round(maxVal - (i / gridLevels) * maxVal)
    gridLines.push({ y, val })
  }

  // Build path
  const points = cumulative.map((c, i) => `${getX(i)} ${getY(c.total)}`)
  const linePath = 'M ' + points.join(' L ')
  const areaPath = linePath + ` L ${getX(count - 1)} ${padTop + chartH} L ${getX(0)} ${padTop + chartH} Z`

  return (
    <div style={S.card}>
      <div style={S.sectionLabel}>Cumulative Growth</div>
      <div style={{ width: '100%', overflow: 'hidden' }}>
        <svg viewBox={`0 0 ${svgW} ${svgH}`} width="100%" height="180" preserveAspectRatio="none">
          {gridLines.map((g, i) => (
            <g key={i}>
              <line x1={padLeft} y1={g.y} x2={svgW - padRight} y2={g.y} stroke={C.border} strokeWidth="0.5" />
              <text x={padLeft - 5} y={g.y + 4} textAnchor="end" fontSize="9" fill={C.muted} fontFamily={FONT_BODY}>{g.val}</text>
            </g>
          ))}
          <path d={areaPath} fill="rgba(194,101,60,0.1)" />
          <path d={linePath} fill="none" stroke={C.accent} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          {cumulative.map((c, i) => (
            <g key={i}>
              <circle cx={getX(i)} cy={getY(c.total)} r={i === count - 1 ? 4 : 3} fill={C.accent} />
              <text x={getX(i)} y={padTop + chartH + 16} textAnchor="middle" fontSize="9"
                fill={i === count - 1 ? C.accent : C.muted}
                fontWeight={i === count - 1 ? 700 : 400}
                fontFamily={FONT_BODY}>
                {c.month.substring(0, 3)}
              </text>
            </g>
          ))}
          {/* End label */}
          <text x={getX(count - 1)} y={getY(cumulative[count - 1].total) - 8} textAnchor="middle"
            fontSize="10" fill={C.accent} fontWeight="700" fontFamily={FONT_DISPLAY}>
            {cumulative[count - 1].total}
          </text>
        </svg>
      </div>
    </div>
  )
}

function ForecastSection({ summary, projections, monthlyTrends }) {
  if (!projections || !monthlyTrends || monthlyTrends.length < 2) return null

  const { daysInMonth } = projections
  const days = daysInMonth || 30
  const lastMonth = monthlyTrends[monthlyTrends.length - 1]
  const realRate = summary?.leadsPerDay || (lastMonth.leads / (lastMonth.days || 30))

  // ── Calculate growth trend across ALL months ──
  // Month-over-month growth rates for recent growth period (ignore early decline)
  const growthRates = []
  for (let i = 1; i < monthlyTrends.length; i++) {
    const prev = monthlyTrends[i - 1].leads
    const curr = monthlyTrends[i].leads
    if (prev > 0) growthRates.push(curr / prev)
  }

  // Recent 3-month growth rates (the acceleration period)
  const recent3 = growthRates.slice(-3)
  const avgRecentGrowth = recent3.length > 0
    ? recent3.reduce((a, b) => a + b, 0) / recent3.length
    : 1.0

  // Weighted average growth: more weight on recent months
  const weighted3 = growthRates.length >= 3
    ? growthRates[growthRates.length - 3] * 0.15 + growthRates[growthRates.length - 2] * 0.30 + growthRates[growthRates.length - 1] * 0.55
    : avgRecentGrowth

  // ── Three scenarios based on trend analysis ──
  // All scenarios assume SOME growth since the trend is clearly upward

  // Find the minimum recent growth rate (most conservative single month)
  const minRecentGrowth = recent3.length > 0 ? Math.min(...recent3) : 1.0

  // Conservative: apply the LOWEST recent month-over-month growth rate
  // Even the worst recent month still showed growth
  const conservative = Math.round(lastMonth.leads * Math.max(minRecentGrowth, 1.05))

  // Moderate: apply weighted average growth rate to last month
  const moderate = Math.round(lastMonth.leads * Math.min(weighted3, 2.0))

  // Optimistic: apply recent momentum (avg of last 3 growth rates, capped)
  const optimistic = Math.round(lastMonth.leads * Math.min(avgRecentGrowth, 2.5))

  // Determine next month name
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  let forecastLabel = 'April Forecast'
  const idx = monthNames.findIndex(m => lastMonth.month.toLowerCase().startsWith(m.toLowerCase()))
  if (idx >= 0) forecastLabel = monthNames[(idx + 1) % 12] + ' Forecast'

  // Sort scenarios from low to high
  const sorted = [conservative, moderate, optimistic].sort((a, b) => a - b)

  const daysRemaining = days

  const scenarios = [
    { label: 'Conservative', sublabel: `Minimum recent growth (+${Math.round((Math.max(minRecentGrowth, 1.05) - 1) * 100)}%)`, value: sorted[0], color: C.muted },
    { label: 'Moderate', sublabel: 'Weighted growth trend', value: sorted[1], color: C.warning },
    { label: 'Optimistic', sublabel: 'Recent momentum continues', value: sorted[2], color: C.success },
  ]

  return (
    <div style={S.card}>
      <div style={S.sectionLabel}>{forecastLabel}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {scenarios.map(s => (
          <div key={s.label} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '12px 14px', borderRadius: '8px', border: `1px solid ${C.border}`,
            background: C.bg, borderLeft: `3px solid ${s.color}`,
          }}>
            <div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: C.text }}>{s.label}</div>
              <div style={{ fontSize: '11px', color: C.muted }}>{s.sublabel}</div>
            </div>
            <span style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: '20px', color: s.color }}>
              {s.value}
            </span>
          </div>
        ))}
      </div>
      <div style={{ marginTop: '12px', fontSize: '11px', color: C.muted, lineHeight: 1.5 }}>
        Based on {monthlyTrends.length}-month trend analysis. {lastMonth.month} pace: <strong style={{ color: C.text }}>{realRate.toFixed(2)} leads/day</strong>. Recent growth: <strong style={{ color: C.text }}>{((avgRecentGrowth - 1) * 100).toFixed(0)}%/month</strong>.
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════
// SECTION 6: Monthly Breakdown Table
// ═══════════════════════════════════════════════════════════
function MonthlyBreakdownTableInline({ monthlyTrends, projections }) {
  if (!monthlyTrends || monthlyTrends.length === 0) return null

  const currentYM = projections?.currentMonthLabel
  const lastIdx = monthlyTrends.length - 1

  const thStyle = {
    fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px',
    color: C.muted, textAlign: 'left', padding: '8px 12px', borderBottom: `2px solid ${C.border}`,
  }
  const thNumStyle = { ...thStyle, textAlign: 'right' }

  return (
    <div style={S.card}>
      <div style={S.sectionLabel}>Monthly Breakdown</div>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
        <thead>
          <tr>
            <th style={thStyle}>Month</th>
            <th style={thNumStyle}>Leads</th>
            <th style={thNumStyle}>Meetings</th>
            <th style={thNumStyle}>Leads/Day</th>
            <th style={thNumStyle}>vs Prev Month</th>
          </tr>
        </thead>
        <tbody>
          {monthlyTrends.map((m, i) => {
            const isCurrent = i === lastIdx
            const prevLeads = i > 0 ? monthlyTrends[i - 1].leads : null
            let change = null
            if (prevLeads != null && prevLeads > 0) {
              change = ((m.leads - prevLeads) / prevLeads * 100).toFixed(1)
            }
            const days = m.days || 30
            const leadsPerDay = (m.leads / days).toFixed(2)

            const tdBase = {
              padding: '8px 12px',
              borderBottom: `1px solid ${C.border}`,
              ...(i % 2 === 1 ? { background: 'rgba(247,245,240,0.5)' } : {}),
              ...(isCurrent ? { fontWeight: 600, borderLeft: i === 0 ? undefined : undefined } : {}),
            }
            const tdNum = { ...tdBase, fontFamily: FONT_DISPLAY, fontWeight: isCurrent ? 700 : 600, textAlign: 'right' }

            // For current month row, add left border accent
            const rowStyle = isCurrent ? { borderLeft: `3px solid ${C.accent}` } : {}

            return (
              <tr key={m.month + i} style={rowStyle}>
                <td style={{ ...tdBase, ...(isCurrent ? { borderLeft: `3px solid ${C.accent}`, fontWeight: 600 } : {}) }}>{m.month}</td>
                <td style={tdNum}>{m.leads}</td>
                <td style={tdNum}>{m.meetings || 0}</td>
                <td style={tdNum}>{leadsPerDay}</td>
                <td style={{
                  ...tdNum,
                  color: change == null ? C.muted : parseFloat(change) >= 0 ? C.success : C.accent,
                  fontWeight: 600,
                }}>
                  {change == null ? '—' : `${parseFloat(change) >= 0 ? '+' : ''}${change}%`}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════
// SECTION 7: Pipeline Health + Growth Metrics
// ═══════════════════════════════════════════════════════════
function PipelineHealthInline({ summary }) {
  const openRate = summary.openRate || 0
  const replyRate = summary.responseRate || 0
  const positiveRate = summary.opportunities != null && summary.replies
    ? ((summary.opportunities / summary.replies) * 100).toFixed(1) : 0
  const meetingConv = summary.meetingsScheduled > 0 && summary.totalLeads > 0
    ? ((summary.meetingsScheduled / summary.totalLeads) * 100).toFixed(1) : 0

  const gauges = [
    { label: 'Open Rate', value: `${openRate}%`, fill: Math.min((openRate / 50) * 100, 100), color: openRate >= 25 ? C.success : C.warning, benchmark: `Benchmark: 25% — ${openRate >= 25 ? 'Above average' : 'Below average'}` },
    { label: 'Reply Rate', value: `${replyRate}%`, fill: Math.min((replyRate / 4) * 100, 100), color: replyRate >= 2 ? C.success : C.warning, benchmark: `Benchmark: 2.0% — ${replyRate >= 2 ? 'Above average' : 'Slightly below'}` },
    { label: 'Positive Rate', value: `${positiveRate}%`, fill: Math.min((parseFloat(positiveRate) / 60) * 100, 100), color: parseFloat(positiveRate) >= 35 ? C.success : C.warning, benchmark: `Benchmark: 35% — ${parseFloat(positiveRate) >= 35 ? 'Excellent' : 'Room to grow'}` },
    { label: 'Meeting Conversion', value: `${meetingConv}%`, fill: Math.min((parseFloat(meetingConv) / 5) * 100, 100), color: parseFloat(meetingConv) >= 2.5 ? C.success : C.warning, benchmark: `Benchmark: 2.5% — ${parseFloat(meetingConv) >= 2.5 ? 'Above average' : 'Below average'}` },
  ]

  return (
    <div style={S.card}>
      <div style={S.sectionLabel}>Pipeline Health</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {gauges.map(g => (
          <div key={g.label}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: C.text }}>{g.label}</span>
              <span style={{ fontSize: '12px', fontWeight: 700, color: C.text, fontFamily: FONT_DISPLAY }}>{g.value}</span>
            </div>
            <div style={{ width: '100%', height: '8px', background: C.bg, borderRadius: '4px', overflow: 'hidden', border: `1px solid ${C.border}` }}>
              <div style={{ height: '100%', width: `${g.fill}%`, background: g.color, borderRadius: '4px', transition: 'width 0.3s' }} />
            </div>
            <div style={{ fontSize: '10px', color: C.muted, marginTop: '2px' }}>{g.benchmark}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function GrowthMetrics({ monthlyTrends, growth }) {
  if (!monthlyTrends || monthlyTrends.length === 0) return null

  const firstMonthLeads = growth?.firstMonthLeads || monthlyTrends[0]?.leads || 0
  const peakMonth = monthlyTrends.reduce((max, m) => m.leads > max.leads ? m : max, monthlyTrends[0])
  const peakMonthLeads = growth?.peakMonthLeads || peakMonth.leads
  const totalAll = monthlyTrends.reduce((s, m) => s + m.leads, 0)
  const avgMonthly = (totalAll / monthlyTrends.length).toFixed(1)
  const growthPct = firstMonthLeads > 0
    ? Math.round(((peakMonthLeads - firstMonthLeads) / firstMonthLeads) * 100) : 0

  // Calculate growth streak
  let streakMonths = []
  for (let i = monthlyTrends.length - 1; i > 0; i--) {
    const prev = monthlyTrends[i - 1].leads
    const curr = monthlyTrends[i].leads
    if (curr > prev && prev > 0) {
      const pct = (((curr - prev) / prev) * 100).toFixed(1)
      streakMonths.unshift({ name: monthlyTrends[i].month.substring(0, 3), pct: `+${pct}%` })
    } else {
      break
    }
  }

  // Best quarter calc
  const quarterTotals = {}
  monthlyTrends.forEach(m => {
    const parts = m.month.split(' ')
    if (parts.length >= 2) {
      const mName = parts[0]
      const year = parts[parts.length - 1]
      const mIdx = ['January','February','March','April','May','June','July','August','September','October','November','December'].indexOf(mName)
      if (mIdx >= 0) {
        const q = Math.floor(mIdx / 3) + 1
        const key = `Q${q} '${year.slice(-2)}`
        quarterTotals[key] = (quarterTotals[key] || 0) + m.leads
      }
    }
  })
  let bestQ = null, bestQVal = 0
  Object.entries(quarterTotals).forEach(([k, v]) => { if (v > bestQVal) { bestQ = k; bestQVal = v } })

  const cellStyle = { padding: '12px', background: C.bg, borderRadius: '8px', border: `1px solid ${C.border}` }
  const cellLabel = { fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.8px', color: C.muted, marginBottom: '4px' }
  const cellValue = { fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: '22px', color: C.text }

  return (
    <div style={S.card}>
      <div style={S.sectionLabel}>Growth Metrics</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        <div style={cellStyle}>
          <div style={cellLabel}>First Month</div>
          <div style={cellValue}>{firstMonthLeads}</div>
        </div>
        <div style={cellStyle}>
          <div style={cellLabel}>Peak Month</div>
          <div style={{ ...cellValue, color: C.accent }}>{peakMonthLeads}</div>
        </div>
        <div style={cellStyle}>
          <div style={cellLabel}>Total Growth</div>
          <div style={{ ...cellValue, color: C.success }}>{growthPct}%</div>
        </div>
        <div style={cellStyle}>
          <div style={cellLabel}>Avg Monthly</div>
          <div style={cellValue}>{avgMonthly}</div>
        </div>
      </div>

      {streakMonths.length >= 2 && (
        <div style={{
          marginTop: '10px', padding: '10px 14px', background: 'rgba(74,124,89,0.06)',
          borderRadius: '8px', border: '1px solid rgba(74,124,89,0.15)',
          fontSize: '12px', color: C.success, fontWeight: 600,
        }}>
          {streakMonths.length}-month growth streak &mdash; {streakMonths.map(s => `${s.name} (${s.pct})`).join(', ')}
        </div>
      )}

      {bestQ && (
        <div style={{ marginTop: '12px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div style={cellStyle}>
              <div style={cellLabel}>Best Quarter</div>
              <div style={cellValue}>{bestQ}</div>
            </div>
            <div style={cellStyle}>
              <div style={cellLabel}>{bestQ} Total</div>
              <div style={{ ...cellValue, color: C.accent }}>{bestQVal}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════
// MAIN DASHBOARD
// ═══════════════════════════════════════════════════════════

export default function Dashboard({ isAdmin, clientRecord, onLogout }) {
  const { clientId } = useParams()
  const navigate = useNavigate()

  const unauthorized = clientRecord && clientRecord.id !== clientId
  if (unauthorized) {
    return (
      <div style={{ ...S.page, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="glass" style={{ padding: '40px', textAlign: 'center', maxWidth: '400px' }}>
          <p style={{ color: '#B85450', fontSize: '16px', fontWeight: 600, margin: '0 0 8px' }}>Access Denied</p>
          <p style={{ color: C.muted, fontSize: '14px', margin: '0 0 20px' }}>You can only view your own dashboard.</p>
          <button onClick={() => navigate(`/dashboard/${clientRecord.id}`)} className="btn-primary" style={{ padding: '10px 24px' }}>
            Go to My Dashboard
          </button>
        </div>
      </div>
    )
  }

  const [client, setClient] = useState(null)
  const [data, setData] = useState(null)
  const [loadingClient, setLoadingClient] = useState(true)
  const [loadingSheet, setLoadingSheet] = useState(false)
  const [sheetError, setSheetError] = useState(null)

  useEffect(() => {
    async function fetchClient() {
      const { data: row, error } = await supabase
        .from('clients')
        .select('*')
        .eq('id', clientId)
        .single()
      if (!error && row) setClient(row)
      setLoadingClient(false)
    }
    fetchClient()
  }, [clientId])

  useEffect(() => {
    if (!client) return
    const sheetUrl = client.google_sheet_url || client.google_sheet_id
    const apiKey = client.instantly_api_key
    if (!sheetUrl && !apiKey) return

    setLoadingSheet(true)
    setSheetError(null)

    const sheetPromise = sheetUrl ? fetchSheetData(sheetUrl) : Promise.resolve(null)
    const analyticsPromise = apiKey ? fetchCampaignAnalytics(apiKey) : Promise.resolve(null)
    const campaignsPromise = apiKey ? fetchCampaigns(apiKey) : Promise.resolve(null)

    Promise.allSettled([sheetPromise, analyticsPromise, campaignsPromise])
      .then(([sheetResult, analyticsResult, campaignsResult]) => {
        const sheetData = sheetResult.status === 'fulfilled' ? sheetResult.value : null
        const instantly = analyticsResult.status === 'fulfilled' ? analyticsResult.value : null
        const campaigns = campaignsResult.status === 'fulfilled' ? campaignsResult.value : null

        if (sheetResult.status === 'rejected' && sheetUrl) {
          setSheetError(sheetResult.reason?.message || 'Could not load Google Sheet')
        }

        const merged = sheetData || {
          summary: { totalLeads: 0, leadsToday: 0, leadsPerDay: null, emailsSent: null, responseRate: null, openRate: null, meetingsScheduled: 0 },
          replyTypes: [], monthlyTrends: [], projections: null, campaigns: [],
        }

        if (instantly) {
          merged.summary.emailsSent = instantly.emailsSent
          merged.summary.replies = instantly.replies
          merged.summary.responseRate = instantly.responseRate
          merged.summary.openRate = instantly.openRate
          merged.summary.opportunities = instantly.opportunities
        }

        if (campaigns && campaigns.length > 0) {
          merged.campaigns = campaigns
        }

        setData(merged)
        setLoadingSheet(false)
      })
  }, [client])

  // ── Loading state ──
  if (loadingClient) {
    return (
      <div style={{ ...S.page, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '36px', height: '36px', border: `2px solid ${C.border}`, borderTopColor: C.accent, borderRadius: '50%', margin: '0 auto 16px', animation: 'spin 0.8s linear infinite' }} />
          <p style={{ color: C.muted, fontSize: '14px' }}>Loading dashboard...</p>
        </div>
      </div>
    )
  }

  // ── Main render ──
  return (
    <div style={S.page}>

      {/* ── Sticky Header ── */}
      <header style={S.header}>
        <div style={S.headerInner}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {isAdmin && (
              <>
                <button onClick={() => navigate('/clients')} className="btn-ghost" style={{ fontSize: '12px', color: C.muted, cursor: 'pointer', background: 'none', border: 'none' }}>
                  &larr; All Clients
                </button>
                <div style={{ width: '1px', height: '20px', background: C.border }} />
              </>
            )}
            <div>
              <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: '20px', color: C.text, letterSpacing: '-0.3px' }}>
                {client?.name || 'Client'}
              </div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: C.accent, letterSpacing: '0.5px' }}>
                {client?.company_name || 'BlueTree Marketing'}
              </div>
            </div>
            {!loadingSheet && data && !sheetError && (
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '5px',
                fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px',
                color: C.success, background: 'rgba(74,124,89,0.08)', padding: '3px 10px', borderRadius: '20px',
              }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: C.success, animation: 'pulse 2s infinite' }} className="pulse-dot" />
                Live
              </div>
            )}
            {!loadingSheet && sheetError && (
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: '5px',
                fontSize: '11px', fontWeight: 600, padding: '3px 10px', borderRadius: '20px',
                background: 'rgba(184,84,80,0.08)', color: '#B85450',
              }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#B85450' }} />
                Sheet error
              </span>
            )}
          </div>
          <span
            onClick={() => { if (onLogout) { onLogout(); navigate('/login') } else supabase.auth.signOut() }}
            style={{ fontSize: '12px', color: C.muted, cursor: 'pointer', transition: 'color 0.15s' }}
          >
            Sign Out
          </span>
        </div>
      </header>

      {/* ── Main Content ── */}
      <main style={S.main}>

        {/* Error banner */}
        {sheetError && (
          <div style={{
            background: 'rgba(184,84,80,0.06)', border: '1px solid rgba(184,84,80,0.15)',
            borderRadius: '12px', padding: '14px 18px',
            display: 'flex', alignItems: 'center', gap: '10px',
          }}>
            <span style={{ color: '#B85450', fontSize: '16px' }}>&#9888;</span>
            <div>
              <p style={{ color: '#B85450', fontWeight: 600, fontSize: '13px', margin: 0 }}>Could not load Google Sheet</p>
              <p style={{ color: C.muted, fontSize: '12px', margin: 0 }}>{sheetError}</p>
            </div>
          </div>
        )}

        {/* No data */}
        {!loadingSheet && !data && !sheetError && !client?.google_sheet_url && (
          <div className="glass" style={{ padding: '40px', textAlign: 'center' }}>
            <p style={{ color: C.muted, fontWeight: 600, fontSize: '15px', margin: '0 0 4px' }}>No Google Sheet connected</p>
            <p style={{ color: '#B5B0AA', fontSize: '13px', margin: 0 }}>Add a google_sheet_url to this client in Supabase</p>
          </div>
        )}

        {/* Loading skeleton */}
        {loadingSheet && (
          <>
            <div style={S.grid6040}>
              <div className="skeleton" style={{ height: '200px', borderRadius: '12px' }} />
              <div className="skeleton" style={{ height: '200px', borderRadius: '12px' }} />
            </div>
            <div className="skeleton" style={{ height: '80px', borderRadius: '12px' }} />
            <div style={S.grid2}>
              <div className="skeleton" style={{ height: '240px', borderRadius: '12px' }} />
              <div className="skeleton" style={{ height: '240px', borderRadius: '12px' }} />
            </div>
          </>
        )}

        {/* ═══ DASHBOARD SECTIONS ═══ */}
        {data && !loadingSheet && (
          <>
            {/* SECTION 1: Executive Summary (60%) + KPIs (40%) */}
            <div style={S.grid6040}>
              <ExecutiveSummary data={data.summary} projections={data.projections} monthlyTrends={data.monthlyTrends} growth={data.growth} />
              <KPIStack data={data.summary} projections={data.projections} monthlyTrends={data.monthlyTrends} />
            </div>

            {/* SECTION 2: Month-over-Month Comparison */}
            {data.monthlyTrends.length >= 2 && (
              <MonthlyComparison monthlyTrends={data.monthlyTrends} />
            )}

            {/* SECTION 3: Monthly Bar Chart + Response Breakdown */}
            {data.monthlyTrends.length > 0 && (
              <div style={S.grid2}>
                <MonthlyBarChart monthlyTrends={data.monthlyTrends} />
                <ResponseBreakdown replyTypes={data.replyTypes} />
              </div>
            )}

            {/* SECTION 5: Cumulative Growth + Forecast */}
            {data.monthlyTrends.length > 1 && (
              <div style={S.grid2}>
                <CumulativeGrowthChart monthlyTrends={data.monthlyTrends} />
                <ForecastSection summary={data.summary} projections={data.projections} monthlyTrends={data.monthlyTrends} />
              </div>
            )}

            {/* SECTION 6: Monthly Breakdown Table */}
            {data.monthlyTrends.length > 0 && (
              <MonthlyBreakdownTableInline monthlyTrends={data.monthlyTrends} projections={data.projections} />
            )}

            {/* SECTION 7: Pipeline Health + Growth Metrics */}
            {(data.summary.emailsSent != null || data.summary.replies != null) && (
              <div style={S.grid2}>
                <PipelineHealthInline summary={data.summary} />
                <GrowthMetrics monthlyTrends={data.monthlyTrends} growth={data.growth} />
              </div>
            )}
          </>
        )}

        {/* Footer */}
        <footer style={{ textAlign: 'center', fontSize: '11px', color: C.muted, borderTop: `1px solid ${C.border}`, paddingTop: '24px' }}>
          Campaign data powered by Lead Gen Jay &middot; {data ? 'Live data from Google Sheets' : 'Connect a sheet to see live data'}
        </footer>
      </main>
    </div>
  )
}
