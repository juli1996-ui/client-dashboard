import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import Header from './Header'
import SummaryCards from './SummaryCards'
import CampaignTable from './CampaignTable'
import ReplyTypesChart from './ReplyTypesChart'
import MonthlyTrendsChart from './MonthlyTrendsChart'
import ProjectionsChart from './ProjectionsChart'

// Mock data — replace with Google Sheets fetch once sheet ID is configured
function getMockData() {
  return {
    summary: {
      totalLeads: 247,
      leadsToday: 8,
      emailsSent: 12450,
      responseRate: 3.4,
      meetingsScheduled: 18,
    },
    campaigns: [
      { name: 'Q1 SaaS Decision Makers', emailsSent: 3200, emailsOpened: 864, replies: 112, openRate: 27.0, replyRate: 3.5 },
      { name: 'E-commerce Directors Outreach', emailsSent: 2800, emailsOpened: 756, replies: 89, openRate: 27.0, replyRate: 3.2 },
      { name: 'Logistics VP Campaign', emailsSent: 2100, emailsOpened: 567, replies: 67, openRate: 27.0, replyRate: 3.2 },
      { name: 'Finance Executives Q1', emailsSent: 1850, emailsOpened: 499, replies: 58, openRate: 27.0, replyRate: 3.1 },
      { name: 'Healthcare CTO Targeting', emailsSent: 1200, emailsOpened: 324, replies: 41, openRate: 27.0, replyRate: 3.4 },
      { name: 'Real Estate Investors', emailsSent: 1300, emailsOpened: 351, replies: 37, openRate: 27.0, replyRate: 2.8 },
    ],
    replyTypes: [
      { name: 'Interested', value: 89, color: '#10B981' },
      { name: 'Not Interested', value: 142, color: '#EF4444' },
      { name: 'Out of Office', value: 67, color: '#F59E0B' },
      { name: 'Wrong Person', value: 48, color: '#8B5CF6' },
      { name: 'Unsubscribe', value: 31, color: '#6B7280' },
    ],
    monthlyTrends: [
      { month: 'Sep', leads: 28, meetings: 2 },
      { month: 'Oct', leads: 35, meetings: 3 },
      { month: 'Nov', leads: 42, meetings: 4 },
      { month: 'Dec', leads: 38, meetings: 3 },
      { month: 'Jan', leads: 51, meetings: 4 },
      { month: 'Feb', leads: 53, meetings: 5 },
    ],
    projections: {
      leadsActual: 53,
      leadsProjected: 78,
      meetingsActual: 5,
      meetingsProjected: 8,
    },
  }
}

export default function Dashboard({ session }) {
  const [client, setClient] = useState(null)
  const [loading, setLoading] = useState(true)
  const [data] = useState(getMockData)

  useEffect(() => {
    async function fetchClient() {
      const { data: row, error } = await supabase
        .from('clients')
        .select('*')
        .eq('email', session.user.email)
        .single()

      if (!error && row) setClient(row)
      setLoading(false)
    }
    fetchClient()
  }, [session])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4" />
          <p className="text-gray-400 text-sm">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Header client={client} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Summary KPIs */}
        <section>
          <h2 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-4">Overview</h2>
          <SummaryCards data={data.summary} />
        </section>

        {/* Campaign Table */}
        <section>
          <CampaignTable campaigns={data.campaigns} />
        </section>

        {/* Charts Grid */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ReplyTypesChart data={data.replyTypes} />
          <MonthlyTrendsChart data={data.monthlyTrends} />
        </section>

        {/* Projections */}
        <section>
          <ProjectionsChart data={data.projections} />
        </section>

        {/* Footer */}
        <footer className="text-center text-gray-700 text-xs pb-4">
          Lead Gen Jay Client Portal — Data updates every 24h
        </footer>
      </main>
    </div>
  )
}
