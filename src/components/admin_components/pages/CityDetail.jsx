import { useParams, useNavigate } from "react-router-dom";
import LinehaulPlanData from "../data/LinehaulPlanData";
import DriverUpdatesData from "../data/DriverUpdatesData";
import styles from "../css/CityDetail.module.css";
import { useQuery } from "@tanstack/react-query";
import { areaAPI } from "@/api"
import { formatDateInput } from "@/utils";
import LoadingSpinner from "@/components/LoadingSpinner";

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
    return <LoadingSpinner size={20} />
  }

  const plannedToday = area.entries.filter(
    e => formatDateInput(e.plan_date) === formatDateInput(today)
  );


  const rows = plannedToday.map(plan => {

    return {
      truck: plan.truck,
      driver: plan.driver,
      phone: plan.phone || "-",
      email: plan.driverEmail || "-",
      status: plan?.status || "pending",
      transportIssue: plan?.transportation_issue || "",
      issueNote: plan?.issueNote || ""
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
  <div className={styles.entryTable}>
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
                {row?.status}
              </td>
              <td>
                {row.transportIssue ? (
                  <span className={styles.issuesDetail}>
                    ⚠️ {row.transportIssue}
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
    </div>
  );
};

export default CityDetail;
