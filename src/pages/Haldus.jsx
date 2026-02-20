import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import { supabase } from '@/lib/supabase'

export default function Haldus() {
  const { profile } = useAuth()
  const { showToast } = useToast()
  const [tab, setTab] = useState('plates')
  const [plates, setPlates] = useState([])
  const [locations, setLocations] = useState([])
  const [users, setUsers] = useState([])
  const [newPlate, setNewPlate] = useState('')
  const [newLocation, setNewLocation] = useState('')

  function load() {
    supabase.from('license_plates').select('*').order('plate').then(({ data }) => setPlates(data || []))
    supabase.from('locations').select('*').order('name').then(({ data }) => setLocations(data || []))
    supabase.from('profiles').select('id, full_name, role').order('full_name').then(({ data }) => setUsers(data || []))
  }

  useEffect(() => {
    if (profile?.role !== 'Admin') return
    load()
  }, [profile?.role])

  async function addPlate(e) {
    e.preventDefault()
    if (!newPlate.trim()) return
    const { error } = await supabase.from('license_plates').insert({ plate: newPlate.trim().toUpperCase() })
    if (error) {
      showToast('Viga: ' + error.message, 'error')
    } else {
      showToast('Numbrimärk lisatud.')
      setNewPlate('')
      load()
    }
  }

  async function removePlate(id) {
    if (!window.confirm('Eemaldada see numbrimärk?')) return
    await supabase.from('license_plates').delete().eq('id', id)
    showToast('Numbrimärk eemaldatud.')
    load()
  }

  async function addLocation(e) {
    e.preventDefault()
    if (!newLocation.trim()) return
    const { error } = await supabase.from('locations').insert({ name: newLocation.trim() })
    if (error) {
      showToast('Viga: ' + error.message, 'error')
    } else {
      showToast('Asukoht lisatud.')
      setNewLocation('')
      load()
    }
  }

  async function removeLocation(id) {
    if (!window.confirm('Eemaldada see asukoht?')) return
    await supabase.from('locations').delete().eq('id', id)
    showToast('Asukoht eemaldatud.')
    load()
  }

  async function setUserRole(userId, role) {
    const { error } = await supabase.from('profiles').update({ role }).eq('id', userId)
    if (error) {
      showToast('Viga: ' + error.message, 'error')
    } else {
      showToast('Roll uuendatud.')
      load()
    }
  }

  if (profile?.role !== 'Admin') {
    return (
      <div className="card">
        <p className="text-slate-600">Juurdepääs ainult administraatoritele.</p>
      </div>
    )
  }

  const tabs = [
    { id: 'plates', label: 'Numbrimärgid' },
    { id: 'locations', label: 'Asukohad' },
    { id: 'users', label: 'Kasutajad' },
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Haldus</h1>

      <div className="flex flex-wrap gap-2">
        {tabs.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            className={`btn ${tab === id ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setTab(id)}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'plates' && (
        <div className="card space-y-4">
          <h2 className="text-lg font-semibold text-slate-700">Numbrimärgid (vedukid, hakkur 0371TH jne)</h2>
          <form onSubmit={addPlate} className="flex flex-wrap gap-2">
            <input
              className="input max-w-[140px]"
              value={newPlate}
              onChange={(e) => setNewPlate(e.target.value)}
              placeholder="nt. 133LHL"
            />
            <button type="submit" className="btn btn-primary">Lisa</button>
          </form>
          <ul className="space-y-2">
            {plates.map((p) => (
              <li key={p.id} className="flex items-center justify-between py-1 border-b border-slate-100">
                <span>{p.plate}</span>
                <button type="button" className="btn btn-secondary text-sm py-1 px-2" onClick={() => removePlate(p.id)}>Eemalda</button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {tab === 'locations' && (
        <div className="card space-y-4">
          <h2 className="text-lg font-semibold text-slate-700">Asukohad (kuhu kaupa veetakse)</h2>
          <form onSubmit={addLocation} className="flex flex-wrap gap-2">
            <input
              className="input max-w-[180px]"
              value={newLocation}
              onChange={(e) => setNewLocation(e.target.value)}
              placeholder="nt. Mäetaguse"
            />
            <button type="submit" className="btn btn-primary">Lisa</button>
          </form>
          <ul className="space-y-2">
            {locations.map((l) => (
              <li key={l.id} className="flex items-center justify-between py-1 border-b border-slate-100">
                <span>{l.name}</span>
                <button type="button" className="btn btn-secondary text-sm py-1 px-2" onClick={() => removeLocation(l.id)}>Eemalda</button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {tab === 'users' && (
        <div className="card">
          <h2 className="text-lg font-semibold text-slate-700 mb-4">Kasutajad ja rollid</h2>
          <ul className="space-y-3">
            {users.map((u) => (
              <li key={u.id} className="flex items-center justify-between py-2 border-b border-slate-100">
                <span>{u.full_name || u.id}</span>
                <select
                  value={u.role || ''}
                  onChange={(e) => setUserRole(u.id, e.target.value)}
                  className="input max-w-[140px] py-1.5"
                >
                  <option value="Admin">Admin</option>
                  <option value="Vedaja">Vedaja</option>
                  <option value="Hakkur">Hakkur</option>
                </select>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
