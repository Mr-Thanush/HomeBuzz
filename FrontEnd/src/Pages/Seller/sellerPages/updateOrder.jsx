import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import PageTitle from "../../../Components/pageTitle";
import Loader from "../../../Components/loader";
import { updateOrder, removeErrors, removeSuccess } from "../../../Components/features/AdminSeller/sellerSlice";
import { getOrderDetails } from "../../../Components/features/Orders/orderSlice";

export default function OrderUpdate() {
  const { orderId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [status, setStatus] = useState("Processing");
  const [trackingId, setTrackingId] = useState("");
  
  const { order, loading: orderLoading } = useSelector(state => state.order || {});
  const { success, error, loading: sellerLoading } = useSelector(state => state.seller || {});

  const loading = orderLoading || sellerLoading;
  
  useEffect(() => {
    if (orderId) { 
      dispatch(getOrderDetails(orderId));
    }
  }, [dispatch, orderId]);

  useEffect(() => {
    if (order) {
      setStatus(order.orderStatus || "Processing");
      setTrackingId(order.trackingId || "");
    }
  }, [order]);

  const handleUpdate = () => {
    if (!status) return toast.error("Fulfillment mapping status must possess an explicitly configured state value.");
    dispatch(updateOrder({ orderId, status, trackingId }));
  };

  useEffect(() => {
    if (error) {
      toast.error(error, { position: "top-center", autoClose: 3000 });
      dispatch(removeErrors());
    }
    if (success) {
      toast.success("Pipeline structural modifications committed successfully.", { position: "top-center", autoClose: 3000 });
      dispatch(removeSuccess());
      dispatch(getOrderDetails(orderId));
      navigate("/seller/orders");
    }
  }, [dispatch, error, success, orderId, navigate]);
  
  if (loading || !order?._id) return <Loader />;

  return (
    <>
      <PageTitle title="Update Order State" />
      <section className="form-workspace-centering">
        <div className="structured-form-card state-extended-card">
          <h1 className="form-workspace-title">Modify Dispatch Fulfillment</h1>
          <p className="form-workspace-subtitle">Update item statuses, append carrier logs, and review structural customer specs.</p>

          <div className="meta-read-only-section">
            <h3 className="meta-section-headline">Identity Metrics</h3>
            <div className="meta-data-lines-stack">
              <p><span>Order Token:</span> <span className="font-mono">{order._id}</span></p>
              <p><span>Client Name:</span> {order.user?.name || "Anonymous User"}</p>
              <p><span>Destination:</span> {order.shippingInfo?.address}, {order.shippingInfo?.city}, <b>{order.shippingInfo?.pincode}</b>, {order.shippingInfo?.state}</p>
              <p><span>Contact Endpoint:</span> {order.shippingInfo?.phoneNo}</p>
              <p><span>Escrow Clearance:</span> {order.paymentInfo?.status}</p>
              <p><span>Gross Settlement:</span> ₹{(order.totalPrice || 0).toFixed(2)}</p>
            </div>
          </div>

          <div className="meta-read-only-section">
            <h3 className="meta-section-headline">Manifest Package Breakdown</h3>
            <div className="manifest-items-list">
              {order.orderItems?.map((product) => (
                <div className="manifest-item-node" key={product._id}>  
                  <div className="manifest-node-line">
                    <span className="node-bold-name">{product.name}</span>
                    <span className="node-qty-badge">×{product.quantity} Pack(s)</span>
                  </div>
                  <div className="node-secondary-cost">Settlement Unit Cost: ₹{product.price}</div>
                </div>
              ))}
            </div>
          </div>

          <form className="modern-fluid-form" onSubmit={(e) => e.preventDefault()}>
            <div className="input-group-node">
              <label htmlFor="orderStatusSelect">Fulfillment Stage Progression</label>
              <select id="orderStatusSelect" value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="Processing">Processing In Storehouse</option>
                <option value="Shipped">Dispatched To Carrier Route</option>
                <option value="Delivered">Delivered To Customer Destination</option>
                <option value="Cancelled">Voided / Cancelled</option>
              </select>
            </div>

            <div className="input-group-node">
              <label htmlFor="trackingIdInput">Carrier Reference ID</label>
              <input id="trackingIdInput" type="text" placeholder="Awaiting tracking number allocation..." value={trackingId} onChange={(e) => setTrackingId(e.target.value)} />
            </div>

            <button className="form-action-submit-btn update-tint-btn" type="button" onClick={handleUpdate} disabled={loading}>
              {loading ? "Modifying Operational Registry..." : "Commit Fulfillment Changes"}
            </button>
          </form>
        </div>
      </section>
    </>
  );
}