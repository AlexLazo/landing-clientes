import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaBars, FaTimes, FaUser, FaEdit, FaLocationArrow, FaBoxOpen, FaHistory, FaSignOutAlt, FaCaretDown, FaSearch, FaListAlt, FaRocket } from 'react-icons/fa';
import './Sidebar.css';
import { useAuth } from '/src/services/AuthContext';
import DarkModeSwitch from './DarkModeSwitch';

const Encabezado = () => {
  const { logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => JSON.parse(localStorage.getItem("darkMode")) || false);
  const ordersRef = useRef(null);
  const isMobile = window.innerWidth <= 768;

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
    document.body.classList.toggle('dark-mode', darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  const toggleMenu = useCallback(() => {
    setIsOpen(prev => !prev);
    if (isOrdersOpen) {
      setIsOrdersOpen(false);
    }
  }, [isOrdersOpen]);

  const handleLogout = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const handleConfirmLogout = useCallback(() => {
    logout();
    setIsModalOpen(false);
    navigate('/login');
  }, [logout, navigate]);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const handleOrdersToggle = useCallback((e) => {
    e.stopPropagation();
    setIsOrdersOpen(prev => !prev);
  }, []);

  const handleMenuItemClick = useCallback(() => {
    if (isMobile) {
      setIsOpen(false);
    }
    setIsOrdersOpen(false);
  }, [isMobile]);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (ordersRef.current && !ordersRef.current.contains(e.target)) {
        setIsOrdersOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  const isAgregarClientePage = location.pathname === '/agregar-cliente';

  return (
    <>
      <div className={`encabezado ${isOpen ? 'open' : ''}`}>
        <div className="encabezado-content">
          <div className="encabezado-logo">
            <img src="/logo.png" alt="Logo" />
          </div>
          <div className="encabezado-toggle" onClick={toggleMenu}>
            {isOpen ? <FaTimes /> : <FaBars />}
          </div>
          <nav className={`encabezado-menu ${isOpen ? 'open' : ''}`}>
            <ul>
              <li><DarkModeSwitch darkMode={darkMode} toggleDarkMode={toggleDarkMode} /></li>
              {!isAgregarClientePage && (
                <>
                  <li>
                    <Link to="/perfil-cliente" onClick={handleMenuItemClick}>
                      <FaUser className="menu-icon" />
                      <span>Perfil</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/editar-cliente" onClick={handleMenuItemClick}>
                      <FaEdit className="menu-icon" />
                      <span>Editar Perfil</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/direcciones-cliente" onClick={handleMenuItemClick}>
                      <FaLocationArrow className="menu-icon" />
                      <span>Direcciones</span>
                    </Link>
                  </li>
                  <li className={`dropdown ${isOrdersOpen ? 'open' : ''}`} ref={ordersRef}>
                    <button onClick={handleOrdersToggle} className="menu-link">
                      <FaBoxOpen className="menu-icon" />
                      <span>Órdenes</span>
                      <FaCaretDown className={`caret-icon ${isOrdersOpen ? 'open' : ''}`} />
                    </button>
                    <div className="dropdown-menu">
                      <Link to="/historial-ordenes" className="dropdown-item" onClick={handleMenuItemClick}>
                        <FaHistory className="dropdown-icon" />Historial de órdenes
                      </Link>
                      <Link to="/TrackingPage" className="dropdown-item" onClick={handleMenuItemClick}>
                        <FaSearch className="dropdown-icon" />Tracking
                      </Link>
                      <Link to="/pre-orden" className="dropdown-item" onClick={handleMenuItemClick}>
                        <FaListAlt className="dropdown-icon" />Pre-orden
                      </Link>
                      <Link to="/pre-ordenexpress" className="dropdown-item" onClick={handleMenuItemClick}>
                        <FaRocket className="dropdown-icon" />Pre-orden Express
                      </Link>
                    </div>
                  </li>
                </>
              )}
              <li>
                <button onClick={handleLogout} className="logout-button">
                  <FaSignOutAlt className="menu-icon" />
                  <span>Cerrar Sesión</span>
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
      <div className="encabezado-spacer"></div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Confirmación</h2>
            <p>¿Estás seguro de que deseas cerrar sesión?</p>
            <button onClick={handleConfirmLogout} className="confirm-button">Sí</button>
            <button onClick={handleCloseModal} className="cancel-button">No</button>
          </div>
        </div>
      )}
    </>
  );
};

export default Encabezado;