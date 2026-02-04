import React, { useState, useEffect } from "react";
import './order.css';


function OrdersManagement() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch orders from backend
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await fetch("http://localhost:9090/api/v1/store/orders", {
          credentials: "include",
        });
        const data = await res.json();
        if (data.success) setOrders(data.orders);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Update order status
  const updateStatus = async (id, newStatus) => {
    try {
      const res = await fetch(`http://localhost:9090/api/v1/seller/order/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setOrders((prev) =>
          prev.map((order) =>
            order._id === id ? { ...order, orderStatus: newStatus } : order
          )
        );
      } else {
        alert("Failed to update status: " + (data.message || "Unknown error"));
      }
    } catch (error) {
      console.error("Update status error:", error);
      alert("Something went wrong!");
    }
  };

  // Delete order
  const deleteOrder = async (id) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;
    try {
      const res = await fetch(`http://localhost:9090/api/v1/seller/order/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setOrders((prev) => prev.filter((order) => order._id !== id));
      } else {
        alert("Failed to delete order: " + (data.message || "Unknown error"));
      }
    } catch (error) {
      console.error("Delete order error:", error);
      alert("Something went wrong!");
    }
  };

  if (loading) return <h3>Loading orders...</h3>;
  if (orders.length === 0) return <h3>No orders found.</h3>;

  return (
    <div className="ordersManagement">
      <h3>Manage Orders</h3>
      {orders.map((order) => (
        <div key={order._id} className="orderCard">
          <p>Customer: {order.user?.name || "N/A"}</p>
          <p>Email: {order.user?.email || "N/A"}</p>
          <p>Status: {order.orderStatus}</p>

          <div className="orderItems">
            {order.orderItems.map((item) => (
              <div key={item.product} className="orderItemCard">
                <img src={item.image} alt={item.name} />
                <p>{item.name}</p>
                <p>Qty: {item.quantity}</p>
                <p>Price: ₹{item.price}</p>
              </div>
            ))}
          </div>

          <div className="orderBtns">
            {order.orderStatus !== "Delivered" && (
              <button onClick={() => updateStatus(order._id, "Shipped")}>
                Mark Shipped
              </button>
            )}
            <button onClick={() => deleteOrder(order._id)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default OrdersManagement;