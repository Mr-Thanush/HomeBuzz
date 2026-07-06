import React, { useEffect, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { removeErrors, removeSuccess, resetPassword } from "../Components/features/User/userSlice";
import { toast } from "react-toastify";
import "../Styles/resetPassword.css";

function ResetPassword() {
  const navigate = useNavigate();
  const { token } = useParams(); 
  const dispatch = useDispatch();

  const { loading, error, success } = useSelector((state) => state.user);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleResetPasswordSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Credentials match error: Passwords do not target identically", { position: "top-center" });
      return;
    }
    dispatch(resetPassword({ token, password, confirmPassword }));
  };

  useEffect(() => {
    if (error) {
      toast.error(error, { position: "top-center", autoClose: 3000 });
      dispatch(removeErrors());
    }
  }, [dispatch, error]);

  useEffect(() => {
    if (success) {
      toast.success("Password Reset Successfully", { position: "top-center", autoClose: 3000 });
      dispatch(removeSuccess());
      navigate("/signin");
    }
  }, [dispatch, success, navigate]);

  return (
    <div className="reset-container-main">
      <main className="reset-card">
        <h2>Reset Account Password</h2>
        <p className="subtitle">Please configure your alternative secure operational encryption parameters.</p>

        <form onSubmit={handleResetPasswordSubmit} className="reset-form-element">
          {/* New Password Key Field */}
          <div className="input-group">
            <label htmlFor="new-password-input">New Account Password</label>
            <div className="password-field-wrapper">
              <input
                id="new-password-input"
                type={showPassword ? "text" : "password"}
                placeholder="Enter comprehensive safe key..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
              />
              <button
                type="button"
                className="password-toggle-trigger"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password context string" : "Reveal password text string"}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* Confirm Credentials Verification Box */}
          <div className="input-group">
            <label htmlFor="confirm-password-input">Confirm Security Entry</label>
            <input
              id="confirm-password-input"
              type="password"
              placeholder="Re-enter newly designated credentials..."
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              autoComplete="new-password"
            />
          </div>

          <button type="submit" className="reset-btn" disabled={loading}>
            {loading ? "Reconfiguring Keys..." : "Apply Reset Password"}
          </button>
        </form>
      </main>
    </div>
  );
}

export default ResetPassword;