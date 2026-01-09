import { useQuery } from "@tanstack/react-query";
import { entryAPI } from "@/api";
import styles from "../css/LinehaulPlan.module.css";

const PendingLinehaulTable = () => {
  const { data = [], isLoading } = useQuery({
    queryKey: ["pending-linehaul-entries"],
    queryFn: entryAPI.getAllEntries,
    select: (res) => res.data,
  });

  // 🔥 filter NOT completed
  const pendingRows = data.filter(
    (row) => row.status !== "completed"
  );

  if (isLoading) {
    return <div className="card mt-5">Loading pending entries…</div>;
  }

  if (pendingRows.length === 0) {
    return (
      <div className="card mt-5">
        <h3>Pending Linehaul Plans</h3>
        <p style={{ textAlign: "center" }}>✅ No pending entries</p>
      </div>
    );
  }

  return (
    <div className="card mt-5">
      <h3>🚨 Pending Linehaul Status (All Areas)</h3>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Truck</th>
            <th>Driver</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Status</th>
            <th>Transportation Issue</th>
          </tr>
        </thead>

        <tbody>
          {pendingRows.map((row, i) => (
            <tr key={row._id || i}>
              <td>{row.truck}</td>

              <td>{row.driver?.name || "—"}</td>
              <td>{row.driver?.phone || "—"}</td>
              <td>{row.driver?.email || "—"}</td>

              <td className={styles[row.status]}>
                {row.status}
              </td>

              <td>
                {row.transportIssue ? (
                  <span className={styles.issuesDetail}>
                    ⚠️ {row.issueNote || "Reported"}
                  </span>
                ) : (
                  "—"
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PendingLinehaulTable;
