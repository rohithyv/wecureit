import { Outlet, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Layout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-slate-200/90 sticky top-0 z-50 shadow-pharma">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 font-display font-bold text-xl text-primary-700">
            <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary-600 text-white">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            </span>
            WeCureIT
          </Link>
          <nav className="flex items-center gap-6">
            {!user ? (
              <>
                <Link to="/login" className="text-slate-600 hover:text-primary-600 font-medium">Login</Link>
                <Link to="/register" className="btn-primary">Register</Link>
              </>
            ) : (
              <>
                {user.role === 'patient' && (
                  <>
                    <Link to="/patient" className="text-slate-600 hover:text-primary-600 font-medium">Dashboard</Link>
                    <Link to="/patient/doctors" className="text-slate-600 hover:text-primary-600 font-medium">Find Doctors</Link>
                    <Link to="/patient/appointments" className="text-slate-600 hover:text-primary-600 font-medium">My Appointments</Link>
                  </>
                )}
                {user.role === 'doctor' && (
                  <>
                    <Link to="/doctor" className="text-slate-600 hover:text-primary-600 font-medium">Dashboard</Link>
                    <Link to="/doctor/profile" className="text-slate-600 hover:text-primary-600 font-medium">Profile</Link>
                    <Link to="/doctor/chambers" className="text-slate-600 hover:text-primary-600 font-medium">Availability</Link>
                    <Link to="/doctor/appointments" className="text-slate-600 hover:text-primary-600 font-medium">Appointments</Link>
                  </>
                )}
                {user.role === 'admin' && (
                  <>
                    <Link to="/admin" className="text-slate-600 hover:text-primary-600 font-medium">Dashboard</Link>
                    <Link to="/admin/doctors" className="text-slate-600 hover:text-primary-600 font-medium">Doctors</Link>
                    <Link to="/admin/facilities" className="text-slate-600 hover:text-primary-600 font-medium">Facilities</Link>
                  </>
                )}
                <span className="text-slate-500 text-sm">{user.name}</span>
                <button onClick={handleLogout} className="btn-secondary text-sm">Logout</button>
              </>
            )}
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="bg-white border-t border-slate-200/90 py-8 text-slate-500">
        <div className="max-w-6xl mx-auto px-4 text-center text-slate-500 text-sm">
          © {new Date().getFullYear()} WeCureIT – Healthcare & Doctor Chamber Management
        </div>
      </footer>
    </div>
  )
}
