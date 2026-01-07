import api from "../api/axios";

export const getDoctors = async (page = 1, limit = 5) => {
  const res = await api.get(`/patient/doctors?page=${page}&limit=${limit}`);
  return {
    data: res.data.data,
    page: res.data.page,
    totalPages: res.data.total_pages
  };
};

export const getDoctorAvailability = async (doctorId) => {
  const res = await api.get(`/patient/doctors/${doctorId}/availability`);
  console.log("Availability response:", res.data);
  return res.data.data || res.data || [];
};

