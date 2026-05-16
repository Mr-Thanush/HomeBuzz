import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "../../../Components/navBar";
import PageTitle from "../../../Components/pageTitle";
import Loader from "../../../Components/loader";
import {fetchSellerRequests,approveSeller,rejectSeller,removeErrors,removeSuccess,} from "../../../Components/features/AdminSeller/adminSlice";
import { toast } from "react-toastify";

export default function SellerRequests() {
  const dispatch = useDispatch();

  const { loading, sellerRequests, error } = useSelector(
    (state) => state.admin  
  );

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
        toast.success("Seller approved");
        dispatch(removeSuccess());
      })
      .catch((err) => toast.error(err));
  };

  const handleReject = (id) => {
    dispatch(rejectSeller(id))
      .unwrap()
      .then(() => {
        toast.success("Seller rejected");
      })
      .catch((err) => toast.error(err));
  };

  if (loading) return <Loader />;

  return (
    <>
      <Navbar />
      <PageTitle title="Admin Seller Requests" />

      <section className="admin-page2">
        <h1>Seller Requests</h1>

        <div className="admin-table">
          {sellerRequests.length === 0 ? (
            <p>No pending requests</p>
          ) : (
            sellerRequests.map((seller) => (
              <div className="admin-row" key={seller._id}>
                <span>{seller.name}</span>
                <span className="badge pending">Pending</span>

                <button
                  className="success"
                  onClick={() => handleApprove(seller._id)}
                >
                  Approve
                </button>

                <button
                  className="danger"
                  onClick={() => handleReject(seller._id)}
                >
                  Reject
                </button>
              </div>
            ))
          )}
        </div>
      </section>
    </>
  );
}