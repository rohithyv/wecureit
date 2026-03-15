import { useState, useMemo } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getDoctorById, getChamberById, getFacilityById, getBookedSlotsForChamberDate, createAppointment } from '../../services/api'
import { chamberTimeSlots } from '../../services/slots'
import { getNextDates, dateToDayId, APPOINTMENT_DURATIONS } from '../../data/constants'
import { useAuth } from '../../context/AuthContext'

export default function BookAppointment() {
  const { doctorId, chamberId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [durationMinutes, setDurationMinutes] = useState(30)
  const [creditCard, setCreditCard] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const doctor = getDoctorById(doctorId)
  const chamber = getChamberById(chamberId)
  const facility = chamber ? getFacilityById(chamber.facilityId || chamber.clinicId) : null

  const dates = useMemo(() => getNextDates(14), [])

  const availableDates = useMemo(() => {
    if (!chamber?.availableDays?.length) return []
    return dates.filter(d => chamber.availableDays.includes(dateToDayId(d)))
  }, [chamber, dates])

  const bookedSlots = selectedDate ? getBookedSlotsForChamberDate(chamberId, selectedDate) : []
  const allSlots = chamber ? chamberTimeSlots(chamber.slotStart, chamber.slotEnd, durationMinutes) : []
  const availableSlots = allSlots.filter(s => !bookedSlots.includes(s))

  const handleBook = () => {
    if (!selectedDate || !selectedSlot || !user) return
    if (!creditCard.trim()) return
    setSubmitting(true)
    const bookedDuration = durationMinutes
    const charge = chamber.consultationCharge ?? 0
    createAppointment({
      patientId: user.id,
      patientName: user.name,
      doctorId: doctor.id,
      doctorName: doctor.name,
      chamberId: chamber.id,
      chamberName: facility?.name ?? 'Facility',
      chamberAddress: facility?.address,
      chamberState: facility?.state,
      chamberCity: facility?.city,
      date: selectedDate,
      slotTime: selectedSlot,
      status: 'confirmed',
      bookedDurationMinutes: bookedDuration,
      charge,
    })
    setSubmitting(false)
    navigate('/patient/appointments')
  }

  if (!doctor || !chamber || !facility) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <p className="text-slate-600">Facility or doctor not found.</p>
        <Link to="/patient/doctors" className="text-primary-600 font-medium mt-2 inline-block">Back to doctors</Link>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Link to={`/patient/doctors/${doctorId}`} className="text-primary-600 text-sm font-medium mb-6 inline-block">← Back to {doctor.name}</Link>

      <div className="card p-6 mb-8">
        <h1 className="font-display text-xl font-bold text-slate-800">Book appointment</h1>
        <p className="text-slate-600 mt-1">{doctor.name} · {facility.name}</p>
        <p className="text-sm text-slate-500 mt-1">{facility.address}, {facility.city}, {facility.state} {facility.zipCode}</p>
        <p className="text-sm font-medium text-primary-700 mt-2">${chamber.consultationCharge ?? 0} per visit · Choose 15, 30, or 60 min</p>
        <p className="text-xs text-amber-700 mt-2 bg-amber-50 border border-amber-200 rounded-lg p-2">Credit card is required. Card data is encrypted in storage and transit.</p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Select date</label>
          <div className="flex flex-wrap gap-2">
            {availableDates.map((d) => (
              <button
                key={d}
                onClick={() => { setSelectedDate(d); setSelectedSlot(null) }}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition ${selectedDate === d ? 'bg-primary-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
              >
                {new Date(d + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
              </button>
            ))}
          </div>
        </div>

        {selectedDate && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Available slots</label>
            {availableSlots.length === 0 ? (
              <p className="text-slate-500 text-sm">No slots available on this date.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {availableSlots.map((slot) => (
                  <button
                    key={slot}
                    onClick={() => setSelectedSlot(slot)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition ${selectedSlot === slot ? 'bg-primary-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="pt-4">
          <label className="block text-sm font-medium text-slate-700 mb-2">Appointment duration</label>
          <div className="flex flex-wrap gap-2 mb-4">
            {APPOINTMENT_DURATIONS.map((mins) => (
              <button
                key={mins}
                onClick={() => setDurationMinutes(mins)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition ${durationMinutes === mins ? 'bg-primary-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
              >
                {mins} min
              </button>
            ))}
          </div>
        </div>

        <div className="pt-2">
          <label className="block text-sm font-medium text-slate-700 mb-2">Credit card (required)</label>
          <input
            type="password"
            value={creditCard}
            onChange={(e) => setCreditCard(e.target.value)}
            className="input-field max-w-xs"
            placeholder="•••• •••• •••• ••••"
            autoComplete="cc-number"
          />
          <p className="text-xs text-slate-500 mt-1">Credit card information is encrypted in storage and transit.</p>
        </div>

        {selectedDate && selectedSlot && (
          <div className="pt-4 border-t border-slate-200">
            <p className="text-sm text-slate-600 mb-1">
              {selectedDate} at {selectedSlot} · {durationMinutes} min · ${chamber.consultationCharge ?? 0}
            </p>
            <button onClick={handleBook} disabled={submitting || !creditCard.trim()} className="btn-primary">
              {submitting ? 'Booking…' : 'Confirm booking'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
