import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";

import Welcome from "./components/Welcome";
import AdminLogin from "./components/AdminLogin";
import DriverLogin from "./components/DriverLogin";
import NotFound from "./components/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";

import AdminLayout from "./components/admin_components/layout/AdminLayout";
import AdminDashboard from "./components/admin_components/pages/AdminDashboard";
import CityDetail from "./components/admin_components/pages/CityDetail";
import LinehaulPlan from "./components/admin_components/pages/LinehaulPlan";
import DriverDetails from "./components/admin_components/pages/DriverDetails";
import DriverDashboard from "./components/driver_components/pages/DriverDashboard";
// import AdminChatPage from "./chat/admin/AdminChatPage";

function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Welcome />} />
      <Route path="/admin-login" element={<AdminLogin />} />
      <Route path="/driver-login" element={<DriverLogin />} />

      {/* Protected Admin */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="linehaul-plan" element={<LinehaulPlan />} />
        <Route path="driver-details" element={<DriverDetails />} />
        <Route path="city/:id" element={<CityDetail />  } />
      </Route>

      {/* Protected Driver */}
      <Route
        path="/driver-dashboard"
        element={
          <ProtectedRoute>
            <DriverDashboard />
          </ProtectedRoute>
        }
      />

      {/* 404 */}
      <Route path="/404" element={<NotFound />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
