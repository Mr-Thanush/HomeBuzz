import { useDispatch, useSelector } from 'react-redux';
import Navbar from '../../../Components/navBar';
import PageTitle from "../../../Components/pageTitle";
import Loader from '../../../Components/loader';
import { useEffect } from 'react';
import { deleteOrder, fetchAllOrders, removeErrors, removeMessage, removeSuccess } from '../../../Components/features/AdminSeller/sellerSlice';
import { Link, useNavigate } from 'react-router-dom';
import { FaEdit } from 'react-icons/fa';
import { BsTrash } from 'react-icons/bs';
import '../seller.css'
import { toast } from "react-toastify";


export default function AllOrders() {
  const {orders,loading,error,success,message}=useSelector(state=>state.seller);
  const dispatch=useDispatch();
  const navigate=useNavigate();
  
  useEffect(()=>{
   dispatch(fetchAllOrders());
  },[dispatch]);


  const handleDelete=(id)=>{
    const confirm=window.confirm("Are You Sure You Want to Delete This Order?");

    if(confirm){
      dispatch(deleteOrder(id))
    }

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
      toast.success(message, {
        position: "top-center",
        autoClose: 3000,
      });
      dispatch(removeSuccess());
      dispatch(removeMessage());
      dispatch(fetchAllOrders());
    }
  }, [dispatch, error,success,message]);



  if (loading) {
    return <Loader />;
  }

  if (!loading && orders?.length === 0) {
    return(
      <>
      <Navbar/>
      <div className="noOrders">
        <p>No Orders Found</p>
      </div>
      </>
    )
  }
  

  return (
    <>
    <Navbar/>
    <PageTitle title="Seller All Orders"/>
    <section className="seller-page">
      <h1>All Orders</h1>

     {orders.map((order)=>(
      <div className="seller-card" key={order._id}>
        <p><b>Order ID:</b>{order._id}</p>
        <p className={order.orderStatus?.toLowerCase()==="delivered" ? "orderPaid":"orderProcessing"}><b>Status:</b>{order.orderStatus}</p>
        <p className={order.paymentInfo?.status?.toLowerCase()==="paid"? "orderPaid":"orderProcessing"}><b>Payment:</b>{order.paymentInfo?.status}</p>
        <p><b>Order Date:</b>{new Date(order.orderedAt).toLocaleDateString()}</p>
        <p><b>Number Of Items:</b>{order.orderItems.length}</p>
        <p><b>Total:</b>₹{order.totalPrice.toFixed(2)}</p>
        <p><b>Shipping Info:</b>{order.shippingInfo.state}</p>
        <div className="ordersBtns">
         <Link to={`/seller/order/${order._id}`}><button className='orderBtn'><FaEdit size={16} /></button></Link>
        <button className='orderBtn' onClick={()=>handleDelete(order._id)}><BsTrash size={16} /></button>
        </div>
      </div>
     )) }
    </section>
    </>
  );
}
