import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ isAllowed, redirectTo = "/signin", children, loading }) {
  if (loading) {
    return null;
  }

  if (!isAllowed) {
    return <Navigate to={redirectTo} replace />;
  }

  return children;
}
