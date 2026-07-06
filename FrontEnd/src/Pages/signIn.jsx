import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { login, removeErrors, removeSuccess } from "../Components/features/User/userSlice";
import Loader from "../Components/loader";
import "../Styles/signIn.css";

function SignIn() { 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { error, loading, success, isAuthenticated } = useSelector(state => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  
  const redirect = new URLSearchParams(location.search).get("redirect") || "/";

  const loginSubmit = (e) => {
     e.preventDefault();
     dispatch(login({ email, password }));
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(removeErrors());
    }
  }, [error, dispatch]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirect);
    }
  }, [isAuthenticated, navigate, redirect]);

  useEffect(() => {
    if (success) {
      toast.success("Login Successful", { position: "top-center", autoClose: 3000 });
      dispatch(removeSuccess());
    }
  }, [dispatch, success]);

  return (
    <div className="login-container">
      {loading && <Loader />}
      
      <main className="login-card">
        <h1 className="app-title">Home Buzz</h1>
        <p className="subtitle">Sign in to continue</p>

        <form onSubmit={loginSubmit} className="auth-form">
          <div className="auth-input-group">
            <label htmlFor="signin-email">Email Address</label>
            <input
              id="signin-email"
              type="email"
              placeholder="name@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="auth-input-group">
            <label htmlFor="signin-password">Password</label>
            <div className="password-input-wrapper">
              <input
                id="signin-password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your security key"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="eye-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <div className="forgot-container-row">
            <Link to="/password/forgot" className="forgotPassword">
              Forgot Password?
            </Link>
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <p className="register-text">
          Don’t have an account? <Link to="/signup"><span>Sign Up</span></Link>
        </p>
      </main>
    </div>
  );
}

export default SignIn;