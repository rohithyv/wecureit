import { useState } from 'react'
import { Link } from 'react-router-dom'
import { getDoctors, getChambers, getDoctorById, getFacilityById, deleteDoctor, moveChamberToDoctor } from '../../services/api'
import { SPECIALIZATIONS } from '../../data/constants'

export default function AdminDoctors() {
  const [refresh, setRefresh] = useState(0)
  const [movingChamberId, setMovingChamberId] = useState(null)
  const [newDoctorId, setNewDoctorId] = useState('')
  const doctors = getDoctors()
  const chambers = getChambers()

  const handleDeleteDoctor = (doctorId, name) => {
    if (!window.confirm(`Delete doctor "${name}"? This will remove all their chambers and cancel their appointments.`)) return
    deleteDoctor(doctorId)
    setRefresh(r => r + 1)
  }

  const handleMoveChamber = (chamberId) => {
    if (!newDoctorId) return
    moveChamberToDoctor(chamberId, newDoctorId)
    setMovingChamberId(null)
    setNewDoctorId('')
    setRefresh(r => r + 1)
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <Link to="/admin" className="text-primary-600 text-sm font-medium mb-6 inline-block">← Admin dashboard</Link>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-800 mb-2">Manage Doctors</h1>
          <p className="text-slate-600">Add, view, and update doctor information, specialties, and licensed states.</p>
        </div>
        <Link to="/admin/doctors/new" className="btn-primary">Add doctor</Link>
      </div>

      <section className="mb-10">
        <h2 className="font-display text-lg font-semibold text-slate-800 mb-4">Doctors</h2>
        {doctors.length === 0 ? (
          <div className="card p-8 text-center text-slate-500">No doctors.</div>
        ) : (
          <ul className="space-y-3">
            {doctors.map((doc) => (
              <li key={doc.id} className="card p-4 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="font-medium text-slate-800">{doc.name}</p>
                  <p className="text-sm text-slate-600">{doc.qualification}</p>
                  <p className="text-xs text-slate-500">
                    Specialties: {doc.specializationIds?.map(id => SPECIALIZATIONS.find(s => s.id === id)?.name).filter(Boolean).join(', ') || '—'}
                  </p>
                  <p className="text-xs text-slate-500">
                    Licensed states: {doc.licensedStates?.length ? doc.licensedStates.join(', ') : '—'}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    {chambers.filter(c => c.doctorId === doc.id).length} availability slot(s)
                  </p>
                </div>
                <div className="flex gap-2">
                  <Link to={`/admin/doctors/${doc.id}/edit`} className="btn-secondary text-sm">Edit</Link>
                <button
                  onClick={() => handleDeleteDoctor(doc.id, doc.name)}
                  className="btn-secondary text-red-600 border-red-200 hover:bg-red-50"
                >
                  Delete
                </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="font-display text-lg font-semibold text-slate-800 mb-4">Doctor availability – Move to another doctor</h2>
        {chambers.length === 0 ? (
          <div className="card p-8 text-center text-slate-500">No availability slots.</div>
        ) : (
          <ul className="space-y-3">
            {chambers.map((ch) => {
              const facility = getFacilityById(ch.facilityId || ch.clinicId)
              const currentDoctor = getDoctorById(ch.doctorId)
              return (
                <li key={ch.id} className="card p-4 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="font-medium text-slate-800">{facility?.name ?? 'Facility'}</p>
                    <p className="text-sm text-slate-600">{facility?.address}, {facility?.city}, {facility?.state}</p>
                    <p className="text-xs text-slate-500">Current doctor: {currentDoctor?.name ?? ch.doctorId}</p>
                  </div>
                  {movingChamberId === ch.id ? (
                    <div className="flex flex-wrap items-center gap-2">
                      <select
                        value={newDoctorId}
                        onChange={(e) => setNewDoctorId(e.target.value)}
                        className="input-field w-48"
                      >
                        <option value="">Select doctor</option>
                        {doctors.filter(d => d.id !== ch.doctorId).map(d => (
                          <option key={d.id} value={d.id}>{d.name}</option>
                        ))}
                      </select>
                      <button onClick={() => handleMoveChamber(ch.id)} className="btn-primary text-sm">Move</button>
                      <button onClick={() => { setMovingChamberId(null); setNewDoctorId('') }} className="btn-secondary text-sm">Cancel</button>
                    </div>
                  ) : (
                    <button
                      onClick={() => { setMovingChamberId(ch.id); setNewDoctorId('') }}
                      className="btn-secondary text-sm"
                    >
                      Move to another doctor
                    </button>
                  )}
                </li>
              )
            })}
          </ul>
        )}
      </section>
    </div>
  )
}
