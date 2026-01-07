import api from "../api/axios";


export const bookAppointment = async (slotId) => {
  const res = await api.post("/appointments", { slot_id: slotId });
  return res.data;
};

export const getMyAppointments = async () => {
  const res = await api.get("/appointments/my");
  return res.data.data;
};

export const getDoctorAppointments = async () => {
  const res = await api.get("/appointments/doctor");
  return res.data.data;
};

export const cancelAppointment = async (appointmentId) => {
  const res = await api.post(`/appointments/${appointmentId}/cancel`);
  return res.data;
};

