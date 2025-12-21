import api from "../api/axios";

/**
 * Get paginated list of doctors
 * @param {number} page - Page number (default: 1)
 * @param {number} limit - Items per page (default: 5)
 * @returns {Promise<{data: Array, page: number, total_pages: number}>}
 */
export const getDoctors = async (page = 1, limit = 5) => {
  const res = await api.get(`/patient/doctors?page=${page}&limit=${limit}`);
  return {
    data: res.data.data,
    page: res.data.page,
    totalPages: res.data.total_pages
  };
};

/**
 * Get available slots for a specific doctor
 * @param {number} doctorId - The doctor's ID
 * @returns {Promise<Array>} - List of available slots
 */
export const getDoctorAvailability = async (doctorId) => {
  const res = await api.get(`/patient/doctors/${doctorId}/availability`);
  console.log("Availability response:", res.data);
  // Handle both { data: [...] } and direct array responses
  return res.data.data || res.data || [];
};

