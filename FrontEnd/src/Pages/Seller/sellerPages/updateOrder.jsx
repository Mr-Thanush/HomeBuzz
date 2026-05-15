import { useState } from "react";
import "../seller.css";
import Navbar from '../../../Components/navBar';
import PageTitle from "../../../Components/pageTitle";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { updateOrder,removeErrors ,removeSuccess } from "../../../Components/features/AdminSeller/sellerSlice";
import { useNavigate, useParams } from "react-router-dom";
import { getOrderDetails } from "../../../Components/features/Orders/orderSlice";
import { toast } from "react-toastify";
import Loader from "../../../Components/loader";

export default function OrderUpdate() {
  const {orderId}=useParams();
  const [status, setStatus] = useState("Processing");
  const [trackingId, setTrackingId] = useState("");
  const dispatch=useDispatch();
  const navigate=useNavigate();
  const {order,loading:orderLoading}=useSelector(state=>state.order);
  const {success,error,loading:sellerLoading}=useSelector(state=>state.seller);

  console.log(order);
  
  const loading=orderLoading||sellerLoading;
  
  useEffect(()=>{
    if(orderId){ 
        dispatch(getOrderDetails(orderId))
    }
  },[dispatch,orderId]);

 

 const handleUpdate=()=>{
    if(!status){
        toast.error("Please Select Status",{
        position: "top-center",
        autoClose: 3000,
      })
      return;
    }
     dispatch(updateOrder({orderId,status,trackingId}));
 }

 useEffect(() => {
     if (error) {
       toast.error(error, {
         position: "top-center",
         autoClose: 3000,
       });
       dispatch(removeErrors());
     }
     if (success) {
       toast.success("Order Status Updated Successfully", {
         position: "top-center",
         autoClose: 3000,
       });
       dispatch(removeSuccess());
       dispatch(getOrderDetails(orderId))
       navigate("/seller/orders");
     }
   }, [dispatch, error,success,orderId]);
  
    if (loading || !order?.user) {
    return <Loader />;
  }
  return (
    <>
  {loading?(<Loader/>):(
    <>
    <Navbar/>
    <PageTitle title="update Order"/>
    <div className="orderUpdatePage">
      <div className="orderCard">
        <h2 className="orderTitle">Update Order</h2>

    <div className="orderInfo">
        <h2 className="orderItems"> Order Details</h2>     
        <p><span>Order ID:</span>{order._id}</p>
        <p><span>Customer:</span>{order.user.name}</p>
        <p><span>Address:</span>{order.shippingInfo.address},{order.shippingInfo.city},<b>{order.shippingInfo.pincode}</b>,{order.shippingInfo.state}</p>
        <p><span>Mobile No.:</span>{order.shippingInfo.phoneNo}</p>
        <p><span>Payment:</span> {order.paymentInfo.status}</p>
        <p><span>Order Date:</span>{order.orderedAt.slice(0,10)}</p>
        <p><span>Order Status:</span>{order.orderStatus}</p> 
        <p><span>Total:</span>₹{order.totalPrice.toFixed(2)}</p>
    </div>
    

        <div className="orderInfo">
            <h2 className="orderItems"> Order Items</h2>     
            {order.orderItems.map((product)=>(
                <div className="product" key={product._id}>  
           <p><span>ProductName:</span>{product.name}</p>
          <p><span>Price:</span>{product.price}</p>
          <p><span>Quantity:</span>{product.quantity}</p>
               <hr/>
                </div>
            ))}
        </div>

        <form className="orderForm">
          <div className="formGroup">
            <label>Order Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <div className="formGroup">
            <label>Tracking ID</label>
            <input
              type="text"
              placeholder="Enter tracking number"
              value={trackingId}
              onChange={(e) => setTrackingId(e.target.value)}
            />
          </div>

          <button className="updateBtn" type="button" onClick={handleUpdate}>
           {loading ? "Updating..." : "Update Order"}
          </button>
        </form>
      </div>
    </div>
    </>)}
    </>
  );
}