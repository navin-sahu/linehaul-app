import styles from "../css/CitySummaryCard.module.css";

const CitySummaryCard = ({ data, onClick }) => {
  const completed = data.completed || 0;
  const total = data.total || 0;
  const pending = Math.max(total - completed, 0);

  const completedPercent = total
    ? Math.round((completed / total) * 100)
    : 0;

  return (
    <div className={`${styles.citySummaryCard} card`} onClick={onClick}>
      {/* HEADER */}
      <div className={styles.header}>
        <h3>{data.city}</h3>
        <span className={styles.total}>
          Today Planned: <strong>{total}</strong>
        </span>
      </div>

      {/* PROGRESS BAR */}
      <div className={styles.progressBar}>
        <div
          className={styles.completed}
          style={{ width: `${completedPercent}%` }}
        />
        <div
          className={styles.pending}
          style={{ width: `${100 - completedPercent}%` }}
        />
      </div>

      {/* LEGEND */}
      <div className={styles.legend}>
        <div>
          <span className={`${styles.dot} ${styles.completedDot}`} />
          Completed <strong>{completed}</strong>
        </div>

        <div>
          <span className={`${styles.dot} ${styles.pendingDot}`} />
          Pending <strong>{pending}</strong>
        </div>
      </div>

      {/* ISSUES */}
      {data.transportIssues > 0 && (
        <div className={styles.issues}>
          ⚠️ Transportation Issues ({data.transportIssues})
        </div>
      )}
    </div>
  );
};

export default CitySummaryCard;
