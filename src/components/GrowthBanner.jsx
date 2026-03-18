export default function GrowthBanner({ growth, projections }) {
  if (!growth || growth.monthCount < 2) return null

  const { growthPct, firstMonthLeads, peakMonthLeads, peakMonth, totalLeads, monthCount, firstMonth } = growth

  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(16,185,129,0.06) 0%, rgba(59,130,246,0.04) 100%)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      border: '1px solid rgba(16,185,129,0.15)',
      borderRadius: '20px',
      padding: '28px 32px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Decorative glow */}
      <div style={{
        position: 'absolute', top: '-40px', right: '-40px',
        width: '160px', height: '160px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ display: 'flex', alignItems: 'center', gap: '32px', flexWrap: 'wrap' }}>
        <div style={{ textAlign: 'center', minWidth: '140px' }}>
          <p style={{
            fontSize: '48px', fontWeight: 800, color: '#10B981',
            lineHeight: 1, margin: '0 0 4px', letterSpacing: '-2px',
          }}>
            +{growthPct}%
          </p>
          <p style={{ color: '#525252', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.5px', fontWeight: 600, margin: 0 }}>
            Growth since {firstMonth}
          </p>
        </div>

        <div style={{ width: '1px', height: '60px', background: 'rgba(16,185,129,0.15)', flexShrink: 0 }} />

        <div style={{ display: 'flex', gap: '28px', flexWrap: 'wrap', flex: 1 }}>
          <Stat value={totalLeads} label="Total Positive Responses" color="#fff" />
          <Stat value={`${firstMonthLeads} → ${peakMonthLeads}`} label={`${firstMonth} to ${peakMonth}`} color="#3B82F6" />
          <Stat value={monthCount} label="Active Months" color="#8B5CF6" />
          {projections?.leadsProjected > 0 && (
            <Stat value={projections.leadsProjected} label={`${projections.currentMonthLabel} Projected`} color="#F59E0B" />
          )}
        </div>
      </div>

      <div style={{
        marginTop: '20px', padding: '14px 18px',
        background: 'rgba(16,185,129,0.04)',
        border: '1px solid rgba(16,185,129,0.1)',
        borderRadius: '12px',
      }}>
        <p style={{ color: '#10B981', fontSize: '13px', fontWeight: 600, margin: '0 0 4px' }}>
          Consistent upward trajectory
        </p>
        <p style={{ color: '#A3A3A3', fontSize: '13px', margin: 0, lineHeight: 1.6 }}>
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
        fontSize: '24px', fontWeight: 700, color: color || '#fff',
        lineHeight: 1, margin: '0 0 4px', letterSpacing: '-0.5px',
      }}>
        {value}
      </p>
      <p style={{ color: '#525252', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 500, margin: 0 }}>
        {label}
      </p>
    </div>
  )
}
