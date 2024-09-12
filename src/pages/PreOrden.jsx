import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SeleccionarDireccion from './SeleccionarDireccion';
import CrearPaquete from './CrearPaquete';
import GenerarPreOrden from './GenerarPreOrden';
import { Spinner, Alert, Button } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/PreOrden.module.css';

const API_URL = import.meta.env.VITE_API_URL;

const PreOrden = () => {
    const [step, setStep] = useState(1);  // 1: Seleccionar Dirección, 2: Crear Paquete, 3: Generar PreOrden
    const [direcciones, setDirecciones] = useState([]);
    const [selectedDireccion, setSelectedDireccion] = useState(null);
    const [paquete, setPaquete] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

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
                    params: { id_cliente: clienteId },
                    headers: { Authorization: `Bearer ${token}` }
                });

                setDirecciones(direccionesData.direcciones || []);
            } catch (error) {
                setError('Error al cargar las direcciones.');
            } finally {
                setLoading(false);
            }
        };

        fetchDirecciones();
    }, [navigate]);

    const handleDireccionSelect = (direccion) => {
        setSelectedDireccion(direccion);
        setStep(2);  // Pasamos al paso 2: Crear Paquete
    };

    const handlePaqueteChange = (index, event) => {
        const { name, value } = event.target;
        const newPaquete = [...paquete];
        newPaquete[index] = { ...newPaquete[index], [name]: value };
        setPaquete(newPaquete);
    };

    const addDetalle = () => {
        setPaquete([...paquete, { id_tipo_paquete: '', id_tamano_paquete: '', peso: '', descripcion_contenido: '' }]);
    };

    const removeDetalle = (index) => {
        const newPaquete = paquete.filter((_, i) => i !== index);
        setPaquete(newPaquete);
    };

    const handleSubmitPaquete = async (event) => {
        event.preventDefault();
        try {
            // Replace with your API call for package submission
            console.log('Paquete submitted:', paquete);
            // Example submission:
            // await axios.post(`${API_URL}/crear-paquete`, { paquete });
            setStep(3);  // Move to the next step
        } catch (error) {
            setError('Error al crear el paquete.');
        }
    };

    const handlePreOrdenSuccess = () => {
        alert("PreOrden creada con éxito");
        navigate('/historial-preorden');  // Redirigir a una página de historial o similar
    };

    return (
        <div className={styles.preOrdenContainer}>
            <h1 className={styles.title}>Crear PreOrden</h1>
            {loading ? (
                <Spinner color="primary" />
            ) : error ? (
                <Alert color="danger">{error}</Alert>
            ) : (
                <>
                    {step === 1 && (
                        <div>
                            <h2 className={styles.subtitle}>Selecciona una Dirección</h2>
                            <SeleccionarDireccion
                                direcciones={direcciones}
                                onDireccionSelect={handleDireccionSelect}
                            />
                        </div>
                    )}
                    {step === 2 && selectedDireccion && (
                        <CrearPaquete
                            detalles={paquete}
                            handlePaqueteChange={handlePaqueteChange}
                            addDetalle={addDetalle}
                            removeDetalle={removeDetalle}
                            handleSubmitPaquete={handleSubmitPaquete}
                        />
                    )}
                    {step === 3 && paquete && (
                        <GenerarPreOrden
                            paquete={paquete}
                            direccion={selectedDireccion}
                            onSuccess={handlePreOrdenSuccess}
                        />
                    )}
                </>
            )}
        </div>
    );
};

export default PreOrden;
