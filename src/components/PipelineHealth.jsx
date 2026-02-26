export default function PipelineHealth({ summary, projections }) {
  const { emailsSent, replies, opportunities, meetingsScheduled, leadsPerDay } = summary

  const replyRate     = emailsSent && replies ? ((replies / emailsSent) * 100).toFixed(2) : null
  const replyOppPct   = replies && opportunities ? ((opportunities / replies) * 100).toFixed(1) : null
  const oppMeetingPct = opportunities && meetingsScheduled ? ((meetingsScheduled / opportunities) * 100).toFixed(1) : null
  const emailsPerOpp  = opportunities && emailsSent ? Math.round(emailsSent / opportunities) : null

  // Leads to next meeting
  const leadsPerMeeting = opportunities && meetingsScheduled ? Math.round(opportunities / meetingsScheduled) : null
  const { totalLeads } = summary
  const leadsToNext = leadsPerMeeting && totalLeads != null
    ? leadsPerMeeting - (totalLeads % leadsPerMeeting) || leadsPerMeeting
    : null

  // March projected meetings
  const marchConservative = leadsPerDay ? Math.round(leadsPerDay * 31) : null
  const meetingConvRate   = oppMeetingPct ? parseFloat(oppMeetingPct) / 100 : 0.05
  const marchMeetings     = marchConservative ? Math.round(marchConservative * meetingConvRate) : null

  const metrics = [
    {
      value: replyRate != null ? `${replyRate}%` : '—',
      label: 'Reply Rate',
      color: '#a78bfa',
      desc: `${replies?.toLocaleString() ?? '—'} replies from ${emailsSent?.toLocaleString() ?? '—'} emails. Industry benchmark: 0.5–1%`,
    },
    {
      value: replyOppPct != null ? `${replyOppPct}%` : '—',
      label: 'Reply → Opportunity',
      color: '#2ecc71',
      desc: `Nearly 1 in ${replyOppPct ? Math.round(100 / parseFloat(replyOppPct)) : '?'} replies becomes a qualified opportunity`,
    },
    {
      value: oppMeetingPct != null ? `${oppMeetingPct}%` : '—',
      label: 'Opp → Meeting',
      color: '#fbbf24',
      desc: `${meetingsScheduled ?? '—'} meeting requests from ${opportunities ?? '—'} opportunities`,
    },
    {
      value: leadsToNext != null ? `~${leadsToNext}` : '—',
      label: 'Leads to Next Meeting',
      color: '#4a90d9',
      desc: `Estimated leads needed until the next meeting request at current conversion rate`,
    },
    {
      value: emailsPerOpp != null ? emailsPerOpp.toLocaleString() : '—',
      label: 'Emails / Opportunity',
      color: '#2dd4bf',
      desc: `Cost to generate 1 qualified lead. Use this to plan list size for target outcomes`,
    },
    {
      value: marchMeetings != null ? `~${marchMeetings}` : '—',
      label: 'Projected March Meetings',
      color: '#2ecc71',
      desc: `Estimated meeting requests in March based on forecasted leads × ${(meetingConvRate * 100).toFixed(0)}% conversion`,
    },
  ]

  return (
    <div style={{ background: '#16213e', border: '1px solid #2a2d4a', borderRadius: '16px', padding: '32px' }}>
      {/* Instantly badge */}
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: '6px',
        background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.2)',
        borderRadius: '8px', padding: '5px 12px',
        fontSize: '11px', color: '#fbbf24', fontWeight: 600, marginBottom: '20px',
      }}>
        ⚡ Instantly + live sheet data
      </div>

      <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '20px', fontWeight: 600, color: '#fff', marginBottom: '6px' }}>
        Pipeline Health
      </h2>
      <p style={{ color: '#a0a8b8', fontSize: '13px', marginBottom: '24px' }}>
        Key conversion metrics across the full outreach funnel
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
        {metrics.map(m => (
          <div key={m.label} style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid #2a2d4a',
            borderRadius: '12px', padding: '18px 16px', textAlign: 'center',
          }}>
            <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '28px', fontWeight: 700, color: m.color }}>
              {m.value}
            </div>
            <div style={{ fontSize: '11px', color: '#a0a8b8', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600, marginTop: '4px' }}>
              {m.label}
            </div>
            <div style={{ fontSize: '11px', color: '#a0a8b8', marginTop: '6px', lineHeight: 1.5 }}>
              {m.desc}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
