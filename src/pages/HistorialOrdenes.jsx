import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, ListGroup, ListGroupItem, Spinner, Alert, Input } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import { Pagination } from '@mui/material';
import styles from '../styles/HistorialOrdenes.module.css';

const API_URL = import.meta.env.VITE_API_URL;
const ORDENES_PER_PAGE = 10;

const HistorialOrdenesCliente = () => {
    const [ordenes, setOrdenes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('authToken');

            if (!token) {
                navigate('/login'); // Redirigir si no hay token
                return;
            }

            try {
                setLoading(true);

                // Obtener el perfil del cliente para extraer el ID del cliente
                const { data: clienteData } = await axios.get(`${API_URL}/perfil-cliente`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                const clienteId = clienteData.cliente.id; // Extrae el ID del cliente

                // Construir la URL sin el parámetro de búsqueda
                const fetchUrl = `${API_URL}/mis-ordenes?id_cliente=${clienteId}&page=${currentPage}`;

                console.log('Fetching data from:', fetchUrl);

                const { data } = await axios.get(fetchUrl, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                console.log('Fetched data:', data);

                // Si la respuesta es un array, se ajusta el estado
                setOrdenes(Array.isArray(data) ? data : []);
                setTotalPages(Math.ceil(data.length / ORDENES_PER_PAGE)); // Establecer total de páginas
            } catch (error) {
                handleError(error);
            } finally {
                setLoading(false);
            }
        };

        const handleError = (error) => {
            if (error.response) {
                setError(`Error: ${error.response.data.message || 'Error al cargar las órdenes.'}`);
            } else {
                setError('Error al cargar las órdenes.');
            }
        };

        fetchData();
    }, [navigate, currentPage]);

    const handleSearch = (event) => {
        setSearchQuery(event.target.value);
        setCurrentPage(1); // Resetear a la primera página en una nueva búsqueda
    };

    const handlePageChange = (event, newPage) => {
        setCurrentPage(newPage);
    };

    return (
        <div className={styles.historialOrdenesContainer}>
            <div className={styles.header}>
                <h1 className={styles.title}>Historial de Órdenes</h1>
                <Input
                    type="text"
                    placeholder="Buscar por concepto o ID de orden"
                    className={styles.searchInput}
                    onChange={handleSearch}
                />
            </div>
            {loading ? (
                <div className={styles.loading}>
                    <Spinner color="primary" />
                </div>
            ) : error ? (
                <Alert color="danger">{error}</Alert>
            ) : ordenes.length === 0 ? (
                <div className={styles.emptyMessage}>No tienes órdenes registradas.</div>
            ) : (
                <>
                    <ListGroup className={styles.listGroup}>
                        {ordenes.map(orden => (
                            <ListGroupItem key={orden.id} className={styles.listItem}>
                                <div className={styles.ordenDetails}>
                                    <h4 className={styles.ordenTitle}>Concepto: {orden.concepto}</h4>
                                    <p><strong>Total a Pagar:</strong> {orden.total_pagar}</p>
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
