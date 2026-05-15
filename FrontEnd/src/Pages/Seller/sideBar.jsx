import { NavLink } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className="seller-sidebar">
      <h2 className="seller-logo">Seller Panel</h2>

      <nav className="seller-nav">
        <NavLink to="/seller/product/create">Create Product</NavLink>
        <NavLink to="products">All Products</NavLink>
        <NavLink to="orders">All Orders</NavLink>
        <NavLink to="buyers">All Buyers</NavLink>
        <NavLink to="reviews">All Reviews</NavLink>
      </nav>
    </aside> 
  );
}