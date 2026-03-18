function pct(num, denom) {
  if (!denom || !num) return null
  return ((num / denom) * 100).toFixed(1)
}

const STEPS = [
  {
    key: 'emailsSent',
    label: 'Emails Sent',
    rateLabel: '100%',
    rateColor: '#3B82F6',
    bg: 'linear-gradient(135deg,rgba(59,130,246,0.15),rgba(59,130,246,0.06))',
    border: '1px solid rgba(59,130,246,0.15)',
  },
  {
    key: 'replies',
    label: 'Total Replies',
    rateColor: '#8B5CF6',
    bg: 'linear-gradient(135deg,rgba(139,92,246,0.15),rgba(139,92,246,0.06))',
    border: '1px solid rgba(139,92,246,0.15)',
  },
  {
    key: 'opportunities',
    label: 'Opportunities',
    rateColor: '#10B981',
    bg: 'linear-gradient(135deg,rgba(16,185,129,0.15),rgba(16,185,129,0.06))',
    border: '1px solid rgba(16,185,129,0.15)',
  },
  {
    key: 'meetingsScheduled',
    label: 'Meetings',
    rateColor: '#F59E0B',
    bg: 'linear-gradient(135deg,rgba(245,158,11,0.15),rgba(245,158,11,0.06))',
    border: '1px solid rgba(245,158,11,0.15)',
  },
]

const STATUS_DOT = {
  Active:    { color: '#10B981', pulse: true },
  Paused:    { color: '#F59E0B', pulse: false },
  Completed: { color: '#3B82F6', pulse: false },
  Draft:     { color: '#525252', pulse: false },
}

export default function CampaignFunnel({ summary, campaigns }) {
  const { emailsSent, replies, opportunities, meetingsScheduled } = summary
  const values = { emailsSent, replies, opportunities, meetingsScheduled }

  const rates = [
    { value: '100%', color: '#3B82F6' },
    { value: emailsSent ? `${pct(replies, emailsSent)}%` : null, color: '#8B5CF6', suffix: 'reply rate' },
    { value: replies    ? `${pct(opportunities, replies)}% of replies` : null, color: '#10B981' },
    { value: opportunities ? `${pct(meetingsScheduled, opportunities)}% of opps` : null, color: '#F59E0B' },
  ]

  const emailsPerOpp   = opportunities && emailsSent ? Math.round(emailsSent / opportunities) : null
  const leadsPerMeeting = meetingsScheduled && opportunities ? Math.round(opportunities / meetingsScheduled) : null
  const replyOppPct     = replies && opportunities ? pct(opportunities, replies) : null

  return (
    <div className="glass" style={{ padding: '28px' }}>
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: '6px',
        background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.12)',
        borderRadius: '8px', padding: '4px 12px',
        fontSize: '11px', color: '#F59E0B', fontWeight: 600, marginBottom: '18px',
      }}>
        ⚡ Instantly — live campaign data
      </div>

      <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', marginBottom: '4px', letterSpacing: '-0.3px' }}>
        Campaign Funnel Performance
      </h2>
      <p style={{ color: '#525252', fontSize: '13px', marginBottom: '24px' }}>
        {emailsSent ? `${emailsSent.toLocaleString()} emails sent` : 'Email data from Instantly'} — full-funnel conversion breakdown
      </p>

      {/* Horizontal funnel */}
      <div style={{ display: 'flex', alignItems: 'stretch', gap: '3px', minHeight: '90px', marginBottom: '20px' }}>
        {STEPS.map((step, i) => [
          <div key={step.key} style={{
            flex: 1, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            borderRadius: '12px', padding: '14px 8px',
            background: step.bg, border: step.border,
            textAlign: 'center',
            transition: 'all 0.2s',
          }}>
            <div style={{ fontSize: '22px', fontWeight: 800, color: '#fff', lineHeight: 1, letterSpacing: '-0.5px' }}>
              {values[step.key] != null ? values[step.key].toLocaleString() : '—'}
            </div>
            <div style={{ fontSize: '10px', color: '#525252', textTransform: 'uppercase', letterSpacing: '0.8px', fontWeight: 600, marginTop: '6px' }}>
              {step.label}
            </div>
            <div style={{ fontSize: '11px', fontWeight: 700, color: rates[i].color, marginTop: '4px' }}>
              {rates[i].value || '—'}
            </div>
          </div>,
          i < STEPS.length - 1 && (
            <div key={`arrow-${i}`} style={{
              display: 'flex', alignItems: 'center',
              color: 'rgba(255,255,255,0.1)', fontSize: '18px', flexShrink: 0, padding: '0 1px',
            }}>
              ›
            </div>
          ),
        ])}
      </div>

      {/* Quick stats */}
      {(emailsPerOpp || leadsPerMeeting || replyOppPct) && (
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '28px' }}>
          {emailsPerOpp && (
            <div style={{ fontSize: '12px', color: '#A3A3A3' }}>
              <strong style={{ color: '#fff' }}>{emailsPerOpp.toLocaleString()} emails</strong> per opportunity
            </div>
          )}
          {leadsPerMeeting && (
            <div style={{ fontSize: '12px', color: '#A3A3A3' }}>
              <strong style={{ color: '#fff' }}>1 meeting</strong> every ~{leadsPerMeeting} opportunities
            </div>
          )}
          {replyOppPct && (
            <div style={{ fontSize: '12px', color: '#A3A3A3' }}>
              <strong style={{ color: '#10B981' }}>Reply → Opp rate: {replyOppPct}%</strong> — strong qualifier
            </div>
          )}
        </div>
      )}

      {/* Active Campaigns */}
      {campaigns && campaigns.length > 0 && (
        <>
          <div style={{ fontSize: '11px', fontWeight: 600, color: '#525252', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '12px' }}>
            Campaigns
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            {campaigns.map((c, i) => {
              const dot = STATUS_DOT[c.status] || STATUS_DOT.Draft
              return (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.04)',
                  borderRadius: '10px', padding: '10px 14px',
                  transition: 'all 0.15s',
                }}>
                  <div style={{
                    width: '6px', height: '6px', borderRadius: '50%',
                    background: dot.color, flexShrink: 0,
                  }} />
                  <div>
                    <div style={{ fontSize: '12px', color: '#fff', fontWeight: 500, lineHeight: 1.3 }}>
                      {c.name}
                    </div>
                    <div style={{ fontSize: '10px', color: '#525252', marginTop: '2px' }}>
                      {c.status} · {c.emailsSent?.toLocaleString()} emails · {c.replyRate}% reply rate
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
