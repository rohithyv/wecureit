import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { getDoctorByUserId, updateDoctor } from '../../services/api'
import { SPECIALIZATIONS } from '../../data/constants'

export default function DoctorProfileEdit() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const doctor = getDoctorByUserId(user?.id)
  const [form, setForm] = useState({ qualification: '', bio: '', specializationIds: [] })

  useEffect(() => {
    if (doctor) {
      setForm({
        qualification: doctor.qualification || '',
        bio: doctor.bio || '',
        specializationIds: doctor.specializationIds || [],
      })
    }
  }, [doctor])

  const toggleSpec = (specId) => {
    setForm(prev => ({
      ...prev,
      specializationIds: prev.specializationIds.includes(specId)
        ? prev.specializationIds.filter(s => s !== specId)
        : [...prev.specializationIds, specId],
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!doctor) return
    updateDoctor(doctor.id, form)
    navigate('/doctor')
  }

  if (!doctor) return null

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Link to="/doctor" className="text-primary-600 text-sm font-medium mb-6 inline-block">← Back to dashboard</Link>
      <h1 className="font-display text-2xl font-bold text-slate-800 mb-8">Edit profile</h1>

      <form onSubmit={handleSubmit} className="card p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Qualification</label>
          <input
            type="text"
            value={form.qualification}
            onChange={(e) => setForm(f => ({ ...f, qualification: e.target.value }))}
            className="input-field"
            placeholder="e.g. MD, MBBS"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Bio</label>
          <textarea
            value={form.bio}
            onChange={(e) => setForm(f => ({ ...f, bio: e.target.value }))}
            className="input-field min-h-[100px]"
            placeholder="Short bio"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Specializations</label>
          <div className="flex flex-wrap gap-2">
            {SPECIALIZATIONS.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => toggleSpec(s.id)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition ${form.specializationIds.includes(s.id) ? 'bg-primary-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
              >
                {s.icon} {s.name}
              </button>
            ))}
          </div>
        </div>
        <div className="flex gap-3">
          <button type="submit" className="btn-primary">Save profile</button>
          <Link to="/doctor" className="btn-secondary">Cancel</Link>
        </div>
      </form>
    </div>
  )
}
