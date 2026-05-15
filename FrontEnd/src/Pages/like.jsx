import Navbar from "../Components/navBar";
import PageTitle from "../Components/pageTitle";
import "../Styles/like.css";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import LikeItem from "./likeItems";
import { toast } from "react-toastify";
import { removeError } from "../Components/features/Like/likeSlice";
import { Link, useNavigate } from "react-router-dom";

function Like() { 
  const navigate=useNavigate();
 
  const { likeItems } = useSelector((state) => state.like);

  //price Calculation
  const totalCost=likeItems.reduce((sum,item)=>sum+item.price*item.quantity,0)
 
  const deliveryFee=totalCost>500?0:75;
  const gst=totalCost*0.05;
  const finalAmount=totalCost+gst+deliveryFee;

   const handleShippingOut=()=>{
      navigate(`/signin?redirect=/shipping`)
   }
  return (
    <div className="ll-page">
      <PageTitle title="Liked List - HomeBuzz" />
      <Navbar />

      <h1 className="ll-heading">My Liked List</h1>

      {likeItems.length > 0 ? (
        <>
          <div className="ll-grid">
            {likeItems.map((item) => (
              <LikeItem
                key={item.product}
                item={item}
              />
            ))}
          </div>
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

              <div className="checkOutDiv">
            <select className="checkOutAdd">
              <option>Choose Delivery Address</option>
              <option value="address1">Address 1</option>
              <option value="address2">Address 2</option>
            </select>
            <button className="checkout-btn" onClick={handleShippingOut}>
              Proceed to Checkout
            </button>
          </div>
        </>
      ) : (
        <div className="ll-empty"> 
        <p className="nullProducts"> Your Liked List is empty</p>
        <Link to="/" className="toHome">Explore</Link>
        </div>
      )}
    </div>
  );
}

export default Like;