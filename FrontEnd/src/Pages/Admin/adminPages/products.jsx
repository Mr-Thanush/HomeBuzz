import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import PageTitle from "../../../Components/pageTitle";
import { fetchAdminProducts } from "../../../Components/features/AdminSeller/adminSlice";
import Ratings from "../../../Components/ratings";
import Loader from "../../../Components/loader";

export default function AdminProducts() {
  const dispatch = useDispatch();
  const { products = [], loading, error } = useSelector((state) => state.admin || {});

  useEffect(() => {
    dispatch(fetchAdminProducts());
  }, [dispatch]);

  return (
    <>
      <PageTitle title="Admin Products View" />
      <section className="admin-section-wrapper">
        <div className="admin-header-row">
          <div>
            <h1 className="admin-main-heading">All Live Catalog Products</h1>
            <p className="admin-subheading">Audit store offerings, pricing distributions, and item volumes.</p>
          </div>
        </div>

        {loading ? (
          <Loader />
        ) : products && products.length > 0 ? (
          <div className="table-responsive-wrapper">
            <table className="modern-admin-table">
              <thead>
                <tr>
                  <th>Media</th>
                  <th>Product Details</th>
                  <th>Price</th>
                  <th>Inventory</th>
                  <th>Created On</th>
                  <th>Quality Index</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product._id}>
                    <td>
                      <img 
                        src={product.images?.[0]?.url || "https://via.placeholder.com/60"} 
                        alt={product.name} 
                        className="table-item-thumbnail" 
                      />
                    </td>
                    <td>
                      <div className="cell-primary-text">{product.name}</div>
                      <div className="cell-secondary-text">{product.category}</div>
                    </td>
                    <td><span className="currency-marker">₹</span>{product.price}</td>
                    <td>
                      <span className={`stock-indicator ${product.stock < 5 ? 'low-stock' : 'in-stock'}`}>
                        {product.stock} units
                      </span>
                    </td>
                    <td>{product.createdAt ? new Date(product.createdAt).toLocaleDateString() : 'N/A'}</td>
                    <td>
                      <Ratings value={product.ratings} disabled={true} />
                    </td>
                    <td className="text-right">
                      <Link to={`/admin/product/${product._id}`} className="action-btn delete-btn">
                        Delete
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state-card">
            <h2>No Active Catalog Offerings Found</h2>
            <p>Products uploaded by storefronts will automatically populate here.</p>
          </div>
        )}
      </section>
    </>
  );
}