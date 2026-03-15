import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { getDoctors, getDoctorsBySpecialization, getChambersByDoctorId, getFacilityById, getFacilities, getFacilitiesByState } from '../../services/api'
import { SPECIALIZATIONS, MOCK_STATES } from '../../data/constants'

export default function BrowseDoctors() {
  const [selectedSpec, setSelectedSpec] = useState(null)
  const [selectedState, setSelectedState] = useState('')
  const [selectedFacilityId, setSelectedFacilityId] = useState('')
  const [doctorSearch, setDoctorSearch] = useState('')
  const doctorsBySpec = selectedSpec
    ? getDoctorsBySpecialization(selectedSpec)
    : getDoctors()
  const doctors = useMemo(() => {
    let list = doctorsBySpec
    if (selectedState) {
      list = list.filter(doc => getChambersByDoctorId(doc.id).some(c => {
        const fac = getFacilityById(c.facilityId || c.clinicId)
        return fac && fac.state === selectedState
      }))
    }
    if (selectedFacilityId) {
      list = list.filter(doc => getChambersByDoctorId(doc.id).some(c => (c.facilityId || c.clinicId) === selectedFacilityId))
    }
    if (doctorSearch.trim()) {
      const q = doctorSearch.trim().toLowerCase()
      list = list.filter(d => d.name.toLowerCase().includes(q))
    }
    return list
  }, [doctorsBySpec, selectedState, selectedFacilityId, doctorSearch])

  const allFacilities = getFacilities()
  const facilitiesInState = selectedState ? getFacilitiesByState(selectedState) : allFacilities

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="font-display text-2xl font-bold text-slate-800 mb-2">Search for appointments</h1>
      <p className="text-slate-600 mb-6">Search by doctor, specialty, and facility. Mock data includes Virginia, Maryland, and D.C.</p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div>
          <p className="text-sm font-medium text-slate-700 mb-2">Doctor name</p>
          <input
            type="text"
            value={doctorSearch}
            onChange={(e) => setDoctorSearch(e.target.value)}
            className="input-field"
            placeholder="Search by name"
          />
        </div>
        <div>
          <p className="text-sm font-medium text-slate-700 mb-2">State</p>
          <select
            value={selectedState}
            onChange={(e) => { setSelectedState(e.target.value); setSelectedFacilityId('') }}
            className="input-field"
          >
            <option value="">All states</option>
            {MOCK_STATES.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <div>
          <p className="text-sm font-medium text-slate-700 mb-2">Facility</p>
          <select
            value={selectedFacilityId}
            onChange={(e) => setSelectedFacilityId(e.target.value)}
            className="input-field"
          >
            <option value="">All facilities</option>
            {facilitiesInState.map(f => (
              <option key={f.id} value={f.id}>{f.name}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="mb-8">
        <p className="text-sm font-medium text-slate-700 mb-2">Specialty</p>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedSpec(null)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition ${!selectedSpec ? 'bg-primary-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          >
            All
          </button>
          {SPECIALIZATIONS.map((s) => (
            <button
              key={s.id}
              onClick={() => setSelectedSpec(s.id)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition ${selectedSpec === s.id ? 'bg-primary-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
              {s.icon} {s.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {doctors.map((doc) => (
          <Link key={doc.id} to={`/patient/doctors/${doc.id}`} className="card p-6 hover:border-primary-300 transition group block">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-2xl font-bold shrink-0">
                {doc.name.charAt(0)}
              </div>
              <div className="min-w-0">
                <h2 className="font-semibold text-slate-800 group-hover:text-primary-600">{doc.name}</h2>
                <p className="text-sm text-slate-600">{doc.qualification}</p>
                <p className="text-xs text-slate-500 mt-1">
                  {doc.specializationIds?.length ? doc.specializationIds.map(id => SPECIALIZATIONS.find(s => s.id === id)?.name).filter(Boolean).join(', ') : 'General'}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
      {doctors.length === 0 && (
        <p className="text-slate-500 text-center py-8">No doctors found for this region or specialization.</p>
      )}
    </div>
  )
}
