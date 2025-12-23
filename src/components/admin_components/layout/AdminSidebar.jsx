const AdminSidebar = () => {
  return (
    <aside className="admin-sidebar">
      <div className="logo"><img src="/images/logo.png" alt="Linehaul Logo" className="logo" /></div>

      <nav>
        <a className="active">Dashboard</a>
        <a>Load Board</a>
        <a>Route Planner</a>
        <a>Analytics</a>
        <a>Settings</a>
      </nav>
    </aside>
  );
};

export default AdminSidebar;
