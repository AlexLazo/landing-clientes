import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "/src/services/authService";
import "/src/styles/LoginClientForm.css";
import { FiArrowLeft, FiLock } from "react-icons/fi";

const ClienteLogin = ({ logo, onLogin = () => {} }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const token = await AuthService.loginClient(email, password);
      if (token) {
        onLogin();
        navigate("/perfil-cliente"); // Redirige directamente al perfil del cliente
      } else {
        setError("Credenciales inválidas");
      }
    } catch (err) {
      console.error("Error de inicio de sesión:", err.message);
      setError("Credenciales inválidas");
    }
  };

  const handleForgotPassword = () => {
    navigate("/forget-password");
  };

  const handleRegister = () => {
    navigate("/register");
  };

  const handleHomeRedirect = () => {
    navigate("/");
  };

  return (
    <div className="client-login-form">
      <button className="home-button" onClick={handleHomeRedirect}>
        <FiArrowLeft className="home-icon" />
      </button>
      <div className="logo-container">
        <img src={logo} alt="Logo" className="logo" />
      </div>
      <h2>Bienvenido/a!</h2>
      <p>Inicia sesión para acceder a tu cuenta</p>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleLogin}>
        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Contraseña</label>
          <div className="password-input">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <span className="forgot-password" onClick={handleForgotPassword}>
            <FiLock className="password-icon" /> ¿Olvidaste tu contraseña?
          </span>
        </div>
        <button type="submit">Iniciar Sesión</button>
        <button
          type="button"
          onClick={handleRegister}
          className="register-button"
        >
          ¿No estás registrado? Regístrate aquí
        </button>
      </form>
    </div>
  );
};

export default ClienteLogin;
