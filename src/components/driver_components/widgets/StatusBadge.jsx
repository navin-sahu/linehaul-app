import { useState } from "react";
import styles from "../css/StatusBadge.module.css";

const FLOW = [
  { key: "NOT_STARTED", label: "Not Started", color: "#9ca3af" },
  { key: "IN_TRANSIT", label: "In Transit", color: "#f59e0b" },
  { key: "COMPLETED", label: "Completed", color: "green" }
];

const StatusBadge = ({ initialStatus = "NOT_STARTED", onChange }) => {
  const [status, setStatus] = useState(initialStatus);

  const activeIndex = FLOW.findIndex(
    s => s.key.toLowerCase() === status.toLowerCase()
  );

  const handleClick = (newStatus) => {
    setStatus(newStatus);          // 🔥 frontend update
    onChange?.(newStatus);         // optional backend sync
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.labels}>
        {FLOW.map(s => (
          <span key={s.key}>{s.label}</span>
        ))}
      </div>

      <div className={styles.bar}>
        {FLOW.map((s, i) => {
          const isActive = i <= activeIndex;

          // 🔐 LOCK RULES
          const isLocked =
            status === "COMPLETED" || i <= activeIndex;

          return (
            <div key={s.key} className={styles.step}>
              <button
                className={`${styles.dot} ${isActive ? styles.active : ""}`}
                style={{
                  backgroundColor: isActive ? s.color : "#fff",
                  borderColor: s.color,
                  cursor: isLocked ? "not-allowed" : "pointer"
                }}
                disabled={isLocked}
                onClick={() => handleClick(s.key)}
              />

              {i < FLOW.length - 1 && (
                <div
                  className={styles.line}
                  style={{
                    background:
                      i < activeIndex
                        ? `linear-gradient(90deg, ${FLOW[i].color}, ${FLOW[i + 1].color})`
                        : "#e5e7eb"
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StatusBadge;
