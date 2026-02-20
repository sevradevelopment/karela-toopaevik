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
    if (error) showToast('Viga: ' + error.message, 'error')
    else { showToast('Numbrimärk lisatud.'); setNewPlate(''); load() }
  }

  async function removePlate(id) {
    if (!window.confirm('Eemaldada see numbrimärk?')) return
    await supabase.from('license_plates').delete().eq('id', id)
    showToast('Numbrimärk eemaldatud.'); load()
  }

  async function addLocation(e) {
    e.preventDefault()
    if (!newLocation.trim()) return
    const { error } = await supabase.from('locations').insert({ name: newLocation.trim() })
    if (error) showToast('Viga: ' + error.message, 'error')
    else { showToast('Asukoht lisatud.'); setNewLocation(''); load() }
  }

  async function removeLocation(id) {
    if (!window.confirm('Eemaldada see asukoht?')) return
    await supabase.from('locations').delete().eq('id', id)
    showToast('Asukoht eemaldatud.'); load()
  }

  async function setUserRole(userId, role) {
    const { error } = await supabase.from('profiles').update({ role }).eq('id', userId)
    if (error) showToast('Viga: ' + error.message, 'error')
    else { showToast('Roll uuendatud.'); load() }
  }

  if (profile?.role !== 'Admin') {
    return (
      <div className="page">
        <div className="card">
          <p style={{ color: 'var(--text-secondary)' }}>Juurdepääs ainult administraatoritele.</p>
        </div>
      </div>
    )
  }

  const tabs = [
    { id: 'plates', label: 'Numbrimärgid' },
    { id: 'locations', label: 'Asukohad' },
    { id: 'users', label: 'Kasutajad' },
  ]

  return (
    <div className="page">
      <div className="page-header">
        <h1>Haldus</h1>
        <p>Numbrimärgid, asukohad ja kasutajate rollid.</p>
      </div>

      <div className="chips" style={{ marginBottom: '1.5rem' }}>
        {tabs.map(({ id, label }) => (
          <button key={id} type="button" className={`chip ${tab === id ? 'selected' : ''}`} onClick={() => setTab(id)}>
            {label}
          </button>
        ))}
      </div>

      {tab === 'plates' && (
        <div className="card">
          <div className="card-section-title">Numbrimärgid (vedukid, hakkur 0371TH jne)</div>
          <form onSubmit={addPlate} style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
            <input className="input" value={newPlate} onChange={(e) => setNewPlate(e.target.value)} placeholder="nt. 133LHL" style={{ maxWidth: '140px' }} />
            <button type="submit" className="btn btn-primary">Lisa</button>
          </form>
          <ul className="list-plain">
            {plates.map((p) => (
              <li key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>{p.plate}</span>
                <button type="button" className="btn btn-danger btn-sm" onClick={() => removePlate(p.id)}>Eemalda</button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {tab === 'locations' && (
        <div className="card">
          <div className="card-section-title">Asukohad (kuhu kaupa veetakse)</div>
          <form onSubmit={addLocation} style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
            <input className="input" value={newLocation} onChange={(e) => setNewLocation(e.target.value)} placeholder="nt. Mäetaguse" style={{ maxWidth: '180px' }} />
            <button type="submit" className="btn btn-primary">Lisa</button>
          </form>
          <ul className="list-plain">
            {locations.map((l) => (
              <li key={l.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>{l.name}</span>
                <button type="button" className="btn btn-danger btn-sm" onClick={() => removeLocation(l.id)}>Eemalda</button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {tab === 'users' && (
        <div className="card">
          <div className="card-section-title">Kasutajad ja rollid</div>
          <ul className="list-plain">
            {users.map((u) => (
              <li key={u.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
                <span>{u.full_name || u.id}</span>
                <select
                  value={u.role || ''}
                  onChange={(e) => setUserRole(u.id, e.target.value)}
                  className="input"
                  style={{ maxWidth: '140px', minHeight: '40px' }}
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
