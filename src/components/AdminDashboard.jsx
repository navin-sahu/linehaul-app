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

        <p><strong>Name:</strong> {adminData.name}</p>
        <p><strong>Role:</strong> {adminData.role}</p>
        <p><strong>Pending Loadplans:</strong> {adminData.pendingLoadplans}</p>

        <h3>Cities</h3>
        <ul>
          {adminData.cities.map((city, index) => (
            <li key={index}>{city}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminDashboard;
