import React, { useEffect, useState } from "react";
import Navbar from "../Components/Navbar";
import PageTitle from "../Components/PageTitle";
import Loader from "../Components/Loader";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { removeErrors, removeSuccess, updateProfile } from "../Components/features/User/userSlice";
import "../Styles/updateProfile.css";

function UpdateProfile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const [profilePicPreview, setProfilePicPreview] = useState("");

  const { loading, error, success, message, user, isAuthenticated } = useSelector(
    (state) => state.user
  );

  // Authentication Guard
  useEffect(() => {
    if (isAuthenticated === false) {
      navigate("/signin");
    }
  }, [isAuthenticated, navigate]);

  // Sync state data when user payload loads
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
    }
  }, [user]);

  // Error Message Handling
  useEffect(() => {
    if (error) {
      toast.error(error, { position: "top-center", autoClose: 3000 });
      dispatch(removeErrors());
    }
  }, [dispatch, error]);

  // Success Confirmation Tracking
  useEffect(() => {
    if (success) {
      toast.success(message || "Profile updated successfully!", {
        position: "top-center",
        autoClose: 3000,
      });
      dispatch(removeSuccess());
      navigate("/profile");
    }
  }, [dispatch, success, message, navigate]);

  // Handle local File Reader operations
  const profilePicChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setProfilePicPreview(reader.result);
        setProfilePic(reader.result);
      }
    };

    reader.onerror = () => {
      toast.error("Error reading media selection file.");
    };
    reader.readAsDataURL(file);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      toast.error("Name and Email fields are required.");
      return;
    }

    const payload = { name, email };
    if (profilePic) {
      payload.profilepic = profilePic;
    }
    dispatch(updateProfile(payload));
  };

  if (loading) return <Loader />;

  return (
    <div className="update-profile-page">
      <PageTitle title="Update Profile" />
      <Navbar />

      <main className="update-profile-container">
        <h2>Update Profile</h2>

        <form className="update-profile-form" onSubmit={submitHandler}>
          
          {/* Avatar Section */}
          <div className="profile-image-section">
            <div className="profile-image">
              {profilePicPreview || user?.profilepic?.url ? (
                <img 
                  src={profilePicPreview || user?.profilepic?.url} 
                  alt="Profile Avatar Preview" 
                />
              ) : (
                <span className="default-avatar" aria-hidden="true">👤</span>
              )}
            </div>

            <label className="upload-btn">
              Change Photo
              <input 
                type="file" 
                name="profilepic" 
                accept="image/*" 
                onChange={profilePicChange} 
              />
            </label>
          </div>

          {/* Core Input Elements */}
          <div className="form-group">
            <label htmlFor="profile-name">Full Name</label>
            <input
              id="profile-name"
              type="text"
              name="name"
              value={name}
              placeholder="Enter your name"
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="profile-email">Email Address</label>
            <input
              id="profile-email"
              type="email"
              name="email"
              value={email}
              placeholder="Enter your email"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Action Grid Layout Buttons */}
          <div className="updateBtns">
            <button type="submit" className="save-btn">
              Save Changes
            </button>

            <Link to="/password/update" className="changePass-link">
              Update Password
            </Link>
          </div>
        </form>
      </main>
    </div>
  );
}

export default UpdateProfile;