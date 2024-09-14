import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Modal from 'react-modal';
import styles from "/src/styles/PerfilCliente.module.css";
import { Button, ListGroup, ListGroupItem, Spinner } from 'reactstrap';
import { Pagination } from '@mui/material'; // Importa el componente Pagination de MUI

const API_URL = import.meta.env.VITE_API_URL;

Modal.setAppElement('#root');

export default function PerfilCliente() {
    const [cliente, setCliente] = useState(null);
    const [direcciones, setDirecciones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [confirmDeleteModalIsOpen, setConfirmDeleteModalIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('datos-generales');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const DIRECTIONS_PER_PAGE = 3;
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCliente = async () => {
            const token = localStorage.getItem("authToken");
    
            if (!token) {
                navigate("/login");
                return;
            }
    
            try {
                const response = await axios.get(`${API_URL}/perfil-cliente`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
    
                setCliente(response.data.cliente);
    
                if (!response.data.cliente.telefono) {
                    setModalIsOpen(true);
                }
            } catch (error) {
                if (error.response && error.response.status === 404) {
                    navigate('/agregar-cliente');
                } else {
                    console.error("Error fetching cliente data:", error);
                }
            } finally {
                setLoading(false);
            }
        };
    
        fetchCliente();
    }, [navigate]);
    
    useEffect(() => {
        const fetchDirecciones = async () => {
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
                    params: { id_cliente: clienteId, page: currentPage },
                    headers: { Authorization: `Bearer ${token}` }
                });

                setDirecciones(direccionesData.direcciones || []);
                setTotalPages(direccionesData.totalPages || 1);
            } catch (error) {
                console.error("Error fetching direcciones:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDirecciones();
    }, [currentPage, navigate]);

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    const handleDeleteAccount = () => {
        setConfirmDeleteModalIsOpen(true);
    };

    const handleConfirmDelete = async () => {
        const token = localStorage.getItem("authToken");

        if (!token) {
            navigate("/login");
            return;
        }

        try {
            await axios.delete(`${API_URL}/perfil-cliente`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            alert("Cuenta eliminada.");
            localStorage.removeItem("authToken");
            navigate("/login");
        } catch (error) {
            console.error("Error al eliminar cuenta:", error);
        } finally {
            setConfirmDeleteModalIsOpen(false);
        }
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };

    const handleAddData = () => {
        navigate('/agregar-cliente');
        closeModal();
    };

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    if (loading) {
        return <p className={styles.loading}>Cargando...</p>;
    }

    if (!cliente) {
        return <p className={styles.error}>No se encontró la información del cliente.</p>;
    }

    return (
        <div className={styles.profileContainer}>
            <div className={styles.header}>
                <img src="/src/assets/logo.png" alt="Avatar" className={styles.avatar} />
                <div className={styles.headerLeft}>
                    <div className={styles.headerText}>
                        <h2>{cliente.nombre || '-'} {cliente.apellido || '-'}</h2>
                        <p>{cliente.email || '-'}</p>
                    </div>
                </div>
                <div className={styles.headerRight}>
                    <p className={styles.clientCode}>Código: {cliente.id || 'N/A'}</p>
                </div>
            </div>

            <nav className={styles.navMenu}>
                <a
                    href="#datos-generales"
                    className={`${styles.navLink} ${activeTab === 'datos-generales' ? styles.active : ''}`}
                    onClick={() => handleTabClick('datos-generales')}
                >
                    Datos Generales
                </a>
                <a
                    href="#direcciones"
                    className={`${styles.navLink} ${activeTab === 'direcciones' ? styles.active : ''}`}
                    onClick={() => handleTabClick('direcciones')}
                >
                    Direcciones favoritas
                </a>
            </nav>

            <div className={styles.profileContent}>
                {activeTab === 'datos-generales' && (
                    <div className={styles.profileDetails}>
                        <div className={styles.detailsGrid}>
                            <div>
                                <p className={styles.detailsLabel}>DUI:</p>
                                <p>{cliente.dui || '-'}</p>
                            </div>
                            <div>
                                <p className={styles.detailsLabel}>Teléfono:</p>
                                <p>{cliente.telefono || '-'}</p>
                            </div>
                            <div>
                                <p className={styles.detailsLabel}>Nombre Comercial:</p>
                                <p>{cliente.nombre_comercial || '-'}</p>
                            </div>
                            <div>
                                <p className={styles.detailsLabel}>Tipo Persona:</p>
                                <p>{cliente.id_tipo_persona || '-'}</p>
                            </div>
                            <div>
                                <p className={styles.detailsLabel}>Es Contribuyente:</p>
                                <p>{cliente.es_contribuyente ? 'Sí' : 'No'}</p>
                            </div>
                            <div>
                                <p className={styles.detailsLabel}>Departamento:</p>
                                <p>{cliente.id_departamento || '-'}</p>
                            </div>
                            <div>
                                <p className={styles.detailsLabel}>ID Municipio:</p>
                                <p>{cliente.id_municipio || '-'}</p>
                            </div>
                            <div>
                                <p className={styles.detailsLabel}>NIT:</p>
                                <p>{cliente.nit || '-'}</p>
                            </div>
                            <div>
                                <p className={styles.detailsLabel}>NRC:</p>
                                <p>{cliente.nrc || '-'}</p>
                            </div>
                            <div>
                                <p className={styles.detailsLabel}>Giro:</p>
                                <p>{cliente.giro || '-'}</p>
                            </div>
                            <div>
                                <p className={styles.detailsLabel}>Nombre Empresa:</p>
                                <p>{cliente.nombre_empresa || '-'}</p>
                            </div>
                            <div>
                                <p className={styles.detailsLabel}>Dirección:</p>
                                <p>{cliente.direccion || '-'}</p>
                            </div>
                        </div>
                    </div>
                )}
                {activeTab === 'direcciones' && (
                    <div className={styles.direccionesClienteContainer}>
                        {loading ? (
                            <div className={styles.loading}>
                                <Spinner color="primary" />
                            </div>
                        ) : (
                            <>
                                {direcciones.length === 0 ? (
                                    <div className={styles.emptyMessage}>No tienes direcciones registradas.</div>
                                ) : (
                                    <>
                                        <ListGroup className={styles.listGroup}>
                                            {direcciones.slice((currentPage - 1) * DIRECTIONS_PER_PAGE, currentPage * DIRECTIONS_PER_PAGE).map(direccion => (
                                                <ListGroupItem key={direccion.id} className={styles.listItem}>
                                                    <div className={styles.direccionDetails}>
                                                        <h4 className={styles.direccionTitle}>{direccion.direccion}</h4>
                                                        <p><strong>Nombre de Contacto:</strong> {direccion.nombre_contacto}</p>
                                                        <p><strong>Teléfono:</strong> {direccion.telefono}</p>
                                                        <p><strong>Referencia:</strong> {direccion.referencia}</p>
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
                                            />
                                        </div>
                                    </>
                                )}
                            </>
                        )}
                    </div>
                )}
            </div>

            {activeTab === 'datos-generales' && (
                <div className={styles.actions}>
                    <button onClick={() => navigate(`/editar-cliente`)} className={styles.editButton}>
                        Editar Perfil
                    </button>
                </div>
            )}

            {/* Modal for Profile Incompletion */}
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Complete Your Profile"
                className={styles.modal}
                overlayClassName={styles.overlay}
            >
                <h2>Completa tu perfil</h2>
                <p>Por favor, ingresa los datos necesarios para completar tu perfil.</p>
                <button onClick={handleAddData} className={styles.addDataButton}>
                    Agregar Datos
                </button>
                <button onClick={closeModal} className={styles.closeModalButton}>
                    Cerrar
                </button>
            </Modal>
        </div>
    );
}
