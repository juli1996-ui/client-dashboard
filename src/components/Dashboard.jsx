import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { fetchSheetData } from '../lib/parseSheet'
import { fetchCampaignAnalytics, fetchCampaigns } from '../lib/instantly'
import SummaryCards from './SummaryCards'
import CampaignFunnel from './CampaignFunnel'
import MonthlyTrendsChart from './MonthlyTrendsChart'
import MonthlyBreakdownTable from './MonthlyBreakdownTable'
import ReplyTypesChart from './ReplyTypesChart'
import MarchForecast from './MarchForecast'
import PipelineHealth from './PipelineHealth'
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

    const sheetPromise     = sheetUrl ? fetchSheetData(sheetUrl) : Promise.resolve(null)
    const analyticsPromise = apiKey   ? fetchCampaignAnalytics(apiKey) : Promise.resolve(null)
    const campaignsPromise = apiKey   ? fetchCampaigns(apiKey) : Promise.resolve(null)

    // allSettled so a failing source never blocks the other
    Promise.allSettled([sheetPromise, analyticsPromise, campaignsPromise])
      .then(([sheetResult, analyticsResult, campaignsResult]) => {
        const sheetData = sheetResult.status === 'fulfilled' ? sheetResult.value : null
        const instantly = analyticsResult.status === 'fulfilled' ? analyticsResult.value : null
        const campaigns = campaignsResult.status === 'fulfilled' ? campaignsResult.value : null

        if (sheetResult.status === 'rejected' && sheetUrl) {
          setSheetError(sheetResult.reason?.message || 'Could not load Google Sheet')
        }

        const merged = sheetData || {
          summary: { totalLeads: 0, leadsToday: 0, leadsPerDay: null, emailsSent: null, responseRate: null, openRate: null, meetingsScheduled: 0 },
          replyTypes: [], monthlyTrends: [], projections: null, campaigns: [],
        }

        if (instantly) {
          merged.summary.emailsSent    = instantly.emailsSent
          merged.summary.replies       = instantly.replies
          merged.summary.responseRate  = instantly.responseRate
          merged.summary.openRate      = instantly.openRate
          merged.summary.opportunities = instantly.opportunities
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
      <div style={{ minHeight: '100vh', background: '#1a1a2e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '48px', height: '48px', border: '3px solid #2a2d4a', borderTopColor: '#4a90d9', borderRadius: '50%', margin: '0 auto 16px', animation: 'spin 0.8s linear infinite' }} />
          <p style={{ color: '#a0a8b8', fontSize: '14px' }}>Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#1a1a2e' }}>
      {/* Header */}
      <header style={{ background: '#16213e', borderBottom: '1px solid #2a2d4a', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button
              onClick={() => navigate('/clients')}
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid #2a2d4a', borderRadius: '10px', padding: '8px 16px', color: '#a0a8b8', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
            >
              ← All Clients
            </button>

            <div style={{ width: '1px', height: '24px', background: '#2a2d4a' }} />

            <div>
              <p style={{ color: '#4a90d9', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '3px', margin: '0 0 2px' }}>
                {client?.company_name || 'Dashboard'}
              </p>
              <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '18px', fontWeight: 700, color: '#fff', margin: 0 }}>
                {client?.name || 'Client'}
              </h1>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {!loadingSheet && (
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                fontSize: '11px', fontWeight: 700, padding: '3px 10px', borderRadius: '20px',
                background: sheetError ? 'rgba(248,113,113,0.12)' : data ? 'rgba(46,204,113,0.12)' : 'rgba(160,168,184,0.1)',
                color: sheetError ? '#f87171' : data ? '#2ecc71' : '#a0a8b8',
              }}>
                <span style={{
                  width: '6px', height: '6px', borderRadius: '50%',
                  background: sheetError ? '#f87171' : data ? '#2ecc71' : '#a0a8b8',
                }} className={data && !sheetError ? 'pulse-dot' : ''} />
                {sheetError ? 'Sheet error' : data ? 'Live data' : 'No sheet'}
              </span>
            )}
            {loadingSheet && (
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                fontSize: '11px', fontWeight: 700, padding: '3px 10px', borderRadius: '20px',
                background: 'rgba(74,144,217,0.12)', color: '#4a90d9',
              }}>
                <svg style={{ animation: 'spin 0.8s linear infinite', width: '12px', height: '12px' }} viewBox="0 0 24 24" fill="none">
                  <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Loading...
              </span>
            )}

            <button
              onClick={() => supabase.auth.signOut()}
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid #2a2d4a', borderRadius: '10px', padding: '8px 16px', color: '#a0a8b8', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px' }}>

        {/* Sheet error banner */}
        {sheetError && (
          <div style={{ background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.25)', borderRadius: '14px', padding: '16px 20px', display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '24px' }}>
            <svg style={{ width: '20px', height: '20px', color: '#f87171', flexShrink: 0, marginTop: '1px' }} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div>
              <p style={{ color: '#f87171', fontWeight: 600, fontSize: '14px', margin: '0 0 2px' }}>Could not load Google Sheet</p>
              <p style={{ color: 'rgba(248,113,113,0.7)', fontSize: '12px', margin: 0 }}>{sheetError}</p>
            </div>
          </div>
        )}

        {/* No data configured */}
        {!loadingSheet && !data && !sheetError && !client?.google_sheet_url && (
          <div style={{ background: '#16213e', border: '1px solid #2a2d4a', borderRadius: '14px', padding: '40px 24px', textAlign: 'center', marginBottom: '24px' }}>
            <p style={{ color: '#a0a8b8', fontWeight: 600, fontSize: '15px', margin: '0 0 4px' }}>No Google Sheet connected</p>
            <p style={{ color: '#353d60', fontSize: '13px', margin: 0 }}>Add a <code style={{ color: '#a0a8b8' }}>google_sheet_url</code> to this client in Supabase</p>
          </div>
        )}

        {/* Loading skeleton */}
        {loadingSheet && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
            {[...Array(4)].map((_, i) => (
              <div key={i} style={{ background: '#16213e', border: '1px solid #2a2d4a', borderRadius: '14px', height: '128px', animation: 'pulse 1.5s ease-in-out infinite' }} />
            ))}
          </div>
        )}

        {/* Main content */}
        {data && !loadingSheet && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

            {/* 1. KPI Cards */}
            <section>
              <p style={{ color: '#4a90d9', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '3px', margin: '0 0 16px' }}>
                Overview
              </p>
              <SummaryCards data={data.summary} projections={data.projections} />
            </section>

            {/* 2. Campaign Funnel + Active Campaigns */}
            {(data.summary.emailsSent != null || data.summary.replies != null || data.summary.meetingsScheduled > 0) && (
              <section>
                <CampaignFunnel summary={data.summary} campaigns={data.campaigns} />
              </section>
            )}

            {/* 3. Lead Trend chart (full width) */}
            {data.monthlyTrends.length > 0 && (
              <section>
                <MonthlyTrendsChart data={data.monthlyTrends} />
              </section>
            )}

            {/* 4. Two-column: Monthly Breakdown table + Lead Types donut */}
            {(data.monthlyTrends.length > 0 || data.replyTypes.length > 0) && (
              <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                {data.monthlyTrends.length > 0 && (
                  <MonthlyBreakdownTable
                    monthlyTrends={data.monthlyTrends}
                    projections={data.projections}
                  />
                )}
                {data.replyTypes.length > 0 && <ReplyTypesChart data={data.replyTypes} />}
              </section>
            )}

            {/* 5. March Forecast */}
            {data.projections && data.summary.leadsPerDay && (
              <section>
                <MarchForecast summary={data.summary} projections={data.projections} />
              </section>
            )}

            {/* 6. Pipeline Health */}
            {(data.summary.emailsSent != null || data.summary.replies != null) && (
              <section>
                <PipelineHealth summary={data.summary} projections={data.projections} />
              </section>
            )}

            {/* 7. Monthly Projection (current month vs previous) */}
            {data.projections && (
              <section>
                <ProjectionsChart data={data.projections} />
              </section>
            )}

          </div>
        )}

        <footer style={{ textAlign: 'center', color: '#353d60', fontSize: '12px', paddingTop: '32px', paddingBottom: '16px' }}>
          Lead Gen Jay Client Portal — {data ? 'Live Google Sheets data' : 'Connect a sheet to see live data'}
        </footer>
      </main>
    </div>
  )
}
