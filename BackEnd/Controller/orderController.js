 import Product from "../Models/productModel.js";
 import User from "../Models/userModel.js";
 import handleAsyncError from "../middleWare/handleAsyncError.js";
 import handleError from "../utils/handleError.js";
 import Order from "../Models/orderModel.js";

 //CREATE NEW ORDER
 export const createNewOrder= handleAsyncError(async(req,res,next)=>{
    const {shippingInfo,orderItems,paymentInfo,itemPrice,taxPrice,shippingPrice,totalPrice}=req.body;

    const order=await Order.create({
        shippingInfo,
        orderItems,
        paymentInfo,
        itemPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paidAt:Date.now(),
        user:req.user._id
    })

    res.status(201).json({
        success:true,
        order
    })
 })

//GET SINGLE ORDER
export const getSingleOrder=handleAsyncError(async(req,res,next)=>{
    const order= await Order.findById(req.params.id).populate("user","name email");

    if(!order){
        return next(new handleError("No Order Found With This Id",404));
    }
    res.status(200).json({
        success:true,
        order
    })
})

//ALL MY ORDERS
export const allMyOrders=handleAsyncError(async(req,res,next)=>{
    const orders=await Order.find({user:req.user._id});

    if(!orders){
        return next(new handleError("No Order Found",404));
    }
    res.status(200).json({
        success:true,
        orders
    })
})

//GET ALL ORDERS (ADMIN,SELLER)
export const getAllOrders=handleAsyncError(async(req,res,next)=>{
    const orders=await Order.find();

    let totalAmount=0;
    orders.forEach(order=>{
        totalAmount+=order.totalPrice;
    })

    if(!orders){
        return next(new handleError("No Order Found",404));
    }
    res.status(200).json({
        success:true,
        orders,
        totalAmount 
    })
})

//UPDATE ORDER STATUS (SELLER)
export const updateOrderStatus=handleAsyncError(async(req,res,next)=>{
    const order=await Order.findById(req.params.id);
    if(!order){
        return next(new handleError("No Order Found ",404));
    }
    if(order.orderStatus==="Delivered"){
        return next(new handleError("Order is already delivered",404));
    }
    await Promise.all(order.orderItems.map(item=>updateQunantity(item.product,item.quantity)));

    order.orderStatus=req.body.status; 
    order.trackingId = req.body.trackingId;

    if(req.body.status==="Delivered"){
        order.deliveredAt=Date.now();
    }

    await order.save({validateBeforeSave:false});

    res.status(200).json({
        success:true,
        order
    })
})

async function updateQunantity(id, quantity) {
  const product = await Product.findById(id);
  if (!product) {
    throw new Error("Product not found");
  }
  product.stock = Math.max(0, product.stock - quantity);
  await product.save({ validateBeforeSave: false });
}

//DELETE ORDER (ADMIN,SELLER)
export const deleteOrder=handleAsyncError(async(req,res,next)=>{
    const order=await Order.findById(req.params.id);
    if(!order){
        return next(new handleError("No Order Found ",404));
    }
    if(order.orderStatus!=="Delivered"){
        return next(new handleError("Only delivered orders can be deleted",404)); 
    }
    await order.deleteOne({ _id: req.params.id });

    res.status(200).json({
        success:true,
        message:"Order Deleted Successfully"
    })
})