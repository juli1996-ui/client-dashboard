// Manual overrides for partial-month campaign windows.
// Use when sheet dates don't reflect the real campaign dates
// (e.g. all rows entered as "2026-04-01" but activity was actually Apr 28–30).
//
// Keyed by client ID (Supabase clients.id). Each override maps a year-month
// to { firstDay, lastDay } -- the dashboard will compute activeDays = (last - first + 1)
// and label the month as "(since <firstDay>)".

export const MONTH_OVERRIDES = {
  // Brian Rechtman — April 2026 activity actually ran Apr 28-30
  'a6f95745-a971-4d0f-87a0-137d16bfd27a': {
    '2026-04': { firstDay: 28, lastDay: 30 },
  },
}

// Helper used by parseSheet caller to apply override after parsing
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
