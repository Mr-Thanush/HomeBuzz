import Order from '../Models/orderModel.js';
import Product from '../Models/productModel.js';
import User from '../Models/userModel.js';
import handleError from '../utils/handleError.js';
import asyncErrors from '../MiddleWare/asyncErrors.js';

//Create New Order
export const createNewOrder = asyncErrors(async (req, res, next) => {
  const { shippingInfo, orderItems, paymentInfo, itemPrice, taxPrice, shippingPrice, totalPrice } = req.body;

  // Basic validation
  if (!shippingInfo || !orderItems || orderItems.length === 0) {
    return next(new handleError("Shipping info and order items are required", 400));
  }

  // Default COD if paymentInfo is missing
  const payment = paymentInfo || { id: "COD", status: "Success" };

  // Create order
  const order = await Order.create({
    shippingInfo,
    orderItems: orderItems.map(item => ({
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      image: item.image,
      product: item.product || item._id, // Support frontend _id
    })),
    paymentInfo: {
      id: payment.id,
      status: payment.status,
    },
    itemPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paidAt: Date.now(),
    user: req.user._id
  });

  // Reduce stock for each product
  await Promise.all(order.orderItems.map(item => updateQuantity(item.product, item.quantity)));

  res.status(201).json({
    success: true,
    order
  });
});

// Helper function to update stock
async function updateQuantity(id, quantity) {
  const product = await Product.findById(id);
  if (!product) {
    throw new handleError("Product not found", 404);
  }
  product.stock -= quantity;
  await product.save({ validateBeforeSave: false });
}
//Getting Single Order Details
export const singleOrderDetails=asyncErrors(async(req,res,next)=>{
const order=await Order.findById(req.params.id).populate("user","name email");
if(!order){
    return next(new handleError("No order found ",404));
}
res.status(200).json({
        success:true,
        order
    })
})

//All My Orders
export const allMyOrderDetails=asyncErrors(async(req,res,next)=>{
    const orders=await Order.find({user:req.user._id})
    if(!orders){
    return next(new handleError("No order found ",404));
    }
    res.status(200).json({
        success:true,
        orders
    })
})


// All Orders 
export const allOrderDetails = asyncErrors(async (req, res, next) => {
  const orders = await Order.find()
    .populate("user", "name email") 
    .populate("orderItems.product", "name brand image"); 

  if (!orders || orders.length === 0) {
    return next(new handleError("No orders found", 404));
  }

  let totalAmount = 0;
  orders.forEach((order) => {
    totalAmount += order.totalPrice;
  });

  res.status(200).json({
    success: true,
    orders,
    totalAmount,
  });
});

//Update Order Status
export const updateOrderStatus=asyncErrors(async(req,res,next)=>{
   const order=await Order.findById(req.params.id);
   if(!order){
    return next(new handleError("No order found ",404));
    }
    if(order.orderStatus==="Delivered"){
    return next(new handleError("This Order is Already been Delivered",404));
    }
    await Promise.all(order.orderItems.map(item=>updateQuantity(item.product,item.quantity)))
    order.orderStatus=req.body.status;
    if(order.orderStatus==="Delivered"){
        order.deliveredAt=Date.now();
    }
    await order.save({validateBeforeSave:false})
 res.status(200).json({
        success:true,
        order
       
    })

})

//Delete Order 
export const deleteOrder=asyncErrors(async(req,res,next)=>{
   const order=await Order.findById(req.params.id);
   if(!order){
    return next(new handleError("No order found ",404));
    }
    if(order.orderStatus!=="Delivered"){
        return next(new handleError("This order is under processing and cannot be deleted",404))
    }
    await deleteOne({_id:req.params.id})
 res.status(200).json({
        success:true,
        message:"Oreder deleted Successfully"
    })
})


