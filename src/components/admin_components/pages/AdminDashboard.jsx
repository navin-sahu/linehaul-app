import { useNavigate } from "react-router-dom";
import CitySummaryCard from "../widgets/CitySummaryCard";
import DriverUpdatesData from "../data/DriverUpdatesData"
import LinehaulPlanData from "../data/LinehaulPlanData";
import EntriesViewer from "../pages/EntriesViewer";
import styles from "../css/AdminDashboard.module.css";
import { useQuery } from "@tanstack/react-query";
import { areaAPI } from "@/api";

const AdminDashboard = () => {
  const navigate = useNavigate();
    const { data: areas } = useQuery({
      queryKey: ["linehaul-area-summaries"],
      queryFn: areaAPI.getAllAreaSummary,
      initialData: []
    });



  return (
    <>
      <h1>Today’s Plan</h1>


     <div className={styles.citySummaryGrid}>
  {areas?.data?.map(area => {

    console.log("Summary for", area.name, ":", area);

    return (
      <CitySummaryCard
        key={area.name}
        data={area}
        onClick={() =>
          navigate(`/admin/city/${area._id}`)
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
