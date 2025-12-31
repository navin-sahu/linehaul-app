import api from "./axios";

/**
 * Create Area (Admin)
 */
export const createArea = (data) =>
  api.post("/areas", data);

/**
 * Get all areas
 */
export const getAreas = () =>
  api.get("/areas");

/**
 * Get single area
 */
export const getAreaById = (id) =>
  api.get(`/areas/${id}`);

/**
 * Delete Area (Admin)
 */
export const deleteArea = (id) =>
  api.delete(`/areas/${id}`);
