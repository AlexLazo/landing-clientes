import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../../services/AuthService"; // Asegúrate de importar el AuthService

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    AuthService.logout(); // Asegúrate de que el AuthService esté siendo utilizado
    navigate("/login");
  }, [navigate]);

  return null;
};

export default Logout;