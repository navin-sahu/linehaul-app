import { useState } from "react";
import styles from "../chat.module.css";
import { mockDrivers } from "../data/mockDrivers";
import { mockMessages } from "../data/mockMessages";
import ChatBox from "../components/ChatBox";

const AdminChatPage = () => {
  const [active, setActive] = useState(null);

  // ✅ Unread first
  const sortedDrivers = [...mockDrivers].sort(
    (a, b) => (b.unread || 0) - (a.unread || 0)
  );

  return (
    <div className={styles.adminWrapper}>
      {/* LEFT – DRIVER LIST */}
      <aside className={styles.driverList}>
        {sortedDrivers.map(d => (
          <div
            key={d.id}
            className={`${styles.driverItem} ${
              active?.id === d.id ? styles.active : ""
            }`}
            onClick={() => setActive(d)}
          >
            {d.name}
            {d.unread > 0 && (
              <span className={styles.unread}>{d.unread}</span>
            )}
          </div>
        ))}
      </aside>

      {/* RIGHT – CHAT */}
      <section style={{ flex: 1, position: "relative" }}>
        {active ? (
          <ChatBox
            title={active.name}
            messages={mockMessages[active.id] || []}
            embedded
          />
        ) : (
          <p style={{ padding: 20 }}>
            Select a driver to start chat
          </p>
        )}
      </section>
    </div>
  );
};

export default AdminChatPage;
