import api from "../api/axios";

/**
 * Get doctor dashboard info
 * @returns {Promise<{message: string}>}
 */
export const getDoctorDashboard = async () => {
  const res = await api.get("/doctor/dashboard");
  return res.data;
};

/**
 * Get doctor profile
 * @returns {Promise<{id: number, name: string, email: string, designation: string, specialization: string}>}
 */
export const getDoctorProfile = async () => {
  const res = await api.get("/doctor/profile");
  return res.data;
};

/**
 * Update doctor profile (designation & specialization)
 * @param {Object} profileData - { designation: string, specialization: string }
 * @returns {Promise<{message: string}>}
 */
export const updateDoctorProfile = async (profileData) => {
  const res = await api.post("/doctor/profile", profileData);
  return res.data;
};

/**
 * Create an availability slot
 * @param {Object} slotData - { date: "YYYY-MM-DD", start_time: "HH:MM", end_time: "HH:MM" }
 * @returns {Promise<{message: string, slot_id: number}>}
 */
export const createAvailabilitySlot = async (slotData) => {
  const res = await api.post("/doctor/availability", slotData);
  return res.data;
};

/**
 * Delete doctor account (for non-practicing doctors)
 * @returns {Promise<{message: string}>}
 */
export const deleteDoctorAccount = async () => {
  const res = await api.delete("/doctor/account");
  return res.data;
};
