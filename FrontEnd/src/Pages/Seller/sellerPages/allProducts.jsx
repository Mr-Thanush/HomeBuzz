import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import PageTitle from "../../../Components/pageTitle";
import Ratings from '../../../Components/ratings';
import Loader from '../../../Components/loader';
import { deleteProduct, fetchSellerProducts, removeErrors, removeSuccess } from '../../../Components/features/AdminSeller/sellerSlice';

export default function SellerAllProducts() {
  const dispatch = useDispatch();
  const { products = [], error, loading, deleting = {} } = useSelector((state) => state.seller || {});

  useEffect(() => {
    dispatch(fetchSellerProducts());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error, { position: "top-center", autoClose: 3000 });
      dispatch(removeErrors());
    }  
  }, [dispatch, error]);

  const handleDelete = (productId) => {
    if (window.confirm("Are you sure you want to delete this product listing permanently?")) {
      dispatch(deleteProduct(productId)).then((action) => {
        if (action.type === "seller/deleteProduct.fulfilled") {
          toast.success("Catalog entity purged successfully", { position: "top-center", autoClose: 3000 });
          dispatch(removeSuccess());
          dispatch(fetchSellerProducts());
        }
      });
    }
  }; 

  return (
    <>
      <PageTitle title="Seller All Products" />
      <section className="seller-view-wrapper">
        <div className="view-header-row">
          <h1 className="view-main-title">Storefront Product Catalog</h1>
          <p className="view-subtitle">Audit metrics, stock counts, pricing parameters, and visibility modifiers.</p>
        </div>

        {loading && products.length === 0 ? (
          <Loader />
        ) : products && products.length > 0 ? (
          <div className="table-responsive-container">
            <table className="modern-data-table">
              <thead>
                <tr>
                  <th>Thumbnail</th>
                  <th>Product Details</th>
                  <th>Core Category</th>
                  <th>Inventory Status</th>
                  <th>Unit Pricing</th>
                  <th>Creation Date</th>
                  <th>Feedback Rating</th>
                  <th className="action-column-header">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product._id}>
                    <td>
                      <img 
                        src={product.image?.[0]?.url || "https://via.placeholder.com/50"} 
                        alt={product.name} 
                        className="catalog-row-thumbnail"
                      />
                    </td>
                    <td>
                      <div className="cell-bold-title">{product.name}</div>
                    </td>
                    <td><span className="category-tag-ui">{product.category}</span></td>
                    <td>
                      <span className={`stock-counter-badge ${(product.stock || 0) > 0 ? "in-stock" : "out-of-stock"}`}>
                        {product.stock} units
                      </span>
                    </td>
                    <td className="font-weight-bold">₹{product.price}</td>
                    <td>{product.createdAt ? new Date(product.createdAt).toLocaleDateString() : "N/A"}</td>
                    <td>
                      <Ratings value={product.ratings} disabled={true} />
                    </td>
                    <td>
                      <div className="action-icon-flex-group">
                        <Link to={`/seller/product/${product._id}`} className="action-pill-btn update-accent">
                          Update
                        </Link>
                        <button 
                          className="action-pill-btn delete-accent" 
                          disabled={deleting[product._id]} 
                          onClick={() => handleDelete(product._id)}
                        >
                          {deleting[product._id] ? "Purging..." : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-catalog-fallback">
            <h2>No Core Offerings Located</h2>
            <p>Your digital merchant catalog is empty. Click Create Product to begin.</p>
          </div>
        )}
      </section>
    </>
  );
}