export default function LeadQualityBreakdown({ replyTypes, totalLeads }) {
  if (!replyTypes || replyTypes.length === 0) return null

  // Calculate high-intent percentage (Interested + Meeting Request + Forwarded)
  const highIntent = replyTypes
    .filter(t => t.name !== 'Other')
    .reduce((sum, t) => sum + t.value, 0)
  const highIntentPct = totalLeads > 0 ? Math.round((highIntent / totalLeads) * 100) : 0

  const maxVal = Math.max(...replyTypes.map(t => t.value))

  return (
    <div style={{ background: '#16213e', border: '1px solid #2a2d4a', borderRadius: '16px', padding: '28px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '20px', fontWeight: 600, color: '#fff', margin: '0 0 6px' }}>
            Lead Quality
          </h2>
          <p style={{ color: '#a0a8b8', fontSize: '13px', margin: 0 }}>
            Breakdown of response quality and intent level
          </p>
        </div>
        {/* High intent badge */}
        <div style={{
          textAlign: 'center', padding: '10px 18px',
          background: 'rgba(46,204,113,0.08)',
          border: '1px solid rgba(46,204,113,0.2)',
          borderRadius: '12px',
        }}>
          <p style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: '28px', fontWeight: 700, color: '#2ecc71',
            lineHeight: 1, margin: '0 0 2px',
          }}>
            {highIntentPct}%
          </p>
          <p style={{ color: '#a0a8b8', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600, margin: 0 }}>
            High Intent
          </p>
        </div>
      </div>

      {/* Horizontal bar chart */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {replyTypes.map(type => {
          const pct = totalLeads > 0 ? Math.round((type.value / totalLeads) * 100) : 0
          const barWidth = maxVal > 0 ? Math.max(4, Math.round((type.value / maxVal) * 100)) : 0

          return (
            <div key={type.name}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontSize: '13px', color: '#fff', fontWeight: 500 }}>{type.name}</span>
                <span style={{ fontSize: '13px', color: type.color, fontWeight: 700 }}>
                  {type.value} ({pct}%)
                </span>
              </div>
              <div style={{ height: '24px', background: 'rgba(255,255,255,0.04)', borderRadius: '6px', overflow: 'hidden' }}>
                <div style={{
                  width: `${barWidth}%`,
                  height: '100%',
                  background: `linear-gradient(90deg, ${type.color}33, ${type.color})`,
                  borderRadius: '6px',
                  transition: 'width 0.8s ease',
                }} />
              </div>
            </div>
          )
        })}
      </div>

      {/* Insight callout */}
      <div style={{
        marginTop: '20px', padding: '14px 18px',
        background: 'rgba(74,144,217,0.06)',
        border: '1px solid rgba(74,144,217,0.15)',
        borderRadius: '10px',
      }}>
        <p style={{ color: '#4a90d9', fontSize: '13px', fontWeight: 600, margin: '0 0 4px' }}>
          Pipeline Quality Insight
        </p>
        <p style={{ color: '#a0a8b8', fontSize: '13px', margin: 0, lineHeight: 1.6 }}>
          <strong style={{ color: '#fff' }}>{highIntentPct}%</strong> of all responses show genuine interest or intent to engage.
          {highIntentPct >= 70 && ' This is an exceptionally strong conversion quality — most campaigns see 40-60%.'}
          {highIntentPct >= 50 && highIntentPct < 70 && ' This is above average conversion quality — the targeting is resonating well.'}
        </p>
      </div>
    </div>
  )
}
