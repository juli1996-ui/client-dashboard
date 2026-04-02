import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function CumulativeChart({ data }) {
  if (!data || data.length < 2) return null

  const chartData = data.map(row => ({
    month: row.month,
    cumulative: row.cumulative,
    leads: row.leads,
  }))

  return (
    <div style={{ background: '#FFFFFF', border: '1px solid #E8E4DE', borderRadius: '16px', padding: '28px' }}>
      <h2 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 4px', color: '#2D2A26', letterSpacing: '-0.3px', fontFamily: "'Fraunces', Georgia, serif" }}>
        Cumulative Growth
      </h2>
      <p style={{ color: '#8A8580', fontSize: '13px', margin: '0 0 20px', fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}>
        Total positive responses over time — showing compounding pipeline momentum
      </p>

      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={chartData} margin={{ top: 5, right: 24, left: -15, bottom: 5 }}>
          <defs>
            <linearGradient id="cumulativeGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#C2653C" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#C2653C" stopOpacity={0.01} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#F0ECE6" vertical={false} />
          <XAxis dataKey="month" tick={{ fill: '#8A8580', fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: '#8A8580', fontSize: 11 }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{
              background: '#FFFFFF',
              border: '1px solid #E8E4DE',
              borderRadius: '12px', fontSize: '13px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
            }}
            labelStyle={{ color: '#2D2A26', fontWeight: 600 }}
            formatter={(value, name) => [
              value,
              name === 'cumulative' ? 'Total Leads' : 'New This Month',
            ]}
          />
          <Area
            type="monotone"
            dataKey="cumulative"
            stroke="#C2653C"
            strokeWidth={2.5}
            fill="url(#cumulativeGradient)"
            dot={{ fill: '#C2653C', r: 4, strokeWidth: 0 }}
            activeDot={{ r: 6, fill: '#FFFFFF', stroke: '#C2653C', strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>

      {/* Milestone badges */}
      <div style={{ display: 'flex', gap: '8px', marginTop: '16px', flexWrap: 'wrap' }}>
        {chartData.map((d, i) => (
          <div key={d.month} style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '5px 12px', borderRadius: '20px',
            background: i === chartData.length - 1 ? 'rgba(74,124,89,0.08)' : '#FAF8F5',
            border: `1px solid ${i === chartData.length - 1 ? 'rgba(74,124,89,0.2)' : '#F0ECE6'}`,
          }}>
            <span style={{ fontSize: '12px', color: '#8A8580', fontWeight: 500 }}>{d.month}</span>
            <span style={{
              fontSize: '13px', fontWeight: 700,
              color: i === chartData.length - 1 ? '#4A7C59' : '#2D2A26',
            }}>
              {d.cumulative}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
