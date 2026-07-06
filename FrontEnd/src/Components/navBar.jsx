import React from "react";
import "../Styles/navBar.css";
import { BsBookmarkHeart } from "react-icons/bs";
import { FiSearch } from "react-icons/fi";
import { FaChevronLeft } from "react-icons/fa";
import { HiOutlineUserCircle, HiOutlineUserPlus } from "react-icons/hi2";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const isHome = location.pathname === "/";
  const { isAuthenticated, user } = useSelector((state) => state.user || {});
  const { likeItems = [] } = useSelector((state) => state.like || {});

  // Safe checks for user profile pictures
  const hasCustomProfilePic = user?.profilepic?.url && user.profilepic.url !== "profile url";

  return (
    <nav className={`navbar ${isHome ? "navbar-home" : "navbar-store"}`}>
      {!isHome && (
        <button className="back-btn" onClick={() => navigate(-1)} aria-label="Go back">
          <FaChevronLeft size={16} />
        </button>
      )}

      <div className="nav-logo">
        <Link to="/" className="links">HomeBuzz</Link>
      </div>

      <div className="nav-icons">
        <Link to="/search" className="nav-item" aria-label="Search items">
          <FiSearch size={18} />
        </Link>

        {/* RELATIVE WRAPPER INSTANCE */}
        <Link to="/like" className="nav-item1" aria-label="View liked items">
          <BsBookmarkHeart size={18} />
          {likeItems.length > 0 && (
            <span className="likedItemsCount">{likeItems.length}</span>
          )}
        </Link>

        {isAuthenticated ? (
          <Link to="/profile" className="nav-item" aria-label="View Profile">
            {hasCustomProfilePic ? (
              <img src={user.profilepic.url} alt="User Profile" className="nav-ProfilPic" />
            ) : (
              <HiOutlineUserCircle size={24} />
            )}
          </Link>
        ) : (
          <Link to="/signin" className="nav-item" aria-label="Sign In">
            <HiOutlineUserPlus size={22} />
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;