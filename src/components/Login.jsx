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
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', background: '#0A0A0F', position: 'relative' }}>
      {/* Gradient mesh background */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 60% 50% at 50% 40%, rgba(59,130,246,0.06), transparent 70%), radial-gradient(ellipse 40% 40% at 30% 70%, rgba(139,92,246,0.04), transparent)',
      }} />

      <div style={{ width: '100%', maxWidth: '420px', position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <p style={{ color: '#3B82F6', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '4px', marginBottom: '12px' }}>
            Lead Gen Jay
          </p>
          <h1 style={{ fontSize: '36px', fontWeight: 800, letterSpacing: '-0.5px', marginBottom: '8px' }}>
            Client Portal
          </h1>
          <p style={{ color: '#525252', fontSize: '14px' }}>Sign in to access your campaign dashboard</p>
        </div>

        {/* Glass card */}
        <div style={{
          background: 'rgba(255,255,255,0.03)',
          backdropFilter: 'blur(12px) saturate(150%)',
          WebkitBackdropFilter: 'blur(12px) saturate(150%)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: '20px',
          padding: '36px',
        }}>
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={labelStyle}>Email Address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@company.com"
                required
                className="input-glass"
              />
            </div>

            <div>
              <label style={labelStyle}>Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="input-glass"
              />
            </div>

            {error && (
              <div style={{
                background: 'rgba(239,68,68,0.08)',
                border: '1px solid rgba(239,68,68,0.2)',
                borderRadius: '10px',
                padding: '12px 16px',
                color: '#EF4444',
                fontSize: '13px',
              }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{
                width: '100%',
                padding: '13px',
                fontSize: '14px',
                fontWeight: 700,
                opacity: loading ? 0.6 : 1,
                cursor: loading ? 'not-allowed' : 'pointer',
                marginTop: '4px',
              }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', fontSize: '12px', marginTop: '24px', color: '#2A2A3A' }}>
          © 2026 Lead Gen Jay. All rights reserved.
        </p>
      </div>
    </div>
  )
}

const labelStyle = {
  display: 'block',
  fontSize: '12px',
  fontWeight: 500,
  color: '#A3A3A3',
  marginBottom: '6px',
  letterSpacing: '0.3px',
}
