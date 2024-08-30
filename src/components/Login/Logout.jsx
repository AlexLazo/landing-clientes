import React from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    // Actualiza el estado de autenticación en el AuthContext
    setIsAuthenticated(false);
    navigate('/login');
  };
  

  return (
    <button onClick={handleLogout}>Cerrar sesión</button>
  );
};

export default Logout;
