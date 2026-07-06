import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import PageTitle from "../Components/PageTitle";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar";
import { forgotPassword, removeErrors, removeSuccess } from "../Components/features/User/userSlice";
import "../Styles/forgotPassword.css";

function ForgotPassword() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");

  const { loading, error, success, message } = useSelector((state) => state.user);

  const handleForgotPassword = (e) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Please enter your email");
      return;
    }
    dispatch(forgotPassword({ email }));
  };

  // Error Catch Action Monitoring Loop
  useEffect(() => {
    if (error) {
      toast.error(error, {
        position: "top-center",
        autoClose: 3000,
      });
      dispatch(removeErrors());
    }
  }, [dispatch, error]);

  // Handle Success & Reset Input field state
  useEffect(() => {
    if (success) {
      toast.success(message || "Password reset link sent successfully", {
        position: "top-center",
        autoClose: 3000,
      });
      setEmail("");
      dispatch(removeSuccess());
      navigate("/signin"); // Redirects to sign-in instead of profile since password isn't updated yet
    }
  }, [dispatch, success, message, navigate]);

  return (
    <div className="forgot-password-layout">
      <PageTitle title="Forgot Password" />
      <Navbar />
      
      <main className="forgot-password-page">
        <div className="forgot-password-card">
          <h2>Forgot Password?</h2>
          <p className="subtitle">
            Enter your email and we’ll send you a reset link
          </p>

          <form onSubmit={handleForgotPassword} className="forgot-password-form">
            <div className="form-group">
              <label htmlFor="forgot-email">Email Address</label>
              <input
                id="forgot-email"
                type="email"
                placeholder="Enter your registered email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <button type="submit" disabled={loading} className="reset-submit-btn">
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>

          <div className="back-to-login">
            <Link to="/signin">← Back to Login</Link>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ForgotPassword;