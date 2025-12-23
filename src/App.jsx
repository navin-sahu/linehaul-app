import { Routes, Route } from "react-router-dom";
import "./App.css";
import Welcome from "./components/Welcome";
import AdminLogin from "./components/AdminLogin";
import DriverLogin from "./components/DriverLogin";
import AdminDashboard from "./components/admin_components/pages/AdminDashboard";
import DriverDashboard from "./components/driver_components/pages/DriverDashboard";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path="/admin-login" element={<AdminLogin />} />
      <Route path="/driver-login" element={<DriverLogin />} />
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
      <Route path="/driver-dashboard" element={<DriverDashboard />} />
    </Routes>
  );
}

export default App;
