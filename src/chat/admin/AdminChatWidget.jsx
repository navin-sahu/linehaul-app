import { useState } from "react";
import styles from "../chat.module.css";
import { mockDrivers } from "../data/mockDrivers";
import { mockMessages } from "../data/mockMessages";
import ChatBox from "../components/ChatBox";

const AdminChatWidget = ({ onClose }) => {
  const [activeDriver, setActiveDriver] = useState(null);

  // unread first
  const sortedDrivers = [...mockDrivers].sort(
    (a, b) => (b.unread || 0) - (a.unread || 0)
  );

  return (
    <div className={styles.chatBox}>
      {/* HEADER */}
      <div className={styles.chatHeader}>
        {activeDriver ? (
          <span onClick={() => setActiveDriver(null)} style={{ cursor: "pointer" }}>
            ← {activeDriver.name}
          </span>
        ) : (
          "Driver Chats"
        )}
        <span
          style={{ float: "right", cursor: "pointer" }}
          onClick={onClose}
        >
          ✕
        </span>
      </div>

      {/* BODY */}
      <div className={styles.chatBody}>
        {!activeDriver ? (
          sortedDrivers.map(d => (
            <div
              key={d.id}
              className={styles.driverItem}
              onClick={() => setActiveDriver(d)}
            >
              {d.name}
              {d.unread > 0 && (
                <span className={styles.unread}>{d.unread}</span>
              )}
            </div>
          ))
        ) : (
          <ChatBox
            title={activeDriver.name}
            messages={mockMessages[activeDriver.id] || []}
            sender="admin"
            embedded
          />
        )}
      </div>
    </div>
  );
};

export default AdminChatWidget;
