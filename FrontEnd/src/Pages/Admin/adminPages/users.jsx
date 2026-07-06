import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import PageTitle from "../../../Components/pageTitle";
import { fetchAdminUsers, deleteSingleUser, removeErrors, removeMessage } from "../../../Components/features/AdminSeller/adminSlice";
import Loader from "../../../Components/loader";

export default function Users() {
  const dispatch = useDispatch();
  const { loading, error, users = [], message } = useSelector((state) => state.admin || {});

  useEffect(() => {
    dispatch(fetchAdminUsers());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(removeErrors());
    }
    if (message) {
      toast.success(message);
      dispatch(removeMessage());
    }
  }, [dispatch, error, message]);

  const handleDelete = (userId) => {
    if (window.confirm("Are you entirely sure you want to permanently delete this account?")) {
      dispatch(deleteSingleUser(userId));
    }
  };

  return (
    <>
      <PageTitle title="Admin Users View" />
      <section className="admin-section-wrapper">
        <div className="admin-header-row">
          <div>
            <h1 className="admin-main-heading">User Accounts Registry</h1>
            <p className="admin-subheading">Perform access provisioning modifications, privilege leveling and removals.</p>
          </div>
        </div>

        {loading && users.length === 0 ? (
          <Loader />
        ) : (
          <div className="table-responsive-wrapper">
            <table className="modern-admin-table">
              <thead>
                <tr>
                  <th>Identity Details</th>
                  <th>System Access Tier</th>
                  <th>Registration Date</th>
                  <th>Last Modification</th>
                  <th className="text-right">Access Controls</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td>
                      <div className="cell-primary-text">{user.name}</div>
                      <div className="cell-secondary-text">{user.email}</div>
                    </td>
                    <td>
                      <span className={`role-badge ${user.role || 'user'}`}>
                        {user.role}
                      </span>
                    </td>
                    <td>{user.createdAt ? user.createdAt.slice(0, 10) : 'N/A'}</td>
                    <td>{user.updatedAt ? user.updatedAt.slice(0, 10) : 'N/A'}</td>
                    <td className="text-right">
                      <div className="action-button-group">
                        <Link to={`/admin/user/${user._id}`} className="action-btn update-btn">
                          Modify Role
                        </Link>
                        <button 
                          className="action-btn delete-btn"
                          disabled={loading}
                          onClick={() => handleDelete(user._id)}
                        >
                          {loading ? "Removing..." : "Delete Account"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}