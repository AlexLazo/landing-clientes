import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, ListGroup, ListGroupItem, Spinner, Alert } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/Direcciones.module.css';
import ModalEditarDireccion from './ModalEditarDireccion';

const API_URL = import.meta.env.VITE_API_URL;

const DireccionesCliente = () => {
    const [direcciones, setDirecciones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [direccionToEdit, setDireccionToEdit] = useState(null);
    const [direccionToDelete, setDireccionToDelete] = useState(null);
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
                    params: { id_cliente: clienteId },
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
    }, [navigate, modalOpen]); // Add modalOpen to dependencies to refetch when modal closes

    const handleEdit = (direccion) => {
        setDireccionToEdit(direccion);
        setModalOpen(true);
    };

    const handleSave = async () => {
        setModalOpen(false);
        // Refetch or update the state to reflect changes
        const token = localStorage.getItem('authToken');

        try {
            const { data: clienteData } = await axios.get(`${API_URL}/perfil-cliente`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const clienteId = clienteData.cliente.id;

            const { data: direccionesData } = await axios.get(`${API_URL}/direcciones`, {
                params: { id_cliente: clienteId },
                headers: { Authorization: `Bearer ${token}` }
            });

            setDirecciones(direccionesData.direcciones || []);
        } catch (error) {
            handleError(error);
        }
    };

    const handleDelete = (id) => {
        setDireccionToDelete(id);
        setModalOpen(true);
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
            setModalOpen(false);
        } catch (error) {
            setError('Error al eliminar la dirección.');
        }
    };

    const closeModal = () => {
        setModalOpen(false);
    };

    return (
        <div className={styles.direccionesClienteContainer}>
            <div className={styles.header}>
                <h1 className={styles.title}>Direcciones del Cliente</h1>
                <Button
                    color="primary"
                    className={styles.buttonAgregar}
                    onClick={() => navigate('/agregar-direccion')}
                >
                    Agregar Dirección
                </Button>
            </div>

            {loading ? (
                <div className={styles.loading}>
                    <Spinner color="primary" />
                </div>
            ) : error ? (
                <Alert color="danger">{error}</Alert>
            ) : direcciones.length === 0 ? (
                <div className={styles.emptyMessage}>No tienes direcciones registradas.</div>
            ) : (
                <>
                    <h2 className={styles.subtitle}>Direcciones Registradas</h2>
                    <ListGroup className={styles.listGroup}>
                        {direcciones.map(direccion => (
                            <ListGroupItem key={direccion.id} className={styles.listItem}>
                                <div className={styles.direccionDetails}>
                                    <h5 className={styles.direccionTitle}>{direccion.direccion}</h5>
                                    <p><strong>Nombre de Contacto:</strong> {direccion.nombre_contacto}</p>
                                    <p><strong>Teléfono:</strong> {direccion.telefono}</p>
                                    <p><strong>Referencia:</strong> {direccion.referencia}</p>
                                </div>
                                <div className={styles.actionButtons}>
                                    <Button
                                        color="warning"
                                        className={styles.buttonEditar}
                                        onClick={() => handleEdit(direccion)}
                                    >
                                        Editar
                                    </Button>
                                    <Button
                                        color="danger"
                                        className={styles.buttonEliminar}
                                        onClick={() => handleDelete(direccion.id)}
                                    >
                                        Eliminar
                                    </Button>
                                </div>
                            </ListGroupItem>
                        ))}
                    </ListGroup>
                </>
            )}

            {modalOpen && (
                <ModalEditarDireccion
                    isOpen={modalOpen}
                    onClose={closeModal}
                    direccion={direccionToEdit}
                    onSave={handleSave}
                />
            )}
        </div>
    );
};

export default DireccionesCliente;
