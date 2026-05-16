import { HiArrowRightOnRectangle, HiOutlineCog6Tooth, HiOutlinePencil, HiOutlineQuestionMarkCircle, HiOutlineShoppingBag, HiOutlineStopCircle, HiOutlineTicket, HiOutlineUserCircle } from "react-icons/hi2";
import Navbar from "../Components/navBar";
import PageTitle from "../Components/pageTitle";
import "../Styles/profile.css";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout, removeSuccess } from "../Components/features/User/userSlice";
import { toast } from "react-toastify";

function Profile({ user }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();


  const handleLogout = () => {
    dispatch(logout())
      .unwrap()
      .then(() => {
        toast.success("Signout Successful", {
          position: "top-center",
          autoClose: 3000,
        })
        dispatch(removeSuccess())
        navigate('/')
      })
      .catch((error) => {
        toast.error("Signout Failed", {
          position: "top-center",
          autoClose: 3000,
        })
      })
  }
  return (
    <div className="profile-page">
      <PageTitle title="Profile - HomeBuzz" />
      <Navbar />

      {/* Profile Card */}
      <div className="profile-card">
        <div className="profile-div">
          <button className="edit"><Link to="/profile/update" className="editLink"><HiOutlinePencil /></Link></button>
          <div className="profilePic">
            <img src={user.profilepic ? user.profilepic.url : "Profile"} alt="Profile Picture" className="profileImg" />
          </div>
        </div>

        <h2 className="profile-name">{user.name}</h2>
        <p className="profile-email">{user.email}</p>
        <p className="profile-role">Role: {user.role || "user"}</p>
        <p className="profileCreatedOn">Created On:{user?.createdAt
          ? String(user.createdAt).slice(0, 10)
          : "N/A"
        }
        </p>
        {user.role === "admin" && <Link to="/admin"><button className="adminDashboard">Admin Dashboard</button></Link>}

        {/* <p className="profile-bio">
          Passionate about homemade food and handcrafted products.
        </p> */}
      </div>


      <div className="profile-menu">
        <ProfileItem icon={<HiOutlineCog6Tooth />} label="Settings" />
        <Link to="/user/orders" className="userOrder"><ProfileItem icon={<HiOutlineShoppingBag />} label="Order Details" /></Link>
        <ProfileItem icon={<HiOutlineTicket />} label="Coupons" />
        <ProfileItem icon={<HiOutlineQuestionMarkCircle />} label="Help Centre" />
     {user?.role === "admin" ? null : user?.role === "seller" ? (
        user?.sellerInfo?.status === "approved" ? (
          <Link to="/seller" className="userOrder">
            <ProfileItem
              icon={<HiOutlineStopCircle />}
              label="My Store"
              highlight
            />
          </Link>
        ) : (
          <ProfileItem
            icon={<HiOutlineStopCircle />}
            label="Store Approval Pending"
            highlight
          />
        )
      ) : (
        <Link to="/createstore" className="userOrder">
          <ProfileItem
            icon={<HiOutlineStopCircle />}
            label="Create Store"
            highlight
          />
        </Link>
      )}
      </div>


      <button className="logout-btn" onClick={handleLogout}>
        <HiArrowRightOnRectangle size={18} />
        Sign Out
      </button>
    </div>
  );
}

function ProfileItem({ icon, label, highlight }) {
  return (
    <div className={`profile-item ${highlight ? "highlight" : ""}`}>
      <div className="item-left">
        <span className="item-icon">{icon}</span>
        <span>{label}</span>
      </div>
      <span className="item-arrow">›</span>
    </div>
  );
}

export default Profile;