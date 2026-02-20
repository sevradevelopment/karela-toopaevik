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
    <div className="login-page">
      <div className="login-card">
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: 64, height: 64, borderRadius: '16px',
            background: 'linear-gradient(135deg, #16a34a, #15803d)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '2rem', margin: '0 auto 1rem',
            boxShadow: '0 8px 24px rgba(22,163,74,0.3)'
          }}>🌲</div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--text)', marginBottom: '0.25rem' }}>
            Karela Transport OÜ
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Tööpäevik – logi sisse
          </p>
        </div>

        {authError && (
          <div className="alert alert-warning" style={{ marginBottom: '1.25rem' }}>
            Ühendusviga. Kontrolli VITE_SUPABASE_URL ja VITE_SUPABASE_ANON_KEY.
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label className="label">E-posti aadress</label>
            <input
              type="email"
              className="input"
              placeholder="nimi@ettevõte.ee"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError('') }}
              disabled={loading}
              autoComplete="email"
              autoFocus
            />
          </div>
          <div className="field" style={{ marginBottom: '1.5rem' }}>
            <label className="label">Parool</label>
            <input
              type="password"
              className="input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError('') }}
              disabled={loading}
              autoComplete="current-password"
            />
          </div>
          {error && (
            <div className="alert alert-error" style={{ marginBottom: '1.25rem' }}>
              {error}
            </div>
          )}
          <button type="submit" className="btn btn-primary btn-full" style={{ fontSize: '1rem', fontWeight: '700' }} disabled={loading}>
            {loading ? (
              <>
                <svg className="spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>
                Sisenen...
              </>
            ) : 'Sisene'}
          </button>
        </form>
      </div>
    </div>
  )
}
