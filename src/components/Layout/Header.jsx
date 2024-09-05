import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [lastScrollTop, setLastScrollTop] = useState(0);

  useEffect(() => {
    document.body.classList.toggle('dark-mode', darkMode);

    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

      if (scrollTop > lastScrollTop) {
        // Scrolling down
        setIsHidden(true);
      } else {
        // Scrolling up
        setIsHidden(false);
      }
      setLastScrollTop(scrollTop <= 0 ? 0 : scrollTop); // For Mobile or negative scrolling
    };

    window.addEventListener('scroll', handleScroll);

    // Cleanup on component unmount
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [darkMode, lastScrollTop]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <header className={`header ${isHidden ? 'hidden' : ''}`}>
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
