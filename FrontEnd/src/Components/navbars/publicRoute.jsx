import { Navigate } from "react-router-dom";

function PublicRoute({ children }) {
  const isLoggedIn = document.cookie.includes("token");

  return isLoggedIn ? <Navigate to="/profile" /> : children;
}

export default PublicRoute;