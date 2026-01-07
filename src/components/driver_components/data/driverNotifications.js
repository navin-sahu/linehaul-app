export const getDriverNotifications = (driverId) => {
  const key = `driver_notifications_${driverId}`;
  return JSON.parse(localStorage.getItem(key)) || [];
};

export const saveDriverNotifications = (driverId, data) => {
  const key = `driver_notifications_${driverId}`;
  localStorage.setItem(key, JSON.stringify(data));
};

export const markAllAsRead = (driverId) => {
  const notifs = getDriverNotifications(driverId).map(n => ({
    ...n,
    read: true
  }));
  saveDriverNotifications(driverId, notifs);
  return notifs;
};

export const markOneAsRead = (driverId, notifId) => {
  const notifs = getDriverNotifications(driverId).map(n =>
    n.id === notifId ? { ...n, read: true } : n
  );
  saveDriverNotifications(driverId, notifs);
  return notifs;
};
