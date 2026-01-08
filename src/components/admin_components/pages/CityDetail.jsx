import { useParams, useNavigate } from "react-router-dom";
import LinehaulPlanData from "../data/LinehaulPlanData";
import DriverUpdatesData from "../data/DriverUpdatesData";
import styles from "../css/CityDetail.module.css";
import { useQuery } from "@tanstack/react-query";
import { areaAPI } from "@/api"
import { formatDateInput } from "@/utils";

const CityDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();   // 👈 add this
  const today = new Date().toISOString().slice(0, 10);

  // get area by id
  const { data: area } = useQuery({
    queryKey: ["getareabyid", id],
    queryFn: (id) => areaAPI.getAreaById(id.queryKey[1]).then(res => res.data),
  });



  if (!area) {
    return <p>No data found for {id}</p>;
  }

  const plannedToday = area.entries.filter(
    e => formatDateInput(e.plan_date) === formatDateInput(today)
  );

  console.log(plannedToday)

  const updatesToday = DriverUpdatesData.filter(
    u => formatDateInput(u.planDate) === formatDateInput(today)
  );

  const rows = plannedToday.map(plan => {
    const update = updatesToday.find(
      u => u.truck === plan.trucks
    );

    return {
      truck: plan.truck,
      driver: plan.driver,
      phone: plan.phone || "-",
      email: plan.driverEmail || "-",
      status: update?.status || "pending",
      transportIssue: update?.transport_issue || false,
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
      <h3>{area?.name} – Today Details</h3>

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
              <td>{row.driver?.name}</td>
              <td>{row.driver?.phone}</td>
              <td>{row.driver?.email}</td>
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
    </div>
  );
};

export default CityDetail;
