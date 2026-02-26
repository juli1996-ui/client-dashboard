import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setError(error.message)
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: '#1a1a2e' }}>
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#4a90d9', letterSpacing: '3px' }}>
            Lead Gen Jay
          </p>
          <h1 className="text-4xl font-bold mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>
            Client Portal
          </h1>
          <p className="text-sm" style={{ color: '#a0a8b8' }}>Sign in to access your campaign dashboard</p>
        </div>

        {/* Card */}
        <div style={{ background: '#16213e', border: '1px solid #2a2d4a', borderRadius: '16px', padding: '36px' }}>
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#a0a8b8', letterSpacing: '1px' }}>
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@company.com"
                required
                style={{
                  width: '100%', padding: '12px 16px', borderRadius: '10px',
                  background: 'rgba(255,255,255,0.05)', border: '1px solid #2a2d4a',
                  color: '#fff', fontSize: '14px', outline: 'none',
                }}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#a0a8b8', letterSpacing: '1px' }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                style={{
                  width: '100%', padding: '12px 16px', borderRadius: '10px',
                  background: 'rgba(255,255,255,0.05)', border: '1px solid #2a2d4a',
                  color: '#fff', fontSize: '14px', outline: 'none',
                }}
              />
            </div>

            {error && (
              <div style={{ background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.3)', borderRadius: '10px', padding: '12px 16px', color: '#f87171', fontSize: '13px' }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '13px', borderRadius: '10px', border: 'none',
                background: '#4a90d9', color: '#fff', fontSize: '14px', fontWeight: 700,
                cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1,
                transition: 'background 0.2s',
              }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs mt-6" style={{ color: '#353d60' }}>
          © 2026 Lead Gen Jay. All rights reserved.
        </p>
      </div>
    </div>
  )
}
