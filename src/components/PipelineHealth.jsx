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
      color: '#8B5CF6',
      desc: `${replies?.toLocaleString() ?? '—'} replies from ${emailsSent?.toLocaleString() ?? '—'} emails. Industry benchmark: 0.5–1%`,
    },
    {
      value: replyOppPct != null ? `${replyOppPct}%` : '—',
      label: 'Reply → Opportunity',
      color: '#10B981',
      desc: `Nearly 1 in ${replyOppPct ? Math.round(100 / parseFloat(replyOppPct)) : '?'} replies becomes a qualified opportunity`,
    },
    {
      value: oppMeetingPct != null ? `${oppMeetingPct}%` : '—',
      label: 'Opp → Meeting',
      color: '#F59E0B',
      desc: `${meetingsScheduled ?? '—'} meeting requests from ${opportunities ?? '—'} opportunities`,
    },
    {
      value: leadsToNext != null ? `~${leadsToNext}` : '—',
      label: 'Leads to Next Meeting',
      color: '#3B82F6',
      desc: `Estimated leads needed until the next meeting request at current conversion rate`,
    },
    {
      value: emailsPerOpp != null ? emailsPerOpp.toLocaleString() : '—',
      label: 'Emails / Opportunity',
      color: '#14B8A6',
      desc: `Cost to generate 1 qualified lead. Use this to plan list size for target outcomes`,
    },
    {
      value: marchMeetings != null ? `~${marchMeetings}` : '—',
      label: 'Projected March Meetings',
      color: '#10B981',
      desc: `Estimated meeting requests in March based on forecasted leads × ${(meetingConvRate * 100).toFixed(0)}% conversion`,
    },
  ]

  return (
    <div className="glass" style={{ padding: '28px' }}>
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: '6px',
        background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.12)',
        borderRadius: '8px', padding: '4px 12px',
        fontSize: '11px', color: '#F59E0B', fontWeight: 600, marginBottom: '18px',
      }}>
        ⚡ Instantly + live sheet data
      </div>

      <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', marginBottom: '4px', letterSpacing: '-0.3px' }}>
        Pipeline Health
      </h2>
      <p style={{ color: '#525252', fontSize: '13px', marginBottom: '24px' }}>
        Key conversion metrics across the full outreach funnel
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
        {metrics.map(m => (
          <div key={m.label} style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.04)',
            borderRadius: '14px', padding: '18px 16px', textAlign: 'center',
            transition: 'all 0.2s',
          }}>
            <div style={{ fontSize: '26px', fontWeight: 800, color: m.color, letterSpacing: '-0.5px' }}>
              {m.value}
            </div>
            <div style={{ fontSize: '10px', color: '#525252', textTransform: 'uppercase', letterSpacing: '1.5px', fontWeight: 600, marginTop: '4px' }}>
              {m.label}
            </div>
            <div style={{ fontSize: '11px', color: '#A3A3A3', marginTop: '8px', lineHeight: 1.5 }}>
              {m.desc}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
