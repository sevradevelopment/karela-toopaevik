import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import { supabase } from '@/lib/supabase'

export default function Tootmine() {
  const { user } = useAuth()
  const { showToast } = useToast()
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [volume, setVolume] = useState('')
  const [entries, setEntries] = useState([])

  useEffect(() => {
    if (!user?.id) return
    supabase
      .from('production_logs')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false })
      .limit(50)
      .then(({ data }) => setEntries(data || []))
  }, [user?.id])

  async function handleSubmit(e) {
    e.preventDefault()
    const v = parseFloat(volume)
    if (isNaN(v) || v <= 0) {
      showToast('Sisesta kehtiv m³.', 'error')
      return
    }
    const { error } = await supabase.from('production_logs').insert({
      user_id: user.id,
      date,
      volume_m3: v,
    })
    if (error) {
      showToast('Viga: ' + error.message, 'error')
      return
    }
    showToast('Tootmine salvestatud.')
    setVolume('')
    const { data } = await supabase
      .from('production_logs')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false })
      .limit(50)
    setEntries(data || [])
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Hakkepuidu tootmine (m³)</h1>

      <form onSubmit={handleSubmit} className="card space-y-4 max-w-md">
        <div>
          <label className="label">Kuupäev</label>
          <input type="date" className="input" value={date} onChange={(e) => setDate(e.target.value)} required />
        </div>
        <div>
          <label className="label">Tootmine (m³)</label>
          <input type="number" step="0.1" min="0" className="input" value={volume} onChange={(e) => setVolume(e.target.value)} placeholder="nt. 12.5" required />
        </div>
        <button type="submit" className="btn btn-primary">Salvesta</button>
      </form>

      <div className="card">
        <h2 className="text-lg font-semibold text-slate-700 mb-3">Viimased kirjed</h2>
        <ul className="space-y-1 text-sm">
          {entries.map((e) => (
            <li key={e.id}>{e.date} — {e.volume_m3} m³</li>
          ))}
        </ul>
      </div>
    </div>
  )
}
