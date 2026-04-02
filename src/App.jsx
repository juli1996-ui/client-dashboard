import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { supabase } from './lib/supabase'
import Login from './components/Login'
import ClientSelector from './components/ClientSelector'
import Dashboard from './components/Dashboard'

const STORAGE_KEY = 'lgj_client'

function App() {
  // Admin auth (Supabase session)
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  // Client access (email-only, stored in localStorage)
  const [clientAccess, setClientAccess] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : null
    } catch { return null }
  })

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

  const handleClientAccess = (clientData) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(clientData))
    setClientAccess(clientData)
  }

  const handleClientLogout = () => {
    localStorage.removeItem(STORAGE_KEY)
    setClientAccess(null)
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#F7F5F0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '40px', height: '40px', border: '2px solid #E8E4DE', borderTopColor: '#C2653C', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      </div>
    )
  }

  const isAdmin = !!session
  const isClient = !isAdmin && !!clientAccess
  const isLoggedIn = isAdmin || isClient

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            isAdmin ? <Navigate to="/clients" replace />
            : isClient ? <Navigate to={`/dashboard/${clientAccess.id}`} replace />
            : <Login onClientAccess={handleClientAccess} />
          }
        />
        <Route
          path="/clients"
          element={
            isAdmin ? <ClientSelector />
            : isClient ? <Navigate to={`/dashboard/${clientAccess.id}`} replace />
            : <Navigate to="/login" replace />
          }
        />
        <Route
          path="/dashboard/:clientId"
          element={
            !isLoggedIn ? <Navigate to="/login" replace />
            : <Dashboard
                isAdmin={isAdmin}
                clientRecord={isClient ? clientAccess : null}
                onLogout={isClient ? handleClientLogout : undefined}
              />
          }
        />
        <Route
          path="*"
          element={
            <Navigate to={
              isAdmin ? '/clients'
              : isClient ? `/dashboard/${clientAccess.id}`
              : '/login'
            } replace />
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
