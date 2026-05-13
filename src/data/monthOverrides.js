// Manual overrides for partial-month campaign windows.
// Use when sheet dates don't reflect the real campaign dates
// (e.g. all rows entered as "2026-04-01" but activity was actually Apr 28–30).
//
// Keyed by client ID (Supabase clients.id). Each override maps a year-month
// to { firstDay, lastDay } -- the dashboard will compute activeDays = (last - first + 1)
// and label the month as "(since <firstDay>)".

export const MONTH_OVERRIDES = {
  // Brian Rechtman — April 2026 campaigns activated on Apr 28
  'a6f95745-a971-4d0f-87a0-137d16bfd27a': {
    '2026-04': { firstDay: 28, lastDay: 30 },
  },
  // Cain McQuinley — April 2026 campaigns activated on Apr 28
  '47097ab6-0ca6-49ea-8d94-c8bdf9809048': {
    '2026-04': { firstDay: 28, lastDay: 30 },
  },
}

// Campaign activation date per client. When set, the dashboard banner totals
// all responses from this date forward (across multiple months) and labels
// the period as "desde la activación".
// Format: 'YYYY-MM-DD'
export const CAMPAIGN_ACTIVATIONS = {
  'a6f95745-a971-4d0f-87a0-137d16bfd27a': '2026-04-28', // Brian
  '47097ab6-0ca6-49ea-8d94-c8bdf9809048': '2026-04-28', // Cain
}

export function applyMonthOverride(monthlyTrends, clientId) {
  if (!clientId || !MONTH_OVERRIDES[clientId]) return monthlyTrends
  const overrides = MONTH_OVERRIDES[clientId]
  return monthlyTrends.map(m => {
    const o = overrides[m.ym]
    if (!o) return m
    const firstDay = o.firstDay ?? m.firstDay
    const lastDay = o.lastDay ?? m.lastDay
    const activeDays = (firstDay && lastDay) ? (lastDay - firstDay + 1) : m.activeDays
    return { ...m, firstDay, lastDay, activeDays }
  })
}

// Return cumulative response info since the activation date, spanning all
// months from activation onward. Total = sum of leads from activationYM to
// the latest month. Date range = activation day → last activity day in the
// most recent month with data.
export function computeSinceActivation(monthlyTrends, clientId) {
  const activation = CAMPAIGN_ACTIVATIONS[clientId]
  if (!activation || !monthlyTrends || monthlyTrends.length === 0) return null

  const [aYear, aMonth, aDay] = activation.split('-').map(Number)
  const activationYM = `${aYear}-${String(aMonth).padStart(2, '0')}`

  const fromActivation = monthlyTrends.filter(m => m.ym >= activationYM)
  if (fromActivation.length === 0) return null

  const total = fromActivation.reduce((s, m) => s + (m.leads || 0), 0)
  if (total === 0) return null

  const latest = fromActivation[fromActivation.length - 1]
  const [lYear, lMonth] = latest.ym.split('-').map(Number)
  const lastDay = latest.lastDay || latest.days

  const activationDate = new Date(aYear, aMonth - 1, aDay)
  const lastDate = new Date(lYear, lMonth - 1, lastDay)
  const days = Math.max(
    1,
    Math.round((lastDate - activationDate) / (1000 * 60 * 60 * 24)) + 1
  )

  return {
    total,
    days,
    firstDay: aDay,
    lastDay,
    activationYM,
    activationMonth: aMonth,
    activationDay: aDay,
    activationYear: aYear,
    lastMonth: lMonth,
    lastMonthYM: latest.ym,
    isCrossMonth: latest.ym !== activationYM,
  }
}
