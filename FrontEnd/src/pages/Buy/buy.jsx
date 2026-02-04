import React, { useState } from "react";
import "./buy.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../../Components/cartContext";

function BuyItems() {
  const location = useLocation();
  const navigate = useNavigate();
  const address = location.state?.address; // Address object passed from cart/checkout

  const { cartItems, removeFromCart } = useCart();
  const [placingOrder, setPlacingOrder] = useState(false);

  if (!cartItems || cartItems.length === 0) {
    return <p style={{ textAlign: "center", marginTop: "50px" }}>No items in cart</p>;
  }

  // Remove item
  const removeItem = (id) => {
    removeFromCart(id);
  };
 
  // Calculate prices
  const totalMRP = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const platformFee = cartItems.length > 0 ? 20 : 0;
  const totalAmount = totalMRP + platformFee;

  const placeOrder = async () => {
    if (!address) return alert("Please select a delivery address!");

    setPlacingOrder(true);

    try {
      // Map cartItems to required backend schema
      const orderItems = cartItems.map((item) => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.images?.[0]?.url || "default.jpg", // fallback image
        product: item._id,
      }));

      // Make sure address has all required fields
      const shippingInfo = {
        address: address.address || "",
        city: address.city || "",
        state: address.state || "",
        pincode: address.pincode || 0,
        mobileNumber: address.mobileNumber || 0,
      };

      // Check validation before sending
      if (!shippingInfo.address || !shippingInfo.mobileNumber) {
        return alert("Please fill all shipping info fields!");
      }

      const body = {
        shippingInfo,
        orderItems,
        paymentInfo: { id: "COD", status: "Success" },
        itemPrice: totalMRP,
        taxPrice: 0,
        shippingPrice: platformFee,
        totalPrice: totalAmount,
      };

      const res = await fetch("http://localhost:9090/api/v1/new/order", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message || "Order failed");
      }

      alert("Order placed successfully!");
      navigate("/orders"); // Redirect to orders page
    } catch (error) {
      console.error("Order Error:", error);
      alert(error.message);
    } finally {
      setPlacingOrder(false);
    }
  };

  return (
    <div className="buyPage">
      <h1>Checkout</h1>

      {/* Address Section */}
      <div className="addressSection">
        {!address ? (
          <div className="noAddress">
            <h3>No delivery address added</h3>
            <Link to="/address">
              <button className="editAddressBtn">Add Address</button>
            </Link>
          </div>
        ) : (
          <>
            <div className="addressDetails">
              <h3>{address.name}</h3>
              <p>
                {address.address}, {address.city}, {address.state} - {address.pincode}
              </p>
              <p>Mobile: {address.mobileNumber}</p>
            </div>
            <Link to="/address">
              <button className="editAddressBtn">Edit Address</button>
            </Link>
          </>
        )}
      </div>

      {/* Cart Items Section */}
      {cartItems.map((item) => (
        <div className="checkoutItem" key={item._id}>
          <img src={item.images?.[0]?.url || "default.jpg"} alt={item.name} />
          <div className="checkoutItemInfo">
            <h3>{item.name}</h3>
            <p>Price: ₹{item.price}</p>
            <p>Qty: {item.quantity}</p>
          </div>
          <button onClick={() => removeItem(item._id)}>
            <FontAwesomeIcon icon={faX} />
          </button>
        </div>
      ))}

      {/* Price Summary */}
      <div className="priceSummary">
        <div className="priceRow">
          <span>Total MRP</span>
          <span>₹{totalMRP}</span>
        </div>
        <div className="priceRow">
          <span>Platform Fee</span>
          <span>₹{platformFee}</span>
        </div>
        <div className="priceRow total">
          <span>Total Amount</span>
          <span>₹{totalAmount}</span>
        </div>
      </div>

      <button
        className="placeOrderBtn"
        disabled={cartItems.length === 0 || !address || placingOrder}
        onClick={placeOrder}
      >
        {placingOrder ? "Placing Order..." : "Place Order"}
      </button>
    </div>
  );
}

export default BuyItems;