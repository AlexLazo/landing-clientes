import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SeleccionarDireccion from './SeleccionarDireccion';
import CrearPaquete from './CrearPaquete';
import GenerarPreOrden from './GenerarPreOrden';
import { Spinner, Alert } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/PreOrden.module.css'; // Asegúrate de que el archivo CSS tenga las clases correctas
import '../styles/PreOrden.css';

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
                // Obtener los datos del cliente
                const { data: clienteData } = await axios.get(`${API_URL}/perfil-cliente`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                const clienteId = clienteData.cliente.id;

                // Obtener las direcciones del cliente
                const response = await axios.get(`${API_URL}/direcciones`, {
                    params: { id_cliente: clienteId },
                    headers: { Authorization: `Bearer ${token}` },
                });
                const direccionesData = response.data.direcciones || [];

                // Obtener detalles adicionales de las direcciones
                const direccionesWithDetails = await Promise.all(
                    direccionesData.map(async (direccion) => {
                        // Obtener los municipios relacionados con el departamento
                        const municipiosResponse = await axios.get(
                            `${API_URL}/dropdown/get_municipio/${direccion.id_departamento}`,
                            {
                                headers: { Authorization: `Bearer ${token}` },
                            }
                        );
                        const municipio = municipiosResponse.data.municipio.find(
                            (m) => m.id === direccion.id_municipio
                        );

                        // Obtener el nombre del departamento desde el endpoint
                        const departamentoResponse = await axios.get(
                            `${API_URL}/dropdown/get_departamentos`,
                            {
                                headers: { Authorization: `Bearer ${token}` },
                            }
                        );
                        const departamento = departamentoResponse.data.find(
                            (d) => d.id === direccion.id_departamento
                        );

                        return {
                            ...direccion,
                            departamento_nombre: departamento
                                ? departamento.nombre
                                : "No disponible",
                            municipio_nombre: municipio ? municipio.nombre : "No disponible",
                        };
                    })
                );

                setDirecciones(direccionesWithDetails);
            } catch (error) {
                console.error("Error fetching direcciones:", error);
                setError('Error al cargar las direcciones.');
            } finally {
                setLoading(false);
            }
        };

        fetchDirecciones();
    }, [navigate]);

    // Este método maneja la selección de dirección y cambia el paso automáticamente
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
            console.log('Paquete submitted:', paquete);
            // Ejemplo de envío:
            // await axios.post(`${API_URL}/crear-paquete`, { paquete });
            setStep(3);  // Pasar al siguiente paso
        } catch (error) {
            setError('Error al crear el paquete.');
        }
    };

    const handlePreOrdenSuccess = () => {
        alert("PreOrden creada con éxito");
        navigate('/Historial');
    };

    return (
        <div className={styles.preOrdenContainer}>
            <div className={styles.header}>
                <h1 className={styles.title}>Crear PreOrden</h1>
            </div>
            {loading ? (
                <div className={styles.loading}><Spinner color="primary" /></div>
            ) : error ? (
                <div className={styles.error}><Alert color="danger">{error}</Alert></div>
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
