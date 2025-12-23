import { useNavigate } from "react-router-dom";
import AdminLayout from "../layout/AdminLayout";
import DateNavigator from "../widgets/DateNavigator";
import CitySummaryCard from "../widgets/CitySummaryCard";
import { todaySummary } from "../data/adminDummyData";
import "../css/AdminDashboard.css";

const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <AdminLayout>
      <h1>Today’s Dashboard</h1>

      <DateNavigator />

      <div className="city-summary-grid">
        {todaySummary.map((city) => (
          <CitySummaryCard
            key={city.city}
            data={city}
            onClick={() => navigate(`/admin/city/${city.city}`)}
          />
        ))}
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
