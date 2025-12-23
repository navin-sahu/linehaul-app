const adminData = {
  name: "Admin User",
  role: "Administrator",
  cities: ["Wellington", "Auckland", "Christchurch", "Taupo"],
  pendingLoadplans: 5,
};

const AdminDashboard = () => {
  return (
    <div className="welcome-wrapper">
      <div className="welcome-card">
        <h1>Admin Dashboard</h1>
      </div>
    </div>
  );
};

export default AdminDashboard;
