import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { FaEdit } from 'react-icons/fa';
import { BsTrash } from 'react-icons/bs';
import { toast } from "react-toastify";
import PageTitle from "../../../Components/pageTitle";
import Loader from '../../../Components/loader';
import { deleteOrder, fetchAllOrders, removeErrors, removeMessage, removeSuccess } from '../../../Components/features/AdminSeller/sellerSlice';

export default function AllOrders() {
  const dispatch = useDispatch();
  const { orders = [], loading, error, success, message } = useSelector(state => state.seller || {});
  
  useEffect(() => {
    dispatch(fetchAllOrders());
  }, [dispatch]);

  const handleDelete = (id) => {
    if (window.confirm("Are you completely certain you want to permanently purge this order entry?")) {
      dispatch(deleteOrder(id));
    }
  };

  useEffect(() => {
    if (error) {
      toast.error(error, { position: "top-center", autoClose: 3000 });
      dispatch(removeErrors());
    }
    if (success) {
      toast.success(message || "Operation resolved successfully.", { position: "top-center", autoClose: 3000 });
      dispatch(removeSuccess());
      dispatch(removeMessage());
      dispatch(fetchAllOrders());
    }
  }, [dispatch, error, success, message]);

  if (loading) return <Loader />;

  return (
    <>
      <PageTitle title="Seller All Orders" />
      <section className="seller-view-wrapper">
        <div className="view-header-row">
          <h1 className="view-main-title">Incoming Storefront Orders</h1>
          <p className="view-subtitle">Manage customer shipment pipelines, log parameters, and trace states.</p>
        </div>

        {orders.length === 0 ? (
          <div className="empty-catalog-fallback">
            <p>No consumer order entities found mapping to your store profile tokens.</p>
          </div>
        ) : (
          <div className="table-responsive-container">
            <table className="modern-data-table">
              <thead>
                <tr>
                  <th>Order Reference</th>
                  <th>Date Recorded</th>
                  <th>Items Count</th>
                  <th>Shipment Endpoint</th>
                  <th>Financial Pipeline</th>
                  <th>Fulfillment Phase</th>
                  <th>Total Due</th>
                  <th className="action-column-header">Operations</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => {
                  const statusNormalized = order.orderStatus?.toLowerCase() || "";
                  const payStatusNormalized = order.paymentInfo?.status?.toLowerCase() || "";
                  
                  return (
                    <tr key={order._id}>
                      <td className="font-mono-bold">{order._id}</td>
                      <td>{order.orderedAt ? new Date(order.orderedAt).toLocaleDateString() : "N/A"}</td>
                      <td>{order.orderItems?.length || 0} Pack(s)</td>
                      <td><div className="location-cell-text">{order.shippingInfo?.state || "N/A"}</div></td>
                      <td>
                        <span className={`ui-status-pill ${payStatusNormalized === "paid" ? "state-success" : "state-pending"}`}>
                          {order.paymentInfo?.status || "Processing"}
                        </span>
                      </td>
                      <td>
                        <span className={`ui-status-pill ${statusNormalized === "delivered" ? "state-success" : "state-pending"}`}>
                          {order.orderStatus || "Processing"}
                        </span>
                      </td>
                      <td className="font-weight-bold">₹{(order.totalPrice || 0).toFixed(2)}</td>
                      <td>
                        <div className="action-icon-flex-group">
                          <Link to={`/seller/order/${order._id}`} className="operation-action-btn edit-tint" title="Modify State">
                            <FaEdit size={14} />
                          </Link>
                          <button className="operation-action-btn delete-tint" onClick={() => handleDelete(order._id)} title="Purge Record">
                            <BsTrash size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}