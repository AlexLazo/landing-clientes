import React, { useState } from "react";
import axios from "axios";
import styles from "/src/styles/TrackingOrden.module.css";
import { useNavigate } from "react-router-dom"; // Importar useNavigate para redirección

const API_URL = import.meta.env.VITE_API_URL;

export default function TrackingOrden() {
    const [numeroSeguimiento, setNumeroSeguimiento] = useState("");
    const [trackingData, setTrackingData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate(); // Usar useNavigate para redireccionar

    const handleInputChange = (e) => {
        setNumeroSeguimiento(e.target.value);
    };

    const handleTrackOrder = async () => {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem('authToken'); // Obtener el token del almacenamiento local

        if (!token) {
            navigate('/login'); // Redirigir al login si no hay token
            return;
        }

        try {
            const response = await axios.get(`${API_URL}/paquete/tracking-paquete/${numeroSeguimiento}`, {
                headers: { Authorization: `Bearer ${token}` } // Incluir el token en las cabeceras
            });
            console.log("Datos de la API:", response.data); // Verifica los datos aquí
            setTrackingData(response.data);
        } catch (error) {
            console.error("Error en la API:", error); // Muestra el error en la consola
            setError("No se encontró el paquete o ocurrió un error.");
        } finally {
            setLoading(false);
        }
    };

    const renderProgressBar = (estado) => {
        const estados = [
            { id: 1, nombre: "En Tránsito", icono: "pe-7s-plane" },
            { id: 2, nombre: "En Ruta de Entrega", icono: "pe-7s-road" },
            { id: 3, nombre: "Recibido en Destino", icono: "pe-7s-flag" },
            { id: 4, nombre: "En Almacén", icono: "pe-7s-box2" },
            { id: 5, nombre: "En Espera de Recolección", icono: "pe-7s-upload" },
            { id: 6, nombre: "Reprogramado", icono: "pe-7s-refresh" },
            { id: 7, nombre: "En Proceso de Retorno", icono: "pe-7s-back" },
            { id: 8, nombre: "Devuelto", icono: "pe-7s-home" },
            { id: 9, nombre: "Dañado", icono: "pe-7s-attention" },
            { id: 10, nombre: "Perdido", icono: "pe-7s-close-circle" },
            { id: 11, nombre: "Entregado", icono: "pe-7s-check" },
            { id: 12, nombre: "Cancelado", icono: "pe-7s-check-circle" },
        ];

        const currentStep = estados.findIndex(step => step.nombre === estado);

        return (
            <div className={styles.steps}>
                {estados.map((step, index) => (
                    <div
                        key={step.id}
                        className={`${styles.step} ${index <= currentStep ? styles.completed : ""}`}
                    >
                        <div className={styles.stepIconWrap}>
                            <div className={styles.stepIcon}>
                                <i className={step.icono}></i>
                            </div>
                        </div>
                        <h4 className={styles.stepTitle}>{step.nombre}</h4>
                        {index < estados.length - 1 && <div className={styles.stepConnector}></div>}
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className={styles.trackingContainer}>
            <h1>Seguimiento de Paquete</h1>

            <div className={styles.inputContainer}>
                <input
                    type="text"
                    value={numeroSeguimiento}
                    onChange={handleInputChange}
                    placeholder="Ingresa el número de seguimiento"
                    className={styles.trackingInput}
                />
                <button onClick={handleTrackOrder} className={styles.trackButton}>
                    Buscar
                </button>
            </div>

            {loading && <p className={styles.loading}>Cargando...</p>}
            {error && <p className={styles.error}>{error}</p>}

            {trackingData.length === 0 && !loading && !error && (
                <p>No se han encontrado datos. Intenta con otro número de seguimiento.</p>
            )}

            {trackingData.length > 0 && (
                <div className={styles.orderDetails}>
                    <h2>Detalles del Paquete</h2>
                    {trackingData.map((movimiento) => (
                        <div key={movimiento.id_paquete} className={styles.package}>
                            <h4>ID Paquete: {movimiento.id_paquete}</h4>
                            <div>{renderProgressBar(movimiento.estado)}</div>
                            <p><strong>Número de Ingreso:</strong> {movimiento.numero_ingreso}</p>
                            <p><strong>Fecha de Movimiento:</strong> {new Date(movimiento.fecha_movimiento).toLocaleString()}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
