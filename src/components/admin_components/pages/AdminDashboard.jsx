import { useNavigate } from "react-router-dom";
import CitySummaryCard from "../widgets/CitySummaryCard";
import { getCitySummary } from "../widgets/GetCitySummary";
import DriverUpdatesData from "../data/DriverUpdatesData"
import LinehaulPlanData from "../data/LinehaulPlanData";;
import EntriesViewer from "../pages/EntriesViewer";
import styles from "../css/AdminDashboard.module.css";

const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <>
      <h1>Today’s Plan done</h1>


     <div className={styles.citySummaryGrid}>
  {LinehaulPlanData.areas.map(area => {
    const summary = getCitySummary(
      LinehaulPlanData,
      DriverUpdatesData,
      area.name
    );

    return (
      <CitySummaryCard
        key={area.name}
        data={summary}
        onClick={() =>
          navigate(`/admin/city/${summary.city}`)
        }
      />
    );
  })}
</div>
      <div className="mt-5" >
      <EntriesViewer/>
      </div>
    </>
  );
};

export default AdminDashboard;
