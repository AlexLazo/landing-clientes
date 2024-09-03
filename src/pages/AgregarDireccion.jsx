import React, { useState, useEffect } from "react";
import { Card, CardBody, Col, Row, Container, Form, FormGroup, Label, Input, Button, Alert, FormFeedback, Spinner } from "reactstrap";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from '/src/styles/AgregarDireccion.module.css';

const API_URL = import.meta.env.VITE_API_URL;

const AgregarDireccion = () => {
    const [departamentos, setDepartamentos] = useState([]);
    const [municipiosPorDepartamento, setMunicipiosPorDepartamento] = useState({});
    const [nombreContacto, setNombreContacto] = useState("");
    const [telefono, setTelefono] = useState("");
    const [departamento, setDepartamento] = useState("");
    const [municipio, setMunicipio] = useState("");
    const [direccion, setDireccion] = useState("");
    const [referencia, setReferencia] = useState("");
    const [alertaExito, setAlertaExito] = useState(false);
    const [alertaError, setAlertaError] = useState(false);
    const [errorMensaje, setErrorMensaje] = useState("");
    const [direccionError, setDireccionError] = useState("");
    const [isDireccionValid, setIsDireccionValid] = useState(true);
    
    const [idCliente, setIdCliente] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const navigate = useNavigate();
    const token = localStorage.getItem('authToken');

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }

        const fetchDepartamentos = async () => {
            try {
                const response = await axios.get(`${API_URL}/dropdown/get_departamentos`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setDepartamentos(response.data || []);
            } catch (error) {
                console.error("Error al obtener los departamentos:", error);
                setError("Error al cargar los departamentos.");
            }
        };

        fetchDepartamentos();
    }, [token, navigate]);

    useEffect(() => {
        if (departamento) {
            const fetchMunicipios = async () => {
                try {
                    const response = await axios.get(`${API_URL}/dropdown/get_municipio/${departamento}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setMunicipiosPorDepartamento(prev => ({
                        ...prev,
                        [departamento]: response.data.municipio || []
                    }));
                } catch (error) {
                    console.error("Error al obtener los municipios:", error);
                    setError("Error al cargar los municipios.");
                }
            };

            fetchMunicipios();
        }
    }, [departamento, token]);

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }

        const fetchIdCliente = async () => {
            try {
                const { data: clienteData } = await axios.get(`${API_URL}/perfil-cliente`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setIdCliente(clienteData.cliente.id);
            } catch (error) {
                console.error("Error al obtener el id_cliente:", error);
                setError("Error al cargar el id del cliente.");
            } finally {
                setLoading(false);
            }
        };

        fetchIdCliente();
    }, [token, navigate]);

    useEffect(() => {
        if (alertaExito) {
            const timer = setTimeout(() => {
                navigate('/direcciones-cliente');
            }, 2000);

            return () => clearTimeout(timer);
        }
    }, [alertaExito, navigate]);

    const handleDireccionChange = (e) => {
        const value = e.target.value;
        setDireccion(value);
        const isValid = value.trim().length > 0;
        setIsDireccionValid(isValid);
        setDireccionError(isValid ? "" : "La dirección es obligatoria.");
    };

    const handleNombreContactoChange = (e) => setNombreContacto(e.target.value);
    const handleTelefonoChange = (e) => setTelefono(e.target.value);
    const handleReferenciaChange = (e) => setReferencia(e.target.value);
    const handleDepartamentoChange = (e) => {
        const selectedDepartamento = e.target.value;
        setDepartamento(selectedDepartamento);
        setMunicipio(""); // Reset municipio when departamento changes
    };
    const handleMunicipioChange = (e) => setMunicipio(e.target.value);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isDireccionValid || !departamento || !municipio) {
            setAlertaError(true);
            setErrorMensaje("Por favor, revisa los campos requeridos.");
            return;
        }

        const direccionData = {
            id_cliente: idCliente,
            nombre_contacto: nombreContacto,
            telefono: telefono,
            direccion,
            id_departamento: departamento,
            id_municipio: municipio,
            referencia
        };

        try {
            await axios.post(`${API_URL}/direcciones`, direccionData, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                }
            });
            setAlertaExito(true);
            setAlertaError(false);
            setNombreContacto("");
            setTelefono("");
            setDepartamento("");
            setMunicipio("");
            setDireccion("");
            setReferencia("");
        } catch (error) {
            console.error("Error al registrar la dirección:", error);
            setAlertaError(true);
            setErrorMensaje("Hubo un error al registrar la dirección.");
        }
    };

    return (
        <React.Fragment>
            <div className={styles.direccionesClienteContainer}>
                <Container fluid>
                    <Row>
                        <Col lg="12">
                            <Card className={styles.card}>
                                <CardBody>
                                    <h3 className={styles.direccionesClienteTitle}>Agregar Dirección del Cliente</h3>

                                    {alertaExito && (
                                        <Alert className={styles.alertSuccessCustom}>
                                            ¡Dirección registrada exitosamente!
                                        </Alert>
                                    )}
                                    {alertaError && (
                                        <Alert className={styles.alertDangerCustom}>
                                            {errorMensaje}
                                        </Alert>
                                    )}
                                    {loading ? (
                                        <div className={styles.loading}>
                                            <Spinner color="primary" />
                                        </div>
                                    ) : error ? (
                                        <Alert className={styles.alertDangerCustom}>{error}</Alert>
                                    ) : (
                                        <Form onSubmit={handleSubmit}>
                                            <Row form>
                                                <Col md={6}>
                                                    <FormGroup className={styles.formGroup}>
                                                        <Label className={styles.label} for="nombre_contacto">Nombre de Contacto</Label>
                                                        <Input
                                                            type="text"
                                                            id="nombre_contacto"
                                                            className={styles.input}
                                                            value={nombreContacto}
                                                            onChange={handleNombreContactoChange}
                                                            required
                                                        />
                                                    </FormGroup>
                                                </Col>
                                                <Col md={6}>
                                                    <FormGroup className={styles.formGroup}>
                                                        <Label className={styles.label} for="telefono">Teléfono</Label>
                                                        <Input
                                                            type="text"
                                                            id="telefono"
                                                            className={styles.input}
                                                            value={telefono}
                                                            onChange={handleTelefonoChange}
                                                            required
                                                        />
                                                    </FormGroup>
                                                </Col>
                                            </Row>
                                            <Row form>
                                                <Col md={6}>
                                                    <FormGroup className={styles.formGroup}>
                                                        <Label className={styles.label} for="direccion">Dirección</Label>
                                                        <Input
                                                            type="text"
                                                            id="direccion"
                                                            className={styles.input}
                                                            value={direccion}
                                                            onChange={handleDireccionChange}
                                                            required
                                                            invalid={!isDireccionValid}
                                                        />
                                                        {!isDireccionValid && (
                                                            <FormFeedback className={styles.errorFeedback}>
                                                                La dirección es obligatoria.
                                                            </FormFeedback>
                                                        )}
                                                    </FormGroup>
                                                </Col>
                                                <Col md={6}>
                                                    <FormGroup className={styles.formGroup}>
                                                        <Label className={styles.label} for="departamento">Departamento</Label>
                                                        <Input
                                                            type="select"
                                                            id="departamento"
                                                            className={styles.input}
                                                            value={departamento}
                                                            onChange={handleDepartamentoChange}
                                                            required
                                                        >
                                                            <option value="">Seleccione</option>
                                                            {departamentos.map((dep) => (
                                                                <option key={dep.id} value={dep.id}>
                                                                    {dep.nombre}
                                                                </option>
                                                            ))}
                                                        </Input>
                                                    </FormGroup>
                                                </Col>
                                            </Row>
                                            <Row form>
                                                <Col md={6}>
                                                    <FormGroup className={styles.formGroup}>
                                                        <Label className={styles.label} for="municipio">Municipio</Label>
                                                        <Input
                                                            type="select"
                                                            id="municipio"
                                                            className={styles.input}
                                                            value={municipio}
                                                            onChange={handleMunicipioChange}
                                                            required
                                                            disabled={!departamento}
                                                        >
                                                            <option value="">Seleccione</option>
                                                            {municipiosPorDepartamento[departamento]?.map((mun) => (
                                                                <option key={mun.id} value={mun.id}>
                                                                    {mun.nombre}
                                                                </option>
                                                            ))}
                                                        </Input>
                                                    </FormGroup>
                                                </Col>
                                                <Col md={6}>
                                                    <FormGroup className={styles.formGroup}>
                                                        <Label className={styles.label} for="referencia">Referencia</Label>
                                                        <Input
                                                            type="text"
                                                            id="referencia"
                                                            className={styles.input}
                                                            value={referencia}
                                                            onChange={handleReferenciaChange}
                                                        />
                                                    </FormGroup>
                                                </Col>
                                            </Row>
                                            <Button
                                                type="submit"
                                                color="primary"
                                                className={styles.submitButton}
                                            >
                                                Guardar
                                            </Button>
                                        </Form>
                                    )}
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    );
};

export default AgregarDireccion;
