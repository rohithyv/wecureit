import { useState } from 'react'
import { Link } from 'react-router-dom'
import { getFacilities, getFacilityById, addFacility, updateFacility, deleteFacility, getChambersByFacilityId } from '../../services/api'
import { EQUIPMENT_TYPES, MOCK_STATES } from '../../data/constants'

const defaultFacility = {
  name: '',
  address: '',
  state: 'Virginia',
  city: '',
  zipCode: '',
  openTime: '08:00',
  closeTime: '18:00',
  roomsAvailable: 4,
  equipment: [{ type: 'X-Ray', count: 1 }],
}

export default function AdminFacilities() {
  const [refresh, setRefresh] = useState(0)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(defaultFacility)
  const [error, setError] = useState('')

  const facilities = getFacilities()

  const handleEdit = (fac) => {
    setEditingId(fac.id)
    setForm({
      name: fac.name || '',
      address: fac.address || '',
      state: fac.state || 'Virginia',
      city: fac.city || '',
      zipCode: fac.zipCode || '',
      openTime: fac.openTime || '08:00',
      closeTime: fac.closeTime || '18:00',
      roomsAvailable: fac.roomsAvailable ?? 4,
      equipment: Array.isArray(fac.equipment) && fac.equipment.length ? fac.equipment.map(e => ({ type: e.type || 'X-Ray', count: e.count ?? 1 })) : [{ type: 'X-Ray', count: 1 }],
    })
    setError('')
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setForm(defaultFacility)
    setError('')
  }

  const addEquipmentRow = () => {
    setForm(f => ({ ...f, equipment: [...(f.equipment || []), { type: 'X-Ray', count: 1 }] }))
  }

  const updateEquipment = (index, field, value) => {
    setForm(f => {
      const eq = [...(f.equipment || [])]
      eq[index] = { ...eq[index], [field]: field === 'count' ? parseInt(value, 10) || 0 : value }
      return { ...f, equipment: eq }
    })
  }

  const removeEquipment = (index) => {
    setForm(f => ({ ...f, equipment: f.equipment.filter((_, i) => i !== index) }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    if (!form.name?.trim()) { setError('Name is required'); return }
    if (!form.address?.trim()) { setError('Address is required'); return }
    if (!form.city?.trim()) { setError('City is required'); return }
    if (form.roomsAvailable == null || form.roomsAvailable < 1) { setError('At least 1 room required'); return }
    const openM = form.openTime ? form.openTime.split(':').reduce((h, m) => parseInt(h, 10) * 60 + parseInt(m, 10)) : 0
    const closeM = form.closeTime ? form.closeTime.split(':').reduce((h, m) => parseInt(h, 10) * 60 + parseInt(m, 10)) : 0
    if (closeM <= openM) { setError('Closing time must be after opening time'); return }

    if (editingId) {
      updateFacility(editingId, { ...form })
    } else {
      addFacility({ ...form })
    }
    setRefresh(r => r + 1)
    handleCancelEdit()
  }

  const handleDelete = (id, name) => {
    const chambers = getChambersByFacilityId(id)
    if (chambers.length > 0) {
      setError(`Cannot delete: ${chambers.length} doctor availability slot(s) use this facility.`)
      return
    }
    if (!window.confirm(`Delete facility "${name}"?`)) return
    deleteFacility(id)
    setRefresh(r => r + 1)
    if (editingId === id) handleCancelEdit()
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <Link to="/admin" className="text-primary-600 text-sm font-medium mb-6 inline-block">← Admin dashboard</Link>
      <h1 className="font-display text-2xl font-bold text-slate-800 mb-2">Manage Facilities</h1>
      <p className="text-slate-600 mb-8">Add, view, and update facility information: operating hours, rooms, and medical equipment.</p>

      {/* Add / Edit form */}
      <div className="card p-6 mb-10">
        <h2 className="font-display text-lg font-semibold text-slate-800 mb-4">{editingId ? 'Update facility' : 'Add facility'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
              <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="input-field" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">State</label>
              <select value={form.state} onChange={e => setForm(f => ({ ...f, state: e.target.value }))} className="input-field">
                {MOCK_STATES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
            <input type="text" value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} className="input-field" required />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">City</label>
              <input type="text" value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} className="input-field" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">ZIP</label>
              <input type="text" value={form.zipCode} onChange={e => setForm(f => ({ ...f, zipCode: e.target.value }))} className="input-field" />
            </div>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Open</label>
              <input type="time" value={form.openTime} onChange={e => setForm(f => ({ ...f, openTime: e.target.value }))} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Close</label>
              <input type="time" value={form.closeTime} onChange={e => setForm(f => ({ ...f, closeTime: e.target.value }))} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Rooms available</label>
              <input type="number" min={1} value={form.roomsAvailable} onChange={e => setForm(f => ({ ...f, roomsAvailable: parseInt(e.target.value, 10) || 1 }))} className="input-field" />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-slate-700">Equipment (type & count)</label>
              <button type="button" onClick={addEquipmentRow} className="btn-secondary text-sm">+ Add</button>
            </div>
            {(form.equipment || []).map((eq, i) => (
              <div key={i} className="flex gap-2 items-center mb-2">
                <select value={eq.type} onChange={e => updateEquipment(i, 'type', e.target.value)} className="input-field flex-1">
                  {EQUIPMENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                <input type="number" min={0} value={eq.count} onChange={e => updateEquipment(i, 'count', e.target.value)} className="input-field w-20" />
                <button type="button" onClick={() => removeEquipment(i)} className="btn-secondary text-red-600 text-sm">Remove</button>
              </div>
            ))}
          </div>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <div className="flex gap-3">
            <button type="submit" className="btn-primary">{editingId ? 'Save changes' : 'Add facility'}</button>
            {editingId && <button type="button" onClick={handleCancelEdit} className="btn-secondary">Cancel</button>}
          </div>
        </form>
      </div>

      {/* List */}
      <section>
        <h2 className="font-display text-lg font-semibold text-slate-800 mb-4">Facilities</h2>
        {facilities.length === 0 ? (
          <div className="card p-8 text-center text-slate-500">No facilities. Add one above.</div>
        ) : (
          <ul className="space-y-3">
            {facilities.map((fac) => (
              <li key={fac.id} className="card p-4 flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="font-medium text-slate-800">{fac.name}</p>
                  <p className="text-sm text-slate-600">{fac.address}, {fac.city}, {fac.state} {fac.zipCode}</p>
                  <p className="text-xs text-slate-500 mt-1">Hours: {fac.openTime || '08:00'} – {fac.closeTime || '18:00'} · Rooms: {fac.roomsAvailable ?? 0}</p>
                  {Array.isArray(fac.equipment) && fac.equipment.length > 0 && (
                    <p className="text-xs text-slate-500 mt-1">Equipment: {fac.equipment.map(e => `${e.type} (${e.count})`).join(', ')}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(fac)} className="btn-secondary text-sm">Edit</button>
                  <button onClick={() => handleDelete(fac.id, fac.name)} className="btn-secondary text-sm text-red-600 border-red-200 hover:bg-red-50">Delete</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
