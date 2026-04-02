import { useState } from 'react'

export default function GrowthBanner({ growth, projections }) {
  const [showExplain, setShowExplain] = useState(false)

  if (!growth || growth.monthCount < 2) return null

  const { firstMonthLeads, peakMonthLeads, peakMonth, totalLeads, monthCount, firstMonth } = growth

  const stats = [
    {
      value: totalLeads,
      label: 'Total Responses',
      color: '#2D2A26',
      accent: '#4A7C59',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4A7C59" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4-4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>
        </svg>
      ),
      explain: 'Total number of positive responses received across all campaign months.',
    },
    {
      value: monthCount,
      label: 'Active Months',
      color: '#B8860B',
      accent: '#B8860B',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#B8860B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
      ),
      explain: 'Number of months the campaign has been generating leads.',
    },
    ...(projections?.leadsProjected > 0 ? [{
      value: projections.leadsProjected,
      label: `${projections.currentMonthLabel} Projected`,
      color: '#C2653C',
      accent: '#C2653C',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C2653C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
        </svg>
      ),
      explain: 'Projected total leads for the current month based on the daily pace so far.',
    }] : []),
  ]

  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(194,101,60,0.06) 0%, rgba(74,124,89,0.04) 100%)',
      border: '1px solid rgba(194,101,60,0.15)',
      borderRadius: '20px',
      padding: '28px 32px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Decorative glows */}
      <div style={{
        position: 'absolute', top: '-60px', right: '-60px',
        width: '200px', height: '200px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(194,101,60,0.1) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '-40px', left: '-40px',
        width: '140px', height: '140px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(74,124,89,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Top row: before -> after + info button */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
            <span style={{ fontSize: '42px', fontWeight: 800, color: '#8A8580', lineHeight: 1, letterSpacing: '-1.5px' }}>
              {firstMonthLeads}
            </span>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#C2653C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '2px' }}>
              <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
            </svg>
            <span style={{ fontSize: '52px', fontWeight: 800, color: '#C2653C', lineHeight: 1, letterSpacing: '-2px' }}>
              {peakMonthLeads}
            </span>
          </div>
          <p style={{ color: '#8A8580', fontSize: '12px', fontWeight: 600, margin: '8px 0 0', letterSpacing: '0.3px' }}>
            leads per month · from <strong style={{ color: '#2D2A26' }}>{firstMonth}</strong> to <strong style={{ color: '#2D2A26' }}>{peakMonth}</strong>
          </p>
        </div>

        {/* Info button */}
        <button
          onClick={() => setShowExplain(!showExplain)}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            background: showExplain ? 'rgba(194,101,60,0.08)' : '#FAF8F5',
            border: `1px solid ${showExplain ? 'rgba(194,101,60,0.25)' : '#E8E4DE'}`,
            borderRadius: '10px', padding: '7px 14px',
            color: showExplain ? '#C2653C' : '#8A8580',
            fontSize: '12px', fontWeight: 600, cursor: 'pointer',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
          </svg>
          {showExplain ? 'Hide details' : 'What is this?'}
        </button>
      </div>

      {/* Stat cards grid */}
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${stats.length}, 1fr)`, gap: '12px', marginBottom: '20px' }}>
        {stats.map(stat => (
          <div key={stat.label} style={{
            background: `linear-gradient(135deg, ${stat.accent}08, ${stat.accent}04)`,
            border: `1px solid ${stat.accent}20`,
            borderRadius: '14px',
            padding: '18px 16px',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          }}>
            {/* Top accent line */}
            <div style={{
              position: 'absolute', top: 0, left: '20%', right: '20%',
              height: '2px',
              background: `linear-gradient(90deg, transparent, ${stat.accent}, transparent)`,
              opacity: 0.4,
            }} />

            {/* Icon */}
            <div style={{
              width: '32px', height: '32px', borderRadius: '8px',
              background: `${stat.accent}12`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 10px',
            }}>
              {stat.icon}
            </div>

            <p style={{
              fontSize: '26px', fontWeight: 800, color: stat.color,
              lineHeight: 1, margin: '0 0 6px', letterSpacing: '-0.5px',
            }}>
              {stat.value}
            </p>
            <p style={{ color: '#8A8580', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1.2px', fontWeight: 600, margin: 0 }}>
              {stat.label}
            </p>

            {/* Explanation */}
            {showExplain && (
              <p style={{
                marginTop: '10px', paddingTop: '10px',
                borderTop: `1px solid ${stat.accent}15`,
                color: '#8A8580', fontSize: '11px', lineHeight: 1.5, margin: '10px 0 0',
              }}>
                {stat.explain}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Bottom insight */}
      <div style={{
        padding: '14px 18px',
        background: 'rgba(74,124,89,0.04)',
        border: '1px solid rgba(74,124,89,0.1)',
        borderRadius: '12px',
      }}>
        <p style={{ color: '#4A7C59', fontSize: '13px', fontWeight: 600, margin: '0 0 4px' }}>
          Consistent upward trajectory
        </p>
        <p style={{ color: '#8A8580', fontSize: '13px', margin: 0, lineHeight: 1.6 }}>
          The campaign started with <strong style={{ color: '#2D2A26' }}>{firstMonthLeads}</strong> leads in {firstMonth} and
          {' '}scaled to <strong style={{ color: '#2D2A26' }}>{peakMonthLeads}</strong> at peak ({peakMonth}) —
          {' '}the pipeline is compounding, each month builds on the momentum of the previous one.
        </p>
      </div>
    </div>
  )
}
