import React from "react";
import Navbar from "../Components/Navbar";
import PageTitle from "../Components/PageTitle";
import { useSelector } from "react-redux";
import LikeItem from "./likeItems";
import { Link, useNavigate } from "react-router-dom";
import "../Styles/like.css";
 
function Like() { 
  const navigate = useNavigate();
  const { likeItems } = useSelector((state) => state.like);

  // Price Calculation Engine
  const totalCost = likeItems ? likeItems.reduce((sum, item) => sum + item.price * item.quantity, 0) : 0;
  const deliveryFee = totalCost > 500 || totalCost === 0 ? 0 : 75;
  const gst = totalCost * 0.05;
  const finalAmount = totalCost + gst + deliveryFee;

  const handleShippingOut = () => {
    navigate(`/signin?redirect=/shipping`);
  };

  return (
    <div className="ll-page-layout">
      <PageTitle title="Liked List - HomeBuzz" />
      <Navbar />

      <main className="ll-page">
        <h1 className="ll-heading">My Liked List</h1>

        {likeItems && likeItems.length > 0 ? (
          <div className="ll-flex-container">
            {/* Products Main Column */}
            <div className="ll-main-content">
              <div className="ll-grid">
                {likeItems.map((item) => (
                  <LikeItem key={item.product} item={item} />
                ))}
              </div>
            </div>

            {/* Sticky Pricing Summary Panel Block Column */}
            <div className="ll-sidebar">
              <div className="checkout-summary">
                <h3 className="summary-title">Price Summary</h3>

                <div className="summary-row">
                  <span>Items Total</span>
                  <span>₹{totalCost.toFixed(2)}</span>
                </div>

                <div className="summary-row">
                  <span>Delivery Fee</span>
                  <span className={deliveryFee === 0 ? "free" : ""}>
                    {deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}
                  </span>
                </div>
                
                <div className="summary-row">
                  <span>GST (5%)</span>
                  <span>₹{gst.toFixed(2)}</span>
                </div>
                
                <div className="summary-divider"></div>
                
                <div className="summary-total">
                  <span>Total Payable</span>
                  <span>₹{finalAmount.toFixed(2)}</span>
                </div>
              </div>

              {/* Sticky Action Footer Call to Action Panel Section */}
              <div className="checkOutDiv">
                <label htmlFor="checkout-address-select" className="visually-hidden">
                  Select Shipping Address
                </label>
                <select id="checkout-address-select" className="checkOutAdd">
                  <option>Choose Delivery Address</option>
                  <option value="address1">Address 1</option>
                  <option value="address2">Address 2</option>
                </select>
                <button className="checkout-btn" onClick={handleShippingOut}>
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="ll-empty"> 
            <p className="nullProducts">Your Liked List is empty</p>
            <Link to="/" className="toHome">Explore Products</Link>
          </div>
        )}
      </main>
    </div>
  );
}

export default Like;