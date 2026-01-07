import api from "../api/axios";


export const getDoctorDashboard = async () => {
  const res = await api.get("/doctor/dashboard");
  return res.data;
};


export const getDoctorProfile = async () => {
  const res = await api.get("/doctor/profile");
  return res.data;
};

export const updateDoctorProfile = async (profileData) => {
  const res = await api.post("/doctor/profile", profileData);
  return res.data;
};


export const createAvailabilitySlot = async (slotData) => {
  const res = await api.post("/doctor/availability", slotData);
  return res.data;
};

export const deleteDoctorAccount = async () => {
  const res = await api.delete("/doctor/account");
  return res.data;
};
