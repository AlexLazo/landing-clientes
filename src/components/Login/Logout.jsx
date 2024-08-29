import React, { useEffect } from "react";
import AuthService from "../../services/authService";

const Logout = () => {
  useEffect(() => {
    AuthService.logout(); // Limpia el token y otros datos del localStorage
    window.location.href = "/login"; // Redirige al login después de cerrar sesión
  }, []);

  return null;
};

export default Logout;
