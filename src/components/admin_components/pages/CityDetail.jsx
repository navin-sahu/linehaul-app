import { useParams, useNavigate } from "react-router-dom";
import LinehaulPlanData from "../data/LinehaulPlanData";
import DriverUpdatesData from "../data/DriverUpdatesData";
import styles from "../css/CityDetail.module.css";

const CityDetail = () => {
  const { cityName } = useParams();
  const navigate = useNavigate();   // 👈 add this
  const today = new Date().toISOString().slice(0, 10);

  const area = LinehaulPlanData.areas.find(
    a => a.name === cityName
  );

  if (!area) {
    return <p>No data found for {cityName}</p>;
  }

  const plannedToday = area.entries.filter(
    e => e.planDate === today
  );

  const updatesToday = DriverUpdatesData.filter(
    u => u.planDate === today && u.area === cityName
  );

  const rows = plannedToday.map(plan => {
    const update = updatesToday.find(
      u => u.truck === plan.trucks
    );

    return {
      truck: plan.trucks,
      driver: plan.drivers,
      phone: plan.driverPhone || "-",
      email: plan.driverEmail || "-",
      status: update?.status || "pending",
      transportIssue: update?.transportIssue || false,
      issueNote: update?.issueNote || ""
    };
  });

  return (
    <div>
      {/* 🔙 BACK BUTTON */}
      <button
        className={styles.backBtn}
        onClick={() => navigate(-1)}
      >
        ← Back
      </button>
<div className="card mt-5">
      <h3>{cityName} – Today Details</h3>

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
          {rows.map((row, i) => (
            <tr key={i}>
              <td>{row.truck}</td>
              <td>{row.driver}</td>
              <td>{row.phone}</td>
              <td>{row.email}</td>
              <td className={styles[row.status]}>
                {row.status}
              </td>
              <td>
                {row.transportIssue ? (
                  <span className={styles.issue}>
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
    </div>
  );
};

export default CityDetail;
