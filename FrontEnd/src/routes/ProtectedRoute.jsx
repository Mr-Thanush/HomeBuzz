import React from "react";
import { Navigate } from "react-router-dom";
import Loader from "../Components/loader"; // Path adjusted to match your structure

/**
 * Higher-Order Route Guard for securing authenticated view layouts.
 * Prevents unauthorized access and handles async user loading safely.
 */
export default function ProtectedRoute({ 
  isAllowed, 
  redirectTo = "/signin", 
  children, 
  loading = false 
}) {
  // Prevent aggressive redirect flashes while token profiles load asynchronously
  if (loading) {
    return <Loader />;
  }

  // Gracefully bounce unauthorized identities out to the specified landing route
  if (!isAllowed) {
    return <Navigate to={redirectTo} replace />;
  }

  return children;
}