import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import PageTitle from "../../../Components/pageTitle";
import Loader from "../../../Components/loader";
import { fetchSellerRequests, approveSeller, rejectSeller, removeErrors, removeSuccess } from "../../../Components/features/AdminSeller/adminSlice";

export default function SellerRequests() {
  const dispatch = useDispatch();
  const { loading, sellerRequests = [], error } = useSelector((state) => state.admin || {});

  useEffect(() => {
    dispatch(fetchSellerRequests());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(removeErrors());
    }
  }, [error, dispatch]);

  const handleApprove = (id) => {
    dispatch(approveSeller(id))
      .unwrap()
      .then(() => {
        toast.success("Merchant application provisioned.");
        dispatch(removeSuccess());
      })
      .catch((err) => toast.error(err || "Failed authorization verification."));
  };

  const handleReject = (id) => {
    dispatch(rejectSeller(id))
      .unwrap()
      .then(() => {
        toast.success("Merchant application denied.");
        dispatch(removeSuccess());
      })
      .catch((err) => toast.error(err || "Failed decline workflow execution."));
  };

  if (loading && sellerRequests.length === 0) return <Loader />;

  return (
    <>
      <PageTitle title="Admin Seller Requests" />
      <section className="admin-section-wrapper">
        <div className="admin-header-row">
          <div>
            <h1 className="admin-main-heading">Pending Merchant Access Applications</h1>
            <p className="admin-subheading">Audit and verify account applications requesting backend storefront seller privileges.</p>
          </div>
        </div>

        {sellerRequests.length === 0 ? (
          <div className="empty-state-card">
            <h2>No Pending Requests Present</h2>
            <p>New onboarding applications from customers will show up here.</p>
          </div>
        ) : (
          <div className="table-responsive-wrapper">
            <table className="modern-admin-table">
              <thead>
                <tr>
                  <th>Applicant Identity Details</th>
                  <th>Current State</th>
                  <th className="text-right">Resolution Pipeline Operations</th>
                </tr>
              </thead>
              <tbody>
                {sellerRequests.map((seller) => (
                  <tr key={seller._id}>
                    <td>
                      <div className="cell-primary-text">{seller.name}</div>
                      <div className="cell-secondary-text">{seller.email}</div>
                    </td>
                    <td>
                      <span className="role-badge pending">Awaiting Verification</span>
                    </td>
                    <td className="text-right">
                      <div className="action-button-group justify-end">
                        <button className="action-btn approve-btn" onClick={() => handleApprove(seller._id)}>
                          Approve Provisioning
                        </button>
                        <button className="action-btn delete-btn" onClick={() => handleReject(seller._id)}>
                          Decline Request
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}