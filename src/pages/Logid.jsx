import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabase'

const TABS = [
  { id: 'tunnid', label: 'Töötunnid' },
  { id: 'vedu', label: 'Vedu' },
  { id: 'tankimine', label: 'Tankimine' },
  { id: 'tootmine', label: 'Tootmine' },
]

export default function Logid() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('tunnid')
  const [hours, setHours] = useState([])
  const [transports, setTransports] = useState([])
  const [refuels, setRefuels] = useState([])
  const [production, setProduction] = useState([])

  useEffect(() => {
    if (!user?.id) return
    supabase.from('work_hours').select('*').eq('user_id', user.id).order('date', { ascending: false }).limit(100).then(({ data }) => setHours(data || []))
    supabase.from('transport_logs').select('*, license_plates(plate), locations(name)').eq('user_id', user.id).order('date', { ascending: false }).limit(100).then(({ data }) => setTransports(data || []))
    supabase.from('refuel_logs').select('*, license_plates(plate)').eq('user_id', user.id).order('date', { ascending: false }).limit(100).then(({ data }) => setRefuels(data || []))
    supabase.from('production_logs').select('*').eq('user_id', user.id).order('date', { ascending: false }).limit(100).then(({ data }) => setProduction(data || []))
  }, [user?.id])

  return (
    <div className="page">
      <div className="page-header">
        <h1>Logid</h1>
        <p>Kõik oma töökirjed ühes kohas.</p>
      </div>

      <div className="chips" style={{ marginBottom: '1.5rem' }}>
        {TABS.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            className={`chip ${activeTab === id ? 'selected' : ''}`}
            onClick={() => setActiveTab(id)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="card">
        {activeTab === 'tunnid' && (
          <ul className="list-plain">
            {hours.map((e) => (
              <li key={e.id}>{e.date} — {e.start_time} – {e.end_time}</li>
            ))}
          </ul>
        )}
        {activeTab === 'vedu' && (
          <ul className="list-plain">
            {transports.map((e) => (
              <li key={e.id}>{e.date} — {e.license_plates?.plate ?? '—'} | {e.locations?.name ?? '—'} | {e.description ?? '—'} {e.amount ? `(${e.amount})` : ''}</li>
            ))}
          </ul>
        )}
        {activeTab === 'tankimine' && (
          <ul className="list-plain">
            {refuels.map((e) => (
              <li key={e.id}>{e.date} — {e.license_plates?.plate ?? '—'} — {e.liters} L</li>
            ))}
          </ul>
        )}
        {activeTab === 'tootmine' && (
          <ul className="list-plain">
            {production.map((e) => (
              <li key={e.id}>{e.date} — {e.volume_m3} m³</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
