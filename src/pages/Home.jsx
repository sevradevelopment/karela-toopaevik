import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabase'

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'hommikust'
  if (h < 18) return 'päevast'
  return 'õhtust'
}

export default function Home() {
  const { profile } = useAuth()
  const [locations, setLocations] = useState([])

  useEffect(() => {
    supabase.from('locations').select('id, name').order('name').then(({ data }) => setLocations(data || []))
  }, [])

  const name = profile?.full_name || 'töötaja'
  const greeting = getGreeting()

  const links = [
    { to: '/tankimine', label: 'Tankimine' },
    { to: '/tunnid', label: 'Töötunnid' },
    { to: '/vedu', label: 'Vedu (mida ja palju)' },
    { to: '/logid', label: 'Logid' },
  ]
  if (profile?.role === 'Hakkur' || profile?.role === 'Admin') {
    links.push({ to: '/tootmine', label: 'Hakkepuidu tootmine (m³)' })
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>Tere {greeting}, {name}!</h1>
        <p>Karela Transport OÜ tööpäevik</p>
      </div>

      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div className="card-section-title">Asukohad (kuhu kaupa veetakse)</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {locations.length === 0 ? (
            <span style={{ color: 'var(--text-light)' }}>Mäetaguse, Puurmanni, Avinurme, Kuusna, Rava, Sinimäe, Tammistu, Peipsiääre, Kavastu, Loviisa, Orimattila, Balti elekter</span>
          ) : (
            locations.map((loc) => (
              <span key={loc.id} className="badge badge-gray">{loc.name}</span>
            ))
          )}
        </div>
        <p style={{ color: 'var(--text-light)', fontSize: '0.85rem', marginTop: '0.75rem' }}>Asukohti saab halduses muuta (Admin).</p>
      </div>

      <div className="card">
        <div className="card-section-title">Kiirlingid</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '0.75rem' }}>
          {links.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className="btn btn-secondary"
              style={{ justifyContent: 'center' }}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
