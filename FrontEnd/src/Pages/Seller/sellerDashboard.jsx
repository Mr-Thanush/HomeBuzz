import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./sideBar";
import Navbar from "../../Components/navBar";
import "./seller.css";

export default function SellerDashboard() {
  return (
    <div className="seller-app-wrapper">
      <Navbar />
      <div className="seller-layout">
        <Sidebar />
        <main className="seller-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}