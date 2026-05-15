import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../Components/navBar";
import "../Styles/updatePassword.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { removeErrors, removeSuccess, updatePassword } from "../Components/features/User/userSlice";

function UpdatePassword() {
  const dispatch=useDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [oldPassword,setOldPassword]=useState("");
  const [newPassword,setNewPassword]=useState("");
  const [confirmPassword,setConfirmPassword]=useState("");

  const { loading,error,success,message,isAuthenticated} = useSelector(
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
            navigate("/profile")
          }
        }, [dispatch, success,message,navigate]);

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

     const payload={
      oldPassword,
      newPassword,
      confirmPassword
     }

     dispatch(updatePassword(payload));
  };

  return (
    <>
      <NavBar />

      <div className="update-password-page">
        <div className="update-password-card">
          <h2>Update Password</h2>
          <p className="subtitle">Secure your account with a strong password</p>

          <form onSubmit={handlePasswordSubmit}>
            <label>Current Password</label>
            <div className="input-group">
              <input
                type="password"
                name="oldPassword"
                placeholder="Current password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                required
              />
            </div>

            <label>New Password</label>
            <div className="input-group">
              <input
                type={showPassword ? "text" : "password"}
                name="newPassword"
                placeholder="New password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <span
                className="eye-icon"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            <label>Confirm Password</label>
            <div className="input-group">
              <input
                type={showPassword2 ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />

              <span
                className="eye-icon"
                onClick={() => setShowPassword2(!showPassword2)}
              >
                {showPassword2 ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            <button type="submit">
             Update Password
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default UpdatePassword;