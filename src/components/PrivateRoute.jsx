import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { useAuth } from '../services/AuthContext'; // Asegúrate de que el contexto esté exportado desde AuthContext

const PrivateRoute = ({ element: Component, ...rest }) => {
  const { isAuthenticated } = useAuth();

  return (
    <Route
      {...rest}
      element={isAuthenticated ? Component : <Navigate to="/login" />}
    />
  );
};

export default PrivateRoute;
