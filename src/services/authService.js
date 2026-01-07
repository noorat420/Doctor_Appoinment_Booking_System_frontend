import api from "../api/axios";

export const login = async (email, password) => {
  try {
    const res = await api.post("/auth/login", { email, password });

    const token = res.data.access_token;

   
    const payload = JSON.parse(atob(token.split(".")[1]));
    const role = payload.role;

    localStorage.setItem("token", token);

    return { token, role };
  } catch (error) {
    
    const message =
      error.response?.data?.error || "Login failed";

    throw new Error(message);
  }
};

export const register = async (userData) => {
  try {
    const res = await api.post("/auth/register", userData);
    return res.data;
  } catch (error) {
    const message =
      error.response?.data?.error || "Registration failed";

    throw new Error(message);
  }
};

export const logout = () => {
  localStorage.removeItem("token");
};

export const getCurrentUser = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return {
      id: payload.sub,
      role: payload.role,
    };
  } catch {
    return null;
  }
};

export const fetchUserProfile = async () => {
  const res = await api.get("/auth/me");
  return res.data;
};

export const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};

export const getToken = () => {
  return localStorage.getItem("token");
};
