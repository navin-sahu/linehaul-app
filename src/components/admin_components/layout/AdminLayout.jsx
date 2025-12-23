import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import AdminMobileNav from "./AdminMobileNav";
import "../css/Style.css";

const AdminLayout = () => {
  return (
    <div className="admin-root">
      <AdminSidebar />

      <div className="admin-area">
        <AdminHeader />
        <main className="admin-content">
          <Outlet />
        </main>
      </div>

      <AdminMobileNav />
    </div>
  );
};

export default AdminLayout;
