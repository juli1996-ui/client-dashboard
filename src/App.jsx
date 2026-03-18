import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { supabase } from './lib/supabase'
import Login from './components/Login'
import ClientSelector from './components/ClientSelector'
import Dashboard from './components/Dashboard'

function App() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#0A0A0F', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '40px', height: '40px', border: '2px solid rgba(255,255,255,0.06)', borderTopColor: '#3B82F6', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      </div>
    )
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={!session ? <Login /> : <Navigate to="/clients" replace />}
        />
        <Route
          path="/clients"
          element={session ? <ClientSelector /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/dashboard/:clientId"
          element={session ? <Dashboard /> : <Navigate to="/login" replace />}
        />
        <Route
          path="*"
          element={<Navigate to={session ? '/clients' : '/login'} replace />}
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
