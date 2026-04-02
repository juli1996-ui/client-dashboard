const STATUS_STYLE = {
  Active:    { color: '#4A7C59', bg: 'rgba(74,124,89,0.1)' },
  Completed: { color: '#C2653C', bg: 'rgba(194,101,60,0.1)' },
  Paused:    { color: '#B8860B', bg: 'rgba(184,134,11,0.1)' },
  Draft:     { color: '#B5B0AA', bg: 'rgba(181,176,170,0.08)' },
}

export default function CampaignTable({ campaigns }) {
  if (!campaigns || campaigns.length === 0) return null

  return (
    <div style={{ background: '#FFFFFF', border: '1px solid #E8E4DE', borderRadius: '16px', overflow: 'hidden' }}>
      <div style={{ padding: '24px 28px', borderBottom: '1px solid #E8E4DE' }}>
        <h2 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: '20px', fontWeight: 600, margin: 0, color: '#2D2A26' }}>
          Campaign Analytics
        </h2>
        <p style={{ color: '#8A8580', fontSize: '13px', marginTop: '4px', marginBottom: 0 }}>
          Performance breakdown by campaign
        </p>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #E8E4DE' }}>
              {['Campaign', 'Status', 'Emails Sent', 'Replies', 'Open Rate', 'Reply Rate'].map((h, i) => (
                <th key={h} style={{
                  padding: '10px 14px',
                  textAlign: i === 0 ? 'left' : 'right',
                  fontSize: '11px', fontWeight: 600,
                  textTransform: 'uppercase', letterSpacing: '1.2px',
                  color: '#8A8580',
                }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {campaigns.map((c, i) => {
              const st = STATUS_STYLE[c.status] || STATUS_STYLE.Draft
              return (
                <tr
                  key={i}
                  style={{ borderBottom: '1px solid #F0ECE6', transition: 'background 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#FAF8F5'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: '14px', color: '#2D2A26', fontSize: '14px', fontWeight: 500 }}>
                    {c.name}
                  </td>
                  <td style={{ padding: '14px', textAlign: 'right' }}>
                    <span style={{ fontSize: '10px', fontWeight: 700, padding: '3px 10px', borderRadius: '20px', background: st.bg, color: st.color }}>
                      {c.status}
                    </span>
                  </td>
                  <td style={{ padding: '14px', textAlign: 'right', color: '#8A8580', fontSize: '14px', fontVariantNumeric: 'tabular-nums' }}>
                    {c.emailsSent.toLocaleString()}
                  </td>
                  <td style={{ padding: '14px', textAlign: 'right', color: '#8A8580', fontSize: '14px', fontVariantNumeric: 'tabular-nums' }}>
                    {c.replies}
                  </td>
                  <td style={{ padding: '14px', textAlign: 'right', color: '#C2653C', fontSize: '14px', fontWeight: 600 }}>
                    {c.openRate}%
                  </td>
                  <td style={{ padding: '14px', textAlign: 'right' }}>
                    <span style={{
                      fontSize: '12px', fontWeight: 700, padding: '4px 10px', borderRadius: '8px',
                      background: c.replyRate >= 1 ? 'rgba(74,124,89,0.1)' : 'rgba(184,134,11,0.1)',
                      color: c.replyRate >= 1 ? '#4A7C59' : '#B8860B',
                    }}>
                      {c.replyRate}%
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
