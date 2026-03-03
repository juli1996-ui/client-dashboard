import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase, supabaseAdmin } from '../lib/supabase'

const AVATAR_COLORS = ['#4a90d9','#2ecc71','#a78bfa','#fbbf24','#2dd4bf','#f87171','#e67e22','#1abc9c']

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
  const [openMenuId, setOpenMenuId]   = useState(null) // id of card whose menu is open
  const menuRef = useRef(null)
  const navigate = useNavigate()

  // Close dropdown when clicking outside
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

    // 1. Delete row from clients table — use .select() so we can verify a row was actually removed
    const { data: deleted, error: dbError } = await supabase
      .from('clients')
      .delete()
      .eq('id', clientId)
      .select('id')

    if (dbError) {
      setDeleting(false)
      alert(`Error deleting client: ${dbError.message}`)
      return
    }

    // If RLS blocked the delete, Supabase returns no error but also no rows
    if (!deleted || deleted.length === 0) {
      setDeleting(false)
      alert('Delete was blocked by database permissions.\n\nGo to Supabase → Table Editor → clients → RLS Policies and add a DELETE policy, or disable RLS for the clients table.')
      return
    }

    // 2. Best-effort: delete the corresponding Supabase Auth user (needs service role key)
    if (supabaseAdmin) {
      await supabaseAdmin.auth.admin.deleteUser(clientId).catch(() => {
        // Silently ignore — auth user may not exist or id may not match
      })
    }

    setDeleting(false)
    setDeleteConfirm(null)
    setClients(prev => prev.filter(c => c.id !== clientId))
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
              <div key={client.id} style={{ position: 'relative' }}>
                {/* Card — navigates to dashboard */}
                <button
                  onClick={() => navigate(`/dashboard/${client.id}`)}
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

                {/* Three-dot menu button — positioned top-right of card */}
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
                      cursor: 'pointer', color: '#a0a8b8',
                      transition: 'background 0.15s, color 0.15s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = '#fff' }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#a0a8b8' }}
                  >
                    {/* Three vertical dots */}
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <circle cx="12" cy="5"  r="2"/>
                      <circle cx="12" cy="12" r="2"/>
                      <circle cx="12" cy="19" r="2"/>
                    </svg>
                  </button>

                  {/* Dropdown menu */}
                  {openMenuId === client.id && (
                    <div style={{
                      position: 'absolute', top: '34px', right: 0,
                      background: '#1c2340', border: '1px solid #353d60',
                      borderRadius: '10px', minWidth: '140px',
                      boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
                      overflow: 'hidden', zIndex: 50,
                    }}>
                      <button
                        onClick={e => { e.stopPropagation(); setOpenMenuId(null) }}
                        style={{
                          display: 'block', width: '100%', textAlign: 'left',
                          padding: '10px 16px', background: 'none', border: 'none',
                          color: '#a0a8b8', fontSize: '13px', fontWeight: 500,
                          cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
                          transition: 'background 0.12s, color 0.12s',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = '#fff' }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#a0a8b8' }}
                      >
                        Edit
                      </button>
                      <div style={{ height: '1px', background: '#2a2d4a', margin: '0 10px' }} />
                      <button
                        onClick={e => { e.stopPropagation(); setOpenMenuId(null); setDeleteConfirm(client) }}
                        style={{
                          display: 'block', width: '100%', textAlign: 'left',
                          padding: '10px 16px', background: 'none', border: 'none',
                          color: '#f87171', fontSize: '13px', fontWeight: 500,
                          cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
                          transition: 'background 0.12s',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(248,113,113,0.1)' }}
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
              <div>
                <label style={labelStyle}>Client Name *</label>
                <input type="text" placeholder="e.g. Brian Rechtman" value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Email *</label>
                <input type="email" placeholder="e.g. brian@bluetree.com" value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Company Name</label>
                <input type="text" placeholder="e.g. BlueTree Marketing" value={form.company_name}
                  onChange={e => setForm(f => ({ ...f, company_name: e.target.value }))} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Google Sheet URL</label>
                <input type="text" placeholder="https://docs.google.com/spreadsheets/d/..." value={form.google_sheet_url}
                  onChange={e => setForm(f => ({ ...f, google_sheet_url: e.target.value }))} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Instantly API Key</label>
                <input type="password" placeholder="Paste API key..." value={form.instantly_api_key}
                  onChange={e => setForm(f => ({ ...f, instantly_api_key: e.target.value }))} style={inputStyle} />
              </div>

              {formError && <p style={{ color: '#f87171', fontSize: '13px', margin: 0 }}>{formError}</p>}

              <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                <button type="button" onClick={closeModal} style={cancelBtnStyle}>Cancel</button>
                <button type="submit" disabled={saving} style={{ ...submitBtnStyle, background: saving ? '#2a2d4a' : '#4a90d9', color: saving ? '#a0a8b8' : '#fff', cursor: saving ? 'not-allowed' : 'pointer' }}>
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
            background: 'rgba(10,12,25,0.85)',
            backdropFilter: 'blur(6px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px',
          }}
        >
          <div style={{
            background: '#1c2340', border: '1px solid rgba(248,113,113,0.3)',
            borderRadius: '18px', padding: '32px',
            width: '100%', maxWidth: '420px',
            boxShadow: '0 28px 70px rgba(0,0,0,0.7)',
          }}>
            {/* Icon */}
            <div style={{
              width: '48px', height: '48px', borderRadius: '12px', marginBottom: '20px',
              background: 'rgba(248,113,113,0.12)', border: '1px solid rgba(248,113,113,0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
                <path d="M10 11v6M14 11v6"/>
                <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
              </svg>
            </div>

            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '20px', fontWeight: 700, color: '#fff', margin: '0 0 10px' }}>
              Delete Client
            </h2>
            <p style={{ color: '#a0a8b8', fontSize: '14px', lineHeight: 1.6, margin: '0 0 24px' }}>
              Are you sure you want to delete{' '}
              <strong style={{ color: '#fff' }}>{deleteConfirm.name}</strong>?{' '}
              This action cannot be undone.
            </p>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setDeleteConfirm(null)}
                disabled={deleting}
                style={{ ...cancelBtnStyle, flex: 1, cursor: deleting ? 'not-allowed' : 'pointer' }}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                style={{
                  flex: 2, padding: '12px',
                  background: deleting ? '#2a2d4a' : '#ef4444', border: 'none',
                  borderRadius: '10px', color: deleting ? '#a0a8b8' : '#fff',
                  fontSize: '14px', fontWeight: 600,
                  cursor: deleting ? 'not-allowed' : 'pointer',
                  fontFamily: 'DM Sans, sans-serif',
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
  display: 'block', fontSize: '11px', fontWeight: 600, color: '#a0a8b8',
  textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px',
}

const inputStyle = {
  width: '100%', padding: '10px 14px',
  background: 'rgba(255,255,255,0.05)', border: '1px solid #2a2d4a',
  borderRadius: '10px', color: '#fff', fontSize: '13px',
  outline: 'none', fontFamily: 'DM Sans, sans-serif',
  boxSizing: 'border-box',
}

const cancelBtnStyle = {
  flex: 1, padding: '12px',
  background: 'rgba(255,255,255,0.05)', border: '1px solid #2a2d4a',
  borderRadius: '10px', color: '#a0a8b8',
  fontSize: '14px', fontWeight: 600, cursor: 'pointer',
  fontFamily: 'DM Sans, sans-serif',
}

const submitBtnStyle = {
  flex: 2, padding: '12px', border: 'none',
  borderRadius: '10px', fontSize: '14px', fontWeight: 600,
  fontFamily: 'DM Sans, sans-serif',
}
