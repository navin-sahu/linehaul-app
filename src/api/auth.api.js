import api from "./axios";

export const login = (payload) =>
  api.post("/auth/login", payload);

export const register = (payload) =>
  api.post("/auth/register", payload);

export const getDrivers = () =>
  api.get("/auth/drivers");

export const getDriverById = (driverId) =>
  api.get(`/auth/drivers/${driverId}`);

export const updateDriver = (driverId, payload) =>
  api.put(`/auth/drivers/${driverId}`, payload);

export const registerDriver = (payload) =>
  api.post("/auth/register-driver", payload);

export const deleteDriver = (driverId) =>
  api.delete(`/auth/drivers/${driverId}`);

export const updateDriverPassword = (driverId, payload) =>
  api.put(`/auth/drivers/${driverId}/password`, payload);