import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabase'
import { useState, useEffect } from 'react'

const IconHome = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
)
const IconClock = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
)
const IconTruck = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="1" y="3" width="15" height="13" />
    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
    <circle cx="5.5" cy="18.5" r="2.5" />
    <circle cx="18.5" cy="18.5" r="2.5" />
  </svg>
)
const IconTree = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 22v-6M12 16c-2.5 0-4.5-2-4.5-4.5V6a4.5 4.5 0 0 1 9 0v5.5c0 2.5-2 4.5-4.5 4.5z" />
    <path d="M12 8v2M8 12h8M7 16h10" />
  </svg>
)
const IconFuel = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 22V9a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13" />
    <path d="M15 7h2a2 2 0 0 1 2 2v3a2 2 0 0 0 2 2h0" />
    <line x1="3" y1="22" x2="17" y2="22" />
    <rect x="6" y="12" width="6" height="5" rx="1" />
  </svg>
)
const IconList = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="8" y1="6" x2="21" y2="6" />
    <line x1="8" y1="12" x2="21" y2="12" />
    <line x1="8" y1="18" x2="21" y2="18" />
    <line x1="3" y1="6" x2="3.01" y2="6" />
    <line x1="3" y1="12" x2="3.01" y2="12" />
    <line x1="3" y1="18" x2="3.01" y2="18" />
  </svg>
)
const IconStats = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="20" x2="18" y2="10" />
    <line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" />
  </svg>
)
const IconSettings = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
)
const IconLogout = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
)

export default function Sidebar() {
  const navigate = useNavigate()
  const { profile } = useAuth()
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' && window.innerWidth < 768)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  async function logout() {
    await supabase.auth.signOut()
    navigate('/login', { replace: true })
  }

  const userName = profile?.full_name || ''
  const isAdmin = profile?.role === 'Admin'
  const showTootmine = profile?.role === 'Hakkur' || isAdmin

  const navItems = [
    { to: '/', label: 'Avaleht', icon: IconHome },
    { to: '/tunnid', label: 'Töötunnid', icon: IconClock },
    { to: '/vedu', label: 'Vedu', icon: IconTruck },
    ...(showTootmine ? [{ to: '/tootmine', label: 'Tootmine', icon: IconTree }] : []),
    { to: '/tankimine', label: 'Tankimine', icon: IconFuel },
    { to: '/logid', label: 'Logid', icon: IconList },
    ...(isAdmin ? [
      { to: '/statistika', label: 'Statistika', icon: IconStats },
      { to: '/haldus', label: 'Haldus', icon: IconSettings },
    ] : []),
  ]

  const mobileItems = [
    { to: '/', label: 'Avaleht', icon: IconHome },
    { to: '/tunnid', label: 'Tunnid', icon: IconClock },
    { to: '/vedu', label: 'Vedu', icon: IconTruck },
    ...(showTootmine ? [{ to: '/tootmine', label: 'Tootmine', icon: IconTree }] : []),
    { to: '/tankimine', label: 'Tank', icon: IconFuel },
    { to: '/logid', label: 'Logid', icon: IconList },
    ...(isAdmin ? [{ to: '/statistika', label: 'Stats', icon: IconStats }, { to: '/haldus', label: 'Haldus', icon: IconSettings }] : []),
  ]

  if (isMobile) {
    return (
      <>
        <header className="mobile-header">
          <h3>Karela Transport OÜ</h3>
          <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' }}>{userName}</span>
        </header>
        <nav className="bottom-nav">
          {mobileItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `bottom-nav-item${isActive ? ' active' : ''}`}
            >
              <Icon />
              {label}
            </NavLink>
          ))}
          <button type="button" className="bottom-nav-item" onClick={logout}>
            <IconLogout />
            Välja
          </button>
        </nav>
      </>
    )
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <h2>Karela Transport OÜ</h2>
        {userName && <p>{userName}</p>}
      </div>
      <nav className="sidebar-nav">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} className={({ isActive }) => `sidebar-item${isActive ? ' active' : ''}`}>
            <Icon />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-footer">
        <button type="button" className="sidebar-item" onClick={logout} style={{ color: 'rgba(255,255,255,0.5)' }}>
          <IconLogout />
          Logi välja
        </button>
      </div>
    </aside>
  )
}
