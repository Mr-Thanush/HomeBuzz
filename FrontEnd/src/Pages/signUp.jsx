import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { register, removeErrors, removeSuccess } from "../Components/features/User/userSlice";
import Loader from "../Components/loader";
import "../Styles/signUp.css";

function SignUp() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [user, setUser] = useState({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const { success = false, loading = false, error = null } = useSelector(
    (state) => state.user || {}
  );

  const registerSubmit = (e) => {
    e.preventDefault();
    if (!user.name || !user.email || !user.password) {
      toast.error("Please populate all foundational parameters context rules", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }
    dispatch(register(user));
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(removeErrors());
    }
  }, [error, dispatch]);

  useEffect(() => {
    if (success) {
      toast.success("Registration Successful Layout Context Saved");
      dispatch(removeSuccess());
      navigate("/");
    }
  }, [success, dispatch, navigate]);

  return (
    <div className="register-container">
      {loading && <Loader />}
      
      <main className="register-card">
        <h1 className="register-title">Home Buzz</h1>
        <p className="subtitle">Create Account</p>
        
        <form onSubmit={registerSubmit} className="register-form">
          <div className="reg-input-group">
            <label htmlFor="reg-name">Full Name</label>
            <input
              id="reg-name"
              type="text"
              placeholder="Your Name"
              value={user.name}
              required
              onChange={(e) => setUser({ ...user, name: e.target.value })}
            />
          </div>

          <div className="reg-input-group">
            <label htmlFor="reg-email">Email Address</label>
            <input
              id="reg-email"
              type="email"
              placeholder="name@example.com"
              value={user.email}
              required
              onChange={(e) => setUser({ ...user, email: e.target.value })}
            />
          </div>

          <div className="reg-input-group">
            <label htmlFor="reg-password">Password</label>
            <div className="reg-password-wrapper">
              <input
                id="reg-password"
                type={showPassword ? "text" : "password"}
                placeholder="Secure Code String"
                value={user.password}
                required
                onChange={(e) => setUser({ ...user, password: e.target.value })}
              />
              <button
                type="button"
                className="reg-eye-btn"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password entry" : "Reveal password entry"}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <button type="submit" className="registerBtn" disabled={loading}>
            {loading ? "Registering..." : "Sign Up"}
          </button>
        </form>

        <p className="haveAccount">
          Already have an account? <Link to="/signin" className="signinLink">Sign In</Link>
        </p>
      </main>
    </div>
  );
}

export default SignUp;