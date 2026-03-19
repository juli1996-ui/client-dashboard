export default function CampaignHighlights({ highlights, growth, projections }) {
  if (!highlights) return null

  const { velocityMultiplier, topCompanies, recentWins, highIntentPct } = highlights
  const hasCompanies = topCompanies && topCompanies.length > 0
  const hasWins = recentWins && recentWins.length > 0
  const hasVelocity = velocityMultiplier && velocityMultiplier > 1
  const hasIntent = highIntentPct != null && highIntentPct > 0

  if (!hasCompanies && !hasWins && !hasVelocity && !hasIntent) return null

  const TYPE_COLORS = {
    'Meeting Request': '#F59E0B',
    'Interested': '#10B981',
    'Forwarded Internally': '#8B5CF6',
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

      {/* ── Top row: Velocity + High Intent ── */}
      <div style={{ display: 'grid', gridTemplateColumns: hasVelocity && hasIntent ? '1fr 1fr' : '1fr', gap: '16px' }}>

        {/* Lead Velocity */}
        {hasVelocity && (
          <div className="glass" style={{ padding: '24px', position: 'relative', overflow: 'hidden' }}>
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
              background: 'linear-gradient(90deg, transparent, #10B981, transparent)',
              opacity: 0.5,
            }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{
                width: '48px', height: '48px', borderRadius: '14px',
                background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
                </svg>
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                  <span style={{ fontSize: '36px', fontWeight: 800, color: '#10B981', lineHeight: 1, letterSpacing: '-1.5px' }}>
                    {velocityMultiplier}x
                  </span>
                  <span style={{ fontSize: '13px', color: '#A3A3A3', fontWeight: 500 }}>
                    faster
                  </span>
                </div>
                <p style={{ color: '#525252', fontSize: '13px', margin: '4px 0 0' }}>
                  Generating leads <strong style={{ color: '#A3A3A3' }}>{velocityMultiplier}x faster</strong> than the first month of the campaign
                </p>
              </div>
            </div>
          </div>
        )}

        {/* High Intent % */}
        {hasIntent && (
          <div className="glass" style={{ padding: '24px', position: 'relative', overflow: 'hidden' }}>
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
              background: 'linear-gradient(90deg, transparent, #F59E0B, transparent)',
              opacity: 0.5,
            }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{
                width: '48px', height: '48px', borderRadius: '14px',
                background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2z"/>
                </svg>
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                  <span style={{ fontSize: '36px', fontWeight: 800, color: '#F59E0B', lineHeight: 1, letterSpacing: '-1.5px' }}>
                    {highIntentPct}%
                  </span>
                  <span style={{ fontSize: '13px', color: '#A3A3A3', fontWeight: 500 }}>
                    high intent
                  </span>
                </div>
                <p style={{ color: '#525252', fontSize: '13px', margin: '4px 0 0' }}>
                  {highIntentPct >= 70
                    ? <>Exceptional quality — <strong style={{ color: '#A3A3A3' }}>most campaigns average 40-60%</strong></>
                    : highIntentPct >= 50
                    ? <>Above average — <strong style={{ color: '#A3A3A3' }}>targeting is resonating well</strong></>
                    : <>Interested, meetings, and forwarded responses</>
                  }
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Bottom row: Top Companies + Recent Wins ── */}
      <div style={{ display: 'grid', gridTemplateColumns: hasCompanies && hasWins ? '1fr 1fr' : '1fr', gap: '16px' }}>

        {/* Top Companies */}
        {hasCompanies && (
          <div className="glass" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
              <div style={{
                width: '32px', height: '32px', borderRadius: '8px',
                background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
                </svg>
              </div>
              <div>
                <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#fff', margin: 0, letterSpacing: '-0.2px' }}>
                  Top Companies
                </h3>
                <p style={{ fontSize: '12px', color: '#525252', margin: 0 }}>Who's responding the most</p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {topCompanies.map((company, i) => {
                const maxCount = topCompanies[0].count
                const barWidth = Math.max(8, Math.round((company.count / maxCount) * 100))
                return (
                  <div key={company.name} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{
                      width: '20px', height: '20px', borderRadius: '6px',
                      background: i === 0 ? 'rgba(139,92,246,0.15)' : 'rgba(255,255,255,0.04)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '10px', fontWeight: 700,
                      color: i === 0 ? '#8B5CF6' : '#525252',
                      flexShrink: 0,
                    }}>
                      {i + 1}
                    </span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                        <span style={{
                          fontSize: '13px', color: i === 0 ? '#fff' : '#A3A3A3', fontWeight: i === 0 ? 600 : 400,
                          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                        }}>
                          {company.name}
                        </span>
                        <span style={{ fontSize: '12px', color: '#8B5CF6', fontWeight: 700, flexShrink: 0, marginLeft: '8px' }}>
                          {company.count}
                        </span>
                      </div>
                      <div style={{ height: '3px', background: 'rgba(255,255,255,0.04)', borderRadius: '2px', overflow: 'hidden' }}>
                        <div style={{
                          width: `${barWidth}%`, height: '100%',
                          background: i === 0 ? '#8B5CF6' : 'rgba(139,92,246,0.4)',
                          borderRadius: '2px',
                          transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                        }} />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Recent Wins */}
        {hasWins && (
          <div className="glass" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
              <div style={{
                width: '32px', height: '32px', borderRadius: '8px',
                background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <div>
                <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#fff', margin: 0, letterSpacing: '-0.2px' }}>
                  Recent Wins
                </h3>
                <p style={{ fontSize: '12px', color: '#525252', margin: 0 }}>Latest high-intent responses</p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {recentWins.map((lead, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '10px 14px',
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.04)',
                  borderRadius: '10px',
                  transition: 'all 0.15s',
                }}>
                  <div style={{
                    width: '36px', height: '36px', borderRadius: '10px',
                    background: `${TYPE_COLORS[lead.type] || '#525252'}12`,
                    border: `1px solid ${TYPE_COLORS[lead.type] || '#525252'}25`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <span style={{ fontSize: '14px' }}>
                      {lead.type === 'Meeting Request' ? '📅' : lead.type === 'Forwarded Internally' ? '↗' : '✓'}
                    </span>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontSize: '13px', fontWeight: 600, color: '#fff',
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>
                      {lead.name}
                    </div>
                    <div style={{
                      fontSize: '11px', color: '#525252', marginTop: '1px',
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>
                      {[lead.title, lead.org].filter(Boolean).join(' · ') || lead.type}
                    </div>
                  </div>
                  <span style={{
                    fontSize: '10px', fontWeight: 600, padding: '2px 8px', borderRadius: '12px',
                    background: `${TYPE_COLORS[lead.type] || '#525252'}15`,
                    color: TYPE_COLORS[lead.type] || '#525252',
                    flexShrink: 0, whiteSpace: 'nowrap',
                  }}>
                    {lead.type === 'Meeting Request' ? 'Meeting' : lead.type === 'Forwarded Internally' ? 'Forwarded' : 'Interested'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
