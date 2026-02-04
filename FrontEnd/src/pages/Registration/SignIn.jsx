import React from "react";
import './SignIn.css'
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
function SignIn() {
    const [read, setRead] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();


    const handleSignin = async (e) => {
  e.preventDefault();

  try {
    const res = await fetch("http://localhost:9090/api/v1/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      
      body: JSON.stringify({ email, password }),
      credentials: "include",
    });

    const data = await res.json();

    if (data.success) {
      navigate("/profile");
    } else {
      alert(data.message);
    }
  } catch (error) {
    console.error("Signin error:", error);
  }
};

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await fetch("http://localhost:9090/api/v1/me", {
                    credentials: "include",
                });
                if (res.ok) {
                    navigate("/");
                }
            } catch (err) {

            }

        };
        checkAuth();

    }, [])
    return (
        <>
            <h1 className="BrandHeading">Home Buzz</h1>
            <div className="signinPage">

                <h2 className="signinHeading">SignIn</h2>
                <form onSubmit={handleSignin} className="signininputs">
                    <input type="email" className="signName" placeholder="Your Email" onChange={e => setEmail(e.target.value)} />

                    <div className="passwordBox">
                        <input
                            type={read ? "text" : "password"}
                            className="signPass"
                            placeholder="Password"
                            onChange={e => setPassword(e.target.value)}

                        />


                        <button type="button" className="BtnShow" onClick={() => setRead(!read)}>
                            {read ? <FontAwesomeIcon icon={faEyeSlash} /> : <FontAwesomeIcon icon={faEye} />}
                        </button>
                    </div>
                    <div className="forgotPass">
                        <Link to="/forgotpassword"><h6 className="forgotPassName">Forgot Password?</h6></Link>
                    </div>

                    <button type="submit" className="SigninBtn">Sign In</button>
                </form>
                <div className="notHavaAcc">
                    <Link to="/signup"><h6 className="NotHave">Not Have an Account?</h6>
                    </Link>
                </div>
            </div>
        </>
    )
}

export default SignIn;