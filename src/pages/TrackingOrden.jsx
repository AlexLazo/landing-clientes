import React, { useState } from "react";
import axios from "axios";
import styles from "/src/styles/TrackingOrden.module.css";

const API_URL = import.meta.env.VITE_API_URL;

export default function TrackingOrden() {
    const [numeroSeguimiento, setNumeroSeguimiento] = useState("");
    const [orden, setOrden] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleInputChange = (e) => {
        setNumeroSeguimiento(e.target.value);
    };

    const handleTrackOrder = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await axios.get(`${API_URL}/seguimiento-orden`, {
                params: { numero_seguimiento: numeroSeguimiento },
            });

            console.log("Respuesta del servidor:", response.data);
            setOrden(response.data);
        } catch (error) {
            console.error("Error fetching tracking data:", error);
            setError("No se encontró la orden o ocurrió un error.");
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
                        key={index}
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
            <h1>Seguimiento de Orden</h1>

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

            {orden && (
                <div className={styles.orderDetails}>
                    <h2>Detalles de la Orden</h2>
                    <p><strong>ID Orden:</strong> {orden.id}</p>
                    <p><strong>ID Cliente:</strong> {orden.id_cliente}</p>
                    <p><strong>Total a Pagar:</strong> ${orden.total_pagar}</p>
                    <p><strong>Estado del Pago:</strong> {orden.estado_pago}</p>
                    <p><strong>Fecha de Creación:</strong> {new Date(orden.created_at).toLocaleString()}</p>
                    <p><strong>Última Actualización:</strong> {new Date(orden.updated_at).toLocaleString()}</p>

                    <h3>Estado del Paquete</h3>
                    {orden.paquetes && orden.paquetes.length > 0 ? (
                        orden.paquetes.map((paquete) => (
                            <div key={paquete.id} className={styles.package}>
                                <h4>ID Paquete: {paquete.id}</h4>
                                <div>{renderProgressBar(paquete.estado.nombre)}</div>
                                <p><strong>Peso:</strong> {paquete.peso} kg</p>
                                <p><strong>Fecha de Envío:</strong> {new Date(paquete.fecha_envio).toLocaleString()}</p>
                                <p><strong>Fecha de Entrega Estimada:</strong> {paquete.fecha_entrega_estimada ? new Date(paquete.fecha_entrega_estimada).toLocaleString() : 'Pendiente'}</p>
                                <p><strong>Descripción del Contenido:</strong> {paquete.descripcion_contenido}</p>
                            </div>
                        ))
                    ) : (
                        <p>No se encontraron paquetes para esta orden.</p>
                    )}
                </div>
            )}
        </div>
    );
}
