import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'


export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('patient')
  const [error, setError] = useState('')
  const { login } = useAuth()
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()


  // const handleSubmit = (e) => {
  //   e.preventDefault()
  //   setError('')
  //   const result = login(email, password, role)
  //   if (result.error) {
  //     setError(result.error)
  //     return
  //   }
  //   if (role === 'admin') navigate('/admin')
  //   else if (role === 'doctor') navigate('/doctor')
  //   else navigate('/patient')
  // }


  const handleSubmit = async (e) => {
  e.preventDefault()
  setError('')
  setLoading(true)


  try {
    const response = await fetch('http://localhost:8080/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, role })
    })


    const data = await response.json()


    if (response.ok) {
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data))
      login(data)
      
      if (role === 'admin') navigate('/admin')
      else if (role === 'doctor') navigate('/doctor')
      else navigate('/patient')
    } else {
      setError(data.message || 'Login failed')
    }
  } catch (err) {
    setError('Backend not running')
  } finally {
    setLoading(false)
  }
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
            <p className="text-slate-500 text-xs">Sign in to your account</p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
            {/* <select value={role} onChange={(e) => setRole(e.target.value)} className="input-field"> */}
            <select value={role} onChange={(e) => setRole(e.target.value)} className="input-field" disabled={loading}>
              <option value="patient">Patient</option>
              <option value="doctor">Doctor</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            {/* <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-field" placeholder="you@example.com" required /> */}
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-field" placeholder="you@example.com" required disabled={loading} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            {/* <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="input-field" required /> */}
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="input-field" required disabled={loading} />
            
          </div>
          {/* {error && <p className="text-red-600 text-sm">{error}</p>} */}
          {error && (
  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
    {error}
  </div>
)}


          {/* <button type="submit" className="btn-primary w-full">Sign in</button> */}
          <button 
  type="submit" 
  disabled={loading}
  className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
>
  {loading ? 'Signing in...' : 'Sign in'}
</button>


        </form>
        <p className="mt-6 text-center text-slate-600 text-sm">
          Don't have an account? <Link to="/register" className="text-primary-700 font-medium">Register</Link>
        </p>
        <p className="mt-2 text-center text-slate-500 text-xs">
          Demo: [patient@test.com](mailto:patient@test.com) / 123456 (Patient), [doctor@test.com](mailto:doctor@test.com) / 123456 (Doctor). Admin: [wecureIT@gwuproject.com](mailto:wecureIT@gwuproject.com) / wecureIT (Admin only).
        </p>
      </div>
    </div>
  )
}