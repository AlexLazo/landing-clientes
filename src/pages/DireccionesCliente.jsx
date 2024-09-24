import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, ListGroup, ListGroupItem, Spinner, Alert } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import { Pagination } from '@mui/material';
import styles from '../styles/Direcciones.module.css';
import "../styles/Direcciones.css";
import ModalEditarDireccion from './ModalEditarDireccion';

const API_URL = import.meta.env.VITE_API_URL;
const DIRECTIONS_PER_PAGE = 3;

const DireccionesCliente = () => {
    const [direcciones, setDirecciones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalDeleteOpen, setModalDeleteOpen] = useState(false); // Nuevo estado para eliminar
    const [direccionToEdit, setDireccionToEdit] = useState(null);
    const [direccionToDelete, setDireccionToDelete] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('authToken');

            if (!token) {
                navigate('/login');
                return;
            }

            try {
                const { data: clienteData } = await axios.get(`${API_URL}/perfil-cliente`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                const clienteId = clienteData.cliente.id;

                const { data: direccionesData } = await axios.get(`${API_URL}/direcciones`, {
                    params: { id_cliente: clienteId, page: currentPage, search: searchQuery },
                    headers: { Authorization: `Bearer ${token}` }
                });

                setDirecciones(direccionesData.direcciones || []);
            } catch (error) {
                handleError(error);
            } finally {
                setLoading(false);
            }
        };

        const handleError = (error) => {
            if (error.response) {
                setError(`Error: ${error.response.data.message || 'Error al cargar las direcciones.'}`);
            } else {
                setError('Error al cargar las direcciones.');
            }
        };

        fetchData();
    }, [navigate, modalOpen, currentPage, searchQuery]);

    const handleEdit = (direccion) => {
        setDireccionToEdit(direccion);
        setModalOpen(true);
    };

    const handleSave = async () => {
        setModalOpen(false);
        const token = localStorage.getItem('authToken');

        try {
            const { data: clienteData } = await axios.get(`${API_URL}/perfil-cliente`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const clienteId = clienteData.cliente.id;

            const { data: direccionesData } = await axios.get(`${API_URL}/direcciones`, {
                params: { id_cliente: clienteId, page: currentPage, search: searchQuery },
                headers: { Authorization: `Bearer ${token}` }
            });

            setDirecciones(direccionesData.direcciones || []);
        } catch (error) {
            handleError(error);
        }
    };

    const handleDelete = (id) => {
        setDireccionToDelete(id);
        setModalDeleteOpen(true); // Abre el modal de confirmación
    };

    const confirmDelete = async () => {
        const token = localStorage.getItem('authToken');

        if (!token) {
            navigate('/login');
            return;
        }

        try {
            await axios.delete(`${API_URL}/direcciones/${direccionToDelete}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setDirecciones(prevDirecciones => prevDirecciones.filter(d => d.id !== direccionToDelete));
            setModalDeleteOpen(false); // Cierra el modal tras eliminar
        } catch (error) {
            setError('Error al eliminar la dirección.');
        }
    };

    const closeDeleteModal = () => {
        setModalDeleteOpen(false); // Cierra el modal de eliminación
    };

    const handleSearch = (event) => {
        setSearchQuery(event.target.value);
        setCurrentPage(1);
    };

    const handlePageChange = (event, newPage) => {
        setCurrentPage(newPage);
    };

    const totalPages = Math.ceil(direcciones.length / DIRECTIONS_PER_PAGE);

    return (
        <div className="direccionesClienteContainer">
            <div className="header-Direcciones">
                <h1 className="title-Direcciones">Direcciones del Cliente</h1>
                <Button
                    color="primary"
                    className="buttonAgregar"
                    onClick={() => navigate('/agregar-direccion')}
                >
                    Agregar Dirección
                </Button>
            </div>
            {loading ? (
                <div className="loading">
                    <Spinner color="primary" />
                </div>
            ) : error ? (
                <Alert color="danger">{error}</Alert>
            ) : direcciones.length === 0 ? (
                <div className="emptyMessage">No tienes direcciones registradas.</div>
            ) : (
                <>
                    <h2 className="subtitle">Direcciones Registradas</h2>
                    <ListGroup className="listGroup">
                        {direcciones.slice((currentPage - 1) * DIRECTIONS_PER_PAGE, currentPage * DIRECTIONS_PER_PAGE).map(direccion => (
                            <ListGroupItem key={direccion.id} className="listItem">
                                <div className="direccionDetails">
                                    <h4 className="direccionTitle">{direccion.direccion}</h4>
                                    <p><strong>Nombre de Contacto:</strong> {direccion.nombre_contacto}</p>
                                    <p><strong>Teléfono:</strong> {direccion.telefono}</p>
                                    <p><strong>Referencia:</strong> {direccion.referencia}</p>
                                </div>
                                <div className="actionButtons">
                                    <Button
                                        color="warning"
                                        className="buttonEditar"
                                        onClick={() => handleEdit(direccion)}
                                    >
                                        Editar
                                    </Button>
                                    <Button
                                        color="danger"
                                        className="buttonEliminar"
                                        onClick={() => handleDelete(direccion.id)}
                                    >
                                        Eliminar
                                    </Button>
                                </div>
                            </ListGroupItem>
                        ))}
                    </ListGroup>

                    <div className="paginationContainer">
                        <Pagination
                            count={totalPages}
                            page={currentPage}
                            onChange={handlePageChange}
                            color="primary"
                            variant="outlined"
                            shape="rounded"
                        />
                    </div>
                </>
            )}

            {modalOpen && (
                <ModalEditarDireccion
                    isOpen={modalOpen}
                    onClose={() => setModalOpen(false)}
                    direccion={direccionToEdit}
                    onSave={handleSave}
                />
            )}

            {modalDeleteOpen && (
                <div className="modalDeleteOverlay">
                    <div className="modalDelete">
                        <p>¿Estás seguro que deseas eliminar esta dirección?</p>
                        <Button color="danger" onClick={confirmDelete}>
                            Confirmar
                        </Button>
                        <Button color="secondary" onClick={closeDeleteModal}>
                            Cancelar
                        </Button>
                    </div>
                </div>
            )}

        </div>
    );
};

export default DireccionesCliente;
