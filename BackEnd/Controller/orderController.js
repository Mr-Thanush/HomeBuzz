import Product from "../Models/productModel.js";
import handleAsyncError from "../middleWare/handleAsyncError.js";
import handleError from "../utils/handleError.js";
import Order from "../Models/orderModel.js";
import { mysqlPool } from "../config/db.js";

// Helper function to hydrate MySQL user profile data onto an order document
const hydrateUserForOrder = async (order) => {
    if (!order || !order.user) return order;
    
    const [users] = await mysqlPool.query("SELECT id, name, email FROM users WHERE id = ?", [order.user]);
    const userRow = users[0];

    if (userRow) {
        const oObj = order.toObject ? order.toObject() : order;
        oObj.user = { _id: userRow.id, id: userRow.id, name: userRow.name, email: userRow.email };
        return oObj;
    }
    return order;
};

// Create New Order
export const createNewOrder = handleAsyncError(async (req, res, next) => {
    const { shippingInfo, orderItems, paymentInfo, itemPrice, taxPrice, shippingPrice, totalPrice } = req.body;

    const order = await Order.create({
        shippingInfo,
        orderItems,
        paymentInfo,
        itemPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paidAt: Date.now(),
        user: req.user.id // Explicit link to tracking integer row
    });

    res.status(201).json({
        success: true,
        order
    });
});

// Get Single Order
export const getSingleOrder = handleAsyncError(async (req, res, next) => {
    const order = await Order.findById(req.params.id);
    if (!order) {
        return next(new handleError("No Order Found With This Id", 404));
    }

    const hydratedOrder = await hydrateUserForOrder(order);

    res.status(200).json({
        success: true,
        order: hydratedOrder
    });
});

// All My Orders
export const allMyOrders = handleAsyncError(async (req, res, next) => {
    const orders = await Order.find({ user: req.user.id });
    if (!orders || orders.length === 0) {
        return next(new handleError("No Orders Found", 404));
    }

    res.status(200).json({
        success: true,
        orders
    });
});

// Get All Orders (Admin/Seller Overview)
export const getAllOrders = handleAsyncError(async (req, res, next) => {
    const orders = await Order.find();
    if (!orders || orders.length === 0) {
        return next(new handleError("No Orders Found", 404));
    }

    let totalAmount = 0;
    orders.forEach(order => { totalAmount += order.totalPrice; });

    res.status(200).json({
        success: true,
        orders,
        totalAmount
    });
});

// Update Order Status
export const updateOrderStatus = handleAsyncError(async (req, res, next) => {
    const order = await Order.findById(req.params.id);
    if (!order) return next(new handleError("No Order Found", 404));
    
    if (order.orderStatus === "Delivered") {
        return next(new handleError("Order is already delivered", 400));
    }
    
    await Promise.all(order.orderItems.map(item => updateQuantity(item.product, item.quantity)));

    order.orderStatus = req.body.status;
    order.trackingId = req.body.trackingId;

    if (req.body.status === "Delivered") {
        order.deliveredAt = Date.now();
    }

    await order.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true,
        order
    });
});

async function updateQuantity(id, quantity) {
    const product = await Product.findById(id);
    if (!product) throw new Error("Product not found");
    
    product.stock = Math.max(0, product.stock - quantity);
    await product.save({ validateBeforeSave: false });
}

// Delete Order
export const deleteOrder = handleAsyncError(async (req, res, next) => {
    const order = await Order.findById(req.params.id);
    if (!order) return next(new handleError("No Order Found", 404));

    if (order.orderStatus !== "Delivered") {
        return next(new handleError("Only delivered orders can be deleted", 400));
    }
    
    await order.deleteOne();

    res.status(200).json({
        success: true,
        message: "Order Deleted Successfully"
    });
});