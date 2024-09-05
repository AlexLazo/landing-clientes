import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, ListGroup, ListGroupItem, Spinner, Alert, Input } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import { Pagination } from '@mui/material'; // Importa el componente Pagination de MUI
import styles from '../styles/HistorialOrdenes.module.css';

const API_URL = import.meta.env.VITE_API_URL;
const HISTORIAL_PER_PAGE = 10;

const HistorialOrdenesCliente = () => {
    const [historial, setHistorial] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchHistorial = async () => {
            const token = localStorage.getItem('authToken');

            if (!token) {
                navigate('/login');
                return;
            }

            try {
                const fetchUrl = searchQuery
                    ? `${API_URL}/historial/${searchQuery}`
                    : `${API_URL}/historial/ordenes?page=${currentPage}`;
                
                const { data } = await axios.get(fetchUrl, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                // Asegúrate de que el historial sea un array
                setHistorial(Array.isArray(data) ? data : (data.historial || []));
            } catch (error) {
                handleError(error);
            } finally {
                setLoading(false);
            }
        };

        const handleError = (error) => {
            if (error.response) {
                setError(`Error: ${error.response.data.message || 'Error al cargar el historial.'}`);
            } else {
                setError('Error al cargar el historial.');
            }
        };

        fetchHistorial();
    }, [navigate, currentPage, searchQuery]); // Add dependencies

    const handleSearch = (event) => {
        setSearchQuery(event.target.value);
        setCurrentPage(1); // Reset to first page on new search
    };

    const handlePageChange = (event, newPage) => {
        setCurrentPage(newPage);
    };

    const totalPages = Math.ceil(historial.length / HISTORIAL_PER_PAGE);

    return (
        <div className={styles.historialOrdenesContainer}>
            <div className={styles.header}>
                <h1 className={styles.title}>Historial de Órdenes</h1>
                <Input
                    type="text"
                    placeholder="Buscar por número de seguimiento o ID de orden"
                    className={styles.searchInput}
                    value={searchQuery}
                    onChange={handleSearch}
                />
            </div>
            {loading ? (
                <div className={styles.loading}>
                    <Spinner color="primary" />
                </div>
            ) : error ? (
                <Alert color="danger">{error}</Alert>
            ) : historial.length === 0 ? (
                <div className={styles.emptyMessage}>No hay historial disponible.</div>
            ) : (
                <>
                    <ListGroup className={styles.listGroup}>
                        {historial.slice((currentPage - 1) * HISTORIAL_PER_PAGE, currentPage * HISTORIAL_PER_PAGE).map(orden => (
                            <ListGroupItem key={orden.id} className={styles.listItem}>
                                <div className={styles.ordenDetails}>
                                    <h4 className={styles.ordenTitle}>Número de Seguimiento: {orden.numero_seguimiento}</h4>
                                    <p><strong>Estado:</strong> {orden.estadoPaquete.descripcion}</p>
                                    <p><strong>Fecha:</strong> {new Date(orden.created_at).toLocaleDateString()}</p>
                                </div>
                            </ListGroupItem>
                        ))}
                    </ListGroup>

                    <div className={styles.paginationContainer}>
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
        </div>
    );
};

export default HistorialOrdenesCliente;
