import { useState } from "react";
import "../Styles/shipping.css";
import CheckOutAnimation from "./checkOutAnimation";
import Navbar from "../Components/navBar";
import PageTitle from "../Components/pageTitle";
import { City } from "country-state-city";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { saveShippingInfo } from "../Components/features/Like/likeSlice";
import { useNavigate } from "react-router-dom";


function Shipping() {
  const { shippingInfo }=useSelector(state=>state.like);
  const dispatch=useDispatch();
  const navigate=useNavigate();
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
   if(form.mobileNumber.length!==10){
    toast.error("Invali Phone Number ! It Should Be 10 Digits",{position:"top-center",autoClose:3000})
    return;
   }
   dispatch(saveShippingInfo(form));
   navigate('/order/confirm')
  };



  return (
    <>
    <Navbar />
    <PageTitle title="Shipping Address-HomeBuzz"/>
      <CheckOutAnimation step={1} />
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
              <label htmlFor="phone">Phone Number</label>
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
              <label htmlFor="address">Address</label>
              <textarea
                id="fullAddress"
                name="fullAddress"
                placeholder="House No, Street, Area"
                rows="3"
                value={form.fullAddress}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>State</label>
                <select
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
                <label>City</label>
                <select
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

              <div className="form-group">
                <label>Landmark</label>
                <input
                  type="text"
                  name="landmark"
                  placeholder="Nearby landmark (optional)"
                  value={form.landmark}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Pincode</label>
              <input
                type="text"
                name="pincode"
                placeholder="6-digit pincode"
                value={form.pincode}
                onChange={handleChange}
                required
              />
            </div>

            <button
              type="submit"
              className="shipping-btn"
              // disabled={loading}
            >
              Continue to Payment
              {/* {loading ? "Processing..." : "Continue to Payment"} */}
            </button>
          </form>
        </section>
      </main>
    </>
  );
}

export default Shipping;