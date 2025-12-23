import AdminLayout from "../layout/AdminLayout";
import KPIBox from "../widgets/KPIBox";
import CityStatusCard from "../widgets/CityStatusCard";
import "../css/AdminDashboard.css";

const adminStats = {
  totalTrailers: 48,
  loadplansCompleted: 39,
  exceptions: 6,
  lateSailings: 3,
};

const cities = ["Wellington", "Auckland", "Christchurch", "Taupo"];

const AdminDashboard = () => {
  return (
    <AdminLayout>
      <h1>Dashboard Overview</h1>

      <div className="kpi-grid">
        <KPIBox title="Total Trailers" value={adminStats.totalTrailers} />
        <KPIBox title="Loadplans Done" value={adminStats.loadplansCompleted} />
        <KPIBox title="Exceptions" value={adminStats.exceptions} />
        <KPIBox title="Late Sailings" value={adminStats.lateSailings} />
      </div>

      <h2>City Status</h2>
      <div className="city-grid">
        {cities.map((city) => (
          <CityStatusCard key={city} city={city} />
        ))}
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
