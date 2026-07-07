import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Navbar from "../Components/navBar.jsx";
import PageTitle from "../Components/pageTitle.jsx";
import { getOrderDetails, removeErrors } from "../Components/features/Orders/orderSlice";
import { toast } from "react-toastify";
import "../Styles/orderDetails.css";

function OrderDetails() {
  const { orderId } = useParams();
  const dispatch = useDispatch();
  const { order, loading, error } = useSelector((state) => state.order);

  // Split initialization logic from runtime tracking loops safely
  useEffect(() => {
    dispatch(getOrderDetails(orderId));
  }, [dispatch, orderId]);

  // Dedicated separate API failure monitoring effect hook
  useEffect(() => {
    if (error) {
      toast.error(error, { position: "top-center", autoClose: 3000 });
      dispatch(removeErrors());
    }
  }, [dispatch, error]);

  if (loading) {
    return (
      <div className="order-loader-container">
        <p className="order-loading">Loading order details...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="order-loader-container">
        <p className="order-loading">No explicit records found for this order.</p>
      </div>
    );
  }

  return (
    <div className="order-details-wrapper">
      <Navbar />
      <PageTitle title={`Order #${orderId?.slice(-6).toUpperCase()} Details - HomeBuzz`} />

      <main className="order-details-page">
        {/* Status Section */}
        <section className="order-section status-card" aria-label="Order Lifecycle Status">
          <h2>Order Status</h2>
          {order?.orderStatus && (
            <span className={`status-badge ${order.orderStatus.toLowerCase()}`}>
              {order.orderStatus}
            </span>
          )}
        </section>

        {/* Items Listing Section */}
        <section className="order-section">
          <h2>Purchased Items</h2>
          <div className="items-list">
            {order?.orderItems?.map((item, index) => (
              <div className="item-row" key={item._id || index}>
                <div className="item-info-block">
                  <p className="item-name">{item.name}</p>
                  <p className="item-qty">Quantity: {item.quantity}</p>
                </div>
                <span className="item-price">₹{(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Shipping Address Section */}
        <section className="order-section">
          <h2>Shipping Address</h2>
          <div className="address-block">
            <p className="recipient-name"><strong>{order.shippingInfo?.name || "Customer"}</strong></p>
            <p>{order.shippingInfo?.address || order.shippingInfo?.fullAddress}</p>
            <p>
              {order.shippingInfo?.city}, {order.shippingInfo?.state} - {order.shippingInfo?.pincode}
            </p>
            <p className="contact-phone"><strong>Phone:</strong> {order.shippingInfo?.phoneNo || order.shippingInfo?.mobileNumber}</p>
          </div>
        </section>

        {/* Payment Meta Details Section */}
        <section className="order-section">
          <h2>Payment Verification</h2>
          <div className="payment-block">
            <p><strong>Reference ID:</strong> <span className="id-txt">{order.paymentInfo?.id || "N/A"}</span></p>
            <p>
              <strong>Status: </strong>
              <span className={`payment-status-tag ${order?.paymentInfo?.status === "pending" ? "pending" : "paid"}`}>
                {order?.paymentInfo?.status?.toUpperCase() || "PROCESSING"}
              </span>
            </p>
          </div>
        </section>

        {/* Math Calculation Ledger Invoice box */}
        <section className="order-section price-box">
          <h2>Invoice Summary</h2>
          <div className="price-row">
            <span>Subtotal</span>
            <span>₹{order.itemPrice?.toFixed(2) ?? "0.00"}</span>
          </div>
          <div className="price-row">
            <span>Tax Assessment</span>
            <span>₹{order.taxPrice?.toFixed(2) ?? "0.00"}</span>
          </div>
          <div className="price-row">
            <span>Logistics Shipping</span>
            <span>₹{order.shippingPrice?.toFixed(2) ?? "0.00"}</span>
          </div>
          <div className="price-row price-total">
            <span>Total Value Paid</span>
            <span>₹{order.totalPrice?.toFixed(2) ?? "0.00"}</span>
          </div>
        </section>
      </main>
    </div>
  );
}

export default OrderDetails;