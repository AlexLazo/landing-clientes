import React from "react";
import ClienteLogin from "../components/Login/ClienteLogin";
import logo from "../assets/logo-dark.png";
import "../styles/LoginCliente.css";

const LoginClientePage = ({ onLogin }) => {
  return (
    <div className="area">
      <div className="circles">
        <ul>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
        </ul>
      </div>
      <div className="context">
        <ClienteLogin logo={logo} onLogin={onLogin} />
      </div>
    </div>
  );
};

export default LoginClientePage;
