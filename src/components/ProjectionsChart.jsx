import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts'

export default function ProjectionsChart({ data }) {
  const chartData = [
    { label: 'Leads', actual: data.leadsActual, projected: data.leadsProjected },
    { label: 'Meetings', actual: data.meetingsActual, projected: data.meetingsProjected },
  ]

  const leadsProgress = Math.round((data.leadsActual / data.leadsProjected) * 100)
  const meetingsProgress = Math.round((data.meetingsActual / data.meetingsProjected) * 100)

  return (
    <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6">
      <h2 className="text-lg font-semibold text-white">End-of-Month Projections</h2>
      <p className="text-sm text-gray-400 mt-0.5 mb-6">Actual vs projected pace for February 2026</p>

      {/* Progress cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-750 bg-gray-700/40 rounded-xl p-4 border border-gray-700">
          <div className="flex items-end justify-between mb-3">
            <div>
              <p className="text-gray-400 text-xs font-medium uppercase tracking-wide">Leads Projected</p>
              <p className="text-3xl font-bold text-green-400 mt-1 tabular-nums">{data.leadsProjected}</p>
            </div>
            <p className="text-gray-500 text-sm tabular-nums">{data.leadsActual} so far</p>
          </div>
          <div className="h-2 bg-gray-600 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-400 rounded-full transition-all"
              style={{ width: `${leadsProgress}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1.5">{leadsProgress}% of projection reached</p>
        </div>

        <div className="bg-gray-700/40 rounded-xl p-4 border border-gray-700">
          <div className="flex items-end justify-between mb-3">
            <div>
              <p className="text-gray-400 text-xs font-medium uppercase tracking-wide">Meetings Projected</p>
              <p className="text-3xl font-bold text-blue-400 mt-1 tabular-nums">{data.meetingsProjected}</p>
            </div>
            <p className="text-gray-500 text-sm tabular-nums">{data.meetingsActual} scheduled</p>
          </div>
          <div className="h-2 bg-gray-600 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-400 rounded-full transition-all"
              style={{ width: `${meetingsProgress}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1.5">{meetingsProgress}% of projection reached</p>
        </div>
      </div>

      {/* Bar chart */}
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={chartData} margin={{ top: 5, right: 10, left: -15, bottom: 5 }} barGap={6} barCategoryGap="35%">
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fill: '#6B7280', fontSize: 13 }}
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
            cursor={{ fill: 'rgba(255,255,255,0.03)' }}
          />
          <Legend
            formatter={(val) => (
              <span style={{ color: '#9CA3AF', fontSize: '13px' }}>{val}</span>
            )}
          />
          <Bar dataKey="actual" name="Actual" fill="#10B981" radius={[6, 6, 0, 0]} />
          <Bar dataKey="projected" name="Projected" fill="#3B82F6" radius={[6, 6, 0, 0]} fillOpacity={0.6} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
