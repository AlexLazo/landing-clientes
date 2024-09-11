import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Spinner, Alert, Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/PreOrden.module.css';

const API_URL = import.meta.env.VITE_API_URL;

const PreOrden = () => {
    const [step, setStep] = useState(1);
    const [direcciones, setDirecciones] = useState([]);
    const [selectedDireccion, setSelectedDireccion] = useState(null);
    const [paquete, setPaquete] = useState([]);
    const [totalPagar, setTotalPagar] = useState('');
    const [costoAdicional, setCostoAdicional] = useState('');
    const [concepto, setConcepto] = useState('');
    const [tipoDocumento, setTipoDocumento] = useState('');
    const [tipoOrden, setTipoOrden] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [detalles, setDetalles] = useState([
        { id_tipo_paquete: '', id_tamano_paquete: '', peso: '', descripcion_contenido: '' }
    ]);
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
        setStep(2); // Redirigir al paso de "Crear Paquete"
    };

    const handlePaqueteChange = (index, e) => {
        const { name, value } = e.target;
        const newDetalles = [...detalles];
        newDetalles[index] = { ...newDetalles[index], [name]: value };
        setDetalles(newDetalles);
    };

    const addDetalle = () => {
        setDetalles([...detalles, { id_tipo_paquete: '', id_tamano_paquete: '', peso: '', descripcion_contenido: '' }]);
    };

    const removeDetalle = (index) => {
        setDetalles(detalles.filter((_, i) => i !== index));
    };

    const handleSubmitPaquete = (e) => {
        e.preventDefault();
        setPaquete(detalles);
        setStep(3);
    };

    const handlePreOrdenSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const token = localStorage.getItem('authToken');

        try {
            const response = await axios.post(`${API_URL}/ordenes`, {
                id_cliente: selectedDireccion.id_cliente,
                id_direccion: selectedDireccion.id,
                id_tipo_pago: 1,
                total_pagar: totalPagar,
                costo_adicional: costoAdicional,
                concepto: concepto,
                tipo_documento: tipoDocumento,
                tipo_orden: tipoOrden,
                detalles: detalles,
                paquete: paquete
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.status === 200) {
                alert("PreOrden creada con éxito");
                navigate('/historial-preorden');
            }
        } catch (err) {
            setError('Error al generar la preorden.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.preOrdenContainer}>
            <div className={styles.header}>
                <h1 className={styles.title}>Crear PreOrden</h1>
            </div>
            {loading ? (
                <div className={styles.loading}>
                    <Spinner color="primary" />
                </div>
            ) : error ? (
                <Alert color="danger" className={styles.alert}>{error}</Alert>
            ) : (
                <>
                    {step === 1 && (
                        <div className={styles.step}>
                            <h2 className={styles.subtitle}>Selecciona una Dirección</h2>
                            <table className={styles.directionsTable}>
                                <thead>
                                    <tr>
                                        <th>Nombre Contacto</th>
                                        <th>Dirección</th>
                                        <th>Acción</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {direcciones.map((direccion) => (
                                        <tr key={direccion.id}>
                                            <td>{direccion.nombre_contacto}</td>
                                            <td>{direccion.direccion}</td>
                                            <td>
                                                <Button 
                                                    color="primary" 
                                                    onClick={() => handleDireccionSelect(direccion)}
                                                >
                                                    Seleccionar
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                    {step === 2 && selectedDireccion && (
                        <div className={styles.step}>
                            <h2 className={styles.subtitle}>Crear Paquete</h2>
                            <Form onSubmit={handleSubmitPaquete} className={styles.form}>
                                {detalles.map((detalle, index) => (
                                    <div key={index} className={styles.formGroup}>
                                        <h4>Detalle {index + 1}</h4>
                                        <FormGroup>
                                            <Label for={`id_tipo_paquete_${index}`}>Tipo de Paquete</Label>
                                            <Input
                                                type="text"
                                                name="id_tipo_paquete"
                                                value={detalle.id_tipo_paquete}
                                                onChange={(e) => handlePaqueteChange(index, e)}
                                                placeholder="Ingrese el tipo de paquete"
                                            />
                                        </FormGroup>
                                        <FormGroup>
                                            <Label for={`id_tamano_paquete_${index}`}>Tamaño Paquete</Label>
                                            <Input
                                                type="text"
                                                name="id_tamano_paquete"
                                                value={detalle.id_tamano_paquete}
                                                onChange={(e) => handlePaqueteChange(index, e)}
                                                placeholder="Ingrese el tamaño del paquete"
                                            />
                                        </FormGroup>
                                        <FormGroup>
                                            <Label for={`peso_${index}`}>Peso</Label>
                                            <Input
                                                type="text"
                                                name="peso"
                                                value={detalle.peso}
                                                onChange={(e) => handlePaqueteChange(index, e)}
                                                placeholder="Ingrese el peso"
                                            />
                                        </FormGroup>
                                        <FormGroup>
                                            <Label for={`descripcion_contenido_${index}`}>Descripción del Contenido</Label>
                                            <Input
                                                type="text"
                                                name="descripcion_contenido"
                                                value={detalle.descripcion_contenido}
                                                onChange={(e) => handlePaqueteChange(index, e)}
                                                placeholder="Ingrese la descripción del contenido"
                                            />
                                        </FormGroup>
                                        <Button color="danger" onClick={() => removeDetalle(index)} className={styles.removeButton}>Eliminar Detalle</Button>
                                        <hr />
                                    </div>
                                ))}
                                <Button color="primary" onClick={addDetalle} className={styles.addButton}>Agregar Paquete</Button>
                                <br />
                                <Button color="success" type="submit" className={styles.submitButton}>
                                    Crear Paquete
                                </Button>
                            </Form>
                        </div>
                    )}
                    {step === 3 && paquete.length > 0 && (
                        <div className={styles.step}>
                            <h2 className={styles.subtitle}>Generar PreOrden</h2>
                            <Form onSubmit={handlePreOrdenSubmit} className={styles.form}>
                                <FormGroup>
                                    <Label for="total_pagar">Total a Pagar</Label>
                                    <Input
                                        type="text"
                                        name="total_pagar"
                                        value={totalPagar}
                                        onChange={(e) => setTotalPagar(e.target.value)}
                                        placeholder="Ingrese el total a pagar"
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Label for="costo_adicional">Costo Adicional</Label>
                                    <Input
                                        type="text"
                                        name="costo_adicional"
                                        value={costoAdicional}
                                        onChange={(e) => setCostoAdicional(e.target.value)}
                                        placeholder="Ingrese el costo adicional"
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Label for="concepto">Concepto</Label>
                                    <Input
                                        type="text"
                                        name="concepto"
                                        value={concepto}
                                        onChange={(e) => setConcepto(e.target.value)}
                                        placeholder="Ingrese el concepto"
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Label for="tipo_documento">Tipo de Documento</Label>
                                    <Input
                                        type="text"
                                        name="tipo_documento"
                                        value={tipoDocumento}
                                        onChange={(e) => setTipoDocumento(e.target.value)}
                                        placeholder="Ingrese el tipo de documento"
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Label for="tipo_orden">Tipo de Orden</Label>
                                    <Input
                                        type="text"
                                        name="tipo_orden"
                                        value={tipoOrden}
                                        onChange={(e) => setTipoOrden(e.target.value)}
                                        placeholder="Ingrese el tipo de orden"
                                    />
                                </FormGroup>
                                <Button color="success" type="submit" className={styles.submitButton}>
                                    Finalizar PreOrden
                                </Button>
                            </Form>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default PreOrden;
