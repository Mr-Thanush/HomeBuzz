import React, { useEffect } from "react";
import "../Styles/myOrders.css";
import Navbar from "../Components/navBar";
import PageTitle from "../Components/pageTitle";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAllMyOrders, removeErrors } from "../Components/features/Orders/orderSlice";
import { toast } from "react-toastify";

function MyOrders() {
  const { orders = [], loading, error } = useSelector((state) => state.order);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllMyOrders());

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
    <>
      <Navbar />
      <PageTitle title="My Orders | HomeBuzz" />

      <div className="orders-page">
        <header className="orders-header">
          <h1>My Orders</h1>
          <p>Track and manage your purchases</p>
        </header>

        {loading ? (
          <p className="orders-loading">Loading orders...</p>
        ) : orders.length === 0 ? (
          <p className="orders-empty">No orders found</p>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div className="order-card" key={order._id}>
                {/* Top */}
                <div className="order-top">
                  <div>
                    <p className="order-id">Order #{order._id.slice(-6)}</p>
                    <p className="order-date">{formatDate(order.orderedAt)}</p>
                  </div>
                  <span
                    className={`order-status ${order.orderStatus.toLowerCase()}`}
                  >
                    {order.orderStatus}
                  </span>
                </div>

                <div className="order-items">
                  {order.orderItems.map((item, index) => (
                    <div className="order-item" key={index}>
                      <span className="item-name">{item.name}</span>
                      <span className="item-qty">×{item.quantity}</span>
                    </div>
                  ))}
                </div>

                <div className="order-footer">
                  <span className="order-total">₹{order.totalPrice}</span>
                  <Link to={`/order/${order._id}`}>
                    <button className="order-btn">View Details</button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default MyOrders;