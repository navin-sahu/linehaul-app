import { NavLink } from "react-router-dom";
// import { mockDrivers } from "../../../chat/data/mockDrivers";

const AdminSidebar = () => {
  //  const totalUnread = mockDrivers.reduce(
  //   (sum, d) => sum + (d.unread || 0),
  //   0
  // );
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

        <NavLink to="/admin/driver-details" className={({ isActive }) => isActive ? "active" : ""}>
          Driver Details
        </NavLink>
         {/* <NavLink to="/admin/chats" className={({ isActive }) => isActive ? "active" : ""}>
          Chats
          {totalUnread > 0 && (
            <span className="chat-badge">{totalUnread}</span>
          )}
        </NavLink> */}

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
