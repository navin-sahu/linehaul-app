import api from "./axios";

export const getEntriesByDriveId = (driverId) =>
  api.get(`/drivers/${driverId}/entries`);