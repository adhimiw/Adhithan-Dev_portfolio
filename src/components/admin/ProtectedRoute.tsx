import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { isAuthenticated } from '../../services/authService';

interface ProtectedRouteProps {
  children?: React.ReactNode; // Allow children for wrapping layouts
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  if (!isAuthenticated()) {
    // User not authenticated, redirect to login page
    // Include the current location to redirect back after login
    return <Navigate to="/admin/login" replace />;
  }

  // User is authenticated
  // Render the children (e.g., AdminLayout) or Outlet for nested routes
  if (children) {
    return <React.Fragment>{children}</React.Fragment>;
  }

  return <Outlet />;
};

export default ProtectedRoute;
