import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function CumulativeChart({ data }) {
  if (!data || data.length < 2) return null

  const chartData = data.map(row => ({
    month: row.month,
    cumulative: row.cumulative,
    leads: row.leads,
  }))

  return (
    <div className="glass" style={{ padding: '28px' }}>
      <h2 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 4px', color: '#fff', letterSpacing: '-0.3px' }}>
        Cumulative Growth
      </h2>
      <p style={{ color: '#525252', fontSize: '13px', margin: '0 0 20px' }}>
        Total positive responses over time — showing compounding pipeline momentum
      </p>

      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={chartData} margin={{ top: 5, right: 24, left: -15, bottom: 5 }}>
          <defs>
            <linearGradient id="cumulativeGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10B981" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#10B981" stopOpacity={0.01} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
          <XAxis dataKey="month" tick={{ fill: '#525252', fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: '#525252', fontSize: 11 }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{
              background: 'rgba(15,15,23,0.95)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '12px', fontSize: '13px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
            }}
            labelStyle={{ color: '#fff', fontWeight: 600 }}
            formatter={(value, name) => [
              value,
              name === 'cumulative' ? 'Total Leads' : 'New This Month',
            ]}
          />
          <Area
            type="monotone"
            dataKey="cumulative"
            stroke="#10B981"
            strokeWidth={2.5}
            fill="url(#cumulativeGradient)"
            dot={{ fill: '#10B981', r: 4, strokeWidth: 0 }}
            activeDot={{ r: 6, fill: '#fff', stroke: '#10B981', strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>

      {/* Milestone badges */}
      <div style={{ display: 'flex', gap: '8px', marginTop: '16px', flexWrap: 'wrap' }}>
        {chartData.map((d, i) => (
          <div key={d.month} style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '5px 12px', borderRadius: '20px',
            background: i === chartData.length - 1 ? 'rgba(16,185,129,0.08)' : 'rgba(255,255,255,0.03)',
            border: `1px solid ${i === chartData.length - 1 ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.04)'}`,
          }}>
            <span style={{ fontSize: '12px', color: '#525252', fontWeight: 500 }}>{d.month}</span>
            <span style={{
              fontSize: '13px', fontWeight: 700,
              color: i === chartData.length - 1 ? '#10B981' : '#fff',
            }}>
              {d.cumulative}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
