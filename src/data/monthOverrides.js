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

// Return the activation-month info for the banner: count of leads in the
// activation month only (NOT cumulative across months) plus the partial-month
// active-day window.
export function computeSinceActivation(monthlyTrends, clientId) {
  const activation = CAMPAIGN_ACTIVATIONS[clientId]
  if (!activation || !monthlyTrends || monthlyTrends.length === 0) return null

  const [aYear, aMonth, aDay] = activation.split('-').map(Number)
  const activationYM = `${aYear}-${String(aMonth).padStart(2, '0')}`

  const activationMonthEntry = monthlyTrends.find(m => m.ym === activationYM)
  if (!activationMonthEntry || !activationMonthEntry.leads) return null

  const total = activationMonthEntry.leads
  const firstDay = activationMonthEntry.firstDay || aDay
  const lastDay = activationMonthEntry.lastDay || activationMonthEntry.days
  const days = (firstDay && lastDay) ? (lastDay - firstDay + 1) : (activationMonthEntry.activeDays || 1)

  return {
    total,
    days,
    firstDay,
    lastDay,
    activationYM,
    activationMonth: aMonth,
    activationDay: aDay,
    activationYear: aYear,
  }
}
