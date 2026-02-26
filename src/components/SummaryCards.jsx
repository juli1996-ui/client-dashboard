const cards = (data) => [
  {
    title: 'Total Leads',
    value: data.totalLeads.toLocaleString(),
    sub: '+12% vs last month',
    positive: true,
    color: 'text-green-400',
    bg: 'bg-green-500/10',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    title: 'Leads Today',
    value: data.leadsToday,
    sub: '+3 vs yesterday',
    positive: true,
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
      </svg>
    ),
  },
  {
    title: 'Emails Sent',
    value: data.emailsSent.toLocaleString(),
    sub: 'This month',
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
    title: 'Response Rate',
    value: `${data.responseRate}%`,
    sub: '+0.4% vs last month',
    positive: true,
    color: 'text-yellow-400',
    bg: 'bg-yellow-500/10',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    title: 'Meetings Scheduled',
    value: data.meetingsScheduled,
    sub: '+2 this week',
    positive: true,
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
          {card.positive !== null ? (
            <p className={`text-xs mt-1 font-medium ${card.positive ? 'text-green-400' : 'text-red-400'}`}>
              {card.sub}
            </p>
          ) : (
            <p className="text-xs mt-1 text-gray-500">{card.sub}</p>
          )}
        </div>
      ))}
    </div>
  )
}
