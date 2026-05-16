import "./admin.css";
import { Outlet } from "react-router-dom";
import AdminSidebar from './adminSidebar';
import Navbar from "../../Components/navBar";
import PageTitle from "../../Components/pageTitle";
import Dashboard from "./adminPages/dashBoard";
import products from './adminPages/products'

export default function AdminDashboard() {
  return (
    <>
    <Navbar/>
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-content">
        <Outlet /> 
      </main>
      <Dashboard/>
    </div>
    </> 
  );
}