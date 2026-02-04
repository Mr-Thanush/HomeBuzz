import React from "react";
import './SignUp.css'
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import API_URL from "../../api";
function SignUp() {
    const [read, setRead] = useState(false);
    const [see, setSee] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const navigate = useNavigate();
     
const handleSubmit = async (e) => {
  e.preventDefault();

  if (password !== confirm) {
    alert("Passwords do not match!");
    return;
  }

  try {
    const res = await fetch(`${API_URL}/api/v1/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();

    if (data.success) {
      navigate("/");
    } else {
      alert(data.message);
    }
  } catch (error) {
    console.error(error);
    alert("Something went wrong");
  }
};

console.log({ name, email, password });

    return (
        <>
            <h1 className="BrandHeading">Home Buzz</h1>
            <div className="signupPage">
                <h1 className="signUpHeading" >SignUp</h1>
                <form action="" className="signupinputs" onSubmit={handleSubmit}>
                    <input 
                    type="text" 
                      value={name}
                    className="signName" 
                    placeholder="User Name" 
                    onChange={e=>setName(e.target.value)} />

                    <input 
                    type="email" 
                      value={email}
                    className="signEmail" 
                    placeholder="Your Email" 
                    onChange={e=>setEmail(e.target.value)} />

                    <div className="passwordBox">
                        <input
                            type={read ? "text" : "password"}
                              value={password}
                            className="signPass"
                            placeholder="Create Password"
                            onChange={e=>{setPassword(e.target.value)}}
                        />

                        <button type="button" className="BtnShow" onClick={() => setRead(!read)}>
                            {read ? <FontAwesomeIcon icon={faEyeSlash} /> : <FontAwesomeIcon icon={faEye} />}
                        </button>
                    </div>

                    <div className="passwordBox2">
                        <input

                            type={see ? "text" : "password"}
                            className="signPass"
            
                            placeholder="Rewrite Password"
                            onChange={e => setConfirm(e.target.value)}
                        />
                        <button type="button" className="BtnShow2" onClick={() => setSee(!see)}>
                            {see ? <FontAwesomeIcon icon={faEyeSlash} /> : <FontAwesomeIcon icon={faEye} />}
                        </button>

                    </div>

                    <button type="submit" className="SignUpBtn">Sign Up</button>
                </form>
                <div className="notHavaAcc">
                    <Link to="/signin"><h6 className="NotHave">Have an Account?</h6>
                    </Link>
                </div>
            </div>
        </>
    )
}

export default SignUp;