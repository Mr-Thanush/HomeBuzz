import { toast } from "react-toastify";
import "../Styles/signUp.css";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { register, removeErrors, removeSuccess } from "../Components/features/User/userSlice";
import Loader from "../Components/loader";

function SignUp() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });

  const {
    success = false,
    loading = false,
    error = null,
  } = useSelector((state) => state.user || {});

  const registerSubmit = (e) => {
    e.preventDefault();

    if (!user.name || !user.email || !user.password) {
      toast.error("Please fill all required fields", {
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
      toast.success("Registration Successful");
      dispatch(removeSuccess());
      navigate("/");
    }
  }, [success, dispatch, navigate]);

  return (
    <div className="register-container">
      <div className="register-card">
        <h1>Home Buzz</h1>
         <p className="subtitle">SignUp</p>
        <form onSubmit={registerSubmit}>
          <input
            type="text"
            placeholder="Name"
            value={user.name}
            onChange={(e) =>
              setUser({ ...user, name: e.target.value })
            }
          />

          <input
            type="email"
            placeholder="Email"
            value={user.email}
            onChange={(e) =>
              setUser({ ...user, email: e.target.value })
            }
          />

          <input
            type="password"
            placeholder="Password"
            value={user.password}
            onChange={(e) =>
              setUser({ ...user, password: e.target.value })
            }
          />

          <button disabled={loading} className="registerBtn">
            {loading ? "Registering..." : "Sign Up"}
          </button>
        </form>

        <p className="haveAccount">
          Already have an account? <Link to="/signin" className="signinLink">Sign In</Link>
        </p>
      </div>
    </div>
  );
}

export default SignUp;