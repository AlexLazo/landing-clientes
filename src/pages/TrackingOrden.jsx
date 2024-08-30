import React, { useState } from "react";
import axios from "axios";
import styles from "/src/styles/TrackingOrden.module.css";
// Importa tus íconos si es necesario

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
            "En Tránsito",
            "En Ruta de Entrega",
            "Recibido en Destino",
            "En Almacén",
            "En Espera de Recolección",
            "Reprogramado",
            "En Proceso de Retorno",
            "Devuelto",
            "Dañado",
            "Perdido",
            "Entregado",
            "Cancelado",
        ];

        const currentStep = estados.indexOf(estado.nombre);

        return (
            <div className="steps d-flex flex-wrap flex-sm-nowrap justify-content-between padding-top-2x padding-bottom-1x">
                {estados.map((step, index) => (
                    <div key={index} className={`step ${index <= currentStep ? "completed" : ""}`}>
                        <div className="step-icon-wrap">
                            <div className="step-icon">
                                <i className={getStepIcon(index)}></i>
                            </div>
                        </div>
                        <h4 className="step-title">{step}</h4>
                    </div>
                ))}
            </div>
        );
    };

    const getStepIcon = (stepIndex) => {
        switch (stepIndex) {
            case 0:
                return "pe-7s-plane";
            case 1:
                return "pe-7s-road";
            case 2:
                return "pe-7s-flag";
            case 3:
                return "pe-7s-box2";
            case 4:
                return "pe-7s-upload";
            case 5:
                return "pe-7s-refresh";
            case 6:
                return "pe-7s-back";
            case 7:
                return "pe-7s-home";
            case 8:
                return "pe-7s-attention";
            case 9:
                return "pe-7s-close-circle";
            case 10:
                return "pe-7s-check";
            case 11:
                return "pe-7s-check-circle";
            default:
                return "pe-7s-help1";
        }
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
                    <p><strong>ID Dirección:</strong> {orden.id_direccion}</p>
                    <p><strong>ID Tipo de Pago:</strong> {orden.id_tipo_pago}</p>
                    <p><strong>Total a Pagar:</strong> ${orden.total_pagar}</p>
                    <p><strong>Costo Adicional:</strong> ${orden.costo_adicional}</p>
                    <p><strong>ID Estado de Paquetes:</strong> {orden.id_estado_paquetes}</p>
                    <p><strong>Concepto:</strong> {orden.concepto}</p>
                    <p><strong>Número de Seguimiento:</strong> {orden.numero_seguimiento}</p>
                    <p><strong>Tipo de Documento:</strong> {orden.tipo_documento}</p>
                    <p><strong>Estado del Pago:</strong> {orden.estado_pago}</p>
                    <p><strong>Fecha de Creación:</strong> {new Date(orden.created_at).toLocaleString()}</p>
                    <p><strong>Última Actualización:</strong> {new Date(orden.updated_at).toLocaleString()}</p>

                    <h3>Estado del Paquete</h3>
                    {orden.paquetes && orden.paquetes.length > 0 ? (
                        orden.paquetes.map((paquete) => (
                            <div key={paquete.id} className={styles.package}>
                                <h4>ID Paquete: {paquete.id}</h4>
                                <div>{renderProgressBar(paquete.estado)}</div>
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
