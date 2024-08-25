import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { useAuth } from '../services/AuthContext';

// Componente de ruta protegida
const PrivateRoute = ({ element, ...rest }) => {
  const { isAuthenticated } = useAuth();

  return (
    <Route
      {...rest}
      element={isAuthenticated ? element : <Navigate to="/login" />}
    />
  );
};

export default PrivateRoute;
