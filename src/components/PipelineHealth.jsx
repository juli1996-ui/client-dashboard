export default function PipelineHealth({ summary, projections }) {
  const { emailsSent, replies, opportunities, meetingsScheduled, leadsPerDay } = summary

  const replyRate     = emailsSent && replies ? ((replies / emailsSent) * 100).toFixed(2) : null
  const replyOppPct   = replies && opportunities ? ((opportunities / replies) * 100).toFixed(1) : null
  const oppMeetingPct = opportunities && meetingsScheduled ? ((meetingsScheduled / opportunities) * 100).toFixed(1) : null
  const emailsPerOpp  = opportunities && emailsSent ? Math.round(emailsSent / opportunities) : null

  const leadsPerMeeting = opportunities && meetingsScheduled ? Math.round(opportunities / meetingsScheduled) : null
  const { totalLeads } = summary
  const leadsToNext = leadsPerMeeting && totalLeads != null
    ? leadsPerMeeting - (totalLeads % leadsPerMeeting) || leadsPerMeeting
    : null

  const marchConservative = leadsPerDay ? Math.round(leadsPerDay * 31) : null
  const meetingConvRate   = oppMeetingPct ? parseFloat(oppMeetingPct) / 100 : 0.05
  const marchMeetings     = marchConservative ? Math.round(marchConservative * meetingConvRate) : null

  const metrics = [
    {
      value: replyRate != null ? `${replyRate}%` : '—',
      label: 'Reply Rate',
      color: '#C2653C',
      desc: `${replies?.toLocaleString() ?? '—'} replies from ${emailsSent?.toLocaleString() ?? '—'} emails. Industry benchmark: 0.5–1%`,
    },
    {
      value: replyOppPct != null ? `${replyOppPct}%` : '—',
      label: 'Reply → Opportunity',
      color: '#4A7C59',
      desc: `Nearly 1 in ${replyOppPct ? Math.round(100 / parseFloat(replyOppPct)) : '?'} replies becomes a qualified opportunity`,
    },
    {
      value: oppMeetingPct != null ? `${oppMeetingPct}%` : '—',
      label: 'Opp → Meeting',
      color: '#B8860B',
      desc: `${meetingsScheduled ?? '—'} meeting requests from ${opportunities ?? '—'} opportunities`,
    },
    {
      value: leadsToNext != null ? `~${leadsToNext}` : '—',
      label: 'Leads to Next Meeting',
      color: '#C2653C',
      desc: `Estimated leads needed until the next meeting request at current conversion rate`,
    },
    {
      value: emailsPerOpp != null ? emailsPerOpp.toLocaleString() : '—',
      label: 'Emails / Opportunity',
      color: '#8A8580',
      desc: `Cost to generate 1 qualified lead. Use this to plan list size for target outcomes`,
    },
    {
      value: marchMeetings != null ? `~${marchMeetings}` : '—',
      label: 'Projected March Meetings',
      color: '#4A7C59',
      desc: `Estimated meeting requests in March based on forecasted leads × ${(meetingConvRate * 100).toFixed(0)}% conversion`,
    },
  ]

  return (
    <div style={{ background: '#FFFFFF', border: '1px solid #E8E4DE', borderRadius: '16px', boxShadow: '0 1px 3px rgba(45,42,38,0.04)', padding: '28px' }}>
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: '6px',
        background: 'rgba(184,134,11,0.08)', border: '1px solid rgba(184,134,11,0.12)',
        borderRadius: '8px', padding: '4px 12px',
        fontSize: '11px', color: '#B8860B', fontWeight: 600, marginBottom: '18px',
      }}>
        ⚡ Instantly + live sheet data
      </div>

      <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#2D2A26', marginBottom: '4px', letterSpacing: '-0.3px' }}>
        Pipeline Health
      </h2>
      <p style={{ color: '#B5B0AA', fontSize: '13px', marginBottom: '24px' }}>
        Key conversion metrics across the full outreach funnel
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
        {metrics.map(m => (
          <div key={m.label} style={{
            background: '#FAF8F5',
            border: '1px solid #F0ECE6',
            borderRadius: '14px', padding: '18px 16px', textAlign: 'center',
            transition: 'all 0.2s',
          }}>
            <div style={{ fontSize: '26px', fontWeight: 800, color: m.color, letterSpacing: '-0.5px' }}>
              {m.value}
            </div>
            <div style={{ fontSize: '10px', color: '#B5B0AA', textTransform: 'uppercase', letterSpacing: '1.5px', fontWeight: 600, marginTop: '4px' }}>
              {m.label}
            </div>
            <div style={{ fontSize: '11px', color: '#8A8580', marginTop: '8px', lineHeight: 1.5 }}>
              {m.desc}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
