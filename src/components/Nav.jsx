import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabase'

export default function Nav() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, profile } = useAuth()

  async function logout() {
    await supabase.auth.signOut()
    navigate('/login', { replace: true })
  }

  if (!user) return null

  const link = (to, label) => (
    <Link
      to={to}
      className={`px-3 py-2 rounded-lg font-medium transition ${
        location.pathname === to
          ? 'bg-primary text-white'
          : 'text-slate-700 hover:bg-slate-200'
      }`}
    >
      {label}
    </Link>
  )

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-40">
      <div className="max-w-4xl mx-auto px-4 py-3 flex flex-wrap items-center gap-2">
        <span className="font-semibold text-slate-800 mr-2">Karela Transport OÜ</span>
        {link('/', 'Avaleht')}
        {link('/tunnid', 'Töötunnid')}
        {link('/vedu', 'Vedu')}
        {(profile?.role === 'Hakkur' || profile?.role === 'Admin') && link('/tootmine', 'Tootmine')}
        {link('/tankimine', 'Tankimine')}
        {link('/logid', 'Logid')}
        {profile?.role === 'Admin' && (
          <>
            {link('/statistika', 'Statistika')}
            {link('/haldus', 'Haldus')}
          </>
        )}
        <span className="ml-auto flex items-center gap-2">
          <span className="text-slate-600 text-sm">
            {profile?.full_name || user.email}
            <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${
              profile?.role === 'Admin' ? 'bg-amber-100 text-amber-800' :
              profile?.role === 'Hakkur' ? 'bg-emerald-100 text-emerald-800' :
              'bg-sky-100 text-sky-800'
            }`}>
              {profile?.role || '—'}
            </span>
          </span>
          <button
            type="button"
            onClick={logout}
            className="btn btn-secondary text-sm py-1.5 px-3"
          >
            Välju
          </button>
        </span>
      </div>
    </nav>
  )
}
