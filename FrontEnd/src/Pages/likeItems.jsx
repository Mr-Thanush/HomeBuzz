import React, { useEffect, useState } from "react";
import { BsBookmarkHeart, BsX } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { addToLikeList, removeError, removeItemFromLike, removeMessage } from "../Components/features/Like/likeSlice";
import { toast } from "react-toastify";

function LikeItem({ item }) {
  if (!item) return null;
  
  const dispatch = useDispatch(); 
  const { loading, error, success, message } = useSelector((state) => state.like);

  const initialQuantity = item.quantity ?? 1;
  const [quantity, setQuantity] = useState(initialQuantity);

  // Sync internal input state with parent prop shifts safely
  useEffect(() => {
    setQuantity(initialQuantity);
  }, [initialQuantity]);

  // Consolidated API Error Actions Monitoring
  useEffect(() => {
    if (error) {
      const errorMsg = typeof error === "string" ? error : error.message || "Something went wrong";
      toast.error(errorMsg, { position: "top-center", autoClose: 3000 });
      dispatch(removeError());
    }
  }, [dispatch, error]);

  // Consolidated Success Broadcast Action Messages
  useEffect(() => {
    if (success && message) {
      toast.success(message, { position: "top-center", autoClose: 3000, toastId: "cart-update" });
      dispatch(removeMessage());
    }
  }, [dispatch, success, message]);

  const handleIncrement = () => {
    if (item.stock && quantity >= item.stock) {
      toast.error(`Only ${item.stock} items available in stock`);
      return;
    }
    setQuantity((q) => q + 1);
  };

  const handleDecrement = () => {
    if (quantity <= 1) {
      toast.error("Quantity cannot be less than 1");
      return;
    }
    setQuantity((q) => q - 1);
  };

  const handleUpdate = () => {
    if (loading) return;
    if (quantity === initialQuantity) {
      toast.info("Quantity is already up to date");
      return;
    }
    if (item.stock && quantity > item.stock) {
      toast.error(`Only ${item.stock} items available in stock`);
      return;
    }
    dispatch(addToLikeList({ id: item.product, quantity }));
  };

  const handleDelete = () => {
    if (loading) return;
    dispatch(removeItemFromLike(item.product));
    toast.success(`${item.name || "Item"} removed from liked list`);
  };

  return (
    <div className="hb-product-card">
      <div className="hb-product-link">
        {/* IMAGE ON THE LEFT */}
        <div className="ll-image-container">
          <img 
            className="ll-image" 
            src={item.image || "/fallback-product.jpg"} 
            alt={item.name || "Product"} 
          />
        </div>

        {/* DETAILS ON THE RIGHT */}
        <div className="hb-product-body">
          <h3 className="hb-product-title">{item.name}</h3>
          <p className="hb-product-seller">
            By <span className="hb-seller-store">{item.sellerName || "Verified Maker"}</span>
          </p>
          <p className="hb-price">₹{item.price ? Number(item.price).toFixed(2) : "0.00"}</p>

          <div className="llQuantity">
            <button 
              type="button" 
              onClick={handleDecrement} 
              disabled={loading}
              aria-label="Decrease quantity"
            >
              −
            </button>
            <input 
              type="text"
              value={quantity} 
              readOnly 
              aria-label="Current Quantity selection" 
            />
            <button 
              type="button" 
              onClick={handleIncrement} 
              disabled={loading}
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
        </div>

        {/* ACTIONS PANEL */}
        <div className="ll-actions">
          <button 
            className="action-delete-btn"
            disabled={loading} 
            onClick={handleDelete}
            aria-label="Remove item completely"
          >
            <BsX size={24} />
          </button>

          <button
            className={`action-save-btn ${quantity !== initialQuantity ? "pending-save" : ""}`}
            onClick={handleUpdate}
            disabled={loading || quantity === initialQuantity}
            aria-label="Save updated item count"
          >
            <BsBookmarkHeart size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default LikeItem;