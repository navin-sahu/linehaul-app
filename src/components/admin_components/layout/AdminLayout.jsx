import { Outlet } from "react-router-dom";
// import { useState } from "react"; 
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import AdminMobileNav from "./AdminMobileNav";
// import AdminChatFab from "../../../chat/admin/AdminChatFab";
// import AdminChatWidget from "../../../chat/admin/AdminChatWidget";
import "../css/Style.css";
import { useDriverSSE } from "../../../hooks/useDriverSSE";


const AdminLayout = () => {
  useDriverSSE();

  // const [chatOpen, setChatOpen] = useState(false);
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
       {/* <AdminChatFab onClick={() => setChatOpen(true)} />
      {chatOpen && (
        <AdminChatWidget onClose={() => setChatOpen(false)} />
      )} */}
    </div>
  );
};

export default AdminLayout;
