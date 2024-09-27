import React, { useState, useEffect } from 'react';
import { Button, ListGroup, ListGroupItem, Spinner, Alert } from 'reactstrap';
import PropTypes from 'prop-types';
import { Pagination } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/Direcciones.module.css';

const SeleccionarDireccionExpress = ({ direcciones, onDireccionSelect, loading, error }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedRecoleccion, setSelectedRecoleccion] = useState(null);
    const [selectedEntrega, setSelectedEntrega] = useState(null);
    const DIRECTIONS_PER_PAGE = 2;
    const DEPARTAMENTO_RECOLECCION = 12;  // San Miguel
    const MUNICIPIO_RECOLECCION = 215;    // San Miguel

    const navigate = useNavigate();

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

    useEffect(() => {
        if (selectedRecoleccion && selectedEntrega) {
            onDireccionSelect({
                recoleccion: selectedRecoleccion,
                entrega: selectedEntrega,
            });
        }
    }, [selectedRecoleccion, selectedEntrega, onDireccionSelect]);

    // Filtrar direcciones para recolección
    const filteredDireccionesRecoleccion = direcciones.filter(direccion => 
        direccion.id_departamento === DEPARTAMENTO_RECOLECCION && 
        direccion.id_municipio === MUNICIPIO_RECOLECCION
    );

    // Filtrar direcciones para entrega
    const filteredDireccionesEntrega = direcciones.filter(direccion => 
        direccion.id_departamento === DEPARTAMENTO_RECOLECCION && 
        direccion.id_municipio === MUNICIPIO_RECOLECCION &&
        direccion.id !== (selectedRecoleccion ? selectedRecoleccion.id : null) // Excluir dirección de recolección seleccionada
    );

    // Aplicar filtro de búsqueda
    const searchedDireccionesRecoleccion = filteredDireccionesRecoleccion.filter(direccion =>
        direccion.nombre_contacto.toLowerCase().includes(searchQuery.toLowerCase()) ||
        direccion.direccion.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const searchedDireccionesEntrega = filteredDireccionesEntrega.filter(direccion =>
        direccion.nombre_contacto.toLowerCase().includes(searchQuery.toLowerCase()) ||
        direccion.direccion.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalPagesRecoleccion = Math.ceil(searchedDireccionesRecoleccion.length / DIRECTIONS_PER_PAGE);
    const totalPagesEntrega = Math.ceil(searchedDireccionesEntrega.length / DIRECTIONS_PER_PAGE);

    return (
        <div className="direccionesClienteContainer">
            <div className="header-Direcciones">
                <input
                    type="text"
                    placeholder="Buscar dirección..."
                    value={searchQuery}
                    onChange={handleSearch}
                    className="searchInput"
                />
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
            ) : (
                <>
                    {!selectedRecoleccion ? (
                        <>
                            <h5>Seleccionar Dirección de Recolección</h5>
                            {searchedDireccionesRecoleccion.length === 0 ? (
                                <div className="emptyMessage">
                                    No hay direcciones disponibles para recolección. Por favor, agregue una nueva dirección en la ciudad de San Miguel.
                                </div>
                            ) : (
                                <ListGroup className="listGroup">
                                    {searchedDireccionesRecoleccion
                                        .slice((currentPage - 1) * DIRECTIONS_PER_PAGE, currentPage * DIRECTIONS_PER_PAGE)
                                        .map((direccion) => (
                                            <ListGroupItem key={direccion.id} className="listItem">
                                                <div className="direccionDetails">
                                                    <h4 className="direccionTitle">{direccion.direccion}</h4>
                                                    <p><strong>Nombre de Contacto:</strong> {direccion.nombre_contacto}</p>
                                                    <p><strong>Departamento:</strong> {direccion.departamento_nombre}</p>
                                                    <p><strong>Municipio:</strong> {direccion.municipio_nombre}</p>
                                                </div>
                                                <div className="actionButtons">
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
                            )}
                            <div className="paginationContainer">
                                <Pagination
                                    count={totalPagesRecoleccion}
                                    page={currentPage}
                                    onChange={handlePageChange}
                                    color="primary"
                                    variant="outlined"
                                    shape="rounded"
                                />
                            </div>
                        </>
                    ) : (
                        <>
                            <h5>Seleccionar Dirección de Entrega</h5>
                            {searchedDireccionesEntrega.length === 0 ? (
                                <div className="emptyMessage">
                                    No hay direcciones disponibles para entrega en la ciudad de San Miguel. Por favor, agregue una nueva dirección en la ciudad de San Miguel.
                                </div>
                            ) : (
                                <ListGroup className="listGroup">
                                    {searchedDireccionesEntrega
                                        .slice((currentPage - 1) * DIRECTIONS_PER_PAGE, currentPage * DIRECTIONS_PER_PAGE)
                                        .map((direccion) => (
                                            <ListGroupItem key={direccion.id} className="listItem">
                                                <div className="direccionDetails">
                                                    <h4 className="direccionTitle">{direccion.direccion}</h4>
                                                    <p><strong>Nombre de Contacto:</strong> {direccion.nombre_contacto}</p>
                                                    <p><strong>Departamento:</strong> {direccion.departamento_nombre}</p>
                                                    <p><strong>Municipio:</strong> {direccion.municipio_nombre}</p>
                                                </div>
                                                <div className="actionButtons">
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
                            )}
                            <div className="paginationContainer">
                                <Pagination
                                    count={totalPagesEntrega}
                                    page={currentPage}
                                    onChange={handlePageChange}
                                    color="primary"
                                    variant="outlined"
                                    shape="rounded"
                                />
                            </div>
                        </>
                    )}
                </>
            )}
        </div>
    );
};

SeleccionarDireccionExpress.propTypes = {
    direcciones: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number.isRequired,
        nombre_contacto: PropTypes.string.isRequired,
        direccion: PropTypes.string.isRequired,
        departamento_nombre: PropTypes.string.isRequired,
        municipio_nombre: PropTypes.string.isRequired,
        id_departamento: PropTypes.number.isRequired,
        id_municipio: PropTypes.number.isRequired,
    })).isRequired,
    onDireccionSelect: PropTypes.func.isRequired,
    loading: PropTypes.bool,
    error: PropTypes.string,
};

export default SeleccionarDireccionExpress;
