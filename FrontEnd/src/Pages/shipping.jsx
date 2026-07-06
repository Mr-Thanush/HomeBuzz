import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { City } from "country-state-city";
import { toast } from "react-toastify";
import Navbar from "../Components/navBar";
import PageTitle from "../Components/pageTitle";
import CheckOutAnimation from "./checkOutAnimation";
import { saveShippingInfo } from "../Components/features/Like/likeSlice";
import "../Styles/shipping.css";

function Shipping() {
  const { shippingInfo } = useSelector((state) => state.like);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: shippingInfo?.fullName || "",
    mobileNumber: shippingInfo?.mobileNumber || "",
    fullAddress: shippingInfo?.fullAddress || "",
    state: shippingInfo?.state || "",
    city: shippingInfo?.city || "",
    landmark: shippingInfo?.landmark || "",
    pincode: shippingInfo?.pincode || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    if (form.mobileNumber.replace(/\D/g, "").length !== 10) {
      toast.error("Invalid Phone Number! It must contain exactly 10 digits.", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }
    dispatch(saveShippingInfo(form));
    navigate("/order/confirm");
  };

  return (
    <div className="shipping-layout-container">
      <Navbar />
      <PageTitle title="Delivery Information - HomeBuzz" />
      <div className="checkout-anim-wrapper">
        <CheckOutAnimation step={1} />
      </div>

      <main className="shipping-page">
        <section className="shipping-card">
          <header className="shipping-header">
            <h2>Shipping Address</h2>
            <p>Please enter your delivery details accurately</p>
          </header>

          <form className="shipping-form" onSubmit={handleSubmitForm}>
            <div className="form-group">
              <label htmlFor="fullName">Full Name</label>
              <input
                id="fullName"
                type="text"
                name="fullName"
                placeholder="John Doe"
                value={form.fullName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="mobileNumber">Phone Number</label>
              <input
                id="mobileNumber"
                type="tel"
                name="mobileNumber"
                placeholder="10-digit mobile number"
                value={form.mobileNumber}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="fullAddress">Address Details</label>
              <textarea
                id="fullAddress"
                name="fullAddress"
                placeholder="House No, Street, Local Area Name"
                rows="3"
                value={form.fullAddress}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-grid-row">
              <div className="form-group">
                <label htmlFor="state">State</label>
                <select
                  id="state"
                  name="state"
                  value={form.state}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select State</option>
                  <option value="TG">Telangana</option>
                  <option value="AP">Andhra Pradesh</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="city">City</label>
                <select
                  id="city"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  disabled={!form.state}
                  required
                >
                  <option value="">Select City</option>
                  {form.state &&
                    City.getCitiesOfState("IN", form.state).map((city) => (
                      <option key={city.name} value={city.name}>
                        {city.name}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            <div className="form-grid-row dual">
              <div className="form-group">
                <label htmlFor="landmark">Landmark (Optional)</label>
                <input
                  id="landmark"
                  type="text"
                  name="landmark"
                  placeholder="e.g. Near Metro Station"
                  value={form.landmark}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="pincode">Pincode</label>
                <input
                  id="pincode"
                  type="text"
                  name="pincode"
                  placeholder="6-digit postal code"
                  value={form.pincode}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <button type="submit" className="shipping-btn">
              Continue to Payment
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}

export default Shipping;