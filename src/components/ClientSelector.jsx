import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const AVATAR_COLORS = ['#4a90d9','#2ecc71','#a78bfa','#fbbf24','#2dd4bf','#f87171','#e67e22','#1abc9c']

const EMPTY_FORM = { name: '', email: '', company_name: '', google_sheet_url: '', instantly_api_key: '' }

export default function ClientSelector() {
  const [clients, setClients]     = useState([])
  const [loading, setLoading]     = useState(true)
  const [search, setSearch]       = useState('')
  const [showModal, setShowModal] = useState(false)
  const [form, setForm]           = useState(EMPTY_FORM)
  const [saving, setSaving]       = useState(false)
  const [formError, setFormError] = useState(null)
  const navigate = useNavigate()

  const handleSignOut = async () => { await supabase.auth.signOut() }

  const loadClients = () => {
    supabase.from('clients').select('*').order('name')
      .then(({ data }) => { if (data) setClients(data); setLoading(false) })
  }

  useEffect(() => { loadClients() }, [])

  const filtered = clients.filter(c =>
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.company_name?.toLowerCase().includes(search.toLowerCase())
  )

  const initials = name => name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?'

  const openModal  = () => { setForm(EMPTY_FORM); setFormError(null); setShowModal(true) }
  const closeModal = () => { setShowModal(false); setFormError(null) }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name.trim())  { setFormError('Client name is required.'); return }
    if (!form.email.trim()) { setFormError('Email is required.'); return }
    setSaving(true)
    setFormError(null)

    const { error } = await supabase.from('clients').insert({
      name:              form.name.trim(),
      email:             form.email.trim(),
      company_name:      form.company_name.trim() || null,
      google_sheet_url:  form.google_sheet_url.trim() || null,
      instantly_api_key: form.instantly_api_key.trim() || null,
    })

    if (error) {
      setFormError(error.message)
      setSaving(false)
      return
    }

    setSaving(false)
    closeModal()
    setLoading(true)
    loadClients()
  }

  return (
    <div style={{ minHeight: '100vh', background: '#1a1a2e' }}>
      {/* Header */}
      <header style={{ background: '#16213e', borderBottom: '1px solid #2a2d4a', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p style={{ color: '#4a90d9', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '3px', margin: '0 0 2px' }}>
              Lead Gen Jay
            </p>
            <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '18px', fontWeight: 700, color: '#fff', margin: 0 }}>
              Client Portal
            </h1>
          </div>
          <button onClick={handleSignOut} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid #2a2d4a', borderRadius: '10px', padding: '8px 16px', color: '#a0a8b8', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
            Sign Out
          </button>
        </div>
      </header>

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px' }}>
        {/* Title + Search + Add button */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '32px' }}>
          <div>
            <p style={{ color: '#4a90d9', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '3px', margin: '0 0 8px' }}>
              Dashboard
            </p>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '32px', fontWeight: 700, color: '#fff', margin: '0 0 4px' }}>
              All Clients
            </h2>
            <p style={{ color: '#a0a8b8', fontSize: '14px', margin: 0 }}>
              {loading ? '...' : `${clients.length} client${clients.length !== 1 ? 's' : ''}`}
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Search */}
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="Search clients..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{
                  padding: '10px 16px 10px 36px', borderRadius: '10px',
                  background: 'rgba(255,255,255,0.05)', border: '1px solid #2a2d4a',
                  color: '#fff', fontSize: '13px', outline: 'none', width: '220px',
                }}
              />
              <svg style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '14px', height: '14px', color: '#a0a8b8' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/* Add Client button */}
            <button
              onClick={openModal}
              style={{
                display: 'flex', alignItems: 'center', gap: '7px',
                background: '#4a90d9', border: 'none', borderRadius: '10px',
                padding: '10px 18px', color: '#fff',
                fontSize: '13px', fontWeight: 600, cursor: 'pointer',
                fontFamily: 'DM Sans, sans-serif',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              New Client
            </button>
          </div>
        </div>

        {loading && (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <p style={{ color: '#a0a8b8' }}>Loading clients...</p>
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <p style={{ color: '#a0a8b8', fontSize: '16px' }}>No clients found</p>
          </div>
        )}

        {!loading && filtered.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
            {filtered.map((client, i) => (
              <button key={client.id} onClick={() => navigate(`/dashboard/${client.id}`)}
                style={{
                  background: '#16213e', border: '1px solid #2a2d4a', borderRadius: '16px',
                  padding: '24px', textAlign: 'left', cursor: 'pointer',
                  transition: 'border-color 0.2s, transform 0.2s',
                  display: 'block', width: '100%',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#4a90d9'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#2a2d4a'; e.currentTarget.style.transform = 'translateY(0)' }}
              >
                <div style={{
                  width: '48px', height: '48px', borderRadius: '12px', marginBottom: '16px',
                  background: AVATAR_COLORS[i % AVATAR_COLORS.length],
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '18px', fontWeight: 700, color: '#fff',
                }}>
                  {initials(client.name)}
                </div>
                <p style={{ fontFamily: 'Playfair Display, serif', fontSize: '16px', fontWeight: 600, color: '#fff', margin: '0 0 4px' }}>
                  {client.name}
                </p>
                {client.company_name && (
                  <p style={{ color: '#a0a8b8', fontSize: '13px', margin: '0 0 16px' }}>{client.company_name}</p>
                )}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{
                    fontSize: '11px', fontWeight: 700, padding: '3px 10px', borderRadius: '20px',
                    background: client.google_sheet_url ? 'rgba(46,204,113,0.12)' : 'rgba(160,168,184,0.1)',
                    color: client.google_sheet_url ? '#2ecc71' : '#a0a8b8',
                  }}>
                    {client.google_sheet_url ? '● Sheet connected' : '○ No sheet'}
                  </span>
                  <span style={{ color: '#a0a8b8', fontSize: '18px' }}>→</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </main>

      {/* ── Modal ── */}
      {showModal && (
        <div
          onClick={e => { if (e.target === e.currentTarget) closeModal() }}
          style={{
            position: 'fixed', inset: 0, zIndex: 100,
            background: 'rgba(10,12,25,0.85)',
            backdropFilter: 'blur(6px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px',
          }}
        >
          <div style={{
            background: '#1c2340', border: '1px solid #353d60',
            borderRadius: '18px', padding: '32px',
            width: '100%', maxWidth: '480px', position: 'relative',
            boxShadow: '0 28px 70px rgba(0,0,0,0.7)',
          }}>
            {/* Close */}
            <button onClick={closeModal} style={{
              position: 'absolute', top: '16px', right: '20px',
              background: 'none', border: 'none', color: '#a0a8b8',
              fontSize: '22px', cursor: 'pointer', lineHeight: 1,
            }}>×</button>

            <p style={{ color: '#4a90d9', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '3px', margin: '0 0 6px' }}>
              New Client
            </p>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '22px', fontWeight: 700, color: '#fff', margin: '0 0 24px' }}>
              Add Client
            </h2>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

              {/* Name */}
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#a0a8b8', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>
                  Client Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Brian Rechtman"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  style={inputStyle}
                />
              </div>

              {/* Email */}
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#a0a8b8', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>
                  Email *
                </label>
                <input
                  type="email"
                  placeholder="e.g. brian@bluetree.com"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  style={inputStyle}
                />
              </div>

              {/* Company */}
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#a0a8b8', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>
                  Company Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. BlueTree Marketing"
                  value={form.company_name}
                  onChange={e => setForm(f => ({ ...f, company_name: e.target.value }))}
                  style={inputStyle}
                />
              </div>

              {/* Google Sheet URL */}
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#a0a8b8', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>
                  Google Sheet URL
                </label>
                <input
                  type="text"
                  placeholder="https://docs.google.com/spreadsheets/d/..."
                  value={form.google_sheet_url}
                  onChange={e => setForm(f => ({ ...f, google_sheet_url: e.target.value }))}
                  style={inputStyle}
                />
              </div>

              {/* Instantly API Key */}
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#a0a8b8', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>
                  Instantly API Key
                </label>
                <input
                  type="password"
                  placeholder="Paste API key..."
                  value={form.instantly_api_key}
                  onChange={e => setForm(f => ({ ...f, instantly_api_key: e.target.value }))}
                  style={inputStyle}
                />
              </div>

              {/* Error */}
              {formError && (
                <p style={{ color: '#f87171', fontSize: '13px', margin: 0 }}>{formError}</p>
              )}

              {/* Actions */}
              <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                <button type="button" onClick={closeModal} style={{
                  flex: 1, padding: '12px',
                  background: 'rgba(255,255,255,0.05)', border: '1px solid #2a2d4a',
                  borderRadius: '10px', color: '#a0a8b8',
                  fontSize: '14px', fontWeight: 600, cursor: 'pointer',
                  fontFamily: 'DM Sans, sans-serif',
                }}>
                  Cancel
                </button>
                <button type="submit" disabled={saving} style={{
                  flex: 2, padding: '12px',
                  background: saving ? '#2a2d4a' : '#4a90d9', border: 'none',
                  borderRadius: '10px', color: saving ? '#a0a8b8' : '#fff',
                  fontSize: '14px', fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer',
                  fontFamily: 'DM Sans, sans-serif',
                }}>
                  {saving ? 'Saving...' : 'Add Client'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

const inputStyle = {
  width: '100%', padding: '10px 14px',
  background: 'rgba(255,255,255,0.05)', border: '1px solid #2a2d4a',
  borderRadius: '10px', color: '#fff', fontSize: '13px',
  outline: 'none', fontFamily: 'DM Sans, sans-serif',
  boxSizing: 'border-box',
}
