import { useEffect, useState } from "react";
import Navbar from "../../../Components/navBar";
import PageTitle from "../../../Components/pageTitle";
import "../admin.css";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getSingleUser, removeErrors, removeSuccess, updateSingleUser } from "../../../Components/features/AdminSeller/adminSlice";
import { toast } from "react-toastify";

export default function UpdateUserRole() {
  const {userId}=useParams();
  const dispatch=useDispatch();
  const navigate=useNavigate();
  const {user,loading,error,success}=useSelector(state=>state.admin);

   useEffect(()=>{
    dispatch(getSingleUser(userId));
  },[dispatch])

  const [formData,setFormData]=useState({
    name:"",
    email:"",
    role:""
  })

  const{name,email,role}=formData;

  useEffect(()=>{
     if(user){
      setFormData({
        name:user.name||"",
        email:user.email||"",
        role:user.role||""
      })
     }
  },[user]);


  const handleChange=(e)=>{
     setFormData({...formData,[e.target.name]:e.target.value})
  }
 


  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateSingleUser({userId,role}));
  };



   useEffect(() => {
      if (error) {
        toast.error(error.message, {
          position: "top-center",
          autoClose: 3000,
        });
        dispatch(removeErrors());
      }
    }, [dispatch, error]);

     useEffect(() => {
      if (success) {
        toast.success("Role Updated Successfully", {
          position: "top-center",
          autoClose: 3000,
        });
        dispatch(removeSuccess());
        navigate('/admin/users')
      }
    }, [dispatch, success]);


  return (
    <> 
    <Navbar/>
    <PageTitle title='UpdateUser-Admin'/>
    <section className="updateUser">
      <div className="updateUserCard">
        <h1 className="updateUserTitle">Update User Role</h1>

        <form className="updateUserForm" onSubmit={handleSubmit}>
          <div className="formGroup">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              readOnly
              id="name"
              name="name"
              value={name}
              required
            />
          </div>

          <div className="formGroup">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              readOnly
              name="email"
              value={email}
              required
            />
          </div>

          <div className="formGroup">
            <label htmlFor="role">Role</label>
            <select 
            value={role}
            name="role"
            id="role"
            onChange={handleChange}>
              <option value="">Select Role</option>
              <option value="seller">Seller</option>
              <option value="user">User</option>
            </select>
          </div>

          <button type="submit" className="updateBtn">
            Save Changes
          </button>
        </form>
      </div>
    </section>
    </>
  );
}