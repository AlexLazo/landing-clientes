import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaTimes, FaUser, FaEdit, FaBox, FaTruck, FaTrashAlt, FaSignOutAlt } from 'react-icons/fa';
import './Sidebar.css';
import { useAuth } from '/src/services/AuthContext'; // Ajusta la ruta según tu estructura

const Sidebar = () => {
    const { logout } = useAuth(); // Asume que tienes una función logout en tu AuthContext
    const [isOpen, setIsOpen] = useState(false);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    const handleLogout = () => {
        logout(); // Llama a la función logout cuando el usuario haga clic en "Cerrar Sesión"
    };

    return (
        <div className={`sidebar ${isOpen ? 'open' : ''}`}>
            <div className="sidebar-toggle" onClick={toggleSidebar}>
                {isOpen ? <FaTimes className="toggle-icon" /> : <FaBars className="toggle-icon" />}
            </div>
            <nav className="sidebar-menu">
                <ul>
                    <li>
                        <Link to="/perfil-cliente">
                            <FaUser className="menu-icon" /> Perfil
                        </Link>
                    </li>
                    <li>
                        <Link to="/editar-cliente/:id">
                            <FaEdit className="menu-icon" /> Editar Perfil
                        </Link>
                    </li>
                    <li>
                        <Link to="/ordenes">
                            <FaBox className="menu-icon" /> Órdenes
                        </Link>
                    </li>
                    <li>
                        <Link to="/rastreo">
                            <FaTruck className="menu-icon" /> Rastreo
                        </Link>
                    </li>
                    <li>
                        <Link to="/eliminar-cuenta">
                            <FaTrashAlt className="menu-icon" /> Eliminar Cuenta
                        </Link>
                    </li>
                    <li>
                        <button onClick={handleLogout} className="logout-button">
                            <FaSignOutAlt className="menu-icon" /> Cerrar Sesión
                        </button>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export default Sidebar;
