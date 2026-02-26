const STATUS_STYLE = {
  Active:    { color: '#2ecc71', bg: 'rgba(46,204,113,0.12)' },
  Completed: { color: '#4a90d9', bg: 'rgba(74,144,217,0.12)' },
  Paused:    { color: '#fbbf24', bg: 'rgba(251,191,36,0.12)' },
  Draft:     { color: '#a0a8b8', bg: 'rgba(160,168,184,0.1)' },
}

export default function CampaignTable({ campaigns }) {
  if (!campaigns || campaigns.length === 0) return null

  return (
    <div style={{ background: '#16213e', border: '1px solid #2a2d4a', borderRadius: '16px', overflow: 'hidden' }}>
      <div style={{ padding: '24px 28px', borderBottom: '1px solid #2a2d4a' }}>
        <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '20px', fontWeight: 600, margin: 0, color: '#fff' }}>
          Campaign Analytics
        </h2>
        <p style={{ color: '#a0a8b8', fontSize: '13px', marginTop: '4px', marginBottom: 0 }}>
          Performance breakdown by campaign
        </p>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #2a2d4a' }}>
              {['Campaign', 'Status', 'Emails Sent', 'Replies', 'Open Rate', 'Reply Rate'].map((h, i) => (
                <th key={h} style={{
                  padding: '10px 14px',
                  textAlign: i === 0 ? 'left' : 'right',
                  fontSize: '11px', fontWeight: 600,
                  textTransform: 'uppercase', letterSpacing: '1.2px',
                  color: '#a0a8b8',
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
                <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <td style={{ padding: '14px', color: '#fff', fontSize: '14px', fontWeight: 500 }}>
                    {c.name}
                  </td>
                  <td style={{ padding: '14px', textAlign: 'right' }}>
                    <span style={{ fontSize: '10px', fontWeight: 700, padding: '3px 10px', borderRadius: '20px', background: st.bg, color: st.color }}>
                      {c.status}
                    </span>
                  </td>
                  <td style={{ padding: '14px', textAlign: 'right', color: '#a0a8b8', fontSize: '14px', fontVariantNumeric: 'tabular-nums' }}>
                    {c.emailsSent.toLocaleString()}
                  </td>
                  <td style={{ padding: '14px', textAlign: 'right', color: '#a0a8b8', fontSize: '14px', fontVariantNumeric: 'tabular-nums' }}>
                    {c.replies}
                  </td>
                  <td style={{ padding: '14px', textAlign: 'right', color: '#4a90d9', fontSize: '14px', fontWeight: 600 }}>
                    {c.openRate}%
                  </td>
                  <td style={{ padding: '14px', textAlign: 'right' }}>
                    <span style={{
                      fontSize: '12px', fontWeight: 700, padding: '4px 10px', borderRadius: '8px',
                      background: c.replyRate >= 1 ? 'rgba(46,204,113,0.12)' : 'rgba(251,191,36,0.12)',
                      color: c.replyRate >= 1 ? '#2ecc71' : '#fbbf24',
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
