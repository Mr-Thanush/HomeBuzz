import "./admin.css";
import { Outlet } from "react-router-dom";
import AdminSidebar from './adminSidebar';
import Navbar from "../../Components/navBar";
import Dashboard from "./adminPages/dashBoard";

export default function AdminDashboard() {
  return (
    <>
      <Navbar />
      <div className="admin-layout">
        <AdminSidebar />
        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </>
  );
}