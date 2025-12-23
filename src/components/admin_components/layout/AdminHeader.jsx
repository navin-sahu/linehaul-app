const AdminHeader = () => {
  return (
    <header className="admin-header">
      <input type="search" placeholder="Search" />
      <div className="header-right">
        <span className="bell">🔔</span>
        <span className="avatar">A</span>
      </div>
    </header>
  );
};

export default AdminHeader;
