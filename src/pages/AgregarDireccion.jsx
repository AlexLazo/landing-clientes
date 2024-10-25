import React, { useState, useEffect } from "react";
import { Card, CardBody, Col, Row, Container, Form, FormGroup, Label, Input, Button, Alert, FormFeedback, Spinner } from "reactstrap";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from '/src/styles/AgregarDireccion.module.css';
import '../styles/AgregarDireccion.css';

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
    const [isTelefonoValid, setIsTelefonoValid] = useState(true);
    const [telefonoError, setTelefonoError] = useState("");

    const [idCliente, setIdCliente] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const navigate = useNavigate();
    const token = localStorage.getItem('authToken');

    const departamentosPermitidos = [11, 12, 13, 14];  // Los ID de los departamentos permitidos

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

                // Filtrar departamentos permitidos
                const departamentosFiltrados = (response.data || []).filter(dep =>
                    departamentosPermitidos.includes(dep.id)
                );

                setDepartamentos(departamentosFiltrados);
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

    const handleTelefonoChange = (e) => {
        let telefonoValue = e.target.value.replace(/[^\d]/g, "");

        // Verificar si el primer dígito es 6, 7 o 2
        if (telefonoValue.length > 0 && !["6", "7", "2"].includes(telefonoValue[0])) {
            setTelefonoError("El número de teléfono debe comenzar con 6, 7 o 2");
            setIsTelefonoValid(false);
            return;
        } else {
            setTelefonoError("");
        }

        if (telefonoValue.length > 8) {
            telefonoValue = telefonoValue.slice(0, 8);
        }

        if (telefonoValue.length > 4) {
            telefonoValue = telefonoValue.slice(0, 4) + "-" + telefonoValue.slice(4);
        }

        setTelefono(telefonoValue);

        const isValid = telefonoValue.length === 9;
        setIsTelefonoValid(isValid);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isDireccionValid || !departamento || !municipio || !isTelefonoValid) {
            setAlertaError(true);
            setErrorMensaje("Por favor, revisa los campos requeridos.");
            return;
        }

        try {
            const direccionData = {
                id_cliente: idCliente,
                nombre_contacto: nombreContacto,
                telefono,
                direccion,
                id_departamento: departamento,
                id_municipio: municipio,
                referencia
            };

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
            <div className="direccionesClienteContainer">
                <Container fluid>
                    <Row>
                        <Col lg="12">
                            <Card className="card-agregarDireccion">
                                <CardBody className="card-body-agregarDireccion">
                                    <h3 className="direccionesClienteTitle">Agregar Dirección del Cliente</h3>

                                    {alertaExito && (
                                        <Alert className="alertSuccessCustom">
                                            ¡Dirección registrada exitosamente!
                                        </Alert>
                                    )}
                                    {alertaError && (
                                        <Alert className="alertDangerCustom">
                                            {errorMensaje}
                                        </Alert>
                                    )}
                                    {loading ? (
                                        <div className="loading">
                                            <Spinner color="primary" />
                                        </div>
                                    ) : error ? (
                                        <Alert className="alertDangerCustom">{error}</Alert>
                                    ) : (
                                        <Form onSubmit={handleSubmit}>
                                            <Row form>
                                                <Col md={6}>
                                                    <FormGroup className="formGroup">
                                                        <Label className="label" for="nombre_contacto">Nombre de Contacto <span style={{ color: 'red' }}>*</span></Label>
                                                        <Input
                                                            type="text"
                                                            id="nombre_contacto"
                                                            className="styles.input"
                                                            value={nombreContacto}
                                                            onChange={(e) => setNombreContacto(e.target.value)}
                                                            required
                                                        />
                                                    </FormGroup>
                                                </Col>
                                                <Col md={6}>
                                                    <FormGroup className="formGroup">
                                                        <Label className="label" for="telefono">Teléfono <span style={{ color: 'red' }}>*</span></Label>
                                                        <Input
                                                            type="text"
                                                            id="telefono"
                                                            className="input"
                                                            value={telefono}
                                                            onChange={handleTelefonoChange}
                                                            invalid={!isTelefonoValid}
                                                            required
                                                        />
                                                        <FormFeedback>{telefonoError}</FormFeedback>
                                                    </FormGroup>
                                                </Col>
                                            </Row>
                                            <Row form>
                                                <Col md={6}>
                                                    <FormGroup className="formGroup">
                                                        <Label className="label" for="departamento">
                                                            Departamento <span style={{ color: 'red' }}>*</span>
                                                        </Label>
                                                        <select
                                                            id="departamento"
                                                            className="input"
                                                            value={departamento}
                                                            onChange={(e) => setDepartamento(e.target.value)}
                                                            required
                                                        >
                                                            <option value="">Selecciona un departamento</option>
                                                            {departamentos.map((dep) => (
                                                                <option key={dep.id} value={dep.id}>
                                                                    {dep.nombre}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </FormGroup>
                                                </Col>
                                                <Col md={6}>
                                                    <FormGroup className="formGroup">
                                                        <Label className="label" for="municipio">
                                                            Municipio <span style={{ color: 'red' }}>*</span>
                                                        </Label>
                                                        <select
                                                            id="municipio"
                                                            className="input"
                                                            value={municipio}
                                                            onChange={(e) => setMunicipio(e.target.value)}
                                                            required
                                                        >
                                                            <option value="">Selecciona un municipio</option>
                                                            {municipiosPorDepartamento[departamento]?.map((mun) => (
                                                                <option key={mun.id} value={mun.id}>
                                                                    {mun.nombre}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </FormGroup>
                                                </Col>
                                            </Row>

                                            <Row form>
                                                <Col md={12}>
                                                    <FormGroup className="formGroup">
                                                        <Label className="label" for="direccion">Dirección <span style={{ color: 'red' }}>*</span></Label>
                                                        <Input
                                                            type="text"
                                                            id="direccion"
                                                            className="input"
                                                            value={direccion}
                                                            onChange={handleDireccionChange}
                                                            invalid={!isDireccionValid}
                                                            required
                                                        />
                                                        <FormFeedback>{direccionError}</FormFeedback>
                                                    </FormGroup>
                                                </Col>
                                            </Row>
                                            <Row form>
                                                <Col md={12}>
                                                    <FormGroup className="formGroup">
                                                        <Label className="label" for="referencia">Referencia <span style={{ color: 'red' }}>*</span></Label>
                                                        <Input
                                                            type="text"
                                                            id="referencia"
                                                            className="input"
                                                            value={referencia}
                                                            onChange={(e) => setReferencia(e.target.value)}
                                                        />
                                                    </FormGroup>
                                                </Col>
                                            </Row>
                                            <div className="text-center">
                                                <Button className="submitButton" type="submit">
                                                    Guardar Dirección
                                                </Button>
                                            </div>
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
