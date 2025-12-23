import AdminLayout from "../layout/AdminLayout";
import "../css/AdminDashboard.css";

const AdminDashboard = () => {
  return (
    <AdminLayout>
      <div className="dashboard-grid">
        <div className="card large">Truck Illustration / Status</div>
        <div className="card map">Map / Vision</div>
        <div className="card">KPIs</div>
        <div className="card">Charts</div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
