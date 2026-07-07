import React, { useEffect, useState } from "react";
import Navbar from "../Components/navBar.jsx";
import PageTitle from "../Components/pageTitle.jsx";
import Loader from "../Components/loader.jsx";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { removeErrors, removeSuccess, createStore } from "../Components/features/User/userSlice";
import "../Styles/updateProfile.css"; // Reusing updated structural form styles

function CreateStore() { 
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [storeName, setStoreName] = useState("");
  const [storeEmail, setStoreEmail] = useState("");
  const [description, setDescription] = useState("");
  const [phone, setPhone] = useState("");
  const [altPhone, setAltPhone] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");
  const [country] = useState("India");
  const [profilePic, setProfilePic] = useState("");
  const [profilePicPreview, setProfilePicPreview] = useState("");

  const { loading, error, success, message, user, isAuthenticated } = useSelector(
    (state) => state.user
  );

  // Auth Protection Guard
  useEffect(() => {
    if (isAuthenticated === false) {
      navigate("/signin");
    }
  }, [isAuthenticated, navigate]);

  // Error Handling
  useEffect(() => {
    if (error) {
      toast.error(error, { position: "top-center", autoClose: 3000 });
      dispatch(removeErrors());
    }
  }, [dispatch, error]);

  // Success Handler
  useEffect(() => {
    if (success) {
      toast.success(message || "Store request submitted successfully!");
      dispatch(removeSuccess());
      if (user?.sellerInfo?.status === "pending" || !user?.sellerInfo) {
        navigate("/profile");
      }
    }
  }, [dispatch, success, message, navigate, user]);

  // Sync initial user details to fill store values as fallbacks
  useEffect(() => {
    if (user) {
      setStoreName(user.name || "");
      setStoreEmail(user.email || "");
    }
  }, [user]);

  const profilePicChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setProfilePic(reader.result);
        setProfilePicPreview(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const submitHandler = (e) => {
    e.preventDefault();

    if (!storeName.trim() || !storeEmail.trim() || !phone.trim() || !city.trim() || !pincode.trim()) {
      toast.error("Please fill all required (*) fields");
      return;
    }

    const payload = {
      name: storeName,
      email: storeEmail,
      description,
      phone,
      altPhone,
      address: {
        streetAddress,
        city,
        state,
        pincode,
        country,
      },
    };

    if (profilePic) payload.profilepic = profilePic;
    dispatch(createStore(payload));
  };

  if (loading) return <Loader />;

  return (
    <div className="update-profile-page">
      <PageTitle title="Create Store" />
      <Navbar />

      <main className="update-profile-container store-form-container">
        <h2>Create Your Store</h2>

        <form className="update-profile-form" onSubmit={submitHandler}>
          
          {/* Logo Section */}
          <div className="profile-image-section">
            <div className="profile-image logo-preview">
              {profilePicPreview ? (
                <img src={profilePicPreview} alt="Store Logo Preview" />
              ) : (
                <span className="default-avatar" aria-hidden="true">🏪</span>
              )}
            </div>

            <label className="upload-btn">
              Upload Store Logo
              <input type="file" accept="image/*" onChange={profilePicChange} />
            </label>
          </div>

          {/* Form Content Layout Split Fields */}
          <div className="form-group">
            <label htmlFor="store-name">Store Name *</label>
            <input 
              id="store-name"
              type="text"
              value={storeName} 
              onChange={(e) => setStoreName(e.target.value)} 
              required 
            />
          </div>

          <div className="form-group">
            <label htmlFor="store-email">Store Email *</label>
            <input 
              id="store-email"
              type="email"
              value={storeEmail} 
              onChange={(e) => setStoreEmail(e.target.value)} 
              required 
            />
          </div>

          <div className="form-group">
            <label htmlFor="store-desc">Store Description</label>
            <textarea 
              id="store-desc"
              rows="3" 
              placeholder="Tell customers about your brand..."
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
            />
          </div>

          {/* Contact Group Grid */}
          <div className="form-row-grid">
            <div className="form-group">
              <label htmlFor="store-phone">Phone *</label>
              <input 
                id="store-phone"
                type="tel"
                value={phone} 
                onChange={(e) => setPhone(e.target.value)} 
                required 
              />
            </div>

            <div className="form-group">
              <label htmlFor="store-altphone">Alternate Phone</label>
              <input 
                id="store-altphone"
                type="tel"
                value={altPhone} 
                onChange={(e) => setAltPhone(e.target.value)} 
              />
            </div>
          </div>

          {/* Location Group Segment */}
          <div className="form-group">
            <label htmlFor="store-address">Street Address</label>
            <textarea 
              id="store-address"
              rows="2" 
              placeholder="Building, Street, Area name"
              value={streetAddress} 
              onChange={(e) => setStreetAddress(e.target.value)} 
            />
          </div>

          <div className="form-row-three-grid">
            <div className="form-group">
              <label htmlFor="store-city">City *</label>
              <input 
                id="store-city"
                type="text"
                value={city} 
                onChange={(e) => setCity(e.target.value)} 
                required 
              />
            </div>

            <div className="form-group">
              <label htmlFor="store-state">State</label>
              <input 
                id="store-state"
                type="text"
                value={state} 
                onChange={(e) => setState(e.target.value)} 
              />
            </div>

            <div className="form-group">
              <label htmlFor="store-pincode">Pincode *</label>
              <input 
                id="store-pincode"
                type="text"
                pattern="[0-9]{6}"
                maxLength="6"
                placeholder="6-digit PIN"
                value={pincode} 
                onChange={(e) => setPincode(e.target.value)} 
                required 
              />
            </div>
          </div>

          <button type="submit" className="save-btn submit-store-btn">
            Submit Store Application
          </button>
        </form>
      </main>
    </div>
  );
}

export default CreateStore;