const cards = (data) => [
  {
    title: 'Total Leads',
    value: (data.totalLeads || 0).toLocaleString(),
    sub: 'From Google Sheet',
    positive: null,
    color: 'text-green-400',
    bg: 'bg-green-500/10',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    title: 'Emails Sent',
    value: data.emailsSent != null ? data.emailsSent.toLocaleString() : '—',
    sub: 'From Instantly',
    positive: null,
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    title: 'Open Rate',
    value: data.openRate != null ? `${data.openRate}%` : '—',
    sub: 'From Instantly',
    positive: null,
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    ),
  },
  {
    title: 'Reply Rate',
    value: data.responseRate != null ? `${data.responseRate}%` : '—',
    sub: 'From Instantly',
    positive: null,
    color: 'text-yellow-400',
    bg: 'bg-yellow-500/10',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
      </svg>
    ),
  },
  {
    title: 'Meetings Scheduled',
    value: data.meetingsScheduled || 0,
    sub: 'From Google Sheet',
    positive: null,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
]

export default function SummaryCards({ data }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
      {cards(data).map((card) => (
        <div
          key={card.title}
          className="bg-gray-800 rounded-2xl p-5 border border-gray-700 hover:border-gray-600 transition-colors"
        >
          <div className={`inline-flex p-2 rounded-xl ${card.bg} ${card.color} mb-3`}>
            {card.icon}
          </div>
          <p className="text-gray-400 text-xs font-medium truncate">{card.title}</p>
          <p className="text-2xl font-bold text-white mt-1 tabular-nums">{card.value}</p>
          <p className="text-xs mt-1 text-gray-500">{card.sub}</p>
        </div>
      ))}
    </div>
  )
}
