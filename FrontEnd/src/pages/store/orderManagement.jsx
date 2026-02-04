import React, { useState, useEffect } from "react";
import "./store.css";
import API_URL from "../../api";

function OrdersManagement({ store, orders, setOrders }) {
  const [loading, setLoading] = useState(true);

  // Fetch seller's orders
  useEffect(() => {
    if (!store) return;

    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_URL}/api/v1/seller/orders`, {
          credentials: "include",
        });
        const data = await res.json();
        if (data.success) setOrders(data.orders || []);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [store, setOrders]);

  // Update order status
  const updateStatus = async (id, newStatus) => {
    try {
      const res = await fetch(`${API_URL}/api/v1/seller/order/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        // Update state in parent and locally
        setOrders((prev) =>
          prev.map((order) =>
            order._id === id ? { ...order, orderStatus: newStatus } : order
          )
        );
      }
    } catch (err) {
      console.error(err);
      alert("Failed to update order status");
    }
  };

  // Delete order
  const deleteOrder = async (id) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;
    try {
      const res = await fetch(`${API_URL}/api/v1/seller/order/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setOrders((prev) => prev.filter((order) => order._id !== id));
      }
    } catch (err) {
      console.error(err);
      alert("Failed to delete order");
    }
  };

  if (loading) return <h3>Loading orders...</h3>;
  if (!orders || orders.length === 0) return <h3>No orders found.</h3>;

  return (
    <div className="ordersManagement">
      <h3>Manage Orders</h3>
      {orders.map((order) => (
        <div key={order._id} className="orderCard">
          <h4>Order ID: {order._id}</h4>
          <p>Customer: {order.user?.name || "Unknown"}</p>
          <p>Status: {order.orderStatus}</p>

          {order.orderItems.map((item) => (
            <div key={item.product} className="orderItem">
              <img
                src={item.image || "/placeholder.png"}
                alt={item.name}
                className="orderItemImg"
              />
              <div className="orderItemInfo">
                <h5>{item.name}</h5>
                <p>Qty: {item.quantity}</p>
                <p>Price: ₹{item.price}</p>
              </div>
            </div>
          ))}

          <div className="orderBtns">
            {order.orderStatus !== "Delivered" && (
              <button onClick={() => updateStatus(order._id, "Delivered")}>
                Mark Delivered
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