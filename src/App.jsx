import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import Welcome from "./components/Welcome";
import AdminLogin from "./components/AdminLogin";
import DriverLogin from "./components/DriverLogin";

import AdminLayout from "./components/admin_components/layout/AdminLayout";
import AdminDashboard from "./components/admin_components/pages/AdminDashboard";
import LinehaulPlan from "./components/admin_components/pages/LinehaulPlan";
import DriverDashboard from "./components/driver_components/pages/DriverDashboard";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path="/admin-login" element={<AdminLogin />} />
      <Route path="/driver-login" element={<DriverLogin />} />
       <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="linehaul-plan" element={<LinehaulPlan />} />
      </Route>
      <Route path="/driver-dashboard" element={<DriverDashboard />} />
    </Routes>
  );
}

export default App;
