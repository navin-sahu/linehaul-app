import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../css/AdminHeader.module.css";

// TEMP notifications (later from driver dashboard / API)
const mockNotifications = [
  {
    id: 1,
    title: "Loadplan Missing",
    desc: "TR-204 has no loadplan (Wellington)",
    time: "5 min ago",
  },
  {
    id: 2,
    title: "Status Updated",
    desc: "TR-201 marked as Checked by John",
    time: "20 min ago",
  },
];

const AdminHeader = ({ onSearch }) => {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [showNotif, setShowNotif] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [notifications] = useState(mockNotifications);

  const unreadCount = notifications.length;

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);
    onSearch?.(value);
  };

  const handleLogout = () => {
    sessionStorage.clear();
    localStorage.clear();
    navigate("/", { replace: true });
  };

  return (
    <header className={styles.header}>
      {/* Search */}
      <input
        type="search"
        placeholder="Search trailer, driver, route..."
        value={search}
        onChange={handleSearch}
        className={styles.search}
      />

      <div className={styles.right}>
        {/* Notifications */}
        <div className={styles.notificationWrapper}>
          <button
            className={styles.notificationBtn}
            onClick={() => setShowNotif(!showNotif)}
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
                notifications.map((n) => (
                  <div key={n.id} className={styles.notificationItem}>
                    <strong>{n.title}</strong>
                    <p>{n.desc}</p>
                    <span>{n.time}</span>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Admin menu */}
        <div className={styles.adminWrapper}>
          <button
            className={styles.adminBtn}
            onClick={() => setShowAdmin(!showAdmin)}
          >
            ADMIN
          </button>

          {showAdmin && (
            <div className={styles.adminDropdown}>
              <span className={styles.adminName}>Admin</span>
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

export default AdminHeader;
