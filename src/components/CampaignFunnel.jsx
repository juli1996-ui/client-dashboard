function pct(num, denom) {
  if (!denom || !num) return null
  return ((num / denom) * 100).toFixed(1)
}

const STEPS = [
  {
    key: 'emailsSent',
    label: 'Emails Sent',
    rateLabel: '100%',
    rateColor: '#4a90d9',
    bg: 'linear-gradient(135deg,rgba(74,144,217,0.3),rgba(74,144,217,0.15))',
    border: '1px solid rgba(74,144,217,0.3)',
  },
  {
    key: 'replies',
    label: 'Total Replies',
    rateColor: '#a78bfa',
    bg: 'linear-gradient(135deg,rgba(167,139,250,0.3),rgba(167,139,250,0.15))',
    border: '1px solid rgba(167,139,250,0.3)',
  },
  {
    key: 'opportunities',
    label: 'Opportunities',
    rateColor: '#2ecc71',
    bg: 'linear-gradient(135deg,rgba(46,204,113,0.3),rgba(46,204,113,0.15))',
    border: '1px solid rgba(46,204,113,0.3)',
  },
  {
    key: 'meetingsScheduled',
    label: 'Meetings',
    rateColor: '#fbbf24',
    bg: 'linear-gradient(135deg,rgba(251,191,36,0.3),rgba(251,191,36,0.15))',
    border: '1px solid rgba(251,191,36,0.3)',
  },
]

const STATUS_DOT = {
  Active:    { color: '#2ecc71', pulse: true },
  Paused:    { color: '#fbbf24', pulse: false },
  Completed: { color: '#4a90d9', pulse: false },
  Draft:     { color: '#a0a8b8', pulse: false },
}

export default function CampaignFunnel({ summary, campaigns }) {
  const { emailsSent, replies, opportunities, meetingsScheduled } = summary
  const values = { emailsSent, replies, opportunities, meetingsScheduled }

  // Conversion rates between steps
  const rates = [
    { value: '100%', color: '#4a90d9' },
    { value: emailsSent ? `${pct(replies, emailsSent)}%` : null, color: '#a78bfa', suffix: 'reply rate' },
    { value: replies    ? `${pct(opportunities, replies)}% of replies` : null, color: '#2ecc71' },
    { value: opportunities ? `${pct(meetingsScheduled, opportunities)}% of opps` : null, color: '#fbbf24' },
  ]

  const emailsPerOpp   = opportunities && emailsSent ? Math.round(emailsSent / opportunities) : null
  const leadsPerMeeting = meetingsScheduled && opportunities ? Math.round(opportunities / meetingsScheduled) : null
  const replyOppPct     = replies && opportunities ? pct(opportunities, replies) : null

  return (
    <div style={{ background: '#16213e', border: '1px solid #2a2d4a', borderRadius: '16px', padding: '32px' }}>
      {/* Instantly badge */}
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: '6px',
        background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.2)',
        borderRadius: '8px', padding: '5px 12px',
        fontSize: '11px', color: '#fbbf24', fontWeight: 600, marginBottom: '20px',
      }}>
        ⚡ Instantly — live campaign data
      </div>

      <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '20px', fontWeight: 600, color: '#fff', marginBottom: '6px' }}>
        Campaign Funnel Performance
      </h2>
      <p style={{ color: '#a0a8b8', fontSize: '13px', marginBottom: '24px' }}>
        {emailsSent ? `${emailsSent.toLocaleString()} emails sent` : 'Email data from Instantly'} — full-funnel conversion breakdown
      </p>

      {/* Horizontal funnel */}
      <div style={{ display: 'flex', alignItems: 'stretch', gap: '2px', minHeight: '90px', marginBottom: '20px' }}>
        {STEPS.map((step, i) => [
          <div key={step.key} style={{
            flex: 1, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            borderRadius: '10px', padding: '12px 8px',
            background: step.bg, border: step.border,
            textAlign: 'center',
          }}>
            <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '22px', fontWeight: 700, color: '#fff', lineHeight: 1 }}>
              {values[step.key] != null ? values[step.key].toLocaleString() : '—'}
            </div>
            <div style={{ fontSize: '10px', color: '#a0a8b8', textTransform: 'uppercase', letterSpacing: '0.8px', fontWeight: 600, marginTop: '4px' }}>
              {step.label}
            </div>
            <div style={{ fontSize: '11px', fontWeight: 700, color: rates[i].color, marginTop: '4px' }}>
              {rates[i].value || '—'}
            </div>
          </div>,
          i < STEPS.length - 1 && (
            <div key={`arrow-${i}`} style={{
              display: 'flex', alignItems: 'center',
              color: '#2a2d4a', fontSize: '20px', flexShrink: 0, padding: '0 2px',
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
            <div style={{ fontSize: '12px', color: '#a0a8b8' }}>
              📧 <strong style={{ color: '#fff' }}>{emailsPerOpp.toLocaleString()} emails</strong> per opportunity
            </div>
          )}
          {leadsPerMeeting && (
            <div style={{ fontSize: '12px', color: '#a0a8b8' }}>
              📅 <strong style={{ color: '#fff' }}>1 meeting</strong> every ~{leadsPerMeeting} opportunities
            </div>
          )}
          {replyOppPct && (
            <div style={{ fontSize: '12px', color: '#a0a8b8' }}>
              📈 <strong style={{ color: '#2ecc71' }}>Reply → Opp rate: {replyOppPct}%</strong> — strong qualifier
            </div>
          )}
        </div>
      )}

      {/* Active Campaigns */}
      {campaigns && campaigns.length > 0 && (
        <>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#a0a8b8', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>
            Campaigns
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            {campaigns.map((c, i) => {
              const dot = STATUS_DOT[c.status] || STATUS_DOT.Draft
              return (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid #2a2d4a',
                  borderRadius: '10px', padding: '10px 14px',
                }}>
                  <div style={{
                    width: '8px', height: '8px', borderRadius: '50%',
                    background: dot.color, flexShrink: 0,
                  }} />
                  <div>
                    <div style={{ fontSize: '12px', color: '#fff', fontWeight: 500, lineHeight: 1.3 }}>
                      {c.name}
                    </div>
                    <div style={{ fontSize: '10px', color: '#a0a8b8', marginTop: '2px' }}>
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
