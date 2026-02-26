import { supabase } from '../lib/supabase'

export default function Header({ client }) {
  const handleSignOut = async () => {
    await supabase.auth.signOut()
  }

  const initials = client?.name
    ? client.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : '?'

  return (
    <header className="bg-gray-800 border-b border-gray-700 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        {/* Left: Logo + Client Info */}
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow shadow-green-500/20">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Lead Gen Jay</p>
            <h1 className="text-base font-bold text-white leading-tight">
              Welcome, {client?.name || 'Client'}
            </h1>
          </div>
          {client?.company_name && (
            <span className="hidden sm:inline-flex items-center px-3 py-1 rounded-full bg-gray-700 text-gray-300 text-xs font-medium border border-gray-600">
              {client.company_name}
            </span>
          )}
        </div>

        {/* Right: Avatar + Sign Out */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400 text-xs font-bold">
            {initials}
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
      </div>
    </header>
  )
}
