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
  if (t.includes('meeting') || t.includes('call request') || t.includes('schedule')) {
    return 'Meeting Request'
  }
  if (t.includes('forward') || t.includes('escalat')) {
    return 'Forwarded Internally'
  }
  if (
    t.includes('interested') ||
    t.includes('soft interest') ||
    t.includes('keep in mind') ||
    t.includes('send info') ||
    t.includes('requesting more') ||
    t.includes('follow up') ||
    t.includes('high priority')
  ) {
    return 'Interested'
  }
  // Anything else (Other, Not Interested, etc.)
  return 'Other'
}

// Get YYYY-MM key from a YYYY-MM-DD date string
function yearMonth(dateStr) {
  if (!dateStr) return null
  const m = dateStr.match(/^(\d{4})-(\d{2})-\d{2}$/)
  return m ? `${m[1]}-${m[2]}` : null
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

  // Leads today
  const leadsToday = rows.filter(r => r._date === todayStr).length

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

  // Elapsed days = today's day-of-month; days left in current month
  const elapsedDays = currentDayOfMonth
  const daysLeft = Math.max(0, daysInCurrentMonth - elapsedDays)

  // Daily rate: use current month's own data if it has any,
  // otherwise fall back to the most recent past month's rate
  let dailyRate = 0
  if (currentMonthLeads > 0) {
    dailyRate = elapsedDays > 0 ? currentMonthLeads / elapsedDays : 0
  } else {
    const lastPastYM = sortedYMs.filter(ym => ym < currentYM).slice(-1)[0]
    if (lastPastYM) {
      const lastMonthLeads = byYM[lastPastYM] || 0
      const [y, m] = lastPastYM.split('-').map(Number)
      const daysInLastMonth = new Date(y, m, 0).getDate()
      const lastMonthDates = rows
        .filter(r => r._ym === lastPastYM && /^\d{4}-\d{2}-\d{2}$/.test(r._date))
        .map(r => new Date(r._date))
      const lastElapsedDays = lastMonthDates.length > 0
        ? new Date(Math.max(...lastMonthDates)).getDate()
        : daysInLastMonth
      dailyRate = lastElapsedDays > 0 ? lastMonthLeads / lastElapsedDays : 0
    }
  }

  const leadsProjected = Math.round(currentMonthLeads + dailyRate * daysLeft)
  const meetingsProjected = Math.max(
    currentMonthMeetings,
    Math.round(leadsProjected * (meetingsTotal / total || 0.05))
  )

  // Previous month = the most recent month before the current one
  const prevYM = sortedYMs.filter(ym => ym < currentYM).slice(-1)[0]
  const prevMonthLeads = prevYM ? (byYM[prevYM] || 0) : 0

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
    monthlyTrends,
    projections: {
      leadsActual: currentMonthLeads,
      leadsProjected: Math.max(leadsProjected, currentMonthLeads),
      meetingsActual: currentMonthMeetings,
      meetingsProjected,
      elapsedDays,
      daysInMonth: daysInCurrentMonth,
      dailyRate,
      prevMonthLeads,
      currentYM,
      currentMonthLabel,
    },
    campaigns: [],
  }
}
