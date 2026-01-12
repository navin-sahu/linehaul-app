import api from "./axios";

export const getEntriesByDriveId = (driverId) =>
  api.get(`/driver/${driverId}/entries`);

// update driver entry status
// router.post("/:driverId/entries/:entryId/status", requireAuth, checkSelf, driverController.updateStatusDriverEntry);
export const updateEntryStatusByDriverId = (driverId,entryId,status) => 
  api.post(`/driver/${driverId}/entries/${entryId}/status`,{status})

export const updateEntryIssueByDriverId = (driverId,entryId,issue) =>
  api.post(`/driver/${driverId}/entries/${entryId}/issue`,{issue})