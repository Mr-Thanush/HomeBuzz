import "../Styles/navBar.css";
import { BsBookmarkHeart, BsBagCheck } from "react-icons/bs";
import { FiSearch } from "react-icons/fi";
import { FaChevronLeft } from "react-icons/fa";
import { HiOutlineUserCircle,HiOutlineUserPlus} from "react-icons/hi2";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const isHome = location.pathname === "/";
  const {isAuthenticated,user}=useSelector(state=>state.user || {});
  const {likeItems}=useSelector(state=>state.like || {});

 
  return (
    <nav className={`navbar ${isHome ? "navbar-home" : "navbar-store"}`}>
      
      {!isHome && (
        <button className="back-btn" onClick={() => navigate(-1)}>
          <FaChevronLeft size={16} />
        </button> 
      )}

      <div className="nav-logo">
        <Link to="/" className="links">HomeBuzz</Link>
      </div> 

      <div className="nav-icons">
        <Link to="/search" className="nav-item">
          <FiSearch size={16} />
        </Link>

        <Link to="/like" className="nav-item">
        <p className="likedItemsCount">{likeItems.length}</p>
          <BsBookmarkHeart size={16} />
        </Link>
{isAuthenticated ? (
      <Link to="/profile" className="nav-item">
{user?.profilepic?.url ? (
      <img src={user.profilepic.url} alt="Profile" className="nav-ProfilPic" />
    ) : (
      <HiOutlineUserCircle size={20} />
    )}
    </Link>
  ) : (
    <Link to="/signin" className="nav-item">
    <HiOutlineUserPlus size={20} />
    </Link>
  )}

      </div>
    </nav>
  );
}

export default Navbar;
