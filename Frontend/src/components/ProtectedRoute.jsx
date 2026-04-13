import React from "react";
import { Navigate } from "react-router-dom";

export function ProtectedRoute({ children, allowedRoles }) {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role") || "USER";

  if (!token) {
    // Not logged in
    return <Navigate to="/signin" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    // Logged in but doesn't have required role
    return <Navigate to="/" replace />;
  }

  // Token exists and role is allowed
  return children;
}

export default ProtectedRoute;
