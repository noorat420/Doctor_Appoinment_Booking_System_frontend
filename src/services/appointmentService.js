import api from "../api/axios";

/**
 * Book an appointment for a specific slot
 * @param {number} slotId - The ID of the availability slot to book
 * @returns {Promise<{message: string, appointment_id: number}>}
 */
export const bookAppointment = async (slotId) => {
  const res = await api.post("/appointments", { slot_id: slotId });
  return res.data;
};

/**
 * Get all appointments for the current patient
 * @returns {Promise<Array>} - List of patient's appointments
 */
export const getMyAppointments = async () => {
  const res = await api.get("/appointments/my");
  return res.data.data;
};

/**
 * Get all appointments for the current doctor
 * @returns {Promise<Array>} - List of doctor's appointments
 */
export const getDoctorAppointments = async () => {
  const res = await api.get("/appointments/doctor");
  return res.data.data;
};

/**
 * Cancel an appointment
 * @param {number} appointmentId - The ID of the appointment to cancel
 * @returns {Promise<{message: string}>}
 */
export const cancelAppointment = async (appointmentId) => {
  const res = await api.post(`/appointments/${appointmentId}/cancel`);
  return res.data;
};

