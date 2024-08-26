import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaTimes, FaUser, FaEdit, FaBox, FaTruck, FaTrashAlt, FaSignOutAlt } from 'react-icons/fa';
import './Sidebar.css';
import { useAuth } from '/src/services/AuthContext'; // Ajusta la ruta según tu estructura

const Sidebar = () => {
  const { logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  const handleLogout = useCallback(() => {
    logout();
    // Redirige al usuario a la página de inicio u otra página relevante después del cierre de sesión
  }, [logout]);

  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-toggle" onClick={toggleSidebar} role="button" aria-label={isOpen ? 'Close Sidebar' : 'Open Sidebar'}>
        {isOpen ? <FaTimes className="toggle-icon" /> : <FaBars className="toggle-icon" />}
      </div>
      <nav className="sidebar-menu">
        <ul>
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
            <Link to="/ordenes">
              <FaBox className="menu-icon" />
              {isOpen && <span>Órdenes</span>}
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
          <li>
            <button onClick={handleLogout} className="logout-button">
              <FaSignOutAlt className="menu-icon" />
              {isOpen && <span>Cerrar Sesión</span>}
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
