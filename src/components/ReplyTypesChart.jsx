import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'

const COLORS = ['#3B82F6', '#A3A3A3', '#8B5CF6', '#F59E0B']

export default function ReplyTypesChart({ data }) {
  const total = data.reduce((s, d) => s + d.value, 0)
  const coloredData = data.map((d, i) => ({ ...d, color: d.color || COLORS[i % COLORS.length] }))

  return (
    <div className="glass" style={{ padding: '28px' }}>
      <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', marginBottom: '4px', letterSpacing: '-0.3px' }}>
        Lead Types
      </h2>
      <p style={{ color: '#525252', fontSize: '13px', marginBottom: '20px' }}>
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
              <Cell key={i} fill={entry.color} stroke="rgba(10,10,15,0.8)" strokeWidth={2} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              background: 'rgba(15,15,23,0.95)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '12px', fontSize: '13px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
            }}
            labelStyle={{ color: '#fff', fontWeight: 600 }}
            formatter={(val, name) => [`${val} (${total > 0 ? ((val / total) * 100).toFixed(1) : 0}%)`, name]}
          />
        </PieChart>
      </ResponsiveContainer>

      <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {coloredData.map(item => (
          <div key={item.name} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#A3A3A3' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: item.color, flexShrink: 0 }} />
            <span>{item.name}</span>
            <span style={{ marginLeft: 'auto', fontWeight: 600, color: '#fff' }}>{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
