import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../css/DriverHeader.module.css";

import {
  getDriverNotifications,
  markAllAsRead
} from "../data/driverNotifications";

const DriverHeader = ({ onSearch }) => {
  const navigate = useNavigate();

  const driver =
    JSON.parse(localStorage.getItem("user")) || {};
  const driverId = driver.id;
  const driverName = driver.name || "Driver";

  const [search, setSearch] = useState("");
  const [showDriver, setShowDriver] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const [status, setStatus] = useState("ACTIVE");
  const [notifications, setNotifications] = useState(() => {
  if (!driverId) return [];
  return getDriverNotifications(driverId);
});


  const driverRef = useRef(null);
  const notifRef = useRef(null);



  /* ---------------- CLICK OUTSIDE ---------------- */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (driverRef.current && !driverRef.current.contains(e.target)) {
        setShowDriver(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotif(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ---------------- UNREAD COUNT ---------------- */
  const unreadCount = notifications.filter(n => !n.read).length;

  /* ---------------- OPEN NOTIFICATIONS ---------------- */
const openNotifications = () => {
  if (!driverId) return;

  setShowNotif(prev => !prev);

  if (unreadCount > 0) {
    const updated = markAllAsRead(driverId);
    setNotifications(updated);
  }
};


  /* ---------------- LOGOUT ---------------- */
  const handleLogout = () => {
    localStorage.clear();
    navigate("/", { replace: true });
  };

  return (
    <header className={styles.header}>
     
      <input
        type="search"
        placeholder="Search trip, load, trailer..."
        autoComplete="off"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          onSearch?.(e.target.value);
        }}
        className={styles.search}
      />

      <div className={styles.right}>
        {/* 🔔 Notifications */}
        <div ref={notifRef} className={styles.notificationWrapper}>
          <button
            className={styles.notificationBtn}
            onClick={openNotifications}
          >
            🔔
            {unreadCount > 0 && (
              <span className={styles.badge}>{unreadCount}</span>
            )}
          </button>

          {showNotif && (
            <div className={styles.notificationDropdown}>
              <h4>Notifications</h4>

              {notifications.length === 0 ? (
                <p className={styles.empty}>No notifications</p>
              ) : (
                notifications.map(n => (
                  <div
                    key={n.id}
                    className={`${styles.notificationItem} ${
                      !n.read ? styles.unread : ""
                    }`}
                  >
                    <strong>{n.title}</strong>
                    <p>{n.desc}</p>
                    <span>
                      {new Date(n.time).toLocaleTimeString()}
                    </span>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* 👤 Driver Menu */}
        <div ref={driverRef} className={styles.driverWrapper}>
          <button
            className={styles.driverBtn}
            onClick={() => setShowDriver(p => !p)}
          >
            Welcome, <strong>{driverName}</strong>
          </button>

         {showDriver && (
        <div className={styles.driverDropdown}>
          <span className={styles.driverName}>{driverName}</span>

          {/* 🔘 STATUS SELECTION */}
          <div className={styles.statusBox}>
            <label className={styles.statusRow}>
              <input
                type="radio"
                name="driverStatus"
                value="ACTIVE"
                checked={status === "ACTIVE"}
                onChange={() => setStatus("ACTIVE")}
              />
              <span className={styles.active}>Active</span>
            </label>

            <label className={styles.statusRow}>
              <input
                type="radio"
                name="driverStatus"
                value="INACTIVE"
                checked={status === "INACTIVE"}
                onChange={() => setStatus("INACTIVE")}
              />
              <span className={styles.inactive}>Inactive</span>
            </label>
          </div>

          <button
            className={styles.logoutBtn}
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      )}
        </div>
      </div>
    </header>
  );
};

export default DriverHeader;
