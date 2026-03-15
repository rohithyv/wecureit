import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { getDoctorByUserId, getAppointmentsByDoctorId, setAppointmentActualDuration } from '../../services/api'
import { MAX_PATIENT_VISIT_MINUTES } from '../../data/constants'

export default function DoctorAppointments() {
  const { user } = useAuth()
  const [refresh, setRefresh] = useState(0)
  const [recordingId, setRecordingId] = useState(null)
  const [actualMinutes, setActualMinutes] = useState('')
  const doctor = getDoctorByUserId(user?.id)
  const appointments = doctor ? getAppointmentsByDoctorId(doctor.id) : []
  const today = new Date().toISOString().slice(0, 10)
  const upcoming = appointments.filter(a => a.status === 'confirmed' && a.date >= today)
  const past = appointments.filter(a => a.status === 'cancelled' || a.status === 'completed' || a.date < today)

  const handleRecordVisit = (apt) => {
    const mins = parseInt(actualMinutes, 10)
    if (mins < 0 || mins > 120) return
    setAppointmentActualDuration(apt.id, mins)
    setRecordingId(null)
    setActualMinutes('')
    setRefresh(r => r + 1)
  }

  if (!doctor) return null

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="font-display text-2xl font-bold text-slate-800 mb-2">Appointments</h1>
      <p className="text-slate-600 mb-8">Patient bookings across your chambers.</p>

      <section className="mb-10">
        <h2 className="font-display text-lg font-semibold text-slate-800 mb-4">Upcoming</h2>
        {upcoming.length === 0 ? (
          <div className="card p-8 text-center text-slate-500">No upcoming appointments.</div>
        ) : (
          <ul className="space-y-3">
            {upcoming.map((apt) => (
              <li key={apt.id} className="card p-4">
                <p className="font-medium text-slate-800">{apt.patientName}</p>
                <p className="text-sm text-slate-600">{apt.chamberName ?? 'Facility'} · {apt.date} at {apt.slotTime}</p>
                <p className="text-sm text-slate-500">Booked {apt.bookedDurationMinutes ?? 30} min · ${apt.charge ?? 0}</p>
                {(apt.date <= today) && (
                  <div className="mt-3 pt-3 border-t border-slate-100">
                    {recordingId === apt.id ? (
                      <div className="flex flex-wrap items-center gap-2">
                        <label className="text-sm text-slate-600">Actual visit (min):</label>
                        <input
                          type="number"
                          min={1}
                          max={120}
                          value={actualMinutes}
                          onChange={(e) => setActualMinutes(e.target.value)}
                          className="input-field w-24"
                        />
                        <button onClick={() => handleRecordVisit(apt)} className="btn-primary text-sm">Save</button>
                        <button onClick={() => { setRecordingId(null); setActualMinutes('') }} className="btn-secondary text-sm">Cancel</button>
                        <span className="text-xs text-slate-500">Max {MAX_PATIENT_VISIT_MINUTES} min allowed. Overtime incurs a fine.</span>
                      </div>
                    ) : (
                      <button onClick={() => { setRecordingId(apt.id); setActualMinutes(String(apt.bookedDurationMinutes || 30)) }} className="btn-secondary text-sm">
                        Record visit & set actual duration
                      </button>
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      {past.length > 0 && (
        <section>
          <h2 className="font-display text-lg font-semibold text-slate-800 mb-4">Appointment history</h2>
          <ul className="space-y-3">
            {past.map((apt) => (
              <li key={apt.id} className="card p-4 opacity-90">
                <p className="font-medium text-slate-800">{apt.patientName}</p>
                <p className="text-sm text-slate-600">{apt.chamberName} · {apt.date} at {apt.slotTime} · ${apt.charge ?? 0}</p>
                {apt.status === 'confirmed' && apt.date < today && (
                  <div className="mt-3 pt-3 border-t border-slate-100">
                    {recordingId === apt.id ? (
                      <div className="flex flex-wrap items-center gap-2">
                        <label className="text-sm text-slate-600">Actual visit (min):</label>
                        <input type="number" min={1} max={120} value={actualMinutes} onChange={(e) => setActualMinutes(e.target.value)} className="input-field w-24" />
                        <button onClick={() => handleRecordVisit(apt)} className="btn-primary text-sm">Save</button>
                        <button onClick={() => { setRecordingId(null); setActualMinutes('') }} className="btn-secondary text-sm">Cancel</button>
                      </div>
                    ) : (
                      <button onClick={() => { setRecordingId(apt.id); setActualMinutes(String(apt.bookedDurationMinutes || 30)) }} className="btn-secondary text-sm">Record visit</button>
                    )}
                  </div>
                )}
                {apt.status === 'completed' && apt.actualDurationMinutes != null && (
                  <p className="text-sm text-slate-500 mt-1">
                    Actual: {apt.actualDurationMinutes} min
                    {apt.fine > 0 && <span className="text-amber-700 font-medium"> · Overtime fine: ${apt.fine}</span>}
                  </p>
                )}
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${apt.status === 'cancelled' ? 'bg-red-100 text-red-700' : apt.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                  {apt.status}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}
