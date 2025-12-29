import { useNavigate } from "react-router-dom";
import CitySummaryCard from "../widgets/CitySummaryCard";
import { todaySummary } from "../data/adminDummyData";
import EntriesViewer from "../pages/EntriesViewer";
import styles from "../css/AdminDashboard.module.css";

const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <>
      <h1>Today’s Dashboard</h1>


      <div className={styles.citySummaryGrid}>
        {todaySummary.map((city) => (
          <CitySummaryCard
            key={city.city}
            data={city}
            onClick={() => navigate(`/admin/city/${city.city}`)}
          />
        ))}
      </div>
      <div className="mt-5" >
      <EntriesViewer/>
      </div>
    </>
  );
};

export default AdminDashboard;
