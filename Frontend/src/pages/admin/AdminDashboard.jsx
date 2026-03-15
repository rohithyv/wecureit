import { Link } from 'react-router-dom'
import { getDoctors, getChambers, getFacilities } from '../../services/api'

export default function AdminDashboard() {
  const doctors = getDoctors()
  const chambers = getChambers()
  const facilities = getFacilities()

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="font-display text-2xl font-bold text-slate-800 mb-2">Admin Dashboard</h1>
      <p className="text-slate-600 mb-8">Manage website data: doctors, facilities, and availability.</p>

      <div className="grid sm:grid-cols-3 gap-6 mb-10">
        <Link to="/admin/doctors" className="card p-6 hover:border-primary-300 transition">
          <p className="text-3xl font-bold text-primary-600">{doctors.length}</p>
          <p className="text-slate-600 mt-1">Doctors</p>
          <span className="text-primary-600 font-medium text-sm mt-2 inline-block">Manage doctors →</span>
        </Link>
        <Link to="/admin/facilities" className="card p-6 hover:border-primary-300 transition">
          <p className="text-3xl font-bold text-primary-600">{facilities.length}</p>
          <p className="text-slate-600 mt-1">Facilities</p>
          <span className="text-primary-600 font-medium text-sm mt-2 inline-block">Manage facilities →</span>
        </Link>
        <div className="card p-6">
          <p className="text-3xl font-bold text-primary-600">{chambers.length}</p>
          <p className="text-slate-600 mt-1">Availability slots</p>
          <Link to="/admin/doctors" className="text-primary-600 font-medium text-sm mt-2 inline-block">View in doctors →</Link>
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        <Link to="/admin/doctors" className="btn-primary">Manage Doctors</Link>
        <Link to="/admin/facilities" className="btn-primary">Manage Facilities</Link>
      </div>
    </div>
  )
}
