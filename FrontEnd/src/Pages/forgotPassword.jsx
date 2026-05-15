import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import PageTitle from "../Components/pageTitle";
import { Link, useNavigate } from "react-router-dom";
import NavBar from "../Components/navBar";
import "../Styles/forgotPassword.css";
import { forgotPassword, removeErrors, removeSuccess } from "../Components/features/User/userSlice";

function ForgotPassword() {
  const navigate=useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");

  const { loading, error, success ,message} = useSelector((state) => state.user);


  const handleForgotPassword = (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    dispatch(forgotPassword({ email }));
    setEmail("");
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
            toast.success(message || "Password reset link sent successfully", {
              position: "top-center",
              autoClose: 3000,
            });
            dispatch(removeSuccess());
            navigate("/profile")
          }
        }, [dispatch, success,message,navigate]);

  return (
    <>
      <NavBar />
      <PageTitle title="Forgot Password-HomeBuzz"/>
      <div className="forgot-password-page">
        <div className="forgot-password-card">
          <h2>Forgot Password?</h2>
          <p className="subtitle">
            Enter your email and we’ll send you a reset link
          </p>

          <form onSubmit={handleForgotPassword}>
            <label>Email Address</label>
            <input
              type="email"
              placeholder="Enter your registered email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <button type="submit" disabled={loading}>
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>

          <div className="back-to-login">
            <Link to="/signin">← Back to Login</Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default ForgotPassword;