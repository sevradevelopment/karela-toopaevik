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
    supabase
      .from('locations')
      .select('id, name')
      .order('name')
      .then(({ data }) => setLocations(data || []))
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
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">
        Tere {greeting}, {name}!
      </h1>

      <section className="card">
        <h2 className="text-lg font-semibold text-slate-700 mb-2">Asukohad (kuhu kaupa veetakse)</h2>
        <ul className="flex flex-wrap gap-2">
          {locations.length === 0 ? (
            <li className="text-slate-500">Mäetaguse, Puurmanni, Avinurme, Kuusna, Rava, Sinimäe, Tammistu, Peipsiääre, Kavastu, Loviisa, Orimattila, Balti elekter</li>
          ) : (
            locations.map((loc) => (
              <li key={loc.id} className="bg-slate-100 px-3 py-1 rounded-lg text-sm">{loc.name}</li>
            ))
          )}
        </ul>
        <p className="text-slate-500 text-sm mt-2">Asukohti saab halduses muuta (Admin).</p>
      </section>

      <section className="card">
        <h2 className="text-lg font-semibold text-slate-700 mb-3">Kiirlingid</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {links.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className="block p-4 rounded-xl border border-slate-200 bg-white hover:border-primary hover:bg-primary-light/30 font-medium text-slate-800 transition"
            >
              {label}
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
