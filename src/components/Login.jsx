import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Login({ onClientAccess }) {
  const [mode, setMode] = useState('client') // 'client' or 'admin'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleClientAccess = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { data, error: dbErr } = await supabase
      .from('clients')
      .select('id, name, email, company_name')
      .eq('email', email.trim().toLowerCase())
      .maybeSingle()

    if (dbErr) {
      setError('Something went wrong. Please try again.')
      setLoading(false)
      return
    }

    if (!data) {
      setError('No account found with this email. Please check and try again.')
      setLoading(false)
      return
    }

    setLoading(false)
    onClientAccess(data)
  }

  const handleAdminLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setError(error.message)
    setLoading(false)
  }

  const switchMode = (newMode) => {
    setMode(newMode)
    setError('')
    setEmail('')
    setPassword('')
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', background: '#F7F5F0', position: 'relative' }}>
      <div style={{ width: '100%', maxWidth: '420px', position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <p style={{ color: '#C2653C', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '4px', marginBottom: '12px' }}>
            Lead Gen Jay
          </p>
          <h1 style={{ fontSize: '36px', fontWeight: 800, letterSpacing: '-0.5px', marginBottom: '8px', color: '#2D2A26' }}>
            Client Portal
          </h1>
          <p style={{ color: '#8A8580', fontSize: '14px' }}>
            {mode === 'client'
              ? 'Enter your email to view your campaign dashboard'
              : 'Admin sign in'
            }
          </p>
        </div>

        {/* Glass card */}
        <div style={{
          background: '#FFFFFF',
          border: '1px solid #E8E4DE',
          boxShadow: '0 1px 3px rgba(45,42,38,0.04)',
          borderRadius: '16px',
          padding: '36px',
        }}>
          {mode === 'client' ? (
            <form onSubmit={handleClientAccess} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
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

              {error && <ErrorBox message={error} />}

              <button
                type="submit"
                disabled={loading}
                className="btn-primary"
                style={{
                  width: '100%', padding: '13px', fontSize: '14px', fontWeight: 700,
                  opacity: loading ? 0.6 : 1,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  marginTop: '4px',
                }}
              >
                {loading ? 'Checking...' : 'View My Dashboard'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleAdminLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={labelStyle}>Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="admin@leadgenjay.com"
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

              {error && <ErrorBox message={error} />}

              <button
                type="submit"
                disabled={loading}
                className="btn-primary"
                style={{
                  width: '100%', padding: '13px', fontSize: '14px', fontWeight: 700,
                  opacity: loading ? 0.6 : 1,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  marginTop: '4px',
                }}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
          )}
        </div>

        {/* Toggle link */}
        <p style={{ textAlign: 'center', fontSize: '13px', marginTop: '20px', color: '#8A8580' }}>
          {mode === 'client' ? (
            <button
              onClick={() => switchMode('admin')}
              style={{
                background: 'none', border: 'none', color: '#8A8580',
                fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit',
                transition: 'color 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.color = '#2D2A26'}
              onMouseLeave={e => e.currentTarget.style.color = '#8A8580'}
            >
              Admin Sign In
            </button>
          ) : (
            <button
              onClick={() => switchMode('client')}
              style={{
                background: 'none', border: 'none', color: '#8A8580',
                fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit',
                transition: 'color 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.color = '#2D2A26'}
              onMouseLeave={e => e.currentTarget.style.color = '#8A8580'}
            >
              ← Back to Client Access
            </button>
          )}
        </p>

        <p style={{ textAlign: 'center', fontSize: '12px', marginTop: '16px', color: '#B5B0AA' }}>
          © 2026 Lead Gen Jay. All rights reserved.
        </p>
      </div>
    </div>
  )
}

function ErrorBox({ message }) {
  return (
    <div style={{
      background: 'rgba(184,84,80,0.08)',
      border: '1px solid rgba(184,84,80,0.2)',
      borderRadius: '10px',
      padding: '12px 16px',
      color: '#B85450',
      fontSize: '13px',
    }}>
      {message}
    </div>
  )
}

const labelStyle = {
  display: 'block',
  fontSize: '12px',
  fontWeight: 500,
  color: '#2D2A26',
  marginBottom: '6px',
  letterSpacing: '0.3px',
}
