import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'

const COLORS = ['#C2653C', '#4A7C59', '#B8860B', '#8A8580']

export default function ReplyTypesChart({ data }) {
  const total = data.reduce((s, d) => s + d.value, 0)
  const coloredData = data.map((d, i) => ({ ...d, color: d.color || COLORS[i % COLORS.length] }))

  return (
    <div style={{ background: '#FFFFFF', border: '1px solid #E8E4DE', borderRadius: '16px', padding: '28px' }}>
      <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#2D2A26', marginBottom: '4px', letterSpacing: '-0.3px', fontFamily: "'Fraunces', Georgia, serif" }}>
        Lead Types
      </h2>
      <p style={{ color: '#8A8580', fontSize: '13px', marginBottom: '20px', fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}>
        How leads are responding to outreach
      </p>

      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={coloredData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={95}
            paddingAngle={3}
            dataKey="value"
            labelLine={false}
          >
            {coloredData.map((entry, i) => (
              <Cell key={i} fill={entry.color} stroke="#FFFFFF" strokeWidth={2} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              background: '#FFFFFF',
              border: '1px solid #E8E4DE',
              borderRadius: '12px', fontSize: '13px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
            }}
            labelStyle={{ color: '#2D2A26', fontWeight: 600 }}
            formatter={(val, name) => [`${val} (${total > 0 ? ((val / total) * 100).toFixed(1) : 0}%)`, name]}
          />
        </PieChart>
      </ResponsiveContainer>

      <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {coloredData.map(item => (
          <div key={item.name} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#8A8580' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: item.color, flexShrink: 0 }} />
            <span>{item.name}</span>
            <span style={{ marginLeft: 'auto', fontWeight: 600, color: '#2D2A26' }}>{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
