export default function CampaignHighlights({ highlights, growth, projections, replyTypes }) {
  if (!highlights) return null

  const { velocityMultiplier, highIntentPct } = highlights
  const hasVelocity = velocityMultiplier && velocityMultiplier > 1
  const hasIntent = highIntentPct != null && highIntentPct > 0
  const hasPace = projections && projections.dailyRate > 0
  const hasReplyTypes = replyTypes && replyTypes.length > 0

  if (!hasVelocity && !hasIntent && !hasPace && !hasReplyTypes) return null

  // Monthly pace data
  const currentRate = projections?.dailyRate || 0
  const prevLeads = projections?.prevMonthLeads || 0
  const prevDays = projections?.daysInMonth || 30
  const prevRate = prevLeads / prevDays
  const paceChange = prevRate > 0 ? Math.round(((currentRate - prevRate) / prevRate) * 100) : null
  const paceUp = paceChange !== null && paceChange > 0

  // Reply types total for percentages
  const replyTotal = hasReplyTypes ? replyTypes.reduce((s, t) => s + t.value, 0) : 0
  const maxReplyVal = hasReplyTypes ? Math.max(...replyTypes.map(t => t.value)) : 0

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

      {/* ── Bottom row: Monthly Pace + Response Breakdown ── */}
      <div style={{ display: 'grid', gridTemplateColumns: hasPace && hasReplyTypes ? '1fr 1fr' : '1fr', gap: '16px' }}>

        {/* Monthly Pace */}
        {hasPace && (
          <div className="glass" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
              <div style={{
                width: '32px', height: '32px', borderRadius: '8px',
                background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                </svg>
              </div>
              <div>
                <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#fff', margin: 0, letterSpacing: '-0.2px' }}>
                  Monthly Pace
                </h3>
                <p style={{ fontSize: '12px', color: '#525252', margin: 0 }}>Current vs previous month</p>
              </div>
            </div>

            {/* Pace bars */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* Current */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '13px', color: '#fff', fontWeight: 600 }}>
                    {projections.currentMonthLabel} — now
                  </span>
                  <span style={{ fontSize: '13px', color: '#3B82F6', fontWeight: 700 }}>
                    {currentRate.toFixed(1)}/day
                  </span>
                </div>
                <div style={{ height: '8px', background: 'rgba(255,255,255,0.04)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{
                    width: `${Math.min(100, prevRate > 0 ? Math.round((currentRate / Math.max(currentRate, prevRate)) * 100) : 100)}%`,
                    height: '100%',
                    background: 'linear-gradient(90deg, rgba(59,130,246,0.3), #3B82F6)',
                    borderRadius: '4px',
                    transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                  }} />
                </div>
              </div>

              {/* Previous */}
              {prevRate > 0 && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '13px', color: '#A3A3A3' }}>
                      Last month
                    </span>
                    <span style={{ fontSize: '13px', color: '#525252', fontWeight: 600 }}>
                      {prevRate.toFixed(1)}/day
                    </span>
                  </div>
                  <div style={{ height: '8px', background: 'rgba(255,255,255,0.04)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{
                      width: `${Math.round((prevRate / Math.max(currentRate, prevRate)) * 100)}%`,
                      height: '100%',
                      background: 'rgba(255,255,255,0.1)',
                      borderRadius: '4px',
                      transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                    }} />
                  </div>
                </div>
              )}

              {/* Change indicator */}
              {paceChange !== null && (
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: '6px',
                  padding: '6px 12px', borderRadius: '8px',
                  background: paceUp ? 'rgba(16,185,129,0.06)' : 'rgba(239,68,68,0.06)',
                  border: `1px solid ${paceUp ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)'}`,
                  alignSelf: 'flex-start',
                }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={paceUp ? '#10B981' : '#EF4444'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    {paceUp
                      ? <><polyline points="18 15 12 9 6 15"/></>
                      : <><polyline points="6 9 12 15 18 9"/></>
                    }
                  </svg>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: paceUp ? '#10B981' : '#EF4444' }}>
                    {paceUp ? '+' : ''}{paceChange}% vs last month
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Response Breakdown */}
        {hasReplyTypes && (
          <div className="glass" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
              <div style={{
                width: '32px', height: '32px', borderRadius: '8px',
                background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
                </svg>
              </div>
              <div>
                <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#fff', margin: 0, letterSpacing: '-0.2px' }}>
                  Response Breakdown
                </h3>
                <p style={{ fontSize: '12px', color: '#525252', margin: 0 }}>How leads are engaging</p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {replyTypes.map(type => {
                const pct = replyTotal > 0 ? Math.round((type.value / replyTotal) * 100) : 0
                const barWidth = maxReplyVal > 0 ? Math.max(6, Math.round((type.value / maxReplyVal) * 100)) : 0
                return (
                  <div key={type.name}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontSize: '13px', color: '#A3A3A3', fontWeight: 500 }}>
                        {type.name}
                      </span>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: type.color }}>
                        {type.value} <span style={{ color: '#525252', fontWeight: 400 }}>({pct}%)</span>
                      </span>
                    </div>
                    <div style={{ height: '6px', background: 'rgba(255,255,255,0.04)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{
                        width: `${barWidth}%`,
                        height: '100%',
                        background: `linear-gradient(90deg, ${type.color}40, ${type.color})`,
                        borderRadius: '3px',
                        transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                      }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
