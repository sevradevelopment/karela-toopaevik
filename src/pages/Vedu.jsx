import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import { supabase } from '@/lib/supabase'

export default function Vedu() {
  const { user } = useAuth()
  const { showToast } = useToast()
  const [plateId, setPlateId] = useState('')
  const [locationId, setLocationId] = useState('')
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [plates, setPlates] = useState([])
  const [locations, setLocations] = useState([])
  const [entries, setEntries] = useState([])

  useEffect(() => {
    supabase.from('license_plates').select('id, plate').order('plate').then(({ data }) => setPlates(data || []))
    supabase.from('locations').select('id, name').order('name').then(({ data }) => setLocations(data || []))
  }, [])

  useEffect(() => {
    if (!user?.id) return
    supabase
      .from('transport_logs')
      .select('*, license_plates(plate), locations(name)')
      .eq('user_id', user.id)
      .order('date', { ascending: false })
      .limit(50)
      .then(({ data }) => setEntries(data || []))
  }, [user?.id])

  async function handleSubmit(e) {
    e.preventDefault()
    const { error } = await supabase.from('transport_logs').insert({
      user_id: user.id,
      plate_id: plateId || null,
      location_id: locationId || null,
      date,
      description: description || null,
      amount: amount ? parseFloat(amount) : null,
    })
    if (error) {
      showToast('Viga: ' + error.message, 'error')
      return
    }
    showToast('Vedu salvestatud.')
    setDescription('')
    setAmount('')
    const { data } = await supabase
      .from('transport_logs')
      .select('*, license_plates(plate), locations(name)')
      .eq('user_id', user.id)
      .order('date', { ascending: false })
      .limit(50)
    setEntries(data || [])
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Vedu – mida ja palju vedas</h1>

      <form onSubmit={handleSubmit} className="card space-y-4 max-w-md">
        <div>
          <label className="label">Kuupäev</label>
          <input type="date" className="input" value={date} onChange={(e) => setDate(e.target.value)} required />
        </div>
        <div>
          <label className="label">Numbrimärk</label>
          <select className="input" value={plateId} onChange={(e) => setPlateId(e.target.value)}>
            <option value="">— vali —</option>
            {plates.map((p) => (
              <option key={p.id} value={p.id}>{p.plate}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">Asukoht</label>
          <select className="input" value={locationId} onChange={(e) => setLocationId(e.target.value)}>
            <option value="">— vali —</option>
            {locations.map((l) => (
              <option key={l.id} value={l.id}>{l.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">Mida vedas (kirjeldus)</label>
          <input type="text" className="input" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="nt. hakkepuit" />
        </div>
        <div>
          <label className="label">Kogus (ühik vajadusel)</label>
          <input type="text" className="input" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="nt. 15 m³" />
        </div>
        <button type="submit" className="btn btn-primary">Salvesta</button>
      </form>

      <div className="card">
        <h2 className="text-lg font-semibold text-slate-700 mb-3">Viimased kirjed</h2>
        <ul className="space-y-1 text-sm">
          {entries.map((e) => (
            <li key={e.id}>
              {e.date} — {e.license_plates?.plate ?? '—'} | {e.locations?.name ?? '—'} | {e.description ?? '—'} {e.amount ? `(${e.amount})` : ''}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
