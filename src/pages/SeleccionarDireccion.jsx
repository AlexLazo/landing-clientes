import React, { useState, useEffect } from 'react';
import { Button, ListGroup, ListGroupItem, Spinner, Alert } from 'reactstrap';
import PropTypes from 'prop-types';
import { Pagination } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/Direcciones.module.css';

const SeleccionarDireccion = ({ direcciones, onDireccionSelect, loading, error }) => {
    
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedRecoleccion, setSelectedRecoleccion] = useState(null);
    const [selectedEntrega, setSelectedEntrega] = useState(null);
    const DIRECTIONS_PER_PAGE = 2;

    const handleSelectRecoleccion = (direccion) => {
        setSelectedRecoleccion(direccion);
        localStorage.setItem("selectedRecoleccion", JSON.stringify(direccion));
    };

    const handleSelectEntrega = (direccion) => {
        setSelectedEntrega(direccion);
        localStorage.setItem("selectedEntrega", JSON.stringify(direccion));
    };

    const handleSearch = (event) => {
        setSearchQuery(event.target.value);
        setCurrentPage(1);
    };

    const handlePageChange = (event, newPage) => {
        setCurrentPage(newPage);
    };

    // Verificar si ambas direcciones están seleccionadas y llamar a onDireccionSelect
    useEffect(() => {
        if (selectedRecoleccion && selectedEntrega) {
            onDireccionSelect({
                recoleccion: selectedRecoleccion,
                entrega: selectedEntrega,
            });
        }
    }, [selectedRecoleccion, selectedEntrega, onDireccionSelect]);

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
                    {!selectedRecoleccion ? (
                        <>
                            <h5>Seleccionar Dirección de Recolección</h5>
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
                                                    onClick={() => handleSelectRecoleccion(direccion)}
                                                >
                                                    Seleccionar Recolección
                                                </Button>
                                            </div>
                                        </ListGroupItem>
                                    ))}
                            </ListGroup>
                        </>
                    ) : (
                        <>
                            <h5>Seleccionar Dirección de Entrega</h5>
                            <ListGroup className={styles.listGroup}>
                                {filteredDirecciones
                                    .filter((direccion) => direccion.id !== selectedRecoleccion.id)
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
                                                    onClick={() => handleSelectEntrega(direccion)}
                                                >
                                                    Seleccionar Entrega
                                                </Button>
                                            </div>
                                        </ListGroupItem>
                                    ))}
                            </ListGroup>
                        </>
                    )}

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
