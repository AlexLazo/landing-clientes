import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Crear el contexto de autenticación
const AuthContext = createContext();

// Proveedor de autenticación
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Estado de autenticación
  const [loading, setLoading] = useState(true); // Estado de carga
  const navigate = useNavigate(); // Hook para la navegación

  useEffect(() => {
    // Verificar autenticación del usuario
    const checkAuth = () => {
      try {
        const token = localStorage.getItem('authToken');
        if (token) {
          // Aquí podrías verificar la validez del token si es necesario
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        // Manejo de errores
        console.error('Error checking authentication:', error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false); // Termina el estado de carga
      }
    };

    checkAuth();
  }, []);

  const login = (token) => {
    try {
      localStorage.setItem('authToken', token);
      setIsAuthenticated(true);
      navigate('/'); // Navega a la página de inicio después de iniciar sesión
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  const logout = () => {
    try {
      localStorage.removeItem('authToken');
      setIsAuthenticated(false);
      navigate('/login'); // Navega a la página de inicio de sesión después de cerrar sesión
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>; // O una mejor solución de carga
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para usar el contexto de autenticación
export const useAuth = () => useContext(AuthContext);
