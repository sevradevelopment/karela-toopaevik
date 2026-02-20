import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import { supabase } from '@/lib/supabase'

export default function Tunnid() {
  const { user } = useAuth()
  const { showToast } = useToast()
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [entries, setEntries] = useState([])

  async function load() {
    if (!user?.id) return
    const { data } = await supabase.from('work_hours').select('*').eq('user_id', user.id).order('date', { ascending: false }).limit(50)
    setEntries(data || [])
  }

  useEffect(() => { load() }, [user?.id])

  async function handleSubmit(e) {
    e.preventDefault()
    const { error } = await supabase.from('work_hours').insert({
      user_id: user.id,
      date,
      start_time: startTime,
      end_time: endTime,
    })
    if (error) {
      showToast('Viga: ' + error.message, 'error')
      return
    }
    showToast('Töötunnid salvestatud.')
    setStartTime('')
    setEndTime('')
    load()
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>Töötunnid</h1>
        <p>Alustamise ja lõpetamise kell.</p>
      </div>

      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label className="label">Kuupäev</label>
            <input type="date" className="input" value={date} onChange={(e) => setDate(e.target.value)} required />
          </div>
          <div className="field">
            <label className="label">Alustamise kell</label>
            <input type="time" className="input" value={startTime} onChange={(e) => setStartTime(e.target.value)} required />
          </div>
          <div className="field">
            <label className="label">Lõpetamise kell</label>
            <input type="time" className="input" value={endTime} onChange={(e) => setEndTime(e.target.value)} required />
          </div>
          <button type="submit" className="btn btn-primary">Salvesta</button>
        </form>
      </div>

      <div className="card">
        <div className="card-section-title">Viimased kirjed</div>
        <ul className="list-plain">
          {entries.map((e) => (
            <li key={e.id}>{e.date} — {e.start_time} – {e.end_time}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}
