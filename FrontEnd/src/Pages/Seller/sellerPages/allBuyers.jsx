import React from 'react';
import PageTitle from "../../../Components/pageTitle";

export default function AllBuyers() {
  return (
    <>
      <PageTitle title="Seller All Buyers" />
      <section className="seller-view-wrapper">
        <div className="view-header-row">
          <h1 className="view-main-title">Customer Relationship Registry</h1>
          <p className="view-subtitle">Review core accounts interacting with your storefront catalog purchases.</p>
        </div>

        <div className="seller-data-grid">
          <div className="modern-seller-card">
            <div className="card-identity-block">
              <span className="client-avatar-placeholder">RS</span>
              <div>
                <h3 className="client-title-name">Rahul Sharma</h3>
                <p className="client-meta-email">rahul@email.com</p>
              </div>
            </div>
            <div className="card-badge-row">
              <span className="ui-pill active-client">Verified Customer</span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}