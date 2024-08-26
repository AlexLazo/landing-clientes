import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    document.body.classList.toggle('dark-mode', darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <header className="header">
      <nav className="navbar">
        <div className="logo">
          <img
            src={'/src/assets/logo-dark.png'}
            alt="Company Logo"
            className="logo-img"
          />
        </div>
        <ul className="nav-links">
          <li><Link to="/">Inicio</Link></li>
          <li><Link to="/about">Sobre Nosotros</Link></li>
          <li><Link to="/services">Nuestros Servicios</Link></li>
          <li><Link to="/contact">Contactanos</Link></li>
          <li><Link to="/faq">FAQ</Link></li>
        </ul>
        <div className="header-actions">
          <Link to="/login" className="login-button">Login</Link>
          <button onClick={toggleDarkMode} className="mode-toggle">
            {darkMode ? '🌙' : '☀️'}
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Header;
