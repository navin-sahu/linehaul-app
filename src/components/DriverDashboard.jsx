const driverData = {
  name: "John Driver",
  trailer: "TR-458",
  route: "Wellington → Auckland",
  loadplanStatus: "Completed",
};

const DriverDashboard = () => {
  return (
    <div className="welcome-wrapper">
      <div className="welcome-card">
        <h1>Driver Dashboard</h1>

        <p><strong>Name:</strong> {driverData.name}</p>
        <p><strong>Trailer:</strong> {driverData.trailer}</p>
        <p><strong>Route:</strong> {driverData.route}</p>
        <p><strong>Loadplan Status:</strong> {driverData.loadplanStatus}</p>
      </div>
    </div>
  );
};

export default DriverDashboard;
