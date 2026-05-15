import { NavLink } from "react-router-dom";

export default function AdminSidebar() {
  return (
    <aside className="admin-sidebar">
      <h2 className="admin-logo">Admin Panel</h2>
      <nav className="admin-nav">
        <NavLink to="products">Products</NavLink>
        <NavLink to="users">Users</NavLink>
        <NavLink to="/admin/sellers/request" className="navLinkBig">Seller Requests</NavLink>
      </nav>
    </aside>
  );
}