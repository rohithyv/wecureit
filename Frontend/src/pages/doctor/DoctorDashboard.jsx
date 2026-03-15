import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { getDoctorByUserId, getChambersByDoctorId, getAppointmentsByDoctorId, getFacilityById } from '../../services/api'
import { DAYS } from '../../data/constants'

const WEEKDAY_IDS = ['mon', 'tue', 'wed', 'thu', 'fri']

export default function DoctorDashboard() {
  const { user } = useAuth()
  const doctor = getDoctorByUserId(user?.id)
  const chambers = doctor ? getChambersByDoctorId(doctor.id) : []
  const appointments = doctor ? getAppointmentsByDoctorId(doctor.id).filter(a => a.status === 'confirmed') : []
  const upcoming = appointments.slice(0, 5)
  const scheduleThisWeek = WEEKDAY_IDS.map(dayId => {
    const ch = chambers.find(c => c.availableDays && c.availableDays.includes(dayId))
    if (!ch) return { dayId, facility: null, start: null, end: null }
    const fac = getFacilityById(ch.facilityId || ch.clinicId)
    return { dayId, facility: fac?.name, start: ch.slotStart, end: ch.slotEnd, chamberId: ch.id }
  })

  if (!doctor) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <p className="text-slate-600">Doctor profile not found.</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="font-display text-2xl font-bold text-slate-800 mb-2">Welcome, Dr. {doctor.name.replace(/^Dr\.?\s*/i, '')}</h1>
      <p className="text-slate-600 mb-8">Manage your chambers and appointments.</p>

      <section className="mb-10">
        <h2 className="font-display text-lg font-semibold text-slate-800 mb-4">This week&apos;s schedule</h2>
        <p className="text-slate-600 text-sm mb-4">Where and when you are scheduled to work (from your availability settings).</p>
        <div className="card p-4">
          <ul className="space-y-2">
            {scheduleThisWeek.map(({ dayId, facility, start, end }) => {
              const dayName = DAYS.find(d => d.id === dayId)?.name ?? dayId
              const duration = (start && end) ? `${start} – ${end}` : '—'
              return (
                <li key={dayId} className="flex justify-between items-center py-1 border-b border-slate-100 last:border-0">
                  <span className="font-medium text-slate-700">{dayName}</span>
                  <span className="text-slate-600 text-sm">{facility ? `${facility} · ${duration}` : 'Not scheduled'}</span>
                </li>
              )
            })}
          </ul>
        </div>
      </section>

      <div className="grid sm:grid-cols-2 gap-6 mb-10">
        <Link to="/doctor/chambers" className="card p-6 hover:border-primary-300 transition group">
          <div className="text-3xl mb-3">🏥</div>
          <h2 className="font-semibold text-slate-800 group-hover:text-primary-600">My availability</h2>
          <p className="text-slate-600 text-sm mt-1">Set where and when you work for each weekday. Changes apply to future reservations only.</p>
        </Link>
        <Link to="/doctor/appointments" className="card p-6 hover:border-primary-300 transition group">
          <div className="text-3xl mb-3">📅</div>
          <h2 className="font-semibold text-slate-800 group-hover:text-primary-600">Appointments</h2>
          <p className="text-slate-600 text-sm mt-1">Upcoming appointments and appointment history.</p>
        </Link>
      </div>
      <div className="mb-8">
        <Link to="/doctor/profile" className="card p-4 flex items-center gap-4 hover:border-primary-300 transition group">
          <div className="text-2xl">👤</div>
          <div>
            <h2 className="font-semibold text-slate-800 group-hover:text-primary-600">Edit profile & specializations</h2>
            <p className="text-slate-600 text-sm">Update qualification, bio, and specializations.</p>
          </div>
        </Link>
      </div>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-lg font-semibold text-slate-800">Upcoming appointments</h2>
          <Link to="/doctor/appointments" className="text-primary-600 text-sm font-medium">View all & history</Link>
        </div>
        {upcoming.length === 0 ? (
          <div className="card p-8 text-center text-slate-500">No upcoming appointments.</div>
        ) : (
          <ul className="space-y-3">
            {upcoming.map((apt) => (
              <li key={apt.id} className="card p-4">
                <p className="font-medium text-slate-800">{apt.patientName}</p>
                <p className="text-sm text-slate-600">{apt.chamberName} · {apt.date} at {apt.slotTime}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
