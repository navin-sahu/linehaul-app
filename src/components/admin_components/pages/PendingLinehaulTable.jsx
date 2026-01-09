import { useQuery } from "@tanstack/react-query";
import { areaAPI } from "@/api";
import styles from "../css/CityDetail.module.css";
import { formatDDMMYYYY } from "@/utils";

const PendingLinehaulTable = () => {
  const { data = [], isLoading } = useQuery({
    queryKey: ["linehaulPlan-areas"],
    queryFn: areaAPI.getAreas,
    select: (res) => res.data,
  });

  const allEntries = data.flatMap((area) =>
    (area.entries || []).map((entry) => ({
      ...entry,
      areaName: area.name,
    }))
  );

  const pendingRows = allEntries.filter(
    (entry) => entry.status !== "completed"
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

      <div className={styles.entryTable}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Area</th>
              <th>Date</th>
              <th>Truck</th>
              <th>Driver</th>
              <th>Status</th>
              <th>Transportation Issue</th>
            </tr>
          </thead>

          <tbody>
            {pendingRows.map((row, i) => (
              <tr key={row._id || i}>
                <td>{row.areaName}</td>
                <td className={styles.dateTableCell}>{formatDDMMYYYY(row.plan_date)}</td>
                <td>{row.truck || ""}</td>
                <td>{row.driver_name || ""}</td>

                <td className={styles[row.status]}>
                  {row.status}
                </td>

                <td>
                  {row.transportation_issue ? (
                    <span className={styles.issuesDetail}>
                      ⚠️ {row.transportation_issue}
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
    </div>
  );
};

export default PendingLinehaulTable;
