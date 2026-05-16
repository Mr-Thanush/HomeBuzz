import { useEffect, useState } from "react";
import CheckOutAnimation from "./checkOutAnimation";
import Navbar from "../Components/navBar";
import PageTitle from "../Components/pageTitle";
import "../Styles/payment.css";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { createOrder, removeErrors, removeSuccess } from "../Components/features/Orders/orderSlice";
import { clearLikeList } from "../Components/features/Like/likeSlice";

function Payment() {
  const orderItem = JSON.parse(sessionStorage.getItem("OrderItem"));
  const [method, setMethod] = useState("upi");

  const { likeItems, shippingInfo } = useSelector((state) => state.like);
  const { success, loading, error } = useSelector((state) => state.order);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handlePayment = () => {
    if (!orderItem) {
      toast.error("Order data missing");
      return;
    }

    const orderData = {
      shippingInfo: {
        address: shippingInfo.fullAddress,
        state: shippingInfo.state,
        city: shippingInfo.city,
        pincode: shippingInfo.pincode,
        phoneNo: shippingInfo.mobileNumber,
      },
      orderItems: likeItems.map((item) => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
        product: item.product,
      })),
      paymentInfo: {
    id: method === "cod" ? "COD" : "ONLINE_TXN",
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
      toast.success("Order Placed Successfully", {
        position: "top-center",
        autoClose: 3000,
      });

      sessionStorage.removeItem("OrderItem");
      dispatch(removeSuccess());
      dispatch(clearLikeList())
      navigate("/orders");
    }
  }, [success, dispatch, navigate]);

  useEffect(() => {
    if (error) {
      toast.error(error, {
        position: "top-center",
        autoClose: 3000,
      });
      dispatch(removeErrors());
    }
  }, [error, dispatch]);

  return (
    <>
      <Navbar />
      <PageTitle title="Payment - HomeBuzz" />
      <CheckOutAnimation step={3} />

      <div className="payment-page">
        <div className="payment-card">
          <h2 className="payment-title">Payment</h2>

          <div className="order-summary">
            <div className="row">
              <span>Subtotal</span>
              <span>₹{orderItem.subtotal.toFixed(2)}</span>
            </div>
            <div className="row">
              <span>Shipping</span>
              <span>₹{orderItem.shippingCharge.toFixed(2)}</span>
            </div>
            <div className="row">
              <span>Tax</span>
              <span>₹{orderItem.tax.toFixed(2)}</span>
            </div>
            <div className="row total">
              <span>Total</span>
              <span>₹{orderItem.totalPrice.toFixed(2)}</span>
            </div>
          </div>

          <div className="payment-methods">
            <label className={`method ${method === "upi" ? "active" : ""}`}>
              <input
                type="radio"
                checked={method === "upi"}
                onChange={() => setMethod("upi")}
              />
              <div>
                <h4>UPI</h4>
                <p>Google Pay, PhonePe, Paytm</p>
              </div>
            </label>

            <label className={`method ${method === "card" ? "active" : ""}`}>
              <input
                type="radio"
                checked={method === "card"}
                onChange={() => setMethod("card")}
              />
              <div>
                <h4>Credit / Debit Card</h4>
                <p>Visa, MasterCard, RuPay</p>
              </div>
            </label>

            <label className={`method ${method === "cod" ? "active" : ""}`}>
              <input
                type="radio"
                checked={method === "cod"}
                onChange={() => setMethod("cod")}
              />
              <div>
                <h4>Cash on Delivery</h4>
                <p>Pay when product arrives</p>
              </div>
            </label>
          </div>

          {/* Action */}
          <button
            className="pay-btn"
            onClick={handlePayment}
            disabled={loading}
          >
            {loading ? "Processing..." : `Pay ₹${orderItem.totalPrice.toFixed(2)}`}
          </button>

          <p className="secure-text">🔒 100% Secure Payments</p>
        </div>
      </div>
    </>
  );
}

export default Payment;