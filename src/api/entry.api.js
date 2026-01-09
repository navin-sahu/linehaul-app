import api from "./axios";

/**
 * Add multiple entries
 */
export const addEntries = (data) =>
  api.post("/areas/entries", data);

/**
 * Get all entries
 */
export const getEntries = () =>
  api.get("/areas/entries");

/**
 * Get entries by area name
 */
export const getEntriesByArea = (areaid) =>
  api.get(`/areas/${areaid}/entries`);

/**
 * Add a single entry based on area
 */
export const createEntry = (areaid, data) =>
  api.post(`/areas/${areaid}/entry`, data);

/**
 * Update entry
 */
export const updateEntry = (areaId, entryId, data) =>
  api.put(`/areas/${areaId}/entry/${entryId}`, data);

/** Delete a single entry
 */
export const deleteEntry = (areaId, entryId) =>
  api.delete(`/areas/${areaId}/entry/${entryId}`);

export const getEntriesByDriver = (driverName) =>
  api.get(`/drivers/${driverName}/entries`);