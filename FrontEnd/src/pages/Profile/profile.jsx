import React, { useEffect, useState } from "react";
import "./profile.css";
import { Link, useNavigate } from "react-router-dom";
import API_URL from "../../api";

function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Signout
  const handleSignout = async () => {
    try {
      await fetch(`${API_URL}/api/v1/signout`, {
        method: "POST",
        credentials: "include",
      });
      navigate("/signin");
    } catch (error) {
      console.log("Signout error:", error);
    }
  };

  const handleCreateStore = async () => {
  // after successful store creation
  setUser(prev => ({ ...prev, hasStore: true }));
};


  // Fetch user data
  const fetchUser = async () => {
    try {
      const res = await fetch(`${API_URL}}/api/v1/me`, {
        credentials: "include",
      });
      if (!res.ok) {
        navigate("/signin");
        return;
      }
      const data = await res.json();
      setUser(data.user); // backend returns { user: {...} }
    } catch (error) {
      console.log("Fetch user error:", error);
      navigate("/signin");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  if (loading) return <h2>Loading...</h2>;
  if (!user) return null;

  return (
    <div className="Profile">
      {/* Profile Info */}
      <div className="profileSection1">
        <div className="image">
          <img
            src={user.image || "/default.jpg"}
            alt={user.name}
            className="ProfilePic"
          />
        </div>
        <div className="profileDetails">
          <h1 className="ProfileName">{user.name}</h1>
          <h6>{user.about || "No description"}</h6>
          <p className="email">{user.email}</p>
        </div>
      </div>

      <hr />

      {/* Actions */}
      <div className="profileSection2">
        <Link to="/orders">
          <button className="orders">Orders</button>
        </Link>
        <button className="help">Help Desk</button>
        {!user.hasStore ? (
          <Link to="/createstore">
            <button className="sell">Create Store</button>
          </Link>
        ) : (
          <Link to="/store">
            <button className="storebtn">Go to Store</button>
          </Link>
        )}
        <button className="settings">Settings</button>
      </div>

      {/* Logout */}
      <div className="profileSection3">
        <button className="logoutProfile" onClick={handleSignout}>
          Signout
        </button>
      </div>
    </div>
  );
}

export default Profile;