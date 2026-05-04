const C = {
  text: '#2D2A26', muted: '#8A8580', faint: '#B5B0AA',
  accent: '#C2653C', success: '#4A7C59', warning: '#B8860B',
  surface: '#FFFFFF', surfaceWarm: '#FAF8F5',
  border: '#E8E4DE', borderLight: '#F0ECE6',
}
const FONT_DISPLAY = "'Fraunces', Georgia, serif"

const PRIORITY = {
  high:   { label: 'High Priority', bg: 'rgba(74,124,89,0.10)',  fg: '#4A7C59' },
  medium: { label: 'Medium',        bg: 'rgba(184,134,11,0.10)', fg: '#B8860B' },
  low:    { label: 'Low',           bg: 'rgba(45,42,38,0.06)',   fg: '#8A8580' },
  skip:   { label: 'Skip',          bg: 'rgba(184,84,80,0.08)',  fg: '#B85450' },
}

export default function ActiveCampaigns({ campaigns }) {
  if (!campaigns || campaigns.length === 0) return null

  return (
    <section>
      <p style={{
        fontSize: '11px', fontWeight: 700, textTransform: 'uppercase',
        letterSpacing: '2px', color: C.faint, margin: '0 0 12px',
      }}>
        Active Campaigns — Top Leads
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {campaigns.map(c => (
          <div key={c.id} style={{
            background: C.surface, border: `1px solid ${C.border}`,
            borderRadius: '16px', overflow: 'hidden',
            boxShadow: '0 1px 3px rgba(45,42,38,0.04)',
          }}>
            {/* Campaign header */}
            <div style={{
              padding: '16px 20px',
              borderBottom: `1px solid ${C.borderLight}`,
              background: C.surfaceWarm,
              display: 'flex', alignItems: 'baseline', gap: '12px',
            }}>
              <span style={{
                fontFamily: FONT_DISPLAY, fontWeight: 900, fontSize: '14px',
                color: C.accent, letterSpacing: '0.5px',
              }}>
                {c.code}
              </span>
              <h3 style={{
                fontFamily: FONT_DISPLAY, fontSize: '17px', fontWeight: 700,
                color: C.text, margin: 0, letterSpacing: '-0.2px', flex: 1,
              }}>
                {c.name}
              </h3>
              <span style={{
                fontSize: '12px', fontWeight: 600, color: C.muted,
                fontVariantNumeric: 'tabular-nums',
              }}>
                {c.leads.length} {c.leads.length === 1 ? 'lead' : 'leads'}
              </span>
            </div>

            {/* Lead rows */}
            <div>
              {c.leads.map((lead, i) => {
                const pri = PRIORITY[lead.priority] || PRIORITY.medium
                return (
                  <div key={i} style={{
                    padding: '14px 20px',
                    borderBottom: i < c.leads.length - 1 ? `1px solid ${C.borderLight}` : 'none',
                    display: 'grid',
                    gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 2fr) auto',
                    gap: '16px', alignItems: 'start',
                  }}>
                    {/* Name + description */}
                    <div>
                      <div style={{
                        fontFamily: FONT_DISPLAY, fontSize: '15px', fontWeight: 700,
                        color: C.text, lineHeight: 1.3, marginBottom: '2px',
                      }}>
                        {lead.name}
                      </div>
                      {lead.description && (
                        <div style={{ fontSize: '12px', color: C.muted, lineHeight: 1.5 }}>
                          {lead.description}
                        </div>
                      )}
                    </div>

                    {/* Notes */}
                    <div style={{
                      fontSize: '13px', color: C.text, lineHeight: 1.5,
                      fontStyle: lead.priority === 'skip' ? 'italic' : 'normal',
                      opacity: lead.priority === 'skip' ? 0.7 : 1,
                    }}>
                      {lead.notes}
                    </div>

                    {/* Priority badge */}
                    <span style={{
                      fontSize: '10px', fontWeight: 700, padding: '4px 10px',
                      borderRadius: '999px', whiteSpace: 'nowrap',
                      background: pri.bg, color: pri.fg,
                      textTransform: 'uppercase', letterSpacing: '0.5px',
                    }}>
                      {pri.label}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
