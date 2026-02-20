import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import Nav from './Nav'

export default function Layout({ children }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-500">Laadin…</p>
      </div>
    )
  }

  if (!user && location.pathname !== '/login') {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (location.pathname === '/login') {
    return children
  }

  return (
    <>
      <Nav />
      <main className="max-w-4xl mx-auto px-4 py-6">
        {children}
      </main>
    </>
  )
}
