import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from '../services/AuthContext';

const PrivateRoute = ({ element, ...rest }) => {
  const { isAuthenticated } = useAuth();
  console.log('isAuthenticated en PrivateRoute:', isAuthenticated); // Log para depuración
  return isAuthenticated ? element : <Navigate to="/login" />;
};

export default PrivateRoute;
