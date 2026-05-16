import { useSelector } from "react-redux";
import Navbar from "../../../Components/navBar";
import PageTitle from "../../../Components/pageTitle";

export default function Dashboard() {
  const {users,products}=useSelector(state=>state.admin);
  

  return (
    <>
    <Navbar/>
    <PageTitle title="Admin Dashboard"/>
    <section className="admin-page">
      <h1>Overview</h1>

      <div className="admin-cards">
        <div className="admin-card">
          <p>Total Users</p>
          <h2>{users.length}</h2>
        </div>
        <div className="admin-card">
          <p>Total Sellers</p>
          <h2>{users.filter(user=>user.role==="seller").length}</h2>
        </div>
        <div className="admin-card">
          <p>Total Products</p>
          <h2>{products.length}</h2>
        </div>
      </div>
    </section>
    </>
  );
}