import styles from "../chat.module.css";
import { mockDrivers } from "../data/mockDrivers";

const AdminChatFab = ({ onClick }) => {
  const unread = mockDrivers.reduce(
    (sum, d) => sum + (d.unread || 0),
    0
  );

  return (
    <button className={styles.chatFab} onClick={onClick}>
      💬
      {unread > 0 && (
        <span className={styles.fabBadge}>{unread}</span>
      )}
    </button>
  );
};

export default AdminChatFab;
