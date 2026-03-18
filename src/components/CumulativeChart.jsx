import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function CumulativeChart({ data }) {
  if (!data || data.length < 2) return null

  const chartData = data.map(row => ({
    month: row.month,
    cumulative: row.cumulative,
    leads: row.leads,
  }))

  return (
    <div style={{ background: '#16213e', border: '1px solid #2a2d4a', borderRadius: '16px', padding: '28px' }}>
      <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '20px', fontWeight: 600, margin: '0 0 4px', color: '#fff' }}>
        Cumulative Growth
      </h2>
      <p style={{ color: '#a0a8b8', fontSize: '13px', margin: '0 0 20px' }}>
        Total positive responses over time — showing compounding pipeline momentum
      </p>

      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={chartData} margin={{ top: 5, right: 24, left: -15, bottom: 5 }}>
          <defs>
            <linearGradient id="cumulativeGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2ecc71" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#2ecc71" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
          <XAxis dataKey="month" tick={{ fill: '#a0a8b8', fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: '#a0a8b8', fontSize: 11 }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{ background: '#1e2130', border: '1px solid #2a2d4a', borderRadius: '10px', fontSize: '13px' }}
            labelStyle={{ color: '#fff', fontWeight: 600 }}
            formatter={(value, name) => [
              value,
              name === 'cumulative' ? 'Total Leads' : 'New This Month',
            ]}
          />
          <Area
            type="monotone"
            dataKey="cumulative"
            stroke="#2ecc71"
            strokeWidth={3}
            fill="url(#cumulativeGradient)"
            dot={{ fill: '#2ecc71', r: 5, strokeWidth: 0 }}
            activeDot={{ r: 7, fill: '#fff', stroke: '#2ecc71', strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>

      {/* Milestone badges */}
      <div style={{ display: 'flex', gap: '10px', marginTop: '16px', flexWrap: 'wrap' }}>
        {chartData.map((d, i) => (
          <div key={d.month} style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '6px 12px', borderRadius: '20px',
            background: i === chartData.length - 1 ? 'rgba(46,204,113,0.12)' : 'rgba(255,255,255,0.04)',
            border: `1px solid ${i === chartData.length - 1 ? 'rgba(46,204,113,0.3)' : '#2a2d4a'}`,
          }}>
            <span style={{ fontSize: '12px', color: '#a0a8b8', fontWeight: 500 }}>{d.month}</span>
            <span style={{
              fontSize: '13px', fontWeight: 700,
              color: i === chartData.length - 1 ? '#2ecc71' : '#fff',
            }}>
              {d.cumulative}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
