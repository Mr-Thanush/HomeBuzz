import { useEffect, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import "../Styles/resetPassword.css";
import { useDispatch, useSelector } from "react-redux";
import { removeErrors, removeSuccess, resetPassword } from "../Components/features/User/userSlice";
import { toast } from "react-toastify";

function ResetPassword() {
  const navigate = useNavigate();
  const { token } = useParams(); 
  const dispatch=useDispatch();

  const { loading,error,success,message} = useSelector(
    (state) => state.user
  );

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleResetPasswordSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    const payload = {
      token,
      password,
      confirmPassword,
    };


    dispatch(resetPassword(payload));

  };

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
          toast.success("Reset Password Successfully", {
            position: "top-center",
            autoClose: 3000,
          });
          dispatch(removeSuccess());
          navigate("/signin")
        }
      }, [dispatch,success,navigate]);

  return (
    <div className="reset-container">
      <div className="reset-card">
        <h2>Reset Password</h2>
        <p className="subtitle">
          Create a new password for your account
        </p>

        <form onSubmit={handleResetPasswordSubmit}>
          {/* New Password */}
          <div className="input-group">
            <label>New Password</label>
            <div className="password-field">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="input-group">
            <label>Confirm Password</label>
            <input
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="reset-btn">
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;