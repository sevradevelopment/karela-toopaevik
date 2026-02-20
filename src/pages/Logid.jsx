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
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Logid</h1>

      <div className="flex flex-wrap gap-2">
        {TABS.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            className={`btn ${activeTab === id ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab(id)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="card">
        {activeTab === 'tunnid' && (
          <ul className="space-y-1 text-sm">
            {hours.map((e) => (
              <li key={e.id}>{e.date} — {e.start_time} – {e.end_time}</li>
            ))}
          </ul>
        )}
        {activeTab === 'vedu' && (
          <ul className="space-y-1 text-sm">
            {transports.map((e) => (
              <li key={e.id}>{e.date} — {e.license_plates?.plate ?? '—'} | {e.locations?.name ?? '—'} | {e.description ?? '—'} {e.amount ? `(${e.amount})` : ''}</li>
            ))}
          </ul>
        )}
        {activeTab === 'tankimine' && (
          <ul className="space-y-1 text-sm">
            {refuels.map((e) => (
              <li key={e.id}>{e.date} — {e.license_plates?.plate ?? '—'} — {e.liters} L</li>
            ))}
          </ul>
        )}
        {activeTab === 'tootmine' && (
          <ul className="space-y-1 text-sm">
            {production.map((e) => (
              <li key={e.id}>{e.date} — {e.volume_m3} m³</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
