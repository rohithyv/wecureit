import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Home() {
  const { user } = useAuth()

  return (
    <div>
      <section className="bg-gradient-to-b from-primary-700 via-primary-600 to-primary-700 text-white py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/15 backdrop-blur mb-6">
            <svg className="w-9 h-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4 tracking-tight">
            Trusted care, one click away
          </h1>
          <p className="text-primary-100 text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
            Find doctors by specialty or facility, check availability, and book 15, 30, or 60 minute appointments. Facilities in Virginia, Maryland, and D.C.
          </p>
          {!user ? (
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/register" className="bg-white text-primary-700 font-semibold px-6 py-3 rounded-lg shadow-pharma-md hover:bg-primary-50 transition">
                Get started
              </Link>
              <Link to="/login" className="border-2 border-white/80 text-white font-semibold px-6 py-3 rounded-lg hover:bg-white/10 transition">
                Sign in
              </Link>
            </div>
          ) : user.role === 'patient' ? (
            <Link to="/patient/doctors" className="inline-block bg-white text-primary-700 font-semibold px-6 py-3 rounded-lg shadow-pharma-md hover:bg-primary-50 transition">
              Find a doctor
            </Link>
          ) : user.role === 'admin' ? (
            <Link to="/admin" className="inline-block bg-white text-primary-700 font-semibold px-6 py-3 rounded-lg shadow-pharma-md hover:bg-primary-50 transition">
              Admin dashboard
            </Link>
          ) : (
            <Link to="/doctor/chambers" className="inline-block bg-white text-primary-700 font-semibold px-6 py-3 rounded-lg shadow-pharma-md hover:bg-primary-50 transition">
              My availability
            </Link>
          )}
        </div>
      </section>

      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-display text-2xl font-bold text-center text-slate-800 mb-2">
            How it works
          </h2>
          <p className="text-center text-slate-500 text-sm mb-12 max-w-md mx-auto">
            Simple, secure steps to book your next visit.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card p-6 text-center border-primary-100 bg-primary-50/30">
              <div className="w-12 h-12 rounded-lg bg-primary-600 text-white flex items-center justify-center text-xl font-bold mx-auto mb-4 shadow-pharma">1</div>
              <h3 className="font-semibold text-slate-800 mb-2">Choose specialization</h3>
              <p className="text-slate-600 text-sm">Browse doctors by specialty—cardiology, ortho, pediatrics, and more.</p>
            </div>
            <div className="card p-6 text-center border-primary-100 bg-primary-50/30">
              <div className="w-12 h-12 rounded-lg bg-primary-600 text-white flex items-center justify-center text-xl font-bold mx-auto mb-4 shadow-pharma">2</div>
              <h3 className="font-semibold text-slate-800 mb-2">Pick facility & slot</h3>
              <p className="text-slate-600 text-sm">Choose a facility and see available appointment times by date.</p>
            </div>
            <div className="card p-6 text-center border-primary-100 bg-primary-50/30">
              <div className="w-12 h-12 rounded-lg bg-primary-600 text-white flex items-center justify-center text-xl font-bold mx-auto mb-4 shadow-pharma">3</div>
              <h3 className="font-semibold text-slate-800 mb-2">Book appointment</h3>
              <p className="text-slate-600 text-sm">Confirm your visit and manage all appointments in one dashboard.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
