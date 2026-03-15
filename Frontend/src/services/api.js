// In-memory store (replace with real API later)
let doctors = []
let chambers = []
let facilities = []
let appointments = []
let users = []

// Seed data is loaded from data/seed.js
export function initStore(seed) {
  doctors = seed.doctors ?? []
  chambers = seed.chambers ?? []
  facilities = seed.facilities ?? seed.clinics ?? []
  appointments = seed.appointments ?? []
  users = seed.users ?? []
}

// Users (for auth)
export function getUsers() {
  return [...users]
}

export function addUser({ name, email, password, role, ...rest }) {
  const id = `user_${Date.now()}`
  const u = { id, name, email, password, role, ...rest }
  users.push(u)
  return u
}

// Doctors
export function getDoctors() {
  return [...doctors]
}

export function getDoctorById(id) {
  return doctors.find(d => d.id === id)
}

export function getDoctorByUserId(userId) {
  return doctors.find(d => d.userId === userId)
}

export function addDoctor(data) {
  const id = `doc_${Date.now()}`
  doctors.push({ id, ...data })
  return { id, ...data }
}

export function updateDoctor(id, data) {
  const i = doctors.findIndex(d => d.id === id)
  if (i === -1) return null
  doctors[i] = { ...doctors[i], ...data }
  return doctors[i]
}

export function deleteDoctor(id) {
  const i = doctors.findIndex(d => d.id === id)
  if (i === -1) return false
  const chamberIds = chambers.filter(c => c.doctorId === id).map(c => c.id)
  chamberIds.forEach(cid => deleteChamber(cid))
  appointments.forEach(a => {
    if (a.doctorId === id && a.status === 'confirmed') a.status = 'cancelled'
  })
  doctors.splice(i, 1)
  return true
}

export function getDoctorsBySpecialization(specId) {
  return doctors.filter(d => d.specializationIds && d.specializationIds.includes(specId))
}

// Facilities (operating hours, rooms, equipment – admin managed)
export function getFacilities() {
  return [...facilities]
}

export function getFacilityById(id) {
  return facilities.find(f => f.id === id)
}

export function getFacilitiesByState(state) {
  return facilities.filter(f => f.state === state)
}

export function addFacility(data) {
  const id = `fac_${Date.now()}`
  facilities.push({ id, ...data })
  return { id, ...data }
}

export function updateFacility(id, data) {
  const i = facilities.findIndex(f => f.id === id)
  if (i === -1) return null
  facilities[i] = { ...facilities[i], ...data }
  return facilities[i]
}

export function deleteFacility(id) {
  const i = facilities.findIndex(f => f.id === id)
  if (i === -1) return false
  facilities.splice(i, 1)
  return true
}

export function getChambersByFacilityId(facId) {
  return chambers.filter(c => (c.facilityId || c.clinicId) === facId)
}

// Legacy aliases
export function getClinics() {
  return [...facilities]
}

export function getClinicById(id) {
  return getFacilityById(id)
}

export function getClinicsByState(state) {
  return getFacilitiesByState(state)
}

// Chambers
export function getChambers() {
  return [...chambers]
}

export function getChambersByDoctorId(doctorId) {
  return chambers.filter(c => c.doctorId === doctorId)
}

export function getChambersByState(state) {
  return chambers.filter(c => {
    const fac = getFacilityById(c.facilityId || c.clinicId)
    return fac && fac.state === state
  })
}

export function getChambersByStateAndCity(state, city) {
  return chambers.filter(c => {
    const fac = getFacilityById(c.facilityId || c.clinicId)
    return fac && fac.state === state && fac.city === city
  })
}

export function getChambersByStateCityZip(state, city, zipCode) {
  return chambers.filter(c => {
    const fac = getFacilityById(c.facilityId || c.clinicId)
    return fac && fac.state === state && fac.city === city && (!zipCode || fac.zipCode === zipCode)
  })
}

export function getChamberById(id) {
  return chambers.find(c => c.id === id)
}

export function addChamber(data) {
  const id = `chamber_${Date.now()}`
  chambers.push({ id, ...data })
  return { id, ...data }
}

export function updateChamber(id, data) {
  const i = chambers.findIndex(c => c.id === id)
  if (i === -1) return null
  chambers[i] = { ...chambers[i], ...data }
  return chambers[i]
}

/** Admin: reassign chamber to another doctor (move) */
export function moveChamberToDoctor(chamberId, newDoctorId) {
  const ch = chambers.find(c => c.id === chamberId)
  if (!ch) return null
  ch.doctorId = newDoctorId
  return ch
}

export function deleteChamber(id) {
  const i = chambers.findIndex(c => c.id === id)
  if (i === -1) return false
  chambers.splice(i, 1)
  return true
}

// Appointments
export function getAppointments() {
  return [...appointments]
}

export function getAppointmentsByPatientId(patientId) {
  return appointments.filter(a => a.patientId === patientId)
}

export function getAppointmentsByDoctorId(doctorId) {
  return appointments.filter(a => a.doctorId === doctorId)
}

export function getAppointmentsByChamberId(chamberId) {
  return appointments.filter(a => a.chamberId === chamberId)
}

export function createAppointment(data) {
  const id = `apt_${Date.now()}`
  appointments.push({ id, status: 'confirmed', ...data })
  return { id, status: 'confirmed', ...data }
}

export function setAppointmentActualDuration(id, actualDurationMinutes) {
  const a = appointments.find(x => x.id === id)
  if (!a) return null
  a.actualDurationMinutes = actualDurationMinutes
  a.status = 'completed'
  a.fine = calculateOvertimeFine(a)
  return a
}

// Fine: overtime over booked (up to 60 min) + any time over max 1 hr. Per 30 min = 50% of charge. No double-count.
function calculateOvertimeFine(apt) {
  const booked = apt.bookedDurationMinutes || 30
  const actual = apt.actualDurationMinutes
  if (actual == null || actual <= booked) return 0
  const charge = apt.charge || 0
  const maxVisit = 60
  const per30Charge = charge * 0.5
  let fine = 0
  const overBooked = Math.min(actual, maxVisit) - booked
  if (overBooked > 0) fine += Math.ceil(overBooked / 30) * per30Charge
  if (actual > maxVisit) fine += Math.ceil((actual - maxVisit) / 30) * per30Charge
  return Math.round(fine * 100) / 100
}

export function getAppointmentById(id) {
  return appointments.find(a => a.id === id)
}

export function cancelAppointment(id) {
  const a = appointments.find(x => x.id === id)
  if (!a) return null
  a.status = 'cancelled'
  return a
}

// Check slot availability for a chamber on a given date
export function getBookedSlotsForChamberDate(chamberId, dateStr) {
  return appointments
    .filter(a => a.chamberId === chamberId && a.date === dateStr && a.status !== 'cancelled')
    .map(a => a.slotTime)
}
