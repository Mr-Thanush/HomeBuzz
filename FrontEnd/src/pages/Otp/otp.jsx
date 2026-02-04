import React from "react";
import './otp.css'
import { useLocation,useNavigate } from "react-router-dom";

function Otp() {

    const navigate = useNavigate();
      const location = useLocation();

    return (
        <div className="otpVerification">
            <div className="otpHead">
                <h1 className="verification">Verification</h1>
            </div>
            <div className="otp">
                <h2 className="OtpEnter">
                    Enter Otp
                </h2>
                <div className="otpBoxes">
                   
                    <input type="text" className="box1" maxlength="1" pattern="[0-9]" />
                    <input type="text" className="box2" maxlength="1" pattern="[0-9]"/>
                    <input type="text" className="box3" maxlength="1" pattern="[0-9]"/>
                    <input type="text" className="box4" maxlength="1" pattern="[0-9]"/>
                   
                </div>
           <div className="resendOtp"><h6 className="resend">ResendOtp?</h6></div>
            <div className="changeMailid" onClick={()=>navigate(-1)}><h6 className="ChangeMail">Change Mail Id</h6></div>
                 <button type="submit" className="otpSubmit">Submit</button>
            </div>

        </div>
    )
}

export default Otp;