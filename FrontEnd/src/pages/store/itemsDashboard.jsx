import React, { useState, useMemo } from "react";
import './store.css';

function ItemDashboard({ store, items, orders }) {
    // Metric periods
    const [earningsPeriod, setEarningsPeriod] = useState("monthly");
    const [ordersPeriod, setOrdersPeriod] = useState("monthly");
    const [soldPeriod, setSoldPeriod] = useState("monthly");

    // Calculate metrics dynamically
    const metrics = useMemo(() => {
        // Filter only delivered orders
        const deliveredOrders = orders.filter(order => order.orderStatus === "Delivered");

        // Total earnings from delivered orders
        const totalEarnings = deliveredOrders.reduce((sum, order) => {
            return sum + order.orderItems.reduce((s, item) => s + (item.price || 0) * (item.quantity || 0), 0);
        }, 0);

        // Total sold items
        const totalSold = deliveredOrders.reduce((sum, order) => {
            return sum + order.orderItems.reduce((s, item) => s + (item.quantity || 0), 0);
        }, 0);

        // Total orders (delivered)
        const totalOrders = deliveredOrders.length;

        // Split by period (dummy calculation)
        return {
            earnings: {
                monthly: Math.floor(totalEarnings / 12),
                weekly: Math.floor(totalEarnings / 52),
                yearly: totalEarnings,
            },
            orders: {
                monthly: Math.floor(totalOrders / 12),
                weekly: Math.floor(totalOrders / 52),
                yearly: totalOrders,
            },
            sold: {
                monthly: Math.floor(totalSold / 12),
                weekly: Math.floor(totalSold / 52),
                yearly: totalSold,
            }
        };
    }, [orders]);

    return (
        <div className="dashboard">
            {/* Store Details */}
            <div className="storeDetails">
                <img src={store.logo || "/default.jpg"} alt="Store Logo" className="StoreLogo"/>
                <h1 className="storeName">{store.name}</h1>
                <h3 className="storeEmail">{store.email}</h3>
                <h3 className="storeCategory">Category: {store.category}</h3>
                <h3 className="storeCreatedDate">Created: {new Date(store.createdAt).toLocaleDateString()}</h3>
                <h3 className="StoreAbout">{store.description}</h3>
            </div>

            <hr className="divider"/>

            {/* Dashboard Metrics */}
            <h3>Dashboard Metrics</h3>
            <div className="metrics">
                <div className="metric">
                    <select
                        className="earningsOptions"
                        value={earningsPeriod}
                        onChange={(e) => setEarningsPeriod(e.target.value)}
                    >
                        <option value="monthly">Monthly Earnings</option>
                        <option value="weekly">Weekly Earnings</option>
                        <option value="yearly">Yearly Earnings</option>
                    </select>
                    <p className="paragraphForStore">₹{metrics.earnings[earningsPeriod]}</p>
                </div>

                <div className="metric">
                    <select
                        className="ordersOptions"
                        value={ordersPeriod}
                        onChange={(e) => setOrdersPeriod(e.target.value)}
                    >
                        <option value="monthly">Monthly Orders</option>
                        <option value="weekly">Weekly Orders</option>
                        <option value="yearly">Yearly Orders</option>
                    </select>
                    <p className="paragraphForStore">{metrics.orders[ordersPeriod]}</p>
                </div>

                <div className="metric">
                    <select
                        className="SoldOptions"
                        value={soldPeriod}
                        onChange={(e) => setSoldPeriod(e.target.value)}
                    >
                        <option value="monthly">Monthly Sold Items</option>
                        <option value="weekly">Weekly Sold Items</option>
                        <option value="yearly">Yearly Sold Items</option>
                    </select>
                    <p className="paragraphForStore">{metrics.sold[soldPeriod]}</p>
                </div>
            </div>
        </div>
    );
}

export default ItemDashboard;