export default function CampaignTable({ campaigns }) {
  return (
    <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-700">
        <h2 className="text-lg font-semibold text-white">Campaign Analytics</h2>
        <p className="text-sm text-gray-400 mt-0.5">Performance breakdown across all active campaigns</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px]">
          <thead>
            <tr className="border-b border-gray-700/70">
              {['Campaign', 'Emails Sent', 'Opened', 'Replies', 'Open Rate', 'Reply Rate'].map((h, i) => (
                <th
                  key={h}
                  className={`py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${i === 0 ? 'text-left px-6' : 'text-right px-5'}`}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {campaigns.map((c, i) => (
              <tr key={i} className="border-b border-gray-700/40 hover:bg-gray-700/20 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-400 flex-shrink-0" />
                    <span className="text-white text-sm font-medium">{c.name}</span>
                  </div>
                </td>
                <td className="px-5 py-4 text-right text-gray-300 text-sm tabular-nums">
                  {c.emailsSent.toLocaleString()}
                </td>
                <td className="px-5 py-4 text-right text-gray-300 text-sm tabular-nums">
                  {c.emailsOpened.toLocaleString()}
                </td>
                <td className="px-5 py-4 text-right text-gray-300 text-sm tabular-nums">
                  {c.replies}
                </td>
                <td className="px-5 py-4 text-right">
                  <span className="text-blue-400 text-sm font-medium tabular-nums">{c.openRate}%</span>
                </td>
                <td className="px-5 py-4 text-right">
                  <span className={`inline-flex items-center justify-center min-w-[52px] text-xs font-semibold px-2.5 py-1 rounded-full tabular-nums ${
                    c.replyRate >= 3.0
                      ? 'bg-green-500/15 text-green-400'
                      : 'bg-yellow-500/15 text-yellow-400'
                  }`}>
                    {c.replyRate}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
