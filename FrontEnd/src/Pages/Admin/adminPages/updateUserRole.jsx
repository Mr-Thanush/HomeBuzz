import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import PageTitle from "../../../Components/pageTitle";
import { getSingleUser, removeErrors, removeSuccess, updateSingleUser } from "../../../Components/features/AdminSeller/adminSlice";
import Loader from "../../../Components/loader";

export default function UpdateUserRole() {
  const { userId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading, error, success } = useSelector((state) => state.admin || {});

  const [formData, setFormData] = useState({ name: "", email: "", role: "" });
  const { name, email, role } = formData;

  useEffect(() => {
    dispatch(getSingleUser(userId));
  }, [dispatch, userId]);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        role: user.role || ""
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!role) return toast.warn("Please select a valid target security context role.");
    dispatch(updateSingleUser({ userId, role }));
  };

  useEffect(() => {
    if (error) {
      toast.error(error?.message || error);
      dispatch(removeErrors());
    }
    if (success) {
      toast.success("Identity Privilege Context Updated Successfully");
      dispatch(removeSuccess());
      navigate("/admin/users");
    }
  }, [dispatch, error, success, navigate]);

  if (loading && !name) return <Loader />;

  return (
    <>
      <PageTitle title="Update User Access Role" />
      <section className="form-center-wrapper">
        <div className="modern-form-card">
          <h1 className="form-card-title">Modify Security Context</h1>
          <p className="form-card-sub">Elevate or revoke cross-module operations for this account identity.</p>

          <form onSubmit={handleSubmit} className="modern-stacked-form">
            <div className="modern-form-group">
              <label>Full Name Reference String</label>
              <input type="text" readOnly value={name} className="disabled-input" />
            </div>

            <div className="modern-form-group">
              <label>Email Identity Endpoint</label>
              <input type="email" readOnly value={email} className="disabled-input" />
            </div>

            <div className="modern-form-group">
              <label htmlFor="role">Assigned Authorization Tier</label>
              <select id="role" name="role" value={role} onChange={handleChange} required>
                <option value="">Choose Target Security Level...</option>
                <option value="user">Standard Customer (User)</option>
                <option value="seller">Verified Merchant Partner (Seller)</option>
                <option value="admin">System Superuser (Admin)</option>
              </select>
            </div>

            <button type="submit" disabled={loading} className="modern-form-submit-btn">
              {loading ? "Committing Database Updates..." : "Save System Changes"}
            </button>
          </form>
        </div>
      </section>
    </>
  );
}