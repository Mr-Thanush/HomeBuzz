import React from "react";
import { useSelector } from "react-redux";
import PageTitle from "../../../Components/pageTitle";

export default function Dashboard() {
  const { users = [], products = [] } = useSelector((state) => state.admin || {});

  const sellerCount = users?.filter((user) => user?.role === "seller").length || 0;

  return (
    <>
      <PageTitle title="Admin Dashboard" />
      <section className="admin-section-wrapper">
        <div className="admin-header-row">
          <div>
            <h1 className="admin-main-heading">Overview</h1>
            <p className="admin-subheading">Real-time store performance analytics matrix.</p>
          </div>
        </div>

        <div className="admin-cards-grid">
          <div className="admin-stat-card">
            <span className="card-label">Total Registered Accounts</span>
            <h2 className="card-metric">{users?.length || 0}</h2>
          </div>
          <div className="admin-stat-card">
            <span className="card-label">Active Merchant Stores</span>
            <h2 className="card-metric">{sellerCount}</h2>
          </div>
          <div className="admin-stat-card">
            <span className="card-label">Live Catalog Items</span>
            <h2 className="card-metric">{products?.length || 0}</h2>
          </div>
        </div>
      </section>
    </>
  );
}