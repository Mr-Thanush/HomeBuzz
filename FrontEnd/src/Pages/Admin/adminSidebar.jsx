import React from "react";
import { NavLink } from "react-router-dom";

export default function AdminSidebar() {
  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-header">
        <h2 className="admin-logo">Admin Core</h2>
        <span className="admin-badge-role">System Console</span>
      </div>
      <nav className="admin-nav">
        <NavLink to="/admin/dashboard" className={({ isActive }) => isActive ? "active" : ""}>
          Dashboard Overview
        </NavLink>
        <NavLink to="/admin/products" className={({ isActive }) => isActive ? "active" : ""}>
          Manage Products
        </NavLink>
        <NavLink to="/admin/users" className={({ isActive }) => isActive ? "active" : ""}>
          Manage Users
        </NavLink>
        <NavLink to="/admin/sellers/request" className={({ isActive }) => isActive ? "active" : ""}>
          Seller Requests
        </NavLink>
      </nav>
    </aside>
  );
}