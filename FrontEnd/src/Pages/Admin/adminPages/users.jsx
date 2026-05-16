import { useDispatch, useSelector } from "react-redux";
import Navbar from "../../../Components/navBar";
import PageTitle from "../../../Components/pageTitle";
import { useEffect } from "react";
import { deleteSingleUser, fetchAdminUsers, removeErrors, removeMessage } from "../../../Components/features/AdminSeller/adminSlice";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";


export default function Users() {
  const {loading,error,users,message}=useSelector(state=>state.admin);
  const dispatch=useDispatch();
  const navigate=useNavigate();

  useEffect(()=>{
     dispatch(fetchAdminUsers());
  },[dispatch]);


    const handleDelete=(userId)=>{
      const confirm=window.confirm("Are You Sure You Wan't To Delete This User?");
      if(confirm){
        dispatch(deleteSingleUser(userId));
      }
    }

      useEffect(() => {
      if (error) {
        toast.error(error, {
          position: "top-center",
          autoClose: 3000,
        });
        dispatch(removeErrors());
      }
      if (message) {
        toast.success(message, {
          position: "top-center",
          autoClose: 3000,
        });
        dispatch(removeMessage());
      }
    }, [dispatch, error,message]);



  return (
    <>
    <Navbar/>
    <PageTitle title="Admin Users View"/>
    <section className="admin-page2">
      <h1>All Users</h1>

      {users?.map((user)=>(
        <div className="admin-table" key={user._id}>
        <div className="admin-row">
          <span><b>Name:</b>{user.name}</span>
          <span><b>Email:</b>{user.email}</span>
          <span className="badge user"><b>Role:</b>{user.role}</span>
          <span><b>Created At:</b>{user.createdAt?.slice(0,10)}</span>
          <span><b>Updated At:</b>{user.updatedAt?.slice(0,10)}</span>
          <div className="buttonsProducts">

          <Link to={`/admin/user/${user._id}`}>
          <button className="update">update</button>
          </Link>
          <button className="danger"
          disabled={loading}
          onClick={()=>handleDelete(user._id)}>{loading ? "Deleting..." : "Delete"}</button>
          </div>
        </div>
      </div>
    ))}
    </section>
    </>
  );
}

