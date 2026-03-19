import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { supabase } from './lib/supabase'
import Login from './components/Login'
import ClientSelector from './components/ClientSelector'
import Dashboard from './components/Dashboard'

function App() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [clientRecord, setClientRecord] = useState(undefined) // undefined = loading, null = admin, object = client

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (!session) setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (!session) {
        setClientRecord(undefined)
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  // Once we have a session, check if this user is a client
  useEffect(() => {
    if (!session) return

    const email = session.user?.email
    if (!email) {
      setClientRecord(null)
      setLoading(false)
      return
    }

    supabase
      .from('clients')
      .select('id, name, email, company_name')
      .eq('email', email)
      .maybeSingle()
      .then(({ data }) => {
        setClientRecord(data || null) // null = no match = admin
        setLoading(false)
      })
  }, [session])

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#0A0A0F', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '40px', height: '40px', border: '2px solid rgba(255,255,255,0.06)', borderTopColor: '#3B82F6', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      </div>
    )
  }

  const isClient = session && clientRecord
  const isAdmin = session && clientRecord === null

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={!session ? <Login /> : <Navigate to={isClient ? `/dashboard/${clientRecord.id}` : '/clients'} replace />}
        />
        <Route
          path="/clients"
          element={
            !session ? <Navigate to="/login" replace />
            : isClient ? <Navigate to={`/dashboard/${clientRecord.id}`} replace />
            : <ClientSelector />
          }
        />
        <Route
          path="/dashboard/:clientId"
          element={
            !session ? <Navigate to="/login" replace />
            : <Dashboard isAdmin={isAdmin} clientRecord={clientRecord} />
          }
        />
        <Route
          path="*"
          element={
            <Navigate to={
              !session ? '/login'
              : isClient ? `/dashboard/${clientRecord.id}`
              : '/clients'
            } replace />
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
