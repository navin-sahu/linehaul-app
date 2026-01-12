import styles from "../css/StatusBadge.module.css";

const FLOW = [
  { key: "pending", label: "Not Started", color: "#9ca3af" },
  { key: "transit", label: "In Transit", color: "#f59e0b" },
  { key: "completed", label: "Completed", color: "#16a34a" }
];

const StatusBadge = ({ status = "NOT_STARTED", onChange }) => {
  const activeIndex = Math.max(
    0,
    FLOW.findIndex(s => s.key === status)
  );

  return (
    <div className={styles.wrapper}>
      <div className={styles.bar}>
        {FLOW.map((s, i) => {
          const isActive = i <= activeIndex;

          // 🔐 locking rules
          const isLocked =
            status === "completed" ||
            i !== activeIndex + 1; // only NEXT step allowed

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
