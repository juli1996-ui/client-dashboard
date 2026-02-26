import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function ClientSelector() {
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
  }

  useEffect(() => {
    async function fetchClients() {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('name')

      if (!error && data) setClients(data)
      setLoading(false)
    }
    fetchClients()
  }, [])

  const filtered = clients.filter(c =>
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.company_name?.toLowerCase().includes(search.toLowerCase())
  )

  const getInitials = (name) =>
    name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?'

  const colors = [
    'bg-green-500', 'bg-blue-500', 'bg-purple-500',
    'bg-yellow-500', 'bg-pink-500', 'bg-indigo-500',
    'bg-orange-500', 'bg-teal-500',
  ]

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center shadow shadow-green-500/20">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Lead Gen Jay</p>
              <h1 className="text-base font-bold text-white leading-tight">Client Portal</h1>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-1.5 px-3 py-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-xl transition text-sm font-medium"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Title + Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white">All Clients</h2>
            <p className="text-gray-400 text-sm mt-1">
              {loading ? '...' : `${clients.length} client${clients.length !== 1 ? 's' : ''} total`}
            </p>
          </div>
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search clients..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent w-64 transition"
            />
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-500 mx-auto mb-3" />
              <p className="text-gray-400 text-sm">Loading clients...</p>
            </div>
          </div>
        )}

        {/* Empty state */}
        {!loading && filtered.length === 0 && (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-gray-700">
              <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <p className="text-gray-400 font-medium">
              {search ? 'No clients match your search' : 'No clients yet'}
            </p>
            <p className="text-gray-600 text-sm mt-1">
              {search ? 'Try a different search term' : 'Add clients in Supabase to see them here'}
            </p>
          </div>
        )}

        {/* Client grid */}
        {!loading && filtered.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((client, i) => (
              <button
                key={client.id}
                onClick={() => navigate(`/dashboard/${client.id}`)}
                className="bg-gray-800 border border-gray-700 hover:border-green-500/50 rounded-2xl p-6 text-left transition-all group hover:shadow-lg hover:shadow-green-500/5 hover:-translate-y-0.5"
              >
                {/* Avatar */}
                <div className={`w-12 h-12 ${colors[i % colors.length]} rounded-xl flex items-center justify-center text-white font-bold text-lg mb-4 shadow-lg`}>
                  {getInitials(client.name)}
                </div>

                {/* Info */}
                <h3 className="text-white font-semibold text-base group-hover:text-green-400 transition-colors truncate">
                  {client.name}
                </h3>
                {client.company_name && (
                  <p className="text-gray-400 text-sm mt-0.5 truncate">{client.company_name}</p>
                )}

                {/* Sheet status */}
                <div className="mt-4 flex items-center justify-between">
                  <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${
                    client.google_sheet_url
                      ? 'bg-green-500/10 text-green-400'
                      : 'bg-gray-700 text-gray-500'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${client.google_sheet_url ? 'bg-green-400' : 'bg-gray-500'}`} />
                    {client.google_sheet_url ? 'Sheet connected' : 'No sheet'}
                  </span>
                  <svg className="w-4 h-4 text-gray-600 group-hover:text-green-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
