import { useEffect, useState } from "react";
import Navbar from "../Components/navBar";
import PageTitle from "../Components/pageTitle";
import "../Styles/updateProfile.css";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../Components/loader";
import { toast } from "react-toastify";
import { removeErrors,removeSuccess,createStore} from "../Components/features/User/userSlice";

function CreateStore() { 
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [storeName, setStoreName] = useState("");
  const [storeEmail, setStoreEmail] = useState("");
  const [description, setDescription] = useState("");
  const [phone, setPhone] = useState("");
  const [altPhone, setAltPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");
  const [country, setCountry] = useState("India");
  const [profilePic, setProfilePic] = useState("");
  const [profilePicPreview, setProfilePicPreview] = useState("");
  const { loading, error, success, message, user, isAuthenticated } =
    useSelector((state) => state.user);

  useEffect(() => {
    if (isAuthenticated === false) {
      navigate("/signin");
    }
  }, [isAuthenticated, navigate]);

 
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(removeErrors());
    }
  }, [dispatch, error]);

  
  useEffect(() => {
    if (success) {
      toast.success(message);
      dispatch(removeSuccess());
        if (user?.sellerInfo?.status === "pending") {
           navigate("/profile");
          }
    }
  }, [dispatch, success, message, navigate]);

 
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

    if (!storeName || !storeEmail || !phone || !city || !pincode) {
      toast.error("Please fill all required fields");
      return;
    }

    const payload = {
      name: storeName,
      email: storeEmail,
      description,
      phone,
      altPhone,
      address: {
        address,
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
      <PageTitle title="Create Store - HomeBuzz" />
      <Navbar />

      <div className="update-profile-container">
        <h2>Create Your Store</h2>

        <form className="update-profile-form" onSubmit={submitHandler}>
          {/* Logo */}
          <div className="profile-image-section">
            <div className="profile-image">
              {profilePicPreview ? (
                <img src={profilePicPreview} alt="Store Logo" />
              ) : (
                <div className="default-avatar">🏪</div>
              )}
            </div>

            <label className="upload-btn">
              Upload Store Logo
              <input type="file" accept="image/*" onChange={profilePicChange} />
            </label>
          </div>

          {/* Store Info */}
          <div className="form-group">
            <label>Store Name *</label>
            <input value={storeName} onChange={(e) => setStoreName(e.target.value)} />
          </div>

          <div className="form-group">
            <label>Store Email *</label>
            <input value={storeEmail} onChange={(e) => setStoreEmail(e.target.value)} />
          </div>

          <div className="form-group">
            <label>Store Description</label>
            <textarea rows="3" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>

          {/* Contact */}
          <div className="form-group">
            <label>Phone *</label>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>

          <div className="form-group">
            <label>Alternate Phone</label>
            <input value={altPhone} onChange={(e) => setAltPhone(e.target.value)} />
          </div>

          {/* Address */}
          <div className="form-group">
            <label>Address</label>
            <textarea rows="2" value={address} onChange={(e) => setAddress(e.target.value)} />
          </div>

          <div className="form-group">
            <label>City *</label>
            <input value={city} onChange={(e) => setCity(e.target.value)} />
          </div>

          <div className="form-group">
            <label>State</label>
            <input value={state} onChange={(e) => setState(e.target.value)} />
          </div>

          <div className="form-group">
            <label>Pincode *</label>
            <input value={pincode} onChange={(e) => setPincode(e.target.value)} />
          </div>

          <button type="submit" className="save-btn">
            Create Store
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateStore;