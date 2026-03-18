export default function GrowthBanner({ growth, projections }) {
  if (!growth || growth.monthCount < 2) return null

  const { growthPct, firstMonthLeads, peakMonthLeads, peakMonth, totalLeads, monthCount, firstMonth } = growth

  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(46,204,113,0.08) 0%, rgba(74,144,217,0.08) 100%)',
      border: '1px solid rgba(46,204,113,0.25)',
      borderRadius: '18px',
      padding: '28px 32px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Decorative glow */}
      <div style={{
        position: 'absolute', top: '-40px', right: '-40px',
        width: '160px', height: '160px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(46,204,113,0.12) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ display: 'flex', alignItems: 'center', gap: '32px', flexWrap: 'wrap' }}>
        {/* Main growth number */}
        <div style={{ textAlign: 'center', minWidth: '140px' }}>
          <p style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: '52px', fontWeight: 700, color: '#2ecc71',
            lineHeight: 1, margin: '0 0 4px',
          }}>
            +{growthPct}%
          </p>
          <p style={{ color: '#a0a8b8', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1.5px', fontWeight: 600, margin: 0 }}>
            Growth since {firstMonth}
          </p>
        </div>

        {/* Divider */}
        <div style={{ width: '1px', height: '72px', background: 'rgba(46,204,113,0.2)', flexShrink: 0 }} />

        {/* Stats row */}
        <div style={{ display: 'flex', gap: '28px', flexWrap: 'wrap', flex: 1 }}>
          <Stat value={totalLeads} label="Total Positive Responses" color="#fff" />
          <Stat value={`${firstMonthLeads} → ${peakMonthLeads}`} label={`${firstMonth} to ${peakMonth}`} color="#4a90d9" />
          <Stat value={monthCount} label="Active Months" color="#a78bfa" />
          {projections?.leadsProjected > 0 && (
            <Stat value={projections.leadsProjected} label={`${projections.currentMonthLabel} Projected`} color="#fbbf24" />
          )}
        </div>
      </div>

      {/* Bottom message */}
      <div style={{
        marginTop: '20px', padding: '14px 18px',
        background: 'rgba(46,204,113,0.06)',
        border: '1px solid rgba(46,204,113,0.15)',
        borderRadius: '10px',
      }}>
        <p style={{ color: '#2ecc71', fontSize: '14px', fontWeight: 600, margin: '0 0 4px' }}>
          Consistent upward trajectory
        </p>
        <p style={{ color: '#a0a8b8', fontSize: '13px', margin: 0, lineHeight: 1.6 }}>
          Campaign performance has grown <strong style={{ color: '#fff' }}>+{growthPct}%</strong> from
          {' '}<strong style={{ color: '#fff' }}>{firstMonthLeads}</strong> leads in {firstMonth} to
          {' '}<strong style={{ color: '#fff' }}>{peakMonthLeads}</strong> at peak ({peakMonth}).
          {' '}The pipeline is compounding — each month builds on the momentum of the previous one.
        </p>
      </div>
    </div>
  )
}

function Stat({ value, label, color }) {
  return (
    <div>
      <p style={{
        fontFamily: 'Playfair Display, serif',
        fontSize: '26px', fontWeight: 700, color: color || '#fff',
        lineHeight: 1, margin: '0 0 4px',
      }}>
        {value}
      </p>
      <p style={{ color: '#a0a8b8', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 500, margin: 0 }}>
        {label}
      </p>
    </div>
  )
}
