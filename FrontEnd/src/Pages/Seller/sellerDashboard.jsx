import "./seller.css";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from '../../Components/navBar'
import PageTitle from "../../Components/pageTitle";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchAllOrders, fetchProductReviews, fetchSellerProducts } from "../../Components/features/AdminSeller/sellerSlice";


export default function SellerDashboard() {
  const{products,totalAmount,orders,reviews}=useSelector(state=>state.seller);
  
  const dispatch=useDispatch();
  useEffect(()=>{
  dispatch(fetchAllOrders);
   dispatch(fetchSellerProducts);
   dispatch(fetchProductReviews);
  },[dispatch])



  return (
  <>
  <Navbar/>
  <PageTitle title="Seller Dashboard"/>
    <div className="seller-layout">
      <Sidebar />
      <main className="seller-content">
        <Outlet />
      </main>
       <div className="aboutSeller">
        <img src="seller Img" alt="seller" className="sellerImg"/>
        <h2 className="sellerName"> Seller Name</h2>
        <h3 className="sellerMades"> Seller What he mades</h3>
        <p className="sellerDiscription"> Seller Discription</p>

        <hr/>
        <section className="admin-page">
      <h1>Overview</h1>
      <div className="admin-cards">
        <div className="admin-card">
          <p>Total Users</p>
          <h2>124</h2>
        </div> 
        <div className="admin-card">
          <p>Total Orders</p>
          <h2>{orders.length}</h2>
        </div> 
        <div className="admin-card">
          <p>Total Products</p>
          <h2>{products.length}</h2>
          </div>
          <div className="admin-card">
          <p>Total Reviews</p>
          <h2>{reviews.length}</h2>
        </div>
        <div className="admin-card">
          <p>Total Revinue</p>
          <h2>{totalAmount}</h2>
        </div>
        <div className="admin-card">
          <p>Total In Stock</p>
          <h2>{products.filter(product=>product.stock>0).length}</h2>
        </div>
        <div className="admin-card">
          <p>Total Out Stock</p>
          <h2>{products.filter(product=>product.stock===0).length}</h2>
        </div>
      </div>
    </section>
      </div>
    </div>
    </>  
  );
}
