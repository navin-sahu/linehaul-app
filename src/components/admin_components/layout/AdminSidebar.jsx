import { NavLink } from "react-router-dom";

const AdminSidebar = () => {
  return (
    <aside className="admin-sidebar">
      <div className="logo">
        <img src="/images/logo.png" alt="Linehaul Logo" />
      </div>

      <nav>
        <NavLink to="/admin/dashboard" className={({ isActive }) => isActive ? "active" : ""}>
          Dashboard
        </NavLink>

        <NavLink to="/admin/linehaul-plan" className={({ isActive }) => isActive ? "active" : ""}>
          Linehaul Plan
        </NavLink>

        <NavLink to="/admin/route-planner" className={({ isActive }) => isActive ? "active" : ""}>
          Route Planner
        </NavLink>

        <NavLink to="/admin/analytics" className={({ isActive }) => isActive ? "active" : ""}>
          Analytics
        </NavLink>

        <NavLink to="/admin/settings" className={({ isActive }) => isActive ? "active" : ""}>
          Settings
        </NavLink>
      </nav>
    </aside>
  );
};

export default AdminSidebar;
