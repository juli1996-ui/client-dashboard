import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { fetchSheetData } from '../lib/parseSheet'
import { fetchCampaignAnalytics, fetchCampaigns } from '../lib/instantly'
import SummaryCards from './SummaryCards'
import CampaignTable from './CampaignTable'
import ReplyTypesChart from './ReplyTypesChart'
import MonthlyTrendsChart from './MonthlyTrendsChart'
import ProjectionsChart from './ProjectionsChart'

export default function Dashboard() {
  const { clientId } = useParams()
  const navigate = useNavigate()

  const [client, setClient] = useState(null)
  const [data, setData] = useState(null)
  const [loadingClient, setLoadingClient] = useState(true)
  const [loadingSheet, setLoadingSheet] = useState(false)
  const [sheetError, setSheetError] = useState(null)

  // Fetch client record from Supabase
  useEffect(() => {
    async function fetchClient() {
      const { data: row, error } = await supabase
        .from('clients')
        .select('*')
        .eq('id', clientId)
        .single()

      if (!error && row) setClient(row)
      setLoadingClient(false)
    }
    fetchClient()
  }, [clientId])

  // Fetch Google Sheet + Instantly in parallel once client is loaded
  useEffect(() => {
    if (!client) return

    const sheetUrl = client.google_sheet_url || client.google_sheet_id
    const apiKey   = client.instantly_api_key

    if (!sheetUrl && !apiKey) return

    setLoadingSheet(true)
    setSheetError(null)

    const sheetPromise    = sheetUrl ? fetchSheetData(sheetUrl) : Promise.resolve(null)
    const analyticsPromise = apiKey  ? fetchCampaignAnalytics(apiKey) : Promise.resolve(null)
    const campaignsPromise = apiKey  ? fetchCampaigns(apiKey) : Promise.resolve(null)

    // allSettled so a failing source never blocks the other
    Promise.allSettled([sheetPromise, analyticsPromise, campaignsPromise])
      .then(([sheetResult, analyticsResult, campaignsResult]) => {
        // Base structure from Google Sheet
        const sheetData = sheetResult.status === 'fulfilled' ? sheetResult.value : null
        const instantly  = analyticsResult.status === 'fulfilled' ? analyticsResult.value : null
        const campaigns  = campaignsResult.status === 'fulfilled' ? campaignsResult.value : null

        // Surface sheet errors if sheet failed
        if (sheetResult.status === 'rejected' && sheetUrl) {
          setSheetError(sheetResult.reason?.message || 'Could not load Google Sheet')
        }

        const merged = sheetData || {
          summary: { totalLeads: 0, leadsToday: 0, emailsSent: null, responseRate: null, openRate: null, meetingsScheduled: 0 },
          replyTypes: [], monthlyTrends: [], projections: null, campaigns: [],
        }

        if (instantly) {
          merged.summary.emailsSent   = instantly.emailsSent
          merged.summary.responseRate = instantly.responseRate
          merged.summary.openRate     = instantly.openRate
        }

        if (campaigns && campaigns.length > 0) {
          merged.campaigns = campaigns
        }

        setData(merged)
        setLoadingSheet(false)
      })
  }, [client])

  if (loadingClient) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4" />
          <p className="text-gray-400 text-sm">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/clients')}
              className="flex items-center gap-1.5 px-3 py-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-xl transition text-sm font-medium"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="hidden sm:inline">All Clients</span>
            </button>

            <div className="w-px h-6 bg-gray-700" />

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow shadow-green-500/20">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Dashboard</p>
                <h1 className="text-base font-bold text-white leading-tight">{client?.name || 'Client'}</h1>
              </div>
              {client?.company_name && (
                <span className="hidden sm:inline-flex items-center px-3 py-1 rounded-full bg-gray-700 text-gray-300 text-xs font-medium border border-gray-600">
                  {client.company_name}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Sheet status badge */}
            {!loadingSheet && (
              <span className={`hidden sm:inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${
                sheetError
                  ? 'bg-red-500/10 text-red-400'
                  : data
                    ? 'bg-green-500/10 text-green-400'
                    : 'bg-gray-700 text-gray-500'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${sheetError ? 'bg-red-400' : data ? 'bg-green-400 animate-pulse' : 'bg-gray-500'}`} />
                {sheetError ? 'Sheet error' : data ? 'Live data' : 'No sheet'}
              </span>
            )}
            {loadingSheet && (
              <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400">
                <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Loading sheet...
              </span>
            )}

            <button
              onClick={() => supabase.auth.signOut()}
              className="flex items-center gap-1.5 px-3 py-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-xl transition text-sm font-medium"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">

        {/* Sheet error banner */}
        {sheetError && (
          <div className="bg-red-900/30 border border-red-700/50 rounded-2xl px-5 py-4 flex items-start gap-3">
            <svg className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="text-red-400 font-medium text-sm">Could not load Google Sheet</p>
              <p className="text-red-400/70 text-xs mt-0.5">{sheetError}</p>
            </div>
          </div>
        )}

        {/* No sheet configured */}
        {!loadingSheet && !data && !sheetError && !client?.google_sheet_url && (
          <div className="bg-gray-800 border border-gray-700 rounded-2xl px-5 py-6 text-center">
            <svg className="w-10 h-10 text-gray-600 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-gray-400 font-medium">No Google Sheet connected</p>
            <p className="text-gray-600 text-sm mt-1">Add a <code className="text-gray-500">google_sheet_url</code> to this client in Supabase</p>
          </div>
        )}

        {/* Loading sheet skeleton */}
        {loadingSheet && (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-gray-800 rounded-2xl border border-gray-700 h-32 animate-pulse" />
            ))}
          </div>
        )}

        {/* Real data */}
        {data && !loadingSheet && (
          <>
            <section>
              <h2 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-4">Overview</h2>
              <SummaryCards data={data.summary} />
            </section>

            {data.campaigns.length > 0 && (
              <section>
                <CampaignTable campaigns={data.campaigns} />
              </section>
            )}

            <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {data.replyTypes.length > 0 && <ReplyTypesChart data={data.replyTypes} />}
              {data.monthlyTrends.length > 0 && <MonthlyTrendsChart data={data.monthlyTrends} />}
            </section>

            {data.projections && (
              <section>
                <ProjectionsChart data={data.projections} />
              </section>
            )}
          </>
        )}

        <footer className="text-center text-gray-700 text-xs pb-4">
          Lead Gen Jay Client Portal — {data ? 'Live Google Sheets data' : 'Connect a sheet to see live data'}
        </footer>
      </main>
    </div>
  )
}
