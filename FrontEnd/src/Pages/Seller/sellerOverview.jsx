import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import PageTitle from "../../Components/pageTitle";
import { fetchAllOrders, fetchSellerProducts } from "../../Components/features/AdminSeller/sellerSlice";

export default function SellerOverview() {
  const dispatch = useDispatch();
  const { products = [], totalAmount = 0, orders = [], reviews = [] } = useSelector(state => state.seller || {});

  useEffect(() => {
    dispatch(fetchAllOrders());
    dispatch(fetchSellerProducts());
  }, [dispatch]);

  const inStockCount = products?.filter(product => (product?.stock || 0) > 0).length || 0;
  const outOfStockCount = products?.filter(product => (product?.stock || 0) === 0).length || 0;

  return (
    <>
      <PageTitle title="Seller Overview Panel" />
      <section className="seller-overview-section">
        
        {/* Merchant Identity Card */}
        <div className="merchant-profile-card">
          <div className="profile-details">
            <h2 className="merchant-name">Store Showcase</h2>
            <h3 className="merchant-specialty">Verified Homemade Merchant Partner</h3>
            <p className="merchant-bio">Managing catalog listings, fulfilling processing dispatches, and reviewing consumer quality indices.</p>
          </div>
        </div>

        <h1 className="section-main-title">Performance Analytics</h1>
        
        <div className="metrics-performance-grid">
          <div className="metric-card elevation-sm">
            <span className="metric-label">Gross Store Revenue</span>
            <h2 className="metric-value">₹{(totalAmount || 0).toFixed(2)}</h2>
          </div>
          <div className="metric-card elevation-sm">
            <span className="metric-label">Total Volume Orders</span>
            <h2 className="metric-value">{orders?.length || 0}</h2>
          </div>
          <div className="metric-card elevation-sm">
            <span className="metric-label">Managed Products</span>
            <h2 className="metric-value">{products?.length || 0}</h2>
          </div>
          <div className="metric-card elevation-sm">
            <span className="metric-label">Total Product Reviews</span>
            <h2 className="metric-value">{reviews?.length || 0}</h2>
          </div>
          <div className="metric-card elevation-sm success-accent">
            <span className="metric-label">Active Items In Stock</span>
            <h2 className="metric-value">{inStockCount}</h2>
          </div>
          <div className="metric-card elevation-sm danger-accent">
            <span className="metric-label">Items Out of Stock</span>
            <h2 className="metric-value">{outOfStockCount}</h2>
          </div>
        </div>
      </section>
    </>
  );
}