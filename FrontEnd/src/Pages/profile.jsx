import React from "react";
import { 
  HiArrowRightOnRectangle, 
  HiOutlineCog6Tooth, 
  HiOutlinePencil, 
  HiOutlineQuestionMarkCircle, 
  HiOutlineShoppingBag, 
  HiOutlineStopCircle, 
  HiOutlineTicket 
} from "react-icons/hi2";
import Navbar from "../Components/navBar.jsx";
import PageTitle from "../Components/pageTitle.jsx";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout, removeSuccess } from "../Components/features/User/userSlice";
import { toast } from "react-toastify";
import "../Styles/profile.css";

function Profile({ user }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout())
      .unwrap()
      .then(() => {
        toast.success("Signout Successful", { position: "top-center", autoClose: 3000 });
        dispatch(removeSuccess());
        navigate("/");
      })
      .catch(() => {
        toast.error("Signout Failed", { position: "top-center", autoClose: 3000 });
      });
  };

  if (!user) {
    return (
      <div className="profile-loading-wrapper">
        <Navbar />
        <p>Loading user profile context records...</p>
      </div>
    );
  }

  return (
    <div className="profile-page-wrapper">
      <PageTitle title="My Account - HomeBuzz" />
      <Navbar />

      <main className="profile-page">
        <div className="profile-layout-grid">
          
          {/* Left Column Component Card */}
          <section className="profile-card" aria-label="User Account Summary">
            <div className="avatar-wrapper-block">
              <div className="profilePic">
                <img 
                  src={user?.profilepic?.url || "/fallback-avatar.png"} 
                  alt={`${user?.name || 'User'}'s avatar`} 
                  className="profileImg" 
                />
              </div>
              <Link to="/profile/update" className="edit-avatar-btn" aria-label="Edit Profile Details">
                <HiOutlinePencil />
              </Link>
            </div>

            <h2 className="profile-name">{user?.name}</h2>
            <p className="profile-email">{user?.email}</p>
            <span className={`role-badge ${user?.role || "user"}`}>
              Role: {user?.role || "user"}
            </span>
            
            <p className="profileCreatedOn">
              Member Since: {user?.createdAt ? String(user.createdAt).slice(0, 10) : "N/A"}
            </p>

            {user?.role === "admin" && (
              <Link to="/admin" className="admin-dash-link">
                <button type="button" className="adminDashboard">Admin Dashboard</button>
              </Link>
            )}
          </section>

          {/* Right Column Interactive Directories List */}
          <section className="profile-menu-container" aria-label="Account Action Links">
            <div className="profile-menu">
              <ProfileItem icon={<HiOutlineCog6Tooth />} label="Settings" />
              <Link to="/user/orders" className="userOrder">
                <ProfileItem icon={<HiOutlineShoppingBag />} label="Order Details" />
              </Link>
              <ProfileItem icon={<HiOutlineTicket />} label="Coupons & Offers" />
              <ProfileItem icon={<HiOutlineQuestionMarkCircle />} label="Help Centre" />
              
              {/* Contextual Conditional Store Control Interfaces Mapping */}
              {user?.role === "admin" ? null : user?.role === "seller" ? (
                user?.sellerInfo?.status === "approved" ? (
                  <Link to="/seller" className="userOrder">
                    <ProfileItem icon={<HiOutlineStopCircle />} label="My Store Dashboard" highlight />
                  </Link>
                ) : (
                  <ProfileItem icon={<HiOutlineStopCircle />} label="Store Approval Pending" highlight disabled />
                )
              ) : (
                <Link to="/createstore" className="userOrder">
                  <ProfileItem icon={<HiOutlineStopCircle />} label="Create Seller Store" highlight />
                </Link>
              )}
            </div>

            <button type="button" className="logout-btn" onClick={handleLogout}>
              <HiArrowRightOnRectangle size={18} />
              Sign Out Account
            </button>
          </section>

        </div>
      </main>
    </div>
  );
}

function ProfileItem({ icon, label, highlight, disabled }) {
  return (
    <div className={`profile-item ${highlight ? "highlight" : ""} ${disabled ? "disabled" : ""}`}>
      <div className="item-left">
        <span className="item-icon">{icon}</span>
        <span className="item-label-text">{label}</span>
      </div>
      <span className="item-arrow">›</span>
    </div>
  );
}

export default Profile;