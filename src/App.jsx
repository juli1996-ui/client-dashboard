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
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500" />
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
