import React, { useState } from 'react';
import { Button, ListGroup, ListGroupItem, Spinner, Alert } from 'reactstrap';
import PropTypes from 'prop-types';
import { Pagination } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate
import styles from '../styles/Direcciones.module.css'; // Asegúrate de que este archivo tenga las clases correctas

const SeleccionarDireccion = ({ direcciones, onDireccionSelect, loading, error }) => {
    
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const DIRECTIONS_PER_PAGE = 2;

    const navigate = useNavigate(); // Define navigate

    const handleSelect = (direccion) => {
        localStorage.setItem("selectedAddress", JSON.stringify(direccion));
        onDireccionSelect(direccion);
    };

    const handleSearch = (event) => {
        setSearchQuery(event.target.value);
        setCurrentPage(1);
    };

    const handlePageChange = (event, newPage) => {
        setCurrentPage(newPage);
    };

    const filteredDirecciones = direcciones.filter(direccion =>
        direccion.nombre_contacto.toLowerCase().includes(searchQuery.toLowerCase()) ||
        direccion.direccion.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalPages = Math.ceil(filteredDirecciones.length / DIRECTIONS_PER_PAGE);

    return (
        <div className={styles.direccionesClienteContainer}>
            <div className={styles.header}>
                <input
                    type="text"
                    placeholder="Buscar dirección..."
                    value={searchQuery}
                    onChange={handleSearch}
                    className={styles.searchInput}
                />
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
            ) : filteredDirecciones.length === 0 ? (
                <div className={styles.emptyMessage}>No hay direcciones disponibles.</div>
            ) : (
                <>
                    <ListGroup className={styles.listGroup}>
                        {filteredDirecciones
                            .slice((currentPage - 1) * DIRECTIONS_PER_PAGE, currentPage * DIRECTIONS_PER_PAGE)
                            .map((direccion) => (
                                <ListGroupItem key={direccion.id} className={styles.listItem}>
                                    <div className={styles.direccionDetails}>
                                        <h4 className={styles.direccionTitle}>{direccion.direccion}</h4>
                                        <p><strong>Nombre de Contacto:</strong> {direccion.nombre_contacto}</p>
                                        <p><strong>Departamento:</strong> {direccion.departamento_nombre}</p>
                                        <p><strong>Municipio:</strong> {direccion.municipio_nombre}</p>
                                    </div>
                                    <div className={styles.actionButtons}>
                                        <Button
                                            color="primary"
                                            onClick={() => handleSelect(direccion)}
                                        >
                                            Seleccionar
                                        </Button>
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

SeleccionarDireccion.propTypes = {
    direcciones: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number.isRequired,
        nombre_contacto: PropTypes.string.isRequired,
        direccion: PropTypes.string.isRequired,
        departamento_nombre: PropTypes.string.isRequired,
        municipio_nombre: PropTypes.string.isRequired,
    })).isRequired,
    onDireccionSelect: PropTypes.func.isRequired,
    loading: PropTypes.bool,
    error: PropTypes.string,
};

export default SeleccionarDireccion;
