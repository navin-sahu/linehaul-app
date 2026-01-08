import api from "./axios";

export const login = (payload) => {
  console.log("Logging in with payload:", payload);
  return api.post("/auth/login", payload);
}

export const register = (payload) =>
  api.post("/auth/register", payload);

export const getDrivers = () =>
  api.get("/auth/drivers");

export const getDriverById = (driverId) =>
  api.get(`/auth/drivers/${driverId}`);

// input query keyword to search drivers by name
export const getDriversByName = (keyword) =>
  api.get(`/auth/drivers/search`, { params: { name: keyword } });

export const updateDriver = (driverId, payload) =>
  api.put(`/auth/drivers/${driverId}`, payload);

export const registerDriver = (payload) =>
  api.post("/auth/register-driver", payload);

export const deleteDriver = (driverId) =>
  api.delete(`/auth/drivers/${driverId}`);

export const updateDriverPassword = (driverId, payload) =>
  api.put(`/auth/drivers/${driverId}/password`, payload);