import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Button, ListGroup, ListGroupItem, Spinner, Alert } from 'reactstrap';
import styles from '../styles/Direcciones.module.css'; // Importación correcta del CSS

const API_URL = import.meta.env.VITE_API_URL;

const DireccionesCliente = () => {
    const [direcciones, setDirecciones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('authToken');

            if (!token) {
                navigate('/login');
                return;
            }

            try {
                const { data: { id: clienteId } } = await axios.get(`${API_URL}/clientes`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                const { data: { direcciones = [] } } = await axios.get(`${API_URL}/direcciones/${clienteId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                setDirecciones(direcciones);
            } catch (error) {
                handleError(error);
            } finally {
                setLoading(false);
            }
        };

        const handleError = (error) => {
            if (error.response) {
                console.error('Response error:', error.response.data);
                if (error.response.status === 404) {
                    setError('Direcciones no encontradas.');
                } else {
                    setError(error.response.data.message || 'Error al cargar las direcciones.');
                }
            } else {
                console.error('Error:', error);
                setError('Error al cargar las direcciones.');
            }
        };        

        fetchData();
    }, [navigate]);

    const handleEdit = (direccion) => {
        navigate(`/editar-direccion/${direccion.id}`);
    };

    const handleDelete = async (id) => {
        const token = localStorage.getItem('authToken');

        if (!token) {
            navigate('/login');
            return;
        }

        try {
            await axios.delete(`${API_URL}/direcciones/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setDirecciones(prevDirecciones => prevDirecciones.filter(d => d.id !== id));
        } catch (error) {
            console.error('Error deleting dirección:', error);
            setError('Error al eliminar la dirección.');
        }
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
            <h2 className={styles.subtitle}>Direcciones Registradas</h2>
            {loading ? (
                <div className={styles.loading}>
                    <Spinner color="primary" />
                </div>
            ) : error ? (
                <Alert color="danger">{error}</Alert>
            ) : direcciones.length === 0 ? (
                <p className={styles.emptyMessage}>No tienes direcciones registradas.</p>
            ) : (
                <ListGroup className={styles.listGroup}>
                    {direcciones.map(direccion => (
                        <ListGroupItem key={direccion.id} className={styles.listItem}>
                            {direccion.direccion} - {direccion.nombre_contacto}
                            <div className={styles.actionButtons}>
                                <Button 
                                    color="info"
                                    className={`${styles.button} ${styles.buttonEditar}`}
                                    onClick={() => handleEdit(direccion)}
                                >
                                    Editar
                                </Button>
                                <Button 
                                    color="danger"
                                    className={`${styles.button} ${styles.buttonEliminar}`}
                                    onClick={() => handleDelete(direccion.id)}
                                >
                                    Eliminar
                                </Button>
                            </div>
                        </ListGroupItem>
                    ))}
                </ListGroup>
            )}
        </div>
    );
};

export default DireccionesCliente;
