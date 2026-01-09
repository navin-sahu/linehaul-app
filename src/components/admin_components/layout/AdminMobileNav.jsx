import { NavLink } from "react-router-dom";

const AdminMobileNav = () => {
  const items = [
    { icon: "🏠", to: "/admin/dashboard" },
    { icon: "📋", to: "/admin/linehaul-plan" },
    { icon: "➕", to: "/admin/driver-details" },
    { icon: "📊", to: "/admin/analytics" },
    { icon: "⚙️", to: "/admin/settings" },
  ];

  return (
    <nav className="mobile-nav">
      {items.map((item, index) => (
        <NavLink
          key={index}
          to={item.to}
          className={({ isActive }) =>
            isActive ? "mobile-item active" : "mobile-item"
          }
        >
          {item.icon}
        </NavLink>
      ))}
    </nav>
  );
};

export default AdminMobileNav;
