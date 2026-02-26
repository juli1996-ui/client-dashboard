import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts'

export default function MonthlyTrendsChart({ data }) {
  return (
    <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6">
      <h2 className="text-lg font-semibold text-white">Monthly Trends</h2>
      <p className="text-sm text-gray-400 mt-0.5 mb-5">Leads and meetings generated over time</p>

      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={data} margin={{ top: 5, right: 10, left: -15, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
          <XAxis
            dataKey="month"
            tick={{ fill: '#6B7280', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: '#6B7280', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1F2937',
              border: '1px solid #374151',
              borderRadius: '12px',
              fontSize: '13px',
            }}
            labelStyle={{ color: '#fff', fontWeight: 600 }}
            itemStyle={{ color: '#9CA3AF' }}
          />
          <Legend
            formatter={(val) => (
              <span style={{ color: '#9CA3AF', fontSize: '13px' }}>{val}</span>
            )}
          />
          <Line
            type="monotone"
            dataKey="leads"
            name="Leads"
            stroke="#10B981"
            strokeWidth={2.5}
            dot={{ fill: '#10B981', r: 4, strokeWidth: 0 }}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="meetings"
            name="Meetings"
            stroke="#3B82F6"
            strokeWidth={2.5}
            dot={{ fill: '#3B82F6', r: 4, strokeWidth: 0 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
