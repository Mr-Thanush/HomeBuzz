import React from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./adminSidebar";
import Navbar from "../../Components/navBar";
import "./admin.css";

export default function AdminDashboard() {
  return (
    <div className="admin-app-wrapper">
      <Navbar />
      <div className="admin-layout">
        <AdminSidebar />
        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}