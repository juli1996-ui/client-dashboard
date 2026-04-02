import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase, supabaseAdmin } from '../lib/supabase'

const AVATAR_COLORS = ['#C2653C','#4A7C59','#B8860B','#8A8580','#D4845E','#6B9B78','#C9A227','#B5B0AA']

const EMPTY_FORM = { name: '', email: '', company_name: '', google_sheet_url: '', instantly_api_key: '' }

export default function ClientSelector() {
  const [clients, setClients]         = useState([])
  const [loading, setLoading]         = useState(true)
  const [search, setSearch]           = useState('')
  const [showModal, setShowModal]     = useState(false)
  const [form, setForm]               = useState(EMPTY_FORM)
  const [saving, setSaving]           = useState(false)
  const [formError, setFormError]     = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [deleting, setDeleting]       = useState(false)
  const [openMenuId, setOpenMenuId]   = useState(null)
  const menuRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (!openMenuId) return
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenuId(null)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [openMenuId])

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

  const handleDelete = async () => {
    if (!deleteConfirm) return
    const clientId = deleteConfirm.id
    setDeleting(true)

    const db = supabaseAdmin || supabase
    const { data: deleted, error: dbError } = await db
      .from('clients')
      .delete()
      .eq('id', clientId)
      .select('id')

    if (dbError) {
      setDeleting(false)
      alert(`Error deleting client: ${dbError.message}`)
      return
    }

    if (!deleted || deleted.length === 0) {
      setDeleting(false)
      alert('Could not delete client. Check that the record exists and your Supabase permissions are configured correctly.')
      return
    }

    if (supabaseAdmin) {
      await supabaseAdmin.auth.admin.deleteUser(clientId).catch(() => {})
    }

    setDeleting(false)
    setDeleteConfirm(null)
    setClients(prev => prev.filter(c => c.id !== clientId))
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F7F5F0', position: 'relative' }}>

      {/* Header */}
      <header style={{
        background: '#FFFFFF',
        borderBottom: '1px solid #E8E4DE',
        position: 'sticky', top: 0, zIndex: 10,
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p style={{ color: '#C2653C', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '3px', margin: '0 0 2px', fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}>
              Lead Gen Jay
            </p>
            <h1 style={{ fontSize: '16px', fontWeight: 700, color: '#2D2A26', margin: 0, letterSpacing: '-0.3px', fontFamily: "'Fraunces', Georgia, serif" }}>
              Client Portal
            </h1>
          </div>
          <button onClick={handleSignOut} className="btn-ghost">
            Sign Out
          </button>
        </div>
      </header>

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px', position: 'relative', zIndex: 1 }}>
        {/* Title + Search + Add button */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '32px' }}>
          <div>
            <p style={{ color: '#C2653C', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '3px', margin: '0 0 8px', fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}>
              Dashboard
            </p>
            <h2 style={{ fontSize: '32px', fontWeight: 800, color: '#2D2A26', margin: '0 0 4px', letterSpacing: '-0.5px', fontFamily: "'Fraunces', Georgia, serif" }}>
              All Clients
            </h2>
            <p style={{ color: '#8A8580', fontSize: '14px', margin: 0 }}>
              {loading ? '...' : `${clients.length} client${clients.length !== 1 ? 's' : ''}`}
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="Search clients..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="input-glass"
                style={{ paddingLeft: '36px', width: '220px', fontSize: '13px' }}
              />
              <svg style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '14px', height: '14px', color: '#8A8580' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            <button onClick={openModal} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              New Client
            </button>
          </div>
        </div>

        {loading && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
            {[...Array(6)].map((_, i) => (
              <div key={i} className="skeleton" style={{ height: '160px' }} />
            ))}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <p style={{ color: '#8A8580', fontSize: '16px' }}>No clients found</p>
          </div>
        )}

        {!loading && filtered.length > 0 && (
          <div className="animate-stagger" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
            {filtered.map((client, i) => (
              <div key={client.id} style={{ position: 'relative' }}>
                <button
                  onClick={() => navigate(`/dashboard/${client.id}`)}
                  style={{
                    padding: '24px', textAlign: 'left', cursor: 'pointer',
                    display: 'block', width: '100%',
                    background: '#FFFFFF',
                    border: '1px solid #E8E4DE',
                    borderRadius: '16px',
                    transition: 'all 0.2s',
                    fontFamily: 'inherit',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#C2653C'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(194,101,60,0.08)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#E8E4DE'; e.currentTarget.style.boxShadow = 'none' }}
                >
                  <div style={{
                    width: '44px', height: '44px', borderRadius: '12px', marginBottom: '16px',
                    background: `linear-gradient(135deg, ${AVATAR_COLORS[i % AVATAR_COLORS.length]}33, ${AVATAR_COLORS[i % AVATAR_COLORS.length]})`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '16px', fontWeight: 700, color: '#fff',
                  }}>
                    {initials(client.name)}
                  </div>
                  <p style={{ fontSize: '15px', fontWeight: 600, color: '#2D2A26', margin: '0 0 4px', letterSpacing: '-0.2px' }}>
                    {client.name}
                  </p>
                  {client.company_name && (
                    <p style={{ color: '#8A8580', fontSize: '13px', margin: '0 0 16px' }}>{client.company_name}</p>
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{
                      fontSize: '11px', fontWeight: 600, padding: '3px 10px', borderRadius: '20px',
                      background: client.google_sheet_url ? 'rgba(74,124,89,0.1)' : 'rgba(181,176,170,0.1)',
                      color: client.google_sheet_url ? '#4A7C59' : '#B5B0AA',
                    }}>
                      {client.google_sheet_url ? '● Sheet connected' : '○ No sheet'}
                    </span>
                    <span style={{ color: '#B5B0AA', fontSize: '18px' }}>→</span>
                  </div>
                </button>

                {/* Three-dot menu */}
                <div
                  ref={openMenuId === client.id ? menuRef : null}
                  style={{ position: 'absolute', top: '12px', right: '12px' }}
                >
                  <button
                    onClick={e => { e.stopPropagation(); setOpenMenuId(openMenuId === client.id ? null : client.id) }}
                    title="Options"
                    style={{
                      background: 'none', border: 'none',
                      borderRadius: '8px', width: '28px', height: '28px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer', color: '#B5B0AA',
                      transition: 'all 0.15s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,0,0,0.04)'; e.currentTarget.style.color = '#2D2A26' }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#B5B0AA' }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <circle cx="12" cy="5"  r="2"/>
                      <circle cx="12" cy="12" r="2"/>
                      <circle cx="12" cy="19" r="2"/>
                    </svg>
                  </button>

                  {openMenuId === client.id && (
                    <div style={{
                      position: 'absolute', top: '34px', right: 0,
                      background: '#FFFFFF',
                      border: '1px solid #E8E4DE',
                      borderRadius: '12px', minWidth: '140px',
                      boxShadow: '0 16px 48px rgba(0,0,0,0.1)',
                      overflow: 'hidden', zIndex: 50,
                    }}>
                      <button
                        onClick={e => { e.stopPropagation(); setOpenMenuId(null) }}
                        style={{
                          display: 'block', width: '100%', textAlign: 'left',
                          padding: '10px 16px', background: 'none', border: 'none',
                          color: '#8A8580', fontSize: '13px', fontWeight: 500,
                          cursor: 'pointer', fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
                          transition: 'all 0.12s',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = '#FAF8F5'; e.currentTarget.style.color = '#2D2A26' }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#8A8580' }}
                      >
                        Edit
                      </button>
                      <div style={{ height: '1px', background: '#F0ECE6', margin: '0 10px' }} />
                      <button
                        onClick={e => { e.stopPropagation(); setOpenMenuId(null); setDeleteConfirm(client) }}
                        style={{
                          display: 'block', width: '100%', textAlign: 'left',
                          padding: '10px 16px', background: 'none', border: 'none',
                          color: '#B85450', fontSize: '13px', fontWeight: 500,
                          cursor: 'pointer', fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
                          transition: 'all 0.12s',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(184,84,80,0.06)' }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'none' }}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* ── Add Client Modal ── */}
      {showModal && (
        <div
          onClick={e => { if (e.target === e.currentTarget) closeModal() }}
          style={{
            position: 'fixed', inset: 0, zIndex: 100,
            background: 'rgba(45,42,38,0.5)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px',
          }}
        >
          <div style={{
            background: '#FFFFFF',
            border: '1px solid #E8E4DE',
            borderRadius: '20px', padding: '32px',
            width: '100%', maxWidth: '480px', position: 'relative',
            boxShadow: '0 32px 80px rgba(0,0,0,0.15)',
          }}>
            <button onClick={closeModal} style={{
              position: 'absolute', top: '16px', right: '20px',
              background: 'none', border: 'none', color: '#B5B0AA',
              fontSize: '22px', cursor: 'pointer', lineHeight: 1,
              transition: 'color 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.color = '#2D2A26'}
            onMouseLeave={e => e.currentTarget.style.color = '#B5B0AA'}
            >×</button>

            <p style={{ color: '#C2653C', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '3px', margin: '0 0 6px' }}>
              New Client
            </p>
            <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#2D2A26', margin: '0 0 24px', letterSpacing: '-0.3px', fontFamily: "'Fraunces', Georgia, serif" }}>
              Add Client
            </h2>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={labelStyle}>Client Name *</label>
                <input type="text" placeholder="e.g. Brian Rechtman" value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="input-glass" />
              </div>
              <div>
                <label style={labelStyle}>Email *</label>
                <input type="email" placeholder="e.g. brian@bluetree.com" value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className="input-glass" />
              </div>
              <div>
                <label style={labelStyle}>Company Name</label>
                <input type="text" placeholder="e.g. BlueTree Marketing" value={form.company_name}
                  onChange={e => setForm(f => ({ ...f, company_name: e.target.value }))} className="input-glass" />
              </div>
              <div>
                <label style={labelStyle}>Google Sheet URL</label>
                <input type="text" placeholder="https://docs.google.com/spreadsheets/d/..." value={form.google_sheet_url}
                  onChange={e => setForm(f => ({ ...f, google_sheet_url: e.target.value }))} className="input-glass" />
              </div>
              <div>
                <label style={labelStyle}>Instantly API Key</label>
                <input type="password" placeholder="Paste API key..." value={form.instantly_api_key}
                  onChange={e => setForm(f => ({ ...f, instantly_api_key: e.target.value }))} className="input-glass" />
              </div>

              {formError && <p style={{ color: '#B85450', fontSize: '13px', margin: 0 }}>{formError}</p>}

              <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                <button type="button" onClick={closeModal} className="btn-ghost" style={{ flex: 1, padding: '12px' }}>Cancel</button>
                <button type="submit" disabled={saving} className="btn-primary" style={{
                  flex: 2, padding: '12px',
                  opacity: saving ? 0.5 : 1,
                  cursor: saving ? 'not-allowed' : 'pointer',
                }}>
                  {saving ? 'Saving...' : 'Add Client'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Delete Confirmation Modal ── */}
      {deleteConfirm && (
        <div
          onClick={e => { if (e.target === e.currentTarget && !deleting) setDeleteConfirm(null) }}
          style={{
            position: 'fixed', inset: 0, zIndex: 100,
            background: 'rgba(45,42,38,0.5)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px',
          }}
        >
          <div style={{
            background: '#FFFFFF',
            border: '1px solid rgba(184,84,80,0.2)',
            borderRadius: '20px', padding: '32px',
            width: '100%', maxWidth: '420px',
            boxShadow: '0 32px 80px rgba(0,0,0,0.15)',
          }}>
            <div style={{
              width: '44px', height: '44px', borderRadius: '12px', marginBottom: '20px',
              background: 'rgba(184,84,80,0.08)', border: '1px solid rgba(184,84,80,0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#B85450" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
                <path d="M10 11v6M14 11v6"/>
                <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
              </svg>
            </div>

            <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#2D2A26', margin: '0 0 10px', letterSpacing: '-0.3px', fontFamily: "'Fraunces', Georgia, serif" }}>
              Delete Client
            </h2>
            <p style={{ color: '#8A8580', fontSize: '14px', lineHeight: 1.6, margin: '0 0 24px' }}>
              Are you sure you want to delete{' '}
              <strong style={{ color: '#2D2A26' }}>{deleteConfirm.name}</strong>?{' '}
              This action cannot be undone.
            </p>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setDeleteConfirm(null)}
                disabled={deleting}
                className="btn-ghost"
                style={{ flex: 1, padding: '12px', cursor: deleting ? 'not-allowed' : 'pointer' }}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                style={{
                  flex: 2, padding: '12px',
                  background: deleting ? '#E8E4DE' : '#B85450', border: 'none',
                  borderRadius: '10px', color: deleting ? '#8A8580' : '#fff',
                  fontSize: '14px', fontWeight: 600,
                  cursor: deleting ? 'not-allowed' : 'pointer',
                  fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
                  transition: 'all 0.2s',
                }}
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const labelStyle = {
  display: 'block', fontSize: '12px', fontWeight: 500, color: '#8A8580',
  marginBottom: '6px', letterSpacing: '0.3px',
}
