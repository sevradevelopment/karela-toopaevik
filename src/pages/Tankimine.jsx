import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import { supabase } from '@/lib/supabase'

export default function Tankimine() {
  const { user } = useAuth()
  const { showToast } = useToast()
  const [plateId, setPlateId] = useState('')
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [liters, setLiters] = useState('')
  const [plates, setPlates] = useState([])
  const [entries, setEntries] = useState([])

  useEffect(() => {
    supabase.from('license_plates').select('id, plate').order('plate').then(({ data }) => setPlates(data || []))
  }, [])

  useEffect(() => {
    if (!user?.id) return
    supabase
      .from('refuel_logs')
      .select('*, license_plates(plate)')
      .eq('user_id', user.id)
      .order('date', { ascending: false })
      .limit(50)
      .then(({ data }) => setEntries(data || []))
  }, [user?.id])

  async function handleSubmit(e) {
    e.preventDefault()
    const l = parseFloat(liters)
    if (!plateId || isNaN(l) || l <= 0) {
      showToast('Vali numbrimärk ja sisesta liitrid.', 'error')
      return
    }
    const { error } = await supabase.from('refuel_logs').insert({
      user_id: user.id,
      plate_id: plateId,
      date,
      liters: l,
    })
    if (error) {
      showToast('Viga: ' + error.message, 'error')
      return
    }
    showToast('Tankimine salvestatud.')
    setLiters('')
    const { data } = await supabase
      .from('refuel_logs')
      .select('*, license_plates(plate)')
      .eq('user_id', user.id)
      .order('date', { ascending: false })
      .limit(50)
    setEntries(data || [])
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>Tankimine</h1>
        <p>Numbrimärgid (vedukid ja hakkuri 0371TH).</p>
      </div>

      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label className="label">Kuupäev</label>
            <input type="date" className="input" value={date} onChange={(e) => setDate(e.target.value)} required />
          </div>
          <div className="field">
            <label className="label">Numbrimärk</label>
            <select className="input" value={plateId} onChange={(e) => setPlateId(e.target.value)} required>
              <option value="">— vali —</option>
              {plates.map((p) => (
                <option key={p.id} value={p.id}>{p.plate}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label className="label">Liitrid</label>
            <input type="number" step="0.1" min="0" className="input" value={liters} onChange={(e) => setLiters(e.target.value)} placeholder="nt. 45" required />
          </div>
          <button type="submit" className="btn btn-primary">Salvesta</button>
        </form>
      </div>

      <div className="card">
        <div className="card-section-title">Viimased tankimised</div>
        <ul className="list-plain">
          {entries.map((e) => (
            <li key={e.id}>{e.date} — {e.license_plates?.plate ?? '—'} — {e.liters} L</li>
          ))}
        </ul>
      </div>
    </div>
  )
}
