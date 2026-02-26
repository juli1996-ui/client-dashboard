import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export default function MonthlyTrendsChart({ data }) {
  const chartData = data.map(row => ({
    month: row.month,
    leads: row.leads,
    leadsPerDay: row.days ? +((row.leads / row.days).toFixed(2)) : null,
  }))

  return (
    <div style={{ background: '#16213e', border: '1px solid #2a2d4a', borderRadius: '16px', padding: '28px' }}>
      <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '20px', fontWeight: 600, margin: '0 0 4px', color: '#fff' }}>
        Lead Trend
      </h2>
      <p style={{ color: '#a0a8b8', fontSize: '13px', margin: '0 0 20px' }}>
        Monthly lead count and daily pace over time
      </p>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={chartData} margin={{ top: 5, right: 24, left: -15, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
          <XAxis dataKey="month" tick={{ fill: '#a0a8b8', fontSize: 12 }} axisLine={false} tickLine={false} />

          {/* Left axis: monthly lead count */}
          <YAxis
            yAxisId="left"
            tick={{ fill: '#a0a8b8', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />

          {/* Right axis: leads per day */}
          <YAxis
            yAxisId="right"
            orientation="right"
            tick={{ fill: '#a0a8b8', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />

          <Tooltip
            contentStyle={{ background: '#1e2130', border: '1px solid #2a2d4a', borderRadius: '10px', fontSize: '13px' }}
            labelStyle={{ color: '#fff', fontWeight: 600 }}
            itemStyle={{ color: '#a0a8b8' }}
            formatter={(value, name) => [
              name === 'Leads/Day' ? value.toFixed(2) : value,
              name,
            ]}
          />
          <Legend formatter={val => <span style={{ color: '#a0a8b8', fontSize: '13px' }}>{val}</span>} />

          <Line
            yAxisId="left"
            type="monotone"
            dataKey="leads"
            name="Leads"
            stroke="#4a90d9"
            strokeWidth={3}
            dot={{ fill: '#4a90d9', r: 5, strokeWidth: 0 }}
            activeDot={{ r: 7, fill: '#fff', stroke: '#4a90d9', strokeWidth: 2 }}
          />

          <Line
            yAxisId="right"
            type="monotone"
            dataKey="leadsPerDay"
            name="Leads/Day"
            stroke="#2ecc71"
            strokeWidth={2}
            strokeDasharray="6 4"
            dot={{ fill: '#2ecc71', r: 4, strokeWidth: 0 }}
            activeDot={{ r: 6, fill: '#fff', stroke: '#2ecc71', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
