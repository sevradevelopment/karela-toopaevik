import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/context/AuthContext'

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { error: authError } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { error: err } = await supabase.auth.signInWithPassword({ email, password })
      if (err) {
        setError(err.message || 'Sisselogimine ebaõnnestus')
        return
      }
      navigate(location.state?.from?.pathname || '/', { replace: true })
    } catch (err) {
      setError(err?.message || 'Sisselogimine ebaõnnestus')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
      <div className="card w-full max-w-md">
        <h1 className="text-2xl font-bold text-slate-800 mb-1">Tööpäevik</h1>
        <p className="text-slate-600 text-sm mb-6">Karela Transport OÜ – logi sisse</p>
        {authError && (
          <p className="text-amber-700 text-sm mb-4 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
            Ühendusviga. Kontrolli <code className="bg-amber-100 px-1">VITE_SUPABASE_URL</code> ja <code className="bg-amber-100 px-1">VITE_SUPABASE_ANON_KEY</code>.
          </p>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="label">E-post</label>
          <input
            type="email"
            className="input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="nimi@firma.ee"
            required
          />
          <label className="label">Parool</label>
          <input
            type="password"
            className="input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button type="submit" className="btn btn-primary w-full" disabled={loading}>
            {loading ? 'Sisselogimine…' : 'Sisselogimine'}
          </button>
        </form>
      </div>
    </div>
  )
}
