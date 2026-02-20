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
    const { data } = await supabase
      .from('work_hours')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false })
      .limit(50)
    setEntries(data || [])
  }

  useEffect(() => {
    load()
  }, [user?.id])

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
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Töötunnid</h1>

      <form onSubmit={handleSubmit} className="card space-y-4 max-w-md">
        <div>
          <label className="label">Kuupäev</label>
          <input type="date" className="input" value={date} onChange={(e) => setDate(e.target.value)} required />
        </div>
        <div>
          <label className="label">Alustamise kell</label>
          <input type="time" className="input" value={startTime} onChange={(e) => setStartTime(e.target.value)} required />
        </div>
        <div>
          <label className="label">Lõpetamise kell</label>
          <input type="time" className="input" value={endTime} onChange={(e) => setEndTime(e.target.value)} required />
        </div>
        <button type="submit" className="btn btn-primary">Salvesta</button>
      </form>

      <div className="card">
        <h2 className="text-lg font-semibold text-slate-700 mb-3">Viimased kirjed</h2>
        <ul className="space-y-1 text-sm">
          {entries.map((e) => (
            <li key={e.id}>{e.date} — {e.start_time} – {e.end_time}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}
