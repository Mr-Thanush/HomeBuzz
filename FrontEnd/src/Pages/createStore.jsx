import { useEffect, useState } from "react";
import Navbar from "../Components/navBar";
import PageTitle from "../Components/pageTitle";
import "../Styles/updateProfile.css";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../Components/loader";
import { toast } from "react-toastify";
import { removeErrors, removeSuccess, updateProfile } from "../Components/features/User/userSlice";

function UpdateProfile() {
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [discription, setDiscription] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const [profilePicPreview, setProfilePicPreview] = useState("");
  const { loading, error, success, message, user, isAuthenticated } = useSelector(
    (state) => state.user
  );

  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated === false) {
      navigate("/signin");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (error) {
      toast.error(error, {
        position: "top-center",
        autoClose: 3000,
      });
      dispatch(removeErrors());
    }
  }, [dispatch, error]);

  useEffect(() => {
    if (success) {
      toast.success(message, {
        position: "top-center",
        autoClose: 3000,
      });
      dispatch(removeSuccess());
      navigate("/profile")
    }
  }, [dispatch, success, message, navigate]);

  const profilePicChange = (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      if (reader.readyState === 2) {
        setProfilePicPreview(reader.result);
        setProfilePic(reader.result);
      }
    }

    reader.onerror = (error) => {
      toast.error("Error Reading File");
    }
    reader.readAsDataURL(file);

  }

  const submitHandler = (e) => {
    e.preventDefault();
    const payload = { name, email };
    if (profilePic) {
      payload.profilepic = profilePic;
    }
    dispatch(updateProfile(payload));
  }


  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);


  if (loading) return <Loader />;

  return (
    <div className="update-profile-page">
      <PageTitle title="Update Profile - HomeBuzz" />
      <Navbar />

      <div className="update-profile-container">
        <h2>Create Store</h2>

        <form className="update-profile-form" onSubmit={submitHandler}>
          <div className="profile-image-section" >
            <div className="profile-image">
              {user?.profilepic?.url ? (
                <img src={profilePicPreview || user.profilepic?.url} alt="Profile" name="profilepic" />
              ) : (
                <div className="default-avatar">👤</div>
              )}
            </div>

            <label className="upload-btn">
              Change Photo
              <input type="file" accept="image/*" onChange={profilePicChange} />
            </label>
          </div>

          {/* Form */}

          <div className="form-group">
            <label>Store Name</label>
            <input
              type="text"
              name="name"
              value={name || ""}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Store Email Address</label>
            <input
              type="email"
              name="email"
              value={email || ""}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Store Discription</label>
            <input
              type="text"
              name="discription"
              value={discription || ""}
              onChange={(e) => setDiscription(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Role</label>
            <input
              type="text"
              name="role"
              value="seller"
              onChange={(e) => setDiscription(seller)}
            />
          </div>


          <div className="updateBtns">
            <button type="submit" className="save-btn">
              Save Changes
            </button>

            <Link to="/password/update" className="updatePasswordBtn">
              <button type="button" className="changePass-btn">
                Update Password
              </button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UpdateProfile;