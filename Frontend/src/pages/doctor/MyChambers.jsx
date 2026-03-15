import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { getDoctorByUserId, getChambersByDoctorId, getFacilityById, deleteChamber } from '../../services/api'
import { DAYS } from '../../data/constants'

export default function MyChambers() {
  const { user } = useAuth()
  const [refresh, setRefresh] = useState(0)
  const doctor = getDoctorByUserId(user?.id)
  const chambers = doctor ? getChambersByDoctorId(doctor.id) : []

  const handleDelete = (id, name) => {
    if (window.confirm(`Delete chamber "${name}"?`)) {
      deleteChamber(id)
      setRefresh(r => r + 1)
    }
  }

  if (!doctor) return null

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-800">My availability</h1>
          <p className="text-slate-600 mt-1">Set where and when you are available to work for each weekday. Changes apply to future reservations only.</p>
        </div>
        <Link to="/doctor/chambers/new" className="btn-primary">Add availability</Link>
      </div>

      {chambers.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-slate-600 mb-4">You haven&apos;t set any availability yet.</p>
          <Link to="/doctor/chambers/new" className="btn-primary">Add your first availability</Link>
        </div>
      ) : (
        <ul className="space-y-4">
          {chambers.map((ch) => {
            const facility = getFacilityById(ch.facilityId || ch.clinicId)
            return (
            <li key={ch.id} className="card p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="font-semibold text-slate-800">{facility?.name ?? 'Facility'}</h2>
                  <p className="text-sm text-slate-600 mt-1">{facility?.address}</p>
                  <p className="text-sm text-slate-500">{facility?.city}, {facility?.state} {facility?.zipCode}</p>
                  <p className="text-xs text-slate-500 mt-2">
                    {ch.slotStart}–{ch.slotEnd} (4–8 hrs/day) · {ch.slotDurationMinutes} min slots · ${ch.consultationCharge ?? 0}/visit
                  </p>
                  <p className="text-xs text-slate-500">
                    Weekdays: {ch.availableDays?.map(d => DAYS.find(x => x.id === d)?.name || d).join(', ')}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Link to={`/doctor/chambers/${ch.id}/edit`} className="btn-secondary">Edit</Link>
                  <button onClick={() => handleDelete(ch.id, facility?.name ?? 'Slot')} className="btn-secondary text-red-600 border-red-200 hover:bg-red-50">
                    Delete
                  </button>
                </div>
              </div>
            </li>
          )})}
        </ul>
      )}
    </div>
  )
}
