import api from "../api/axios";

/**
 * Login user with email and password
 * @param {string} email 
 * @param {string} password 
 * @returns {Promise<{token: string, role: string}>}
 */
export const login = async (email, password) => {
  const res = await api.post("/auth/login", { email, password });
  const token = res.data.access_token;
  
  // Decode role from token payload
  const payload = JSON.parse(atob(token.split(".")[1]));
  const role = payload.role;
  
  // Store token in localStorage
  localStorage.setItem("token", token);
  
  return { token, role };
};

/**
 * Register a new user
 * @param {Object} userData - { name, email, password, role }
 * @returns {Promise<Object>}
 */
export const register = async (userData) => {
  const res = await api.post("/auth/register", userData);
  return res.data;
};

/**
 * Logout user by removing token
 */
export const logout = () => {
  localStorage.removeItem("token");
};

/**
 * Get current user info from token
 * @returns {Object|null} - { id, role, email, name } or null if not logged in
 */
export const getCurrentUser = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return {
      id: payload.sub,
      role: payload.role,
      email: payload.email || payload.sub,
      name: payload.name || null
    };
  } catch {
    return null;
  }
};

/**
 * Fetch full user profile from API
 * @returns {Promise<Object>} - { id, name, email, role }
 */
export const fetchUserProfile = async () => {
  const res = await api.get("/auth/me");
  return res.data;
};

/**
 * Check if user is authenticated
 * @returns {boolean}
 */
export const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};

/**
 * Get stored token
 * @returns {string|null}
 */
export const getToken = () => {
  return localStorage.getItem("token");
};

