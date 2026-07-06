import React from "react";
import { FiTruck, FiCheck } from "react-icons/fi";
import { FaBox } from "react-icons/fa";
import { BsBank2 } from "react-icons/bs";
import "../Styles/checkOutAnimation.css";

function CheckOutAnimation({ step = 1 }) {
  // Helper to render icon or completion checkmark
  const renderStepIcon = (currentStep, targetStep, defaultIcon) => {
    if (currentStep > targetStep) {
      return <FiCheck size={18} className="checkmark-icon" />;
    }
    return defaultIcon;
  };

  return (
    <div className="checkout-animation" role="nav" aria-label="Checkout Progress">
      <div className="animation-line"></div>
      <div
        className="animation-progress"
        style={{ width: `${((step - 1) / 2) * 100}%` }}
      ></div>

      <div className={`step ${step >= 1 ? "active" : ""} ${step > 1 ? "completed" : ""}`}>
        <div className="step-circle">
          {renderStepIcon(step, 1, <FiTruck size={16} />)}
        </div>
        <span>Shipping Details</span>
      </div>

      <div className={`step ${step >= 2 ? "active" : ""} ${step > 2 ? "completed" : ""}`}>
        <div className="step-circle">
          {renderStepIcon(step, 2, <FaBox size={16} />)}
        </div>
        <span>Confirm Order</span>
      </div>

      <div className={`step ${step >= 3 ? "active" : ""} ${step > 3 ? "completed" : ""}`}>
        <div className="step-circle">
          {renderStepIcon(step, 3, <BsBank2 size={16} />)}
        </div>
        <span>Payment</span>
      </div>
    </div>
  );
}

export default CheckOutAnimation;