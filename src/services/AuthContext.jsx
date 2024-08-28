import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from './AuthService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar autenticación del usuario al cargar el componente
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (token) {
          // Aquí podrías verificar la validez del token si es necesario
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
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
      AuthService.logout(); // Asegúrate de que AuthService.logout esté limpiando el localStorage
      localStorage.removeItem('authToken'); // Limpia el token del localStorage
      setIsAuthenticated(false);
      navigate('/login'); // Redirige a la página de inicio de sesión
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>; // O una mejor solución de carga, como un spinner
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
