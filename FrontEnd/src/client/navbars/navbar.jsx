import React, { useState } from "react";
import "./navbar.css";
import { useNavigate, useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faCartShopping, faHeart, faUser, faUserPlus } from "@fortawesome/free-solid-svg-icons";

function Navbar() {
  const [name, setName] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = true;

  return (
    <div className="nav">
      {location.pathname !== "/" && (
        <div className="BackBtn" onClick={() => navigate(-1)} >
          <FontAwesomeIcon icon={faAngleLeft} />
        </div>
      )}

      <Link to="/" className="Home"> <h1 className="name">Home Buzz</h1></Link>

      <div className="links">
        <Link to="/wishlist" className="wishlist">
          <FontAwesomeIcon icon={faHeart} className="icon"/>
          <span>Wishlist</span>
        </Link>

        <Link to="/cart" className="cart">
          <FontAwesomeIcon icon={faCartShopping} className="icon"/>
          <span>Cart</span>
        </Link>

        {isAuthenticated ? (
          <Link to="/profile" className="profile">
            <FontAwesomeIcon icon={faUser} className="icon" />
            <span>Profile</span>
          </Link>
        ) : (
          <Link to="/signup" className="profile">
            <FontAwesomeIcon icon={faUserPlus} />
            <span>Sign Up</span>
          </Link>
        )}
      </div>
    </div>
  );

}

export default Navbar;