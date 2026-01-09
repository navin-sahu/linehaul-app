import { useNavigate } from "react-router-dom";
import CitySummaryCard from "../widgets/CitySummaryCard";
import DriverUpdatesData from "../data/DriverUpdatesData";
import LinehaulPlanData from "../data/LinehaulPlanData";
import EntriesViewer from "../pages/EntriesViewer";
import styles from "../css/AdminDashboard.module.css";
import { useQuery } from "@tanstack/react-query";
import { areaAPI } from "@/api";
import LoadingSpinner from "@/components/LoadingSpinner";
import PendingLinehaulTable from "./PendingLinehaulTable";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { data: areas, isLoading } = useQuery({
    queryKey: ["linehaul-area-summaries"],
    queryFn: areaAPI.getAllAreaSummary,
  });
  if (isLoading) {
    return <LoadingSpinner size={20} />;
  }

  return (
    <>
      <h1>Today’s Plan</h1>

      <div className={styles.citySummaryGrid}>
        {areas?.data
          ?.filter(
            (area) => area.total > 0 
          )
          .map((area) => (
            <CitySummaryCard
              key={area._id}
              data={area}
              onClick={() => navigate(`/admin/city/${area._id}`)}
            />
          ))}
      </div>

      <div className="mt-5">
        <PendingLinehaulTable />
      </div>
      <div className="mt-5">
        <EntriesViewer />
      </div>
    </>
  );
};

export default AdminDashboard;
