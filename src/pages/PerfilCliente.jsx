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

                const isProfileComplete = response.data.cliente.telefono; 
                if (!isProfileComplete) {
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

    const handleDeleteAccount = async () => {
        try {
            const token = localStorage.getItem("token");

            if (!token) {
                navigate("/login");
                return;
            }

            await axios.delete(`${API_URL}/perfil-cliente`, {
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
            <h2>Perfil del Cliente</h2>
            <div className={styles.profileInfo}>
                <p><strong>Nombre:</strong> {cliente.nombre}</p>
                <p><strong>Apellido:</strong> {cliente.apellido}</p>
                <p><strong>Correo Electrónico:</strong> {cliente.email}</p>
                <p><strong>DUI:</strong> {cliente.dui}</p>
                <p><strong>Teléfono:</strong> {cliente.telefono}</p>
                <p><strong>Dirección:</strong> {cliente.direccion}</p>
            </div>
            <div className={styles.actions}>
                <button onClick={() => navigate(`/editar-cliente`)} className={styles.editButton}>
                    Editar Perfil
                </button>
                <button onClick={handleDeleteAccount} className={styles.deleteButton}>
                    Eliminar Cuenta
                </button>
            </div>

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
