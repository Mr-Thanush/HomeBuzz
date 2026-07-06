import React, { useEffect, useState } from "react";
import CheckOutAnimation from "./CheckOutAnimation";
import Navbar from "../Components/Navbar";
import PageTitle from "../Components/PageTitle";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { createOrder, removeErrors, removeSuccess } from "../Components/features/Orders/orderSlice";
import { clearLikeList } from "../Components/features/Like/likeSlice";
import "../Styles/payment.css";

function Payment() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Safely parse initial session tokens with defensive layout checks
  const orderItem = JSON.parse(sessionStorage.getItem("OrderItem")) || {
    subtotal: 0,
    shippingCharge: 0,
    tax: 0,
    totalPrice: 0,
  };

  const [method, setMethod] = useState("upi");
  const { likeItems = [], shippingInfo = {} } = useSelector((state) => state.like);
  const { success, loading, error } = useSelector((state) => state.order);

  const handlePayment = () => {
    if (!orderItem || orderItem.totalPrice === 0) {
      toast.error("Order context payload data missing");
      return;
    }

    const orderData = {
      shippingInfo: {
        address: shippingInfo.fullAddress || "",
        state: shippingInfo.state || "",
        city: shippingInfo.city || "",
        pincode: shippingInfo.pincode || "",
        phoneNo: shippingInfo.mobileNumber || "",
      },
      orderItems: likeItems.map((item) => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
        product: item.product,
      })),
      paymentInfo: {
        id: method === "cod" ? "COD" : `ONLINE_${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        status: method === "cod" ? "Pending" : "Paid",
      },
      paymentMethod: method,
      itemPrice: orderItem.subtotal,
      taxPrice: orderItem.tax,
      shippingPrice: orderItem.shippingCharge,
      totalPrice: orderItem.totalPrice,
    };

    dispatch(createOrder(orderData));
  };

  useEffect(() => {
    if (success) {
      toast.success("Order Placed Successfully", { position: "top-center", autoClose: 3000 });
      sessionStorage.removeItem("OrderItem");
      dispatch(removeSuccess());
      dispatch(clearLikeList());
      navigate("/orders");
    }
  }, [success, dispatch, navigate]);

  useEffect(() => {
    if (error) {
      toast.error(error, { position: "top-center", autoClose: 3000 });
      dispatch(removeErrors());
    }
  }, [error, dispatch]);

  return (
    <div className="payment-page-wrapper">
      <Navbar />
      <PageTitle title="Secure Payment - HomeBuzz" />
      <div className="payment-animation-bar">
        <CheckOutAnimation step={3} />
      </div>

      <main className="payment-page">
        <div className="payment-card">
          <h2 className="payment-title">Payment Options</h2>

          {/* Pricing Box calculations panel */}
          <div className="order-summary-box">
            <div className="summary-row">
              <span>Items Subtotal</span>
              <span>₹{(orderItem.subtotal ?? 0).toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Logistics Shipping</span>
              <span>₹{(orderItem.shippingCharge ?? 0).toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Tax Assessment</span>
              <span>₹{(orderItem.tax ?? 0).toFixed(2)}</span>
            </div>
            <div className="summary-row total-payable">
              <span>Total Payable</span>
              <span>₹{(orderItem.totalPrice ?? 0).toFixed(2)}</span>
            </div>
          </div>

          {/* Radio input selectors wrappers */}
          <div className="payment-methods-list">
            <label className={`method-card-label ${method === "upi" ? "active" : ""}`}>
              <input
                type="radio"
                name="paymentMethod"
                checked={method === "upi"}
                onChange={() => setMethod("upi")}
              />
              <div className="method-txt">
                <h4>Instant UPI Payments</h4>
                <p>Google Pay, PhonePe, Paytm, BHIM</p>
              </div>
            </label>

            <label className={`method-card-label ${method === "card" ? "active" : ""}`}>
              <input
                type="radio"
                name="paymentMethod"
                checked={method === "card"}
                onChange={() => setMethod("card")}
              />
              <div className="method-txt">
                <h4>Credit / Debit Cards</h4>
                <p>Visa, MasterCard, RuPay, Maestro</p>
              </div>
            </label>

            <label className={`method-card-label ${method === "cod" ? "active" : ""}`}>
              <input
                type="radio"
                name="paymentMethod"
                checked={method === "cod"}
                onChange={() => setMethod("cod")}
              />
              <div className="method-txt">
                <h4>Cash On Delivery (COD)</h4>
                <p>Pay with cash or digital apps upon delivery</p>
              </div>
            </label>
          </div>

          {/* Transaction submit triggers */}
          <button className="pay-action-btn" onClick={handlePayment} disabled={loading}>
            {loading ? "Processing Order..." : `Pay ₹${(orderItem.totalPrice ?? 0).toFixed(2)}`}
          </button>

          <p className="secure-badge-text">🔒 Verified 256-Bit SSL Secured Encryption</p>
        </div>
      </main>
    </div>
  );
}

export default Payment;