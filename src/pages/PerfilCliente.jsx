import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Modal from 'react-modal';
import styles from "/src/styles/PerfilCliente.module.css";

const API_URL = import.meta.env.VITE_API_URL;

Modal.setAppElement('#root');

export default function PerfilCliente() {
    const [cliente, setCliente] = useState(null);
    const [loading, setLoading] = useState(true);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [confirmDeleteModalIsOpen, setConfirmDeleteModalIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('datos-generales'); // New state for active tab
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCliente = async () => {
            const token = localStorage.getItem("token");

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
                    setModalIsOpen(true); // Open the modal if profile is incomplete
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

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    const handleDeleteAccount = () => {
        setConfirmDeleteModalIsOpen(true); // Open confirmation modal
    };

    const handleConfirmDelete = async () => {
        try {
            const token = localStorage.getItem("token");

            if (!token) {
                navigate("/login");
                return;
            }

            await axios.delete(`${API_URL}/clientes/${cliente.id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            alert("Cuenta eliminada.");
            localStorage.removeItem("token");
            localStorage.removeItem("clienteId");
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
                <a href="#datos-generales" className={`${styles.navLink} ${activeTab === 'datos-generales' ? styles.active : ''}`} onClick={() => handleTabClick('datos-generales')}>Datos Generales</a>
                <a href="#direcciones" className={`${styles.navLink} ${activeTab === 'direcciones' ? styles.active : ''}`} onClick={() => handleTabClick('direcciones')}>Direcciones favoritas</a>
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
                    <div className={styles.addressSection}>
                        {/* Placeholder for Address Section */}
                        <p>Direcciones favoritas</p>
                    </div>
                )}
            </div>

            {activeTab === 'datos-generales' && (
                <div className={styles.actions}>
                    <button onClick={() => navigate(`/editar-cliente`)} className={styles.editButton}>
                        Editar Perfil
                    </button>
                    <button onClick={handleDeleteAccount} className={styles.deleteButton}>
                        Eliminar Cuenta
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

            {/* Modal for Account Deletion Confirmation */}
            <Modal
                isOpen={confirmDeleteModalIsOpen}
                onRequestClose={() => setConfirmDeleteModalIsOpen(false)}
                contentLabel="Confirm Account Deletion"
                className={styles.modal}
                overlayClassName={styles.overlay}
            >
                <h2>Confirmar Eliminación de Cuenta</h2>
                <p>¿Estás seguro de que deseas eliminar tu cuenta? Esta acción es irreversible.</p>
                <button onClick={handleConfirmDelete} className={styles.confirmDeleteButton}>
                    Confirmar
                </button>
                <button onClick={() => setConfirmDeleteModalIsOpen(false)} className={styles.closeModalButton}>
                    Cancelar
                </button>
            </Modal>
        </div>
    );
}
