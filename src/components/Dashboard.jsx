import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { fetchSheetData } from '../lib/parseSheet'
import { fetchCampaignAnalytics, fetchCampaigns } from '../lib/instantly'
import SummaryCards from './SummaryCards'
import GrowthBanner from './GrowthBanner'
import CampaignFunnel from './CampaignFunnel'
import MonthlyTrendsChart from './MonthlyTrendsChart'
import CumulativeChart from './CumulativeChart'
import MonthlyBreakdownTable from './MonthlyBreakdownTable'
import ReplyTypesChart from './ReplyTypesChart'
import LeadQualityBreakdown from './LeadQualityBreakdown'
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
      <div style={{ minHeight: '100vh', background: '#0A0A0F', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '40px', height: '40px', border: '2px solid rgba(255,255,255,0.06)', borderTopColor: '#3B82F6', borderRadius: '50%', margin: '0 auto 16px', animation: 'spin 0.8s linear infinite' }} />
          <p style={{ color: '#525252', fontSize: '14px' }}>Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0F', position: 'relative' }}>
      {/* Gradient mesh */}
      <div className="bg-mesh" />

      {/* Header */}
      <header style={{
        background: 'rgba(10,10,15,0.8)',
        backdropFilter: 'blur(16px) saturate(150%)',
        WebkitBackdropFilter: 'blur(16px) saturate(150%)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        position: 'sticky', top: 0, zIndex: 10,
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button
              onClick={() => navigate('/clients')}
              className="btn-ghost"
            >
              ← All Clients
            </button>

            <div style={{ width: '1px', height: '24px', background: 'rgba(255,255,255,0.06)' }} />

            <div>
              <p style={{ color: '#3B82F6', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '3px', margin: '0 0 2px' }}>
                {client?.company_name || 'Dashboard'}
              </p>
              <h1 style={{ fontSize: '16px', fontWeight: 700, color: '#fff', margin: 0, letterSpacing: '-0.3px' }}>
                {client?.name || 'Client'}
              </h1>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {!loadingSheet && (
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                fontSize: '11px', fontWeight: 600, padding: '4px 12px', borderRadius: '20px',
                background: sheetError ? 'rgba(239,68,68,0.08)' : data ? 'rgba(16,185,129,0.08)' : 'rgba(255,255,255,0.04)',
                color: sheetError ? '#EF4444' : data ? '#10B981' : '#525252',
              }}>
                <span style={{
                  width: '6px', height: '6px', borderRadius: '50%',
                  background: sheetError ? '#EF4444' : data ? '#10B981' : '#525252',
                }} className={data && !sheetError ? 'pulse-dot' : ''} />
                {sheetError ? 'Sheet error' : data ? 'Live data' : 'No sheet'}
              </span>
            )}
            {loadingSheet && (
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                fontSize: '11px', fontWeight: 600, padding: '4px 12px', borderRadius: '20px',
                background: 'rgba(59,130,246,0.08)', color: '#3B82F6',
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
              className="btn-ghost"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px', position: 'relative', zIndex: 1 }}>

        {/* Sheet error banner */}
        {sheetError && (
          <div style={{
            background: 'rgba(239,68,68,0.06)',
            border: '1px solid rgba(239,68,68,0.15)',
            borderRadius: '16px', padding: '16px 20px',
            display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '24px',
          }}>
            <svg style={{ width: '20px', height: '20px', color: '#EF4444', flexShrink: 0, marginTop: '1px' }} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div>
              <p style={{ color: '#EF4444', fontWeight: 600, fontSize: '14px', margin: '0 0 2px' }}>Could not load Google Sheet</p>
              <p style={{ color: 'rgba(239,68,68,0.6)', fontSize: '12px', margin: 0 }}>{sheetError}</p>
            </div>
          </div>
        )}

        {/* No data configured */}
        {!loadingSheet && !data && !sheetError && !client?.google_sheet_url && (
          <div className="glass" style={{ padding: '40px 24px', textAlign: 'center', marginBottom: '24px' }}>
            <p style={{ color: '#A3A3A3', fontWeight: 600, fontSize: '15px', margin: '0 0 4px' }}>No Google Sheet connected</p>
            <p style={{ color: '#2A2A3A', fontSize: '13px', margin: 0 }}>Add a <code style={{ color: '#A3A3A3', background: 'rgba(255,255,255,0.04)', padding: '2px 6px', borderRadius: '4px' }}>google_sheet_url</code> to this client in Supabase</p>
          </div>
        )}

        {/* Loading skeleton */}
        {loadingSheet && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
              {[...Array(4)].map((_, i) => (
                <div key={i} className="skeleton" style={{ height: '128px' }} />
              ))}
            </div>
            <div className="skeleton" style={{ height: '200px' }} />
            <div className="skeleton" style={{ height: '320px' }} />
          </div>
        )}

        {/* Main content */}
        {data && !loadingSheet && (() => {
          const daysInactive = data.projections?.campaignPaused
            ? new Date().getDate() - (data.projections.lastActiveDay || 0)
            : 0
          return (
          <div className="animate-stagger" style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>

            {/* Growth Banner */}
            {data.growth && data.growth.growthPct > 0 && (
              <section>
                <p style={{ color: '#10B981', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '3px', margin: '0 0 14px' }}>
                  Campaign Performance
                </p>
                <GrowthBanner growth={data.growth} projections={data.projections} />
              </section>
            )}

            {/* Campaign Paused banner */}
            {data.projections?.campaignPaused && (
              <section>
                <div className="glass" style={{
                  background: 'linear-gradient(135deg, rgba(245,158,11,0.06) 0%, rgba(239,68,68,0.04) 100%)',
                  borderColor: 'rgba(245,158,11,0.15)',
                  padding: '24px 28px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                    <div style={{
                      width: '40px', height: '40px', borderRadius: '12px', flexShrink: 0,
                      background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.15)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '18px',
                    }}>
                      ⚡
                    </div>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#F59E0B', margin: '0 0 8px', letterSpacing: '-0.2px' }}>
                        Untapped Potential — Campaign Contacts Exhausted
                      </h3>
                      <p style={{ color: '#A3A3A3', fontSize: '14px', lineHeight: 1.7, margin: '0 0 16px' }}>
                        The campaign ran out of contacts on <strong style={{ color: '#fff' }}>March {data.projections.lastActiveDay}</strong>, generating
                        {' '}<strong style={{ color: '#fff' }}>{data.projections.leadsActual} leads in just {data.projections.activeDays} days</strong> ({data.projections.dailyRate.toFixed(2)} leads/day).
                        {' '}At this pace, a full month would have produced <strong style={{ color: '#10B981' }}>~{data.projections.leadsIfFullMonth} leads</strong>.
                      </p>
                      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                        {[
                          { value: `~${data.projections.leadsIfFullMonth}`, label: 'Full Month Potential', color: '#10B981' },
                          { value: `${data.projections.dailyRate.toFixed(2)}/day`, label: 'Active Pace', color: '#F59E0B' },
                          { value: `${daysInactive} days`, label: 'Inactive', color: '#EF4444' },
                        ].map(stat => (
                          <div key={stat.label} className="glass" style={{ padding: '12px 18px', textAlign: 'center' }}>
                            <p style={{ fontSize: '22px', fontWeight: 700, color: stat.color, lineHeight: 1, margin: '0 0 4px' }}>
                              {stat.value}
                            </p>
                            <p style={{ color: '#525252', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600, margin: 0 }}>
                              {stat.label}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* KPI Cards */}
            <section>
              <p style={{ color: '#3B82F6', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '3px', margin: '0 0 14px' }}>
                Overview
              </p>
              <SummaryCards data={data.summary} projections={data.projections} />
            </section>

            {/* Campaign Funnel */}
            {(data.summary.emailsSent != null || data.summary.replies != null || data.summary.meetingsScheduled > 0) && (
              <section>
                <CampaignFunnel summary={data.summary} campaigns={data.campaigns} />
              </section>
            )}

            {/* Lead Trend chart */}
            {data.monthlyTrends.length > 0 && (
              <section>
                <MonthlyTrendsChart data={data.monthlyTrends} />
              </section>
            )}

            {/* Cumulative Growth chart */}
            {data.monthlyTrends.length > 1 && (
              <section>
                <CumulativeChart data={data.monthlyTrends} />
              </section>
            )}

            {/* Two-column: Monthly Breakdown + Lead Types */}
            {(data.monthlyTrends.length > 0 || data.replyTypes.length > 0) && (
              <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                {data.monthlyTrends.length > 0 && (
                  <MonthlyBreakdownTable
                    monthlyTrends={data.monthlyTrends}
                    projections={data.projections}
                  />
                )}
                {data.replyTypes.length > 0 && <ReplyTypesChart data={data.replyTypes} />}
              </section>
            )}

            {/* Lead Quality Breakdown */}
            {data.replyTypes.length > 0 && (
              <section>
                <LeadQualityBreakdown replyTypes={data.replyTypes} totalLeads={data.summary.totalLeads} />
              </section>
            )}

            {/* Forecast */}
            {data.projections && data.summary.leadsPerDay && (
              <section>
                <MarchForecast summary={data.summary} projections={data.projections} />
              </section>
            )}

            {/* Pipeline Health */}
            {(data.summary.emailsSent != null || data.summary.replies != null) && (
              <section>
                <PipelineHealth summary={data.summary} projections={data.projections} />
              </section>
            )}

            {/* Monthly Projection */}
            {data.projections && (
              <section>
                <ProjectionsChart data={data.projections} />
              </section>
            )}

          </div>
          )
        })()}

        <footer style={{ textAlign: 'center', color: '#1A1A27', fontSize: '12px', paddingTop: '32px', paddingBottom: '16px' }}>
          Lead Gen Jay Client Portal — {data ? 'Live Google Sheets data' : 'Connect a sheet to see live data'}
        </footer>
      </main>
    </div>
  )
}
