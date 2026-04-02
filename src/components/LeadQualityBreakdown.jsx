export default function LeadQualityBreakdown({ replyTypes, totalLeads }) {
  if (!replyTypes || replyTypes.length === 0) return null

  const highIntent = replyTypes
    .filter(t => t.name !== 'Other')
    .reduce((sum, t) => sum + t.value, 0)
  const highIntentPct = totalLeads > 0 ? Math.round((highIntent / totalLeads) * 100) : 0

  const maxVal = Math.max(...replyTypes.map(t => t.value))

  return (
    <div style={{ padding: '28px', background: '#FFFFFF', border: '1px solid #E8E4DE', borderRadius: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#2D2A26', margin: '0 0 4px', letterSpacing: '-0.3px', fontFamily: "'Fraunces', Georgia, serif" }}>
            Lead Quality
          </h2>
          <p style={{ color: '#8A8580', fontSize: '13px', margin: 0 }}>
            Breakdown of response quality and intent level
          </p>
        </div>
        <div style={{
          textAlign: 'center', padding: '10px 18px',
          background: 'rgba(74,124,89,0.06)',
          border: '1px solid rgba(74,124,89,0.12)',
          borderRadius: '12px',
        }}>
          <p style={{
            fontSize: '26px', fontWeight: 800, color: '#4A7C59',
            lineHeight: 1, margin: '0 0 2px', letterSpacing: '-0.5px',
          }}>
            {highIntentPct}%
          </p>
          <p style={{ color: '#8A8580', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600, margin: 0 }}>
            High Intent
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {replyTypes.map(type => {
          const pct = totalLeads > 0 ? Math.round((type.value / totalLeads) * 100) : 0
          const barWidth = maxVal > 0 ? Math.max(4, Math.round((type.value / maxVal) * 100)) : 0

          return (
            <div key={type.name}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontSize: '13px', color: '#2D2A26', fontWeight: 500 }}>{type.name}</span>
                <span style={{ fontSize: '13px', color: type.color, fontWeight: 700 }}>
                  {type.value} ({pct}%)
                </span>
              </div>
              <div style={{ height: '20px', background: '#FAF8F5', borderRadius: '6px', overflow: 'hidden' }}>
                <div style={{
                  width: `${barWidth}%`,
                  height: '100%',
                  background: `linear-gradient(90deg, ${type.color}20, ${type.color})`,
                  borderRadius: '6px',
                  transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                }} />
              </div>
            </div>
          )
        })}
      </div>

      <div style={{
        marginTop: '20px', padding: '14px 18px',
        background: 'rgba(194,101,60,0.04)',
        border: '1px solid rgba(194,101,60,0.12)',
        borderRadius: '12px',
      }}>
        <p style={{ color: '#C2653C', fontSize: '13px', fontWeight: 600, margin: '0 0 4px' }}>
          Pipeline Quality Insight
        </p>
        <p style={{ color: '#8A8580', fontSize: '13px', margin: 0, lineHeight: 1.6 }}>
          <strong style={{ color: '#2D2A26' }}>{highIntentPct}%</strong> of all responses show genuine interest or intent to engage.
          {highIntentPct >= 70 && ' This is an exceptionally strong conversion quality — most campaigns see 40-60%.'}
          {highIntentPct >= 50 && highIntentPct < 70 && ' This is above average conversion quality — the targeting is resonating well.'}
        </p>
      </div>
    </div>
  )
}
