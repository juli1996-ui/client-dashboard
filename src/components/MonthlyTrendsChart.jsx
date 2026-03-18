import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export default function MonthlyTrendsChart({ data }) {
  const chartData = data.map((row, i) => {
    const prev = i > 0 ? data[i - 1].leads : null
    const growthPct = prev ? Math.round(((row.leads - prev) / prev) * 100) : null
    return {
      month: row.month,
      leads: row.leads,
      leadsPerDay: row.days ? +((row.leads / row.days).toFixed(2)) : null,
      growthLabel: growthPct !== null ? (growthPct > 0 ? `+${growthPct}%` : `${growthPct}%`) : '',
    }
  })

  return (
    <div className="glass" style={{ padding: '28px' }}>
      <h2 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 4px', color: '#fff', letterSpacing: '-0.3px' }}>
        Lead Trend
      </h2>
      <p style={{ color: '#525252', fontSize: '13px', margin: '0 0 20px' }}>
        Monthly lead count and daily pace over time
      </p>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={chartData} margin={{ top: 5, right: 24, left: -15, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
          <XAxis dataKey="month" tick={{ fill: '#525252', fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis
            yAxisId="left"
            tick={{ fill: '#525252', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            tick={{ fill: '#525252', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              background: 'rgba(15,15,23,0.95)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '12px', fontSize: '13px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
            }}
            labelStyle={{ color: '#fff', fontWeight: 600 }}
            itemStyle={{ color: '#A3A3A3' }}
            formatter={(value, name) => [
              name === 'Leads/Day' ? value.toFixed(2) : value,
              name,
            ]}
          />
          <Legend formatter={val => <span style={{ color: '#525252', fontSize: '12px' }}>{val}</span>} />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="leads"
            name="Leads"
            stroke="#3B82F6"
            strokeWidth={2.5}
            dot={{ fill: '#3B82F6', r: 4, strokeWidth: 0 }}
            activeDot={{ r: 6, fill: '#fff', stroke: '#3B82F6', strokeWidth: 2 }}
            label={({ x, y, index }) => {
              const label = chartData[index]?.growthLabel
              if (!label) return null
              const color = label.startsWith('+') ? '#10B981' : '#EF4444'
              return (
                <text x={x} y={y - 14} textAnchor="middle" fill={color} fontSize={11} fontWeight={700}>
                  {label}
                </text>
              )
            }}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="leadsPerDay"
            name="Leads/Day"
            stroke="#10B981"
            strokeWidth={2}
            strokeDasharray="6 4"
            dot={{ fill: '#10B981', r: 3, strokeWidth: 0 }}
            activeDot={{ r: 5, fill: '#fff', stroke: '#10B981', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
