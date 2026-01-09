import styles from "../css/StatusBadge.module.css";

const FLOW = [
  { key: "NOT_STARTED", label: "Not Started", color: "#9ca3af" },
  { key: "IN_TRANSIT", label: "In Transit", color: "#e5f50bff" },
  { key: "COMPLETED", label: "Completed", color: "green" }
];

const StatusBadge = ({ status, onChange }) => {
  const activeIndex = FLOW.findIndex(s => s.key.toLowerCase() === status.toLowerCase());

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

          // 🔐 LOCK RULE
          const isLocked =
            status === "COMPLETED" || i <= activeIndex;

          return (
            <div key={s.key} className={styles.step}>
              <button
                className={`${styles.dot} ${isActive ? styles.active : ""}`}
                style={{
                  backgroundColor: isActive ? s.color : "#fff",
                  borderColor: s.color
                }}
                disabled={isLocked}
                onClick={() => onChange(s.key)}
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
