// ─────────────────────────────────────────────────────────
// Instantly API v2 client
// Real field names confirmed via API test:
//   emails_sent_count, reply_count_unique, open_count_unique, total_opportunities
// ─────────────────────────────────────────────────────────

// In dev: Vite proxy rewrites /instantly-proxy → https://api.instantly.ai
// In prod: Netlify function handles /instantly-proxy/*
const BASE_URL = '/instantly-proxy/api/v2'

async function get(endpoint, apiKey, params = {}) {
  const url = new URL(BASE_URL + endpoint, window.location.origin)
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null) url.searchParams.set(k, v)
  })

  const resp = await fetch(url.toString(), {
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
  })

  if (!resp.ok) {
    const err = await resp.text()
    throw new Error(`Instantly API error (${resp.status}): ${err}`)
  }

  return resp.json()
}

// ── Aggregate totals across all campaigns ─────────────────
export async function fetchCampaignAnalytics(apiKey) {
  const data = await get('/campaigns/analytics', apiKey)
  const campaigns = Array.isArray(data) ? data : (data.data || data.campaigns || [])

  const totals = campaigns.reduce((acc, c) => ({
    sent:          acc.sent          + (c.emails_sent_count       || 0),
    opened:        acc.opened        + (c.open_count_unique       || 0),
    replied:       acc.replied       + (c.reply_count_unique      || 0),
    opportunities: acc.opportunities + (c.total_opportunities     || 0),
  }), { sent: 0, opened: 0, replied: 0, opportunities: 0 })

  return {
    emailsSent:    totals.sent,
    openRate:      totals.sent > 0 ? +((totals.opened  / totals.sent) * 100).toFixed(1) : null,
    responseRate:  totals.sent > 0 ? +((totals.replied / totals.sent) * 100).toFixed(2) : null,
    opportunities: totals.opportunities,
  }
}

// ── Per-campaign table data ────────────────────────────────
export async function fetchCampaigns(apiKey) {
  const data = await get('/campaigns/analytics', apiKey)
  const campaigns = Array.isArray(data) ? data : (data.data || data.campaigns || [])

  return campaigns
    .map(c => {
      const sent    = c.emails_sent_count  || 0
      const opened  = c.open_count_unique  || 0
      const replied = c.reply_count_unique || 0

      // Map status code to label
      const statusMap = { 1: 'Active', 2: 'Completed', 3: 'Paused', 4: 'Draft' }

      return {
        name:         c.campaign_name || 'Unnamed',
        status:       statusMap[c.campaign_status] || 'Unknown',
        emailsSent:   sent,
        emailsOpened: opened,
        replies:      replied,
        openRate:     sent > 0 ? +((opened  / sent) * 100).toFixed(1) : 0,
        replyRate:    sent > 0 ? +((replied / sent) * 100).toFixed(2) : 0,
      }
    })
    .filter(c => c.emailsSent > 0)
    .sort((a, b) => b.emailsSent - a.emailsSent)
}
