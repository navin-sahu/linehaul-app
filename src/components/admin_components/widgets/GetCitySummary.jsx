// utils/getCitySummary.js

export const getCitySummary = (planData, driverUpdates, areaName) => {
  const today = "2025-12-29"; // or new Date().toISOString().slice(0,10)

  const area = planData.areas.find(a => a.name === areaName);
  if (!area) return null;

  // Planned today
  const plannedToday = area.entries.filter(
    e => e.planDate === today
  );

  // Driver updates today
  const updatesToday = driverUpdates.filter(
    u => u.planDate === today && u.area === areaName
  );

  const completed = updatesToday.filter(
    u => u.status === "completed"
  ).length;

  const transportIssues = updatesToday.filter(
    u => u.transportIssue === true
  ).length;

  return {
    city: areaName,
    total: plannedToday.length,
    completed,
    transportIssues
  };
};
