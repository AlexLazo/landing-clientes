import React, { useState, useCallback, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaBars, FaTimes, FaUser, FaEdit, FaLocationArrow, FaTruck, FaTrashAlt, FaSignOutAlt } from 'react-icons/fa';
import './Sidebar.css';
import { useAuth } from '/src/services/AuthContext'; // Ajusta la ruta según tu estructura

const Sidebar = () => {
  const { logout } = useAuth();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleSidebar = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  const handleLogout = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const handleConfirmLogout = useCallback(() => {
    logout();
    setIsModalOpen(false);
  }, [logout]);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (isOpen && !e.target.closest('.sidebar') && !e.target.closest('.sidebar-toggle')) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen]);

  // Check if the current route is 'AgregarCliente'
  const isAgregarClientePage = location.pathname === '/agregar-cliente';

  return (
    <>
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-toggle" onClick={toggleSidebar} role="button" aria-label={isOpen ? 'Close Sidebar' : 'Open Sidebar'}>
          {isOpen ? <FaTimes className="toggle-icon" /> : <FaBars className="toggle-icon" />}
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
                <li>
                  <Link to="/rastreo">
                    <FaTruck className="menu-icon" />
                    {isOpen && <span>Rastreo</span>}
                  </Link>
                </li>
                <li>
                  <Link to="/eliminar-cuenta">
                    <FaTrashAlt className="menu-icon" />
                    {isOpen && <span>Eliminar Cuenta</span>}
                  </Link>
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

export default Sidebar;
