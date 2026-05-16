import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Navbar from '../Components/navBar';
import PageTitle from "../Components/pageTitle";
import "../Styles/orderDetails.css";
import { getOrderDetails, removeErrors } from "../Components/features/Orders/orderSlice";
import { toast } from "react-toastify";

function OrderDetails() {
  const { orderId } = useParams();
  const dispatch = useDispatch();

  const { order, loading, error } = useSelector((state) => state.order);

  
  
  useEffect(() => {
    dispatch(getOrderDetails(orderId));
    if (error) {
      toast.error(error, { position: "top-center",autoClose: 3000 });
      dispatch(removeErrors());
    } 
  }, [dispatch, orderId, error]);

  if (loading) {
    return <p className="order-loading">Loading order details...</p>;
  }

  if (!order) return null;

  

  return (
    <>
      <Navbar />
      <PageTitle title="Order Details - HomeBuzz" />

      <div className="order-details-page">
      
        <section className="order-section">
          <h2>Order Status</h2>
         {order?.orderStatus && 
         ( <span className={`status-badge ${order.orderStatus.toLowerCase()}`}>
            {order.orderStatus}
          </span>
        )}
        </section>

        
        <section className="order-section">
          <h2>Items</h2>
          <div className="items-list">
            {order?.orderItems?.map((item, index) => (
              <div className="item-row" key={index}>
                <div>
                  <p className="item-name">{item.name}</p>
                  <p className="item-qty">Qty: {item.quantity}</p>
                </div>
                <span className="item-price">₹{item.price}</span>
              </div>
            ))}
          </div>
        </section>

        
        <section className="order-section">
          <h2>Shipping Address:</h2>
          <p> {order.shippingInfo.address}</p>
          <p>
            {order.shippingInfo.city}, {order.shippingInfo.state} -{" "}
            {order.shippingInfo.pincode}
          </p>
          <p>Phone: {order.shippingInfo.phoneNo}</p>
        </section>

        
        <section className="order-section">
          <h2>Payment</h2>
          <p>Method: {order.paymentInfo.id}</p>
          <p className={order?.paymentInfo?.status==="pending"?"pending":"paid"}>Status: {order?.paymentInfo?.status}</p>
        </section>

 <section className="order-section price-box">
          <div>
            <span>Items</span>
            <span>₹{order.itemPrice.toFixed(2)}</span>
          </div>
          <div>
            <span>Tax</span>
            <span>₹{order.taxPrice.toFixed(2)}</span>
          </div>
          <div>
            <span>Shipping</span>
            <span>₹{order.shippingPrice.toFixed(2)}</span>
          </div>
          <div className="price-total">
            <span>Total</span>
            <span>₹{order.totalPrice.toFixed(2)}</span>
          </div>
        </section> 
      </div>
    </>
  );
}

export default OrderDetails;