import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import AdminMobileNav from "./AdminMobileNav";
import "../css/Style.css";

const AdminLayout = ({ children }) => {
  return (
    <div className="admin-root">
      <AdminSidebar />

      <div className="admin-area">
        <AdminHeader />
        <main className="admin-content">{children}</main>
      </div>

      <AdminMobileNav />
    </div>
  );
};

export default AdminLayout;
