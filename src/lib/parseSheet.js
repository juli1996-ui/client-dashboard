// ─────────────────────────────────────────────────────────
// Google Sheets CSV parser
// Sheet format: Month | Response Date | Lead Name | Email |
//               Job Title | Organization | Response Summary | Response Type
// ─────────────────────────────────────────────────────────

// Spanish month name → month number (1-12)
const ES_TO_NUM = {
  enero: 1, febrero: 2, marzo: 3, abril: 4, mayo: 5, junio: 6,
  julio: 7, agosto: 8, septiembre: 9, octubre: 10, noviembre: 11, diciembre: 12,
}

// Month number → short display label
const NUM_TO_LABEL = {
  1: 'Jan', 2: 'Feb', 3: 'Mar', 4: 'Apr', 5: 'May', 6: 'Jun',
  7: 'Jul', 8: 'Aug', 9: 'Sep', 10: 'Oct', 11: 'Nov', 12: 'Dec',
}

// ── Utilities ─────────────────────────────────────────────

export function extractSheetId(url) {
  if (!url) return null
  const m = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/)
  return m ? m[1] : null
}

export function buildCsvUrl(sheetUrl) {
  const id = extractSheetId(sheetUrl)
  if (!id) return null
  const gid = (sheetUrl.match(/[#?&]gid=(\d+)/) || [])[1] || '0'
  return `https://docs.google.com/spreadsheets/d/${id}/gviz/tq?tqx=out:csv&gid=${gid}&t=${Date.now()}`
}

// CSV line splitter — handles quoted fields with commas inside
function splitLine(line) {
  const out = []; let cur = ''; let q = false
  for (const c of line) {
    if (c === '"') { q = !q }
    else if (c === ',' && !q) { out.push(cur.trim()); cur = '' }
    else { cur += c }
  }
  out.push(cur.trim())
  return out
}

// Normalize Response Type to 4 standard buckets
function normalizeType(raw) {
  const t = (raw || '').toLowerCase()
  if (t.includes('meeting') || t.includes('call request') || t.includes('schedule') || t.includes('requesting visit') || t.includes('requesting demo')) {
    return 'Meeting Request'
  }
  if (t.includes('forward') || t.includes('escalat') || t.includes('referral') || t.includes('evaluate internally')) {
    return 'Forwarded Internally'
  }
  if (
    t.includes('interested') ||
    t.includes('interest') ||
    t.includes('soft interest') ||
    t.includes('keep in mind') ||
    t.includes('send info') ||
    t.includes('requesting more') ||
    t.includes('request additional') ||
    t.includes('needs more info') ||
    t.includes('follow up') ||
    t.includes('high priority') ||
    t.includes('confirmed') ||
    t.includes('provided contact') ||
    t.includes('ready for handoff') ||
    t.includes('already familiar')
  ) {
    return 'Interested'
  }
  // Anything else (Other, Not Interested, etc.)
  return 'Other'
}

// English month abbreviation → month number
const EN_ABBR_TO_NUM = {
  jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6,
  jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12,
}

// Parse date string into { year, month, day } or null
// Supports: "YYYY-MM-DD", "Nov-21-2025", "Jan 27-2026", "Mar-4-2026"
function parseDate(dateStr) {
  if (!dateStr) return null

  // YYYY-MM-DD
  const iso = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (iso) return { year: iso[1], month: iso[2], day: iso[3] }

  // Mon-DD-YYYY or Mon DD-YYYY (e.g. "Nov-21-2025", "Jan 27-2026", "Mar-4-2026")
  const eng = dateStr.match(/^([A-Za-z]{3})[\s-]+(\d{1,2})[\s-]+(\d{4})$/)
  if (eng) {
    const mNum = EN_ABBR_TO_NUM[eng[1].toLowerCase()]
    if (mNum) return { year: eng[3], month: String(mNum).padStart(2, '0'), day: String(eng[2]).padStart(2, '0') }
  }

  return null
}

// Get YYYY-MM key from a date string
function yearMonth(dateStr) {
  const d = parseDate(dateStr)
  return d ? `${d.year}-${d.month}` : null
}

// Get YYYY-MM-DD key from a date string
function fullDate(dateStr) {
  const d = parseDate(dateStr)
  return d ? `${d.year}-${d.month}-${d.day}` : null
}

// Parse year-month from Spanish month name using the date for the year
function monthNumFromSpanish(name) {
  return ES_TO_NUM[(name || '').toLowerCase().trim()] || null
}

// ── Main fetch ────────────────────────────────────────────

export async function fetchSheetData(sheetUrl) {
  const csvUrl = buildCsvUrl(sheetUrl)
  if (!csvUrl) throw new Error('Invalid Google Sheet URL')

  const resp = await fetch(csvUrl, { cache: 'no-store' })
  if (!resp.ok) {
    throw new Error(
      `Cannot load sheet (HTTP ${resp.status}). Make sure it is shared as "Anyone with the link can view".`
    )
  }

  const text = await resp.text()
  const rows = parseCSV(text)

  if (rows.length === 0) {
    throw new Error('The sheet appears to be empty. Check the sheet is accessible and has data.')
  }

  return calculateMetrics(rows)
}

// ── CSV Parser ────────────────────────────────────────────

function parseCSV(text) {
  const lines = text.split('\n').filter(l => l.trim())
  if (lines.length < 2) return []

  const rawHeaders = splitLine(lines[0])
  const headers = rawHeaders.map(h => h.replace(/^"|"$/g, '').trim())

  // Find column indices by name
  const idx = (names) => {
    for (const name of names) {
      const i = headers.findIndex(h => h.toLowerCase().replace(/\s+/g, ' ') === name.toLowerCase())
      if (i >= 0) return i
    }
    return -1
  }

  const monthCol   = idx(['month', 'mes'])
  const dateCol    = idx(['response date', 'date', 'fecha'])
  const typeCol    = idx(['response type', 'type', 'tipo'])

  const rows = []

  for (let i = 1; i < lines.length; i++) {
    const vals = splitLine(lines[i]).map(v => v.replace(/^"|"$/g, '').trim())
    if (vals.every(v => !v)) continue // skip empty rows

    const monthName = monthCol >= 0 ? vals[monthCol] : vals[0]
    const dateStr   = dateCol  >= 0 ? vals[dateCol]  : ''
    const rawType   = typeCol  >= 0 ? vals[typeCol]  : ''

    // Determine year-month for chronological sorting
    // Prefer using the actual date; fall back to month name + year from date
    let ym = yearMonth(dateStr)
    if (!ym) {
      const mNum = monthNumFromSpanish(monthName)
      if (mNum) {
        // Guess year from date string or default to current year
        const yearMatch = dateStr.match(/(\d{4})/)
        const year = yearMatch ? yearMatch[1] : new Date().getFullYear()
        ym = `${year}-${String(mNum).padStart(2, '0')}`
      }
    }

    rows.push({
      _ym:   ym,                         // "2025-08"
      _date: dateStr,
      _type: normalizeType(rawType),
      _rawType: rawType || 'Other',
      _monthName: monthName,
    })
  }

  return rows
}

// ── Metrics ───────────────────────────────────────────────

function calculateMetrics(rows) {
  const total = rows.length

  // Current date info
  const now = new Date()
  const todayStr = now.toISOString().slice(0, 10)
  const currentYear = now.getFullYear()
  const currentMonth = now.getMonth() + 1
  const currentYM = `${currentYear}-${String(currentMonth).padStart(2, '0')}`
  const currentDayOfMonth = now.getDate()
  const daysInCurrentMonth = new Date(currentYear, currentMonth, 0).getDate()

  // Leads today — compare normalized dates
  const leadsToday = rows.filter(r => fullDate(r._date) === todayStr).length

  // Reply type counts
  const typeCounts = { Interested: 0, 'Meeting Request': 0, 'Forwarded Internally': 0, Other: 0 }
  rows.forEach(r => {
    if (r._type in typeCounts) typeCounts[r._type]++
    else typeCounts.Other++
  })
  const meetingsTotal = typeCounts['Meeting Request']

  // Group by year-month for chronological trends
  const byYM = {}
  const meetingsByYM = {}

  rows.forEach(r => {
    if (!r._ym) return
    byYM[r._ym] = (byYM[r._ym] || 0) + 1
    if (r._type === 'Meeting Request') {
      meetingsByYM[r._ym] = (meetingsByYM[r._ym] || 0) + 1
    }
  })

  // Sort year-months chronologically, exclude future months (no data should appear beyond today)
  const sortedYMs = Object.keys(byYM).sort().filter(ym => ym <= currentYM)

  const monthlyTrends = sortedYMs.map(ym => {
    const [year, monthStr] = ym.split('-')
    const mNum = parseInt(monthStr, 10)
    const label = NUM_TO_LABEL[mNum] || ym
    const daysInMonth = new Date(Number(year), mNum, 0).getDate()
    return {
      ym,                        // year-month key for comparison in the component
      month: label,
      leads: byYM[ym],
      meetings: meetingsByYM[ym] || 0,
      days: daysInMonth,
    }
  })

  // ── Projections always based on the ACTUAL current month ────────────────

  // Leads so far in current month (0 if current month has no data yet)
  const currentMonthLeads = byYM[currentYM] || 0
  const currentMonthMeetings = meetingsByYM[currentYM] || 0
  const currentMonthLabel = NUM_TO_LABEL[currentMonth]

  // Find the last activity date in the current month to detect campaign pauses
  const currentMonthDates = rows
    .filter(r => r._ym === currentYM)
    .map(r => {
      const d = parseDate(r._date)
      return d ? parseInt(d.day, 10) : 0
    })
    .filter(d => d > 0)
  const lastActiveDay = currentMonthDates.length > 0 ? Math.max(...currentMonthDates) : 0

  // If last activity was more than 7 days ago, campaign likely paused/ended — use active days for rate
  const campaignPaused = lastActiveDay > 0 && (currentDayOfMonth - lastActiveDay) > 7
  const activeDays = campaignPaused ? lastActiveDay : currentDayOfMonth

  // Elapsed days = active campaign days; days left in current month
  const elapsedDays = currentDayOfMonth
  const daysLeft = Math.max(0, daysInCurrentMonth - elapsedDays)

  // Daily rate: use active days (not calendar days) for accurate pace calculation
  let dailyRate = 0
  if (currentMonthLeads > 0) {
    dailyRate = activeDays > 0 ? currentMonthLeads / activeDays : 0
  } else {
    const lastPastYM = sortedYMs.filter(ym => ym < currentYM).slice(-1)[0]
    if (lastPastYM) {
      const lastMonthLeads = byYM[lastPastYM] || 0
      const [y, m] = lastPastYM.split('-').map(Number)
      const daysInLastMonth = new Date(y, m, 0).getDate()
      const lastMonthDates = rows
        .filter(r => r._ym === lastPastYM)
        .map(r => { const d = parseDate(r._date); return d ? parseInt(d.day, 10) : 0 })
        .filter(d => d > 0)
      const lastElapsedDays = lastMonthDates.length > 0
        ? Math.max(...lastMonthDates)
        : daysInLastMonth
      dailyRate = lastElapsedDays > 0 ? lastMonthLeads / lastElapsedDays : 0
    }
  }

  // "What if campaign continued" projection for full month at the active daily rate
  const leadsIfFullMonth = Math.round(dailyRate * daysInCurrentMonth)
  const leadsProjected = Math.round(currentMonthLeads + dailyRate * daysLeft)
  const meetingsProjected = Math.max(
    currentMonthMeetings,
    Math.round(leadsProjected * (meetingsTotal / total || 0.05))
  )

  // Previous month = the most recent month before the current one
  const prevYM = sortedYMs.filter(ym => ym < currentYM).slice(-1)[0]
  const prevMonthLeads = prevYM ? (byYM[prevYM] || 0) : 0

  // ── Growth metrics ────────────────────────────────────────
  const firstMonthLeads = monthlyTrends.length > 0 ? monthlyTrends[0].leads : 0
  const peakMonthLeads  = monthlyTrends.length > 0 ? Math.max(...monthlyTrends.map(m => m.leads)) : 0
  const peakMonth       = monthlyTrends.find(m => m.leads === peakMonthLeads)
  const growthPct       = firstMonthLeads > 0 ? Math.round(((peakMonthLeads - firstMonthLeads) / firstMonthLeads) * 100) : 0

  // Cumulative leads per month
  let cumulative = 0
  const monthlyTrendsWithCumulative = monthlyTrends.map(m => {
    cumulative += m.leads
    return { ...m, cumulative }
  })

  // ── Detailed response type breakdown (raw types, not normalized) ──
  const rawTypeCounts = {}
  rows.forEach(r => {
    const raw = r._rawType || 'Other'
    rawTypeCounts[raw] = (rawTypeCounts[raw] || 0) + 1
  })

  return {
    summary: {
      totalLeads: total,
      leadsToday,
      leadsPerDay: dailyRate > 0 ? Math.round(dailyRate * 10) / 10 : null,
      emailsSent: null,   // from Instantly, not in sheet
      responseRate: null, // from Instantly
      meetingsScheduled: meetingsTotal,
    },
    replyTypes: [
      { name: 'Interested', value: typeCounts['Interested'], color: '#10B981' },
      { name: 'Meeting Request', value: typeCounts['Meeting Request'], color: '#F59E0B' },
      { name: 'Forwarded Internally', value: typeCounts['Forwarded Internally'], color: '#8B5CF6' },
      { name: 'Other', value: typeCounts['Other'], color: '#6B7280' },
    ].filter(t => t.value > 0),
    monthlyTrends: monthlyTrendsWithCumulative,
    growth: {
      firstMonthLeads,
      peakMonthLeads,
      peakMonth: peakMonth?.month || '',
      growthPct,
      totalLeads: total,
      monthCount: monthlyTrends.length,
      firstMonth: monthlyTrends.length > 0 ? monthlyTrends[0].month : '',
    },
    projections: {
      leadsActual: currentMonthLeads,
      leadsProjected: Math.max(leadsProjected, currentMonthLeads),
      leadsIfFullMonth,
      meetingsActual: currentMonthMeetings,
      meetingsProjected,
      elapsedDays,
      activeDays,
      campaignPaused,
      lastActiveDay,
      daysInMonth: daysInCurrentMonth,
      dailyRate,
      prevMonthLeads,
      currentYM,
      currentMonthLabel,
    },
    campaigns: [],
  }
}
