import api from "./axios";

export const getEntriesByDriveId = (driverId) =>
  api.get(`/driver/${driverId}/entries`);