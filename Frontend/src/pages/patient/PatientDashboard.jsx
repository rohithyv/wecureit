import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { getAppointmentsByPatientId } from '../../services/api'

export default function PatientDashboard() {
  const { user } = useAuth()
  const appointments = getAppointmentsByPatientId(user?.id).filter(a => a.status !== 'cancelled')
  const upcoming = appointments.slice(0, 5)

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="font-display text-2xl font-bold text-slate-800 mb-2">Welcome, {user?.name}</h1>
      <p className="text-slate-600 mb-8">Manage your appointments and find doctors.</p>

      <div className="grid sm:grid-cols-2 gap-6 mb-10">
        <Link to="/patient/doctors" className="card p-6 hover:border-primary-300 transition group">
          <div className="text-3xl mb-3">🩺</div>
          <h2 className="font-semibold text-slate-800 group-hover:text-primary-600">Find a doctor</h2>
          <p className="text-slate-600 text-sm mt-1">Browse by specialization and book a chamber slot.</p>
        </Link>
        <Link to="/patient/appointments" className="card p-6 hover:border-primary-300 transition group">
          <div className="text-3xl mb-3">📅</div>
          <h2 className="font-semibold text-slate-800 group-hover:text-primary-600">My appointments</h2>
          <p className="text-slate-600 text-sm mt-1">View and manage your upcoming visits.</p>
        </Link>
      </div>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-lg font-semibold text-slate-800">Upcoming appointments</h2>
          <Link to="/patient/appointments" className="text-primary-600 text-sm font-medium">View all</Link>
        </div>
        {upcoming.length === 0 ? (
          <div className="card p-8 text-center text-slate-500">
            No upcoming appointments. <Link to="/patient/doctors" className="text-primary-600 font-medium">Book one</Link>
          </div>
        ) : (
          <ul className="space-y-3">
            {upcoming.map((apt) => (
              <li key={apt.id} className="card p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-800">{apt.doctorName || 'Doctor'}</p>
                  <p className="text-sm text-slate-600">{apt.date} at {apt.slotTime} · {apt.chamberName || 'Chamber'}</p>
                </div>
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-accent-100 text-accent-700">{apt.status}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
