import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('patient')
  const [error, setError] = useState('')
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    const result = register({ name, email, password, role })
    if (result.error) {
      setError(result.error)
      return
    }
    navigate(role === 'doctor' ? '/doctor' : '/patient')
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-[#f8fafc]">
      <div className="card w-full max-w-md p-8 border-primary-100">
        <div className="flex items-center gap-2.5 mb-6">
          <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary-600 text-white">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          </span>
          <div>
            <h1 className="font-display text-xl font-bold text-primary-700">WeCureIT</h1>
            <p className="text-slate-500 text-xs">Create your account</p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Full name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="input-field" placeholder="John Doe" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
            <select value={role} onChange={(e) => setRole(e.target.value)} className="input-field">
              <option value="patient">Patient</option>
              <option value="doctor">Doctor</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-field" placeholder="you@example.com" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="input-field" minLength={6} required />
          </div>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button type="submit" className="btn-primary w-full">Register</button>
        </form>
        <p className="mt-6 text-center text-slate-600 text-sm">
          Already have an account? <Link to="/login" className="text-primary-700 font-medium">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
