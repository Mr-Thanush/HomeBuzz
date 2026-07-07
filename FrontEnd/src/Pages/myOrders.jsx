import React, { useEffect } from "react";
import Navbar from "../Components/navBar.jsx";
import PageTitle from "../Components/pageTitle.jsx";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAllMyOrders, removeErrors } from "../Components/features/Orders/orderSlice";
import { toast } from "react-toastify";
import "../Styles/myOrders.css";

function MyOrders() {
  const dispatch = useDispatch();
  const { orders = [], loading, error } = useSelector((state) => state.order);

  // Mount logic fetch loop separated safely from state tracking updates
  useEffect(() => {
    dispatch(getAllMyOrders());
  }, [dispatch]);

  // Error logging effect listener
  useEffect(() => {
    if (error) {
      toast.error(error, { position: "top-center", autoClose: 3000 });
      dispatch(removeErrors());
    }
  }, [dispatch, error]);

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  return (
    <div className="orders-page-wrapper">
      <PageTitle title="My Orders | HomeBuzz" />
      <Navbar />

      <main className="orders-page">
        <header className="orders-header">
          <h1>My Orders</h1>
          <p>Track and manage your purchases</p>
        </header>

        {loading ? (
          <div className="orders-status-msg">
            <p className="orders-loading">Loading your orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="orders-empty-state">
            <p className="orders-empty">No orders found</p>
            <Link to="/" className="shop-now-btn">Explore Products</Link>
          </div>
        ) : (
          <div className="orders-grid-layout">
            {orders.map((order) => (
              <article className="order-card" key={order._id}>
                {/* Top Details Bar */}
                <div className="order-top">
                  <div>
                    <h2 className="order-id">Order #{order._id.slice(-6).toUpperCase()}</h2>
                    <p className="order-date">{formatDate(order.orderedAt || order.createdAt)}</p>
                  </div>
                  <span className={`order-status ${order.orderStatus?.toLowerCase() || "processing"}`}>
                    {order.orderStatus || "Processing"}
                  </span>
                </div>

                {/* Mid Items List */}
                <div className="order-items">
                  {order.orderItems?.map((item, index) => (
                    <div className="order-item" key={index}>
                      <span className="item-name">{item.name}</span>
                      <span className="item-qty">×{item.quantity}</span>
                    </div>
                  ))}
                </div>

                {/* Bottom Footer Section */}
                <div className="order-footer">
                  <div className="order-total-block">
                    <span className="total-label">Total</span>
                    <span className="order-total">₹{Number(order.totalPrice).toFixed(2)}</span>
                  </div>
                  <Link to={`/order/${order._id}`} className="order-details-link">
                    View Details
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default MyOrders;