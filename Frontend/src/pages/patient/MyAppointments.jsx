import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { getAppointmentsByPatientId, cancelAppointment } from '../../services/api'

export default function MyAppointments() {
  const { user } = useAuth()
  const [refresh, setRefresh] = useState(0)
  const appointments = getAppointmentsByPatientId(user?.id) || []

  const isWithin24Hours = (dateStr, slotTime) => {
    const aptDate = new Date(dateStr + 'T' + (slotTime || '00:00') + ':00')
    const now = new Date()
    const hoursDiff = (aptDate - now) / (1000 * 60 * 60)
    return hoursDiff > 0 && hoursDiff < 24
  }

  const handleCancel = (apt) => {
    const within24 = isWithin24Hours(apt.date, apt.slotTime)
    const message = within24
      ? 'Cancelling within 24 hours of your appointment may result in a $50 cancellation fee. Do you want to proceed?'
      : 'Cancel this appointment?'
    if (window.confirm(message)) {
      cancelAppointment(apt.id)
      setRefresh(r => r + 1)
    }
  }

  const upcoming = appointments.filter(a => a.status === 'confirmed' && (a.date >= new Date().toISOString().slice(0, 10)))
  const past = appointments.filter(a => a.status === 'cancelled' || (a.date < new Date().toISOString().slice(0, 10)))

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="font-display text-2xl font-bold text-slate-800 mb-2">My appointments</h1>
      <p className="text-slate-600 mb-8">View and manage your bookings.</p>

      <section className="mb-10">
        <h2 className="font-display text-lg font-semibold text-slate-800 mb-4">Upcoming</h2>
        {upcoming.length === 0 ? (
          <div className="card p-8 text-center text-slate-500">
            No upcoming appointments. <Link to="/patient/doctors" className="text-primary-600 font-medium">Book one</Link>
          </div>
        ) : (
          <ul className="space-y-3">
            {upcoming.map((apt) => (
              <li key={apt.id} className="card p-4 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="font-medium text-slate-800">{apt.doctorName}</p>
                  <p className="text-sm text-slate-600">{apt.chamberName}{apt.chamberCity ? ` · ${apt.chamberCity}, ${apt.chamberState}` : ''}</p>
                  <p className="text-sm text-slate-500">{apt.date} at {apt.slotTime} · {apt.bookedDurationMinutes ?? 30} min · ${apt.charge ?? 0}</p>
                </div>
                {isWithin24Hours(apt.date, apt.slotTime) && (
                  <p className="text-xs text-amber-700 bg-amber-50 px-2 py-1 rounded">Cancellation within 24h may incur $50 fee.</p>
                )}
                <button onClick={() => handleCancel(apt)} className="btn-secondary text-sm text-red-600 border-red-200 hover:bg-red-50">
                  Cancel
                </button>
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
              <li key={apt.id} className="card p-4 opacity-75">
                <p className="font-medium text-slate-800">{apt.doctorName}</p>
                <p className="text-sm text-slate-600">{apt.date} at {apt.slotTime} · Booked {apt.bookedDurationMinutes ?? 30} min · ${apt.charge ?? 0}</p>
                {apt.status === 'completed' && apt.actualDurationMinutes != null && (
                  <p className="text-sm text-slate-500 mt-1">
                    Actual visit: {apt.actualDurationMinutes} min
                    {apt.fine > 0 && <span className="text-amber-700 font-medium"> · Overtime fine: ${apt.fine}</span>}
                  </p>
                )}
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${apt.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-600'}`}>
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
