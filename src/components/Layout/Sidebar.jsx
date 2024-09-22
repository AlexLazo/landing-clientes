import React, { useState, useCallback, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaBars, FaTimes, FaUser, FaEdit, FaLocationArrow, FaTruck, FaBoxOpen, FaHistory, FaSignOutAlt, FaCaretDown, FaBox, FaSearch, FaListAlt, FaRocket } from 'react-icons/fa';
import './Sidebar.css';
import { useAuth } from '/src/services/AuthContext';

const Sidebar = () => {
  const { logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true); // Sidebar abierto por defecto
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false); // Nuevo estado para manejar el submenú

  const toggleSidebar = useCallback(() => {
    setIsOpen(prev => {
      if (prev) {
        // Si se está cerrando el sidebar, también cierra el submenú
        setIsOrdersOpen(false);
      }
      return !prev;
    });
  }, []);

  const handleLogout = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const handleConfirmLogout = useCallback(() => {
    logout();
    setIsModalOpen(false);
    navigate('/login'); // Redirige al login después de cerrar sesión
  }, [logout, navigate]);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const handleOrdersToggle = useCallback(() => {
    if (isOpen) {
      setIsOrdersOpen(prev => !prev);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (isOpen && !e.target.closest('.sidebar') && !e.target.closest('.sidebar-toggle')) {
        setIsOpen(false);
        setIsOrdersOpen(false); // Cierra el submenú cuando se hace clic fuera de la barra lateral
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen]);

  const isAgregarClientePage = location.pathname === '/agregar-cliente';

  return (
    <div className={`app-container ${isOpen ? 'sidebar-open' : ''}`}>
      <div className="main-content">
        <div className={`sidebar ${isOpen ? 'open' : ''}`}>
          <div className="sidebar-toggle" onClick={toggleSidebar} role="button" aria-label={isOpen ? 'Close Sidebar' : 'Open Sidebar'}>
            {isOpen ? <FaTimes className="toggle-icon" /> : <FaBars className="toggle-icon" />}
          </div>
          <div className="sidebar-logo">
            <img src="/logo.png" alt="Logo" />
          </div>
          <nav className="sidebar-menu">
            <ul>
              {!isAgregarClientePage && (
                <>
                  <li>
                    <Link to="/perfil-cliente">
                      <FaUser className="menu-icon" />
                      {isOpen && <span>Perfil</span>}
                    </Link>
                  </li>
                  <li>
                    <Link to="/editar-cliente">
                      <FaEdit className="menu-icon" />
                      {isOpen && <span>Editar Perfil</span>}
                    </Link>
                  </li>
                  <li>
                    <Link to="/direcciones-cliente">
                      <FaLocationArrow className="menu-icon" />
                      {isOpen && <span>Direcciones</span>}
                    </Link>
                  </li>
                  <li className={`dropdown ${isOrdersOpen ? 'open' : ''}`}>
                    <button onClick={handleOrdersToggle} className="menu-link">
                      <FaBoxOpen className="menu-icon" />
                      {isOpen && <span>Órdenes</span>}
                      <FaCaretDown className={`caret-icon ${isOrdersOpen ? 'open' : ''}`} />
                    </button>
                    <div className="dropdown-menu">
                      <Link to="/historial-ordenes" className="dropdown-item"><FaHistory className="dropdown-icon" />Historial de órdenes</Link>
                      <Link to="/TrackingPage" className="dropdown-item"><FaSearch className="dropdown-icon" />Tracking</Link>
                      <Link to="/pre-orden" className="dropdown-item"><FaListAlt className="dropdown-icon" />Pre-orden</Link>
                      <Link to="/pre-ordenexpress" className="dropdown-item"><FaRocket className="dropdown-icon" />Pre-orden Express</Link>
                    </div>
                  </li>
                </>
              )}
              <li>
                <button onClick={handleLogout} className="logout-button">
                  <FaSignOutAlt className="menu-icon" />
                  {isOpen && <span>Cerrar Sesión</span>}
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>

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
    </div>
  );
};

export default Sidebar;
