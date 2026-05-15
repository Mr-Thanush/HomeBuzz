import { Link, useLocation, useNavigate } from "react-router-dom";
import "../Styles/signIn.css"
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login, removeErrors, removeSuccess } from "../Components/features/User/userSlice";
import { useEffect } from "react";
import { toast } from "react-toastify";
import Loader from "../Components/loader";


function SignIn() { 
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const {error,loading,success,isAuthenticated}=useSelector(state=>state.user);
  const dispatch=useDispatch();
  const navigate=useNavigate();
  const location=useLocation();
  const redirect=new URLSearchParams(location.search).get("redirect") || "/"

  const loginSubmit=(e)=>{
     e.preventDefault();
     dispatch(login({email,password}));
  }
  useEffect(() => {
      if (error) {
        toast.error(error);
        dispatch(removeErrors());
      }
    }, [error, dispatch]);

    useEffect(()=>{
      if(isAuthenticated){
        navigate(redirect);
      }
    },[isAuthenticated,navigate])

     useEffect(()=>{
      if(success){
        toast.success("Login SuccessFull", {
        position: "top-center",
        autoClose: 3000,
      });
      dispatch(removeSuccess());
      }
    },[dispatch,success]);
  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="app-title">Home Buzz</h1>
        <p className="subtitle">SignIn to continue</p>

        <form onSubmit={loginSubmit}>
          <label>Email</label>
          <input
            type="text"
            name="email"
            placeholder="Enter Email Id"
            required
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
          />

          <label>Password</label>
          <input
            type="password"
            name="password"
            placeholder="Enter password"
            required
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
          />

          <Link to="/password/forgot" >
          <p className="forgotPassword">Forgot Passoword?</p> 
          </Link>

          <button type="submit" className="login-btn">
           {loading? "Signing In...": "SignIn"}
          </button>
        </form>

        <p className="register-text">
          Don’t have an account? <Link to="/signup"><span>SignUp</span></Link>
        </p>
      </div>
    </div>
  );
}

export default SignIn;