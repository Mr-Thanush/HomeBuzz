import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import NavBar from "../Components/navBar";
import Loader from "../Components/loader";
import PageTitle from "../Components/pageTitle";
import { removeErrors, removeSuccess, updatePassword } from "../Components/features/User/userSlice";
import "../Styles/updatePassword.css";

function UpdatePassword() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { loading, error, success, isAuthenticated } = useSelector(
    (state) => state.user
  );

  useEffect(() => {
    if (isAuthenticated === false) {
      navigate("/signin");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (error) {
      toast.error(error, {
        position: "top-center",
        autoClose: 3000,
      });
      dispatch(removeErrors());
    }
  }, [dispatch, error]);

  useEffect(() => {
    if (success) {
      toast.success("Password Updated Successfully", {
        position: "top-center",
        autoClose: 3000,
      });
      dispatch(removeSuccess());
      navigate("/profile");
    }
  }, [dispatch, success, navigate]);

  const handlePasswordSubmit = (e) => {
    e.preventDefault();

    if (oldPassword === newPassword) {
      toast.error("New password must be different from current password", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New password and confirm password do not match", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    const payload = {
      oldPassword,
      newPassword,
      confirmPassword,
    };

    dispatch(updatePassword(payload));
  };

  return (
    <div className="update-password-wrapper">
      {loading && <Loader />}
      <NavBar />
      <PageTitle title="Update Password - HomeBuzz" />

      <main className="update-password-page">
        <div className="update-password-card">
          <h2>Update Password</h2>
          <p className="subtitle">Secure your account with a strong password</p>

          <form onSubmit={handlePasswordSubmit} className="update-password-form">
            <div className="input-field-group">
              <label htmlFor="oldPassword">Current Password</label>
              <div className="input-group">
                <input
                  id="oldPassword"
                  type={showOldPassword ? "text" : "password"}
                  name="oldPassword"
                  placeholder="Current password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="eye-icon"
                  onClick={() => setShowOldPassword(!showOldPassword)}
                  aria-label={showOldPassword ? "Hide current password" : "Show current password"}
                >
                  {showOldPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <div className="input-field-group">
              <label htmlFor="newPassword">New Password</label>
              <div className="input-group">
                <input
                  id="newPassword"
                  type={showPassword ? "text" : "password"}
                  name="newPassword"
                  placeholder="New password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="eye-icon"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide new password" : "Show new password"}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <div className="input-field-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div className="input-group">
                <input
                  id="confirmPassword"
                  type={showPassword2 ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="eye-icon"
                  onClick={() => setShowPassword2(!showPassword2)}
                  aria-label={showPassword2 ? "Hide confirm password" : "Show confirm password"}
                >
                  {showPassword2 ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <button type="submit" className="update-submit-btn" disabled={loading}>
              {loading ? "Updating..." : "Update Password"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default UpdatePassword;