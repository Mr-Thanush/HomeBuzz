import { useNavigate } from "react-router-dom";
import CheckOutAnimation from "./checkOutAnimation";
import Navbar from "../Components/Navbar";
import PageTitle from "../Components/pageTitle";
import "../Styles/orderConfirm.css";
import {useSelector} from  "react-redux";

function OrderConfirm() {
  const navigate = useNavigate();

  const {shippingInfo,likeItems}=useSelector(state=>state.like);
  const {user}=useSelector(state=>state.user);

  const subtotal = likeItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const shippingCharge = subtotal > 500 ? 0 : 40;
  const tax = Math.round(subtotal * 0.05);
  const totalPrice = subtotal + shippingCharge + tax;

const proceedToPayment=()=>{
   const data={
    subtotal,
    shippingCharge,
    tax,
    totalPrice
   }

   sessionStorage.setItem("OrderItem",JSON.stringify(data));
   navigate('/process/payment')
}

  return (
    <>
    <Navbar />
    <PageTitle title="Order Confirm-HomeBuzz"/>
      <CheckOutAnimation step={2} />

      <main className="confirm-page">
      
        <section className="confirm-card">
          <h3 className="confirm-title">Shipping Details</h3>

          <div className="confirm-info">
            <p><strong>Name:</strong> {shippingInfo.fullName}</p>
            <p><strong>Phone:</strong> {shippingInfo.mobileNumber}</p>
            <p>
              <strong>Address:</strong>{" "}
              {shippingInfo.fullAddress}, {shippingInfo.city},{" "}
              {shippingInfo.state} - {shippingInfo.pincode}
            </p>
            <p><strong>Landmark:</strong> {shippingInfo.landmark}</p>
          </div>
        </section>

       
        <section className="confirm-card">
          <h3 className="confirm-title">Order Items</h3>

          <div className="confirm-items">
            {likeItems.map((item) => (
              <div className="confirm-item" key={item._id}>
                <img src={item.image} alt={item.name} />
                <div>
                  <p className="item-name">{item.name}</p>
                  <p className="item-meta">
                    ₹{item.price} x {item.quantity}
                  </p>
                </div>
                <span className="item-total">
                  ₹{item.price * item.quantity}
                </span>
              </div>
            ))}
          </div>
        </section>

       
        <section className="confirm-card summary-card">
          <h3 className="confirm-title">Price Summary</h3>

          <div className="summary-row">
            <span>Itemtotal</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>

          <div className="summary-row">
            <span>Shipping</span>
            <span>{shippingCharge === 0 ? "Free" : `₹${shippingCharge.toFixed(2)}`}</span>
          </div>

          <div className="summary-row">
            <span>Tax (5%)</span>
            <span>₹{tax.toFixed(2)}</span>
          </div>

          <div className="summary-total">
            <span>Total</span>
            <span>₹{totalPrice.toFixed(2)}</span>
          </div>

          <button
            className="confirm-btn"
            onClick={proceedToPayment}
          >
            Proceed to Payment
          </button>
        </section>
      </main>
    </>
  );
}

export default OrderConfirm;