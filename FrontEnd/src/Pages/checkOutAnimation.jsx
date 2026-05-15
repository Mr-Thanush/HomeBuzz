import {FiTruck } from "react-icons/fi";
import "../Styles/checkOutAnimation.css";
import { FaBox } from "react-icons/fa";
import { BsBank2} from "react-icons/bs";

function CheckOutAnimation({ step = 1 }) {
  return (
    <div className="checkout-animation">

      <div className="animation-line"></div>
      <div
        className="animation-progress"
        style={{ width: `${(step - 1) * 50}%` }}
      ></div>
      <div className={`step ${step >= 1 ? "active" : ""}`}>
        <div className="step-circle"><FiTruck size={16} /></div>
        <span>Details</span>
      </div>
      <div className={`step ${step >= 2 ? "active" : ""}`}>
        <div className="step-circle"><FaBox size={16} /></div>
        <span>Conform Order</span>
      </div>
      <div className={`step ${step >= 3 ? "active" : ""}`}>
        <div className="step-circle"><BsBank2 size={16} /></div>
        <span>Payment</span>
      </div>
    </div>
  );
}

export default CheckOutAnimation;