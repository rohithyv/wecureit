import { useParams, Link } from 'react-router-dom'
import { getDoctorById, getChambersByDoctorId, getFacilityById } from '../../services/api'
import { SPECIALIZATIONS } from '../../data/constants'

export default function DoctorProfile() {
  const { doctorId } = useParams()
  const doctor = getDoctorById(doctorId)
  const chambers = getChambersByDoctorId(doctorId)

  if (!doctor) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <p className="text-slate-600">Doctor not found.</p>
        <Link to="/patient/doctors" className="text-primary-600 font-medium mt-2 inline-block">Back to doctors</Link>
      </div>
    )
  }

  const specNames = (doctor.specializationIds || [])
    .map(id => SPECIALIZATIONS.find(s => s.id === id)?.name)
    .filter(Boolean)

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link to="/patient/doctors" className="text-primary-600 text-sm font-medium mb-6 inline-block">← Back to search</Link>

      <div className="card p-6 mb-8">
        <div className="flex flex-wrap items-start gap-6">
          <div className="w-20 h-20 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-3xl font-bold shrink-0">
            {doctor.name.charAt(0)}
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-slate-800">{doctor.name}</h1>
            <p className="text-slate-600">{doctor.qualification}</p>
            {specNames.length > 0 && (
              <p className="text-sm text-slate-500 mt-1">Specialties: {specNames.join(' · ')}</p>
            )}
            {doctor.licensedStates?.length > 0 && (
              <p className="text-sm text-slate-500 mt-1">Licensed in: {doctor.licensedStates.join(', ')}</p>
            )}
            {doctor.bio && <p className="text-slate-600 mt-3">{doctor.bio}</p>}
          </div>
        </div>
      </div>

      <h2 className="font-display text-lg font-semibold text-slate-800 mb-4">Facilities & availability</h2>
      {chambers.length === 0 ? (
        <div className="card p-8 text-center text-slate-500">No availability set yet.</div>
      ) : (
        <div className="space-y-4">
          {chambers.map((ch) => {
            const facility = getFacilityById(ch.facilityId || ch.clinicId)
            return (
            <div key={ch.id} className="card p-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-slate-800">{facility?.name ?? 'Facility'}</h3>
                  <p className="text-sm text-slate-600 mt-1">{facility?.address}</p>
                  <p className="text-sm text-slate-500 mt-1">{facility?.city}, {facility?.state} {facility?.zipCode}</p>
                  <p className="text-xs text-slate-500 mt-1">
                    {ch.slotStart}–{ch.slotEnd} · 15, 30, or 60 min appointments · {ch.availableDays?.join(', ')}
                  </p>
                  <p className="text-sm font-medium text-primary-700 mt-2">${ch.consultationCharge ?? 0} per visit</p>
                </div>
                <Link to={`/patient/book/${doctorId}/${ch.id}`} className="btn-primary shrink-0">
                  Book appointment
                </Link>
              </div>
            </div>
          )})}
        </div>
      )}
    </div>
  )
}
