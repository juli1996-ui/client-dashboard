import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
} from 'recharts'

const RADIAN = Math.PI / 180

function CustomLabel({ cx, cy, midAngle, innerRadius, outerRadius, percent }) {
  if (percent < 0.06) return null
  const r = innerRadius + (outerRadius - innerRadius) * 0.55
  const x = cx + r * Math.cos(-midAngle * RADIAN)
  const y = cy + r * Math.sin(-midAngle * RADIAN)
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={700}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  )
}

export default function ReplyTypesChart({ data }) {
  const total = data.reduce((s, d) => s + d.value, 0)

  return (
    <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6">
      <h2 className="text-lg font-semibold text-white">Types of Replies</h2>
      <p className="text-sm text-gray-400 mt-0.5 mb-5">{total.toLocaleString()} total replies analyzed</p>

      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={65}
            outerRadius={110}
            paddingAngle={3}
            dataKey="value"
            labelLine={false}
            label={<CustomLabel />}
          >
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.color} stroke="transparent" />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: '#1F2937',
              border: '1px solid #374151',
              borderRadius: '12px',
              fontSize: '13px',
            }}
            labelStyle={{ color: '#fff', fontWeight: 600 }}
            itemStyle={{ color: '#9CA3AF' }}
            formatter={(val, name) => [`${val} (${((val / total) * 100).toFixed(1)}%)`, name]}
          />
          <Legend
            iconType="circle"
            iconSize={8}
            formatter={(val) => (
              <span style={{ color: '#9CA3AF', fontSize: '13px' }}>{val}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
