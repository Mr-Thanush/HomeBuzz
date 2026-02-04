import React, { useState, useEffect } from "react";
import "./store.css";
import ItemDashboard from "./itemsDashboard";
import ItemsManagement from "./ItemManagement";
import OrdersManagement from "./orderManagement";
import StoreSettings from "./storeSettings";

function Store() {
  const [activeTab, setActiveTab] = useState("dashboard");

  // Global store data
  const [store, setStore] = useState(null);
  const [items, setItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch store info, items, and orders
  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        setLoading(true);

        // Fetch store info
        const storeRes = await fetch("http://localhost:9090/api/v1/store/me", {
          credentials: "include",
        });
        if (!storeRes.ok) throw new Error("Failed to fetch store info");
        const storeData = await storeRes.json();
        setStore(storeData.store);

        // Fetch store items
        const itemsRes = await fetch(
          "http://localhost:9090/api/v1/seller/products",
          { credentials: "include" }
        );
        if (!itemsRes.ok) throw new Error("Failed to fetch items");
        const itemsData = await itemsRes.json();
        setItems(itemsData.products);

        // Fetch store orders
        const ordersRes = await fetch(
          `http://localhost:9090/api/v1/store/${storeData.store._id}/orders`,
          { credentials: "include" }
        );
        if (!ordersRes.ok) throw new Error("Failed to fetch orders");
        const ordersData = await ordersRes.json();
        setOrders(ordersData.orders || []);

      } catch (error) {
        console.error("Failed to fetch store data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStoreData();
  }, []);

  if (loading) return <h2>Loading store data...</h2>;
  if (!store) return <h2>No store found. Please create your store first.</h2>;

  return (
    <div className="storeForSellers">
      {/* Navigation */}
      <div className="storeNav">
        <button
          className={activeTab === "dashboard" ? "active" : ""}
          onClick={() => setActiveTab("dashboard")}
        >
          Dashboard
        </button>
        <button
          className={activeTab === "items" ? "active" : ""}
          onClick={() => setActiveTab("items")}
        >
          Items
        </button>
        <button
          className={activeTab === "orders" ? "active" : ""}
          onClick={() => setActiveTab("orders")}
        >
          Orders
        </button>
        <button
          className={activeTab === "settings" ? "active" : ""}
          onClick={() => setActiveTab("settings")}
        >
          Store Settings
        </button>
      </div>

      {/* Content */}
      <div className="storeContent">
        {activeTab === "dashboard" && (
          <ItemDashboard store={store} items={items} orders={orders} />
        )}
        {activeTab === "items" && <ItemsManagement store={store} items={items} />}
        {activeTab === "orders" && (
          <OrdersManagement
            store={store}
            orders={orders}
            setOrders={setOrders} // pass setOrders so dashboard updates
          />
        )}
        {activeTab === "settings" && <StoreSettings store={store} />}
      </div>
    </div>
  );
}

export default Store;