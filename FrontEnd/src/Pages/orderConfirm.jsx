import React from "react";
import { useNavigate } from "react-router-dom";
import CheckOutAnimation from "./CheckOutAnimation";
import Navbar from "../Components/Navbar";
import PageTitle from "../Components/PageTitle";
import { useSelector } from "react-redux";
import "../Styles/orderConfirm.css";

function OrderConfirm() {
  const navigate = useNavigate();

  const { shippingInfo = {}, likeItems = [] } = useSelector((state) => state.like);
  const { user } = useSelector((state) => state.user);

  const subtotal = likeItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shippingCharge = subtotal > 500 || subtotal === 0 ? 0 : 40;
  const tax = Math.round(subtotal * 0.05);
  const totalPrice = subtotal + shippingCharge + tax;

  const proceedToPayment = () => {
    const data = { subtotal, shippingCharge, tax, totalPrice };
    sessionStorage.setItem("OrderItem", JSON.stringify(data));
    navigate("/process/payment");
  };

  return (
    <div className="confirm-page-wrapper">
      <Navbar />
      <PageTitle title="Order Confirm - HomeBuzz" />
      
      <div className="animation-container">
        <CheckOutAnimation step={2} />
      </div>

      <main className="confirm-page">
        {/* Shipping Details Section */}
        <section className="confirm-card" aria-labelledby="shipping-details-heading">
          <h3 id="shipping-details-heading" className="confirm-title">Shipping Details</h3>
          <div className="confirm-info">
            <p><strong>Name:</strong> {shippingInfo?.fullName || user?.name}</p>
            <p><strong>Phone:</strong> {shippingInfo?.mobileNumber}</p>
            <p>
              <strong>Address:</strong>{" "}
              {shippingInfo?.fullAddress}, {shippingInfo?.city},{" "}
              {shippingInfo?.state} - {shippingInfo?.pincode}
            </p>
            {shippingInfo?.landmark && <p><strong>Landmark:</strong> {shippingInfo.landmark}</p>}
          </div>
        </section>

        {/* Order Items Section */}
        <section className="confirm-card" aria-labelledby="order-items-heading">
          <h3 id="order-items-heading" className="confirm-title">Order Items</h3>
          <div className="confirm-items">
            {likeItems.map((item) => (
              <div className="confirm-item" key={item._id || item.product}>
                <img src={item.image || "/fallback-product.jpg"} alt={item.name} />
                <div className="item-details-meta">
                  <p className="item-name">{item.name}</p>
                  <p className="item-meta">₹{item.price} × {item.quantity}</p>
                </div>
                <span className="item-total">₹{(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Price Summary Section */}
        <section className="confirm-card summary-card" aria-labelledby="price-summary-heading">
          <h3 id="price-summary-heading" className="confirm-title">Price Summary</h3>
          <div className="summary-row">
            <span>Items Total</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span>{shippingCharge === 0 ? "FREE" : `₹${shippingCharge.toFixed(2)}`}</span>
          </div>
          <div className="summary-row">
            <span>Tax (5%)</span>
            <span>₹{tax.toFixed(2)}</span>
          </div>
          <div className="summary-divider"></div>
          <div className="summary-total">
            <span>Total Payable</span>
            <span>₹totalPrice.toFixed(2)</span>
          </div>

          <button className="confirm-btn" onClick={proceedToPayment}>
            Proceed to Payment
          </button>
        </section>
      </main>
    </div>
  );
}

export default OrderConfirm;