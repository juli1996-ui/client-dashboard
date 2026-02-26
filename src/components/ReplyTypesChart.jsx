import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'

const COLORS = ['#4a90d9', '#a0a8b8', '#a78bfa', '#fbbf24']

export default function ReplyTypesChart({ data }) {
  const total = data.reduce((s, d) => s + d.value, 0)
  const coloredData = data.map((d, i) => ({ ...d, color: d.color || COLORS[i % COLORS.length] }))

  return (
    <div style={{ background: '#16213e', border: '1px solid #2a2d4a', borderRadius: '16px', padding: '28px' }}>
      <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '20px', fontWeight: 600, color: '#fff', marginBottom: '6px' }}>
        Lead Types
      </h2>
      <p style={{ color: '#a0a8b8', fontSize: '13px', marginBottom: '20px' }}>
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
              <Cell key={i} fill={entry.color} stroke="#16213e" strokeWidth={3} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ background: '#1e2130', border: '1px solid #2a2d4a', borderRadius: '10px', fontSize: '13px' }}
            labelStyle={{ color: '#fff', fontWeight: 600 }}
            formatter={(val, name) => [`${val} (${total > 0 ? ((val / total) * 100).toFixed(1) : 0}%)`, name]}
          />
        </PieChart>
      </ResponsiveContainer>

      {/* External legend matching reference */}
      <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {coloredData.map(item => (
          <div key={item.name} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#a0a8b8' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: item.color, flexShrink: 0 }} />
            <span>{item.name}</span>
            <span style={{ marginLeft: 'auto', fontWeight: 600, color: '#fff' }}>{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
