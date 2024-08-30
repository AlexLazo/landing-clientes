import React, { useState, useEffect } from "react";
import { Card, CardBody, Col, Row, Container, Form, FormGroup, Label, Input, Button, Alert, FormFeedback } from "reactstrap";
import AuthService from "/src/services/authService";
import axios from 'axios';
import "/src/styles/DireccionesCliente.module.css";

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

    const token = AuthService.getCurrentUser();

    useEffect(() => {
        const fetchDepartamentos = async () => {
            try {
                const response = await axios.get(`${API_URL}/dropdown/get_departamentos`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                if (response.data && Array.isArray(response.data)) {
                    setDepartamentos(response.data);
                } else {
                    console.error("Respuesta no válida para departamentos:", response.data);
                }
            } catch (error) {
                console.error("Error al obtener los departamentos:", error);
            }
        };

        fetchDepartamentos();
    }, [token]);

    useEffect(() => {
        const fetchMunicipios = async () => {
            if (departamento) {
                try {
                    const response = await axios.get(`${API_URL}/dropdown/get_municipio/${departamento}`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    if (response.data.municipio && Array.isArray(response.data.municipio)) {
                        setMunicipiosPorDepartamento(prev => ({
                            ...prev,
                            [departamento]: response.data.municipio
                        }));
                    } else {
                        console.error("Respuesta no válida para municipios:", response.data);
                    }
                } catch (error) {
                    console.error("Error al obtener los municipios:", error);
                }
            }
        };

        fetchMunicipios();
    }, [departamento, token]);

    const handleDireccionChange = (e) => {
        const value = e.target.value;
        setDireccion(value);
        // Validar dirección si es necesario
        const isValid = value.length > 0; // Ejemplo simple: dirección no vacía
        setIsDireccionValid(isValid);
        setDireccionError(isValid ? "" : "La dirección es obligatoria.");
    };

    const handleNombreContactoChange = (e) => {
        setNombreContacto(e.target.value);
    };

    const handleTelefonoChange = (e) => {
        setTelefono(e.target.value);
    };

    const handleReferenciaChange = (e) => {
        setReferencia(e.target.value);
    };

    const handleDepartamentoChange = (e) => {
        const selectedDepartamento = e.target.value;
        setDepartamento(selectedDepartamento);
        setMunicipio("");
    };

    const handleMunicipioChange = (e) => {
        setMunicipio(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isDireccionValid || !departamento || !municipio) {
            setAlertaError(true);
            setErrorMensaje("Por favor, revisa los campos requeridos.");
            return;
        }

        const direccionData = {
            nombre_contacto: nombreContacto,
            telefono: telefono,
            direccion,
            id_departamento: departamento,
            id_municipio: municipio,
            referencia
        };

        console.log("Datos a enviar:", direccionData);

        try {
            const response = await axios.post(`${API_URL}/direcciones`, direccionData, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                }
            });

            console.log("Dirección registrada:", response.data);
            setAlertaExito(true);
            setTimeout(() => setAlertaExito(false), 2000);
            resetForm();
            setAlertaError(false);
        } catch (error) {
            console.error("Error de solicitud:", error);
            handleError(error);
        }
    };

    const resetForm = () => {
        setNombreContacto("");
        setTelefono("");
        setDireccion("");
        setDepartamento("");
        setMunicipio("");
        setReferencia("");
    };

    const handleError = (error) => {
        let errorMessage = "Hubo un error al procesar la solicitud. Por favor, inténtalo de nuevo.";

        if (error.response && error.response.data) {
            const errorData = error.response.data;

            if (errorData.error) {
                const errors = errorData.error;

                if (errors.direccion && errors.direccion.length > 0) {
                    errorMessage = "La dirección ya está registrada.";
                }
            }
        }

        setAlertaExito(false);
        setAlertaError(true);
        setErrorMensaje(errorMessage);
    };

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <Row>
                        <Col lg="12">
                            <Card>
                                <CardBody>
                                    <h3 className="form-title">Agregar Dirección del Cliente</h3>

                                    {alertaExito && (
                                        <div className="alert-custom alert-success-custom">
                                            <span>¡Dirección registrada exitosamente!</span>
                                            <button
                                                type="button"
                                                className="alert-close-btn"
                                                onClick={() => setAlertaExito(false)}
                                                aria-label="Close"
                                            >
                                                &times;
                                            </button>
                                        </div>
                                    )}
                                    {alertaError && (
                                        <div className="alert-custom alert-danger-custom">
                                            <span>{errorMensaje}</span>
                                            <button
                                                type="button"
                                                className="alert-close-btn"
                                                onClick={() => setAlertaError(false)}
                                                aria-label="Close"
                                            >
                                                &times;
                                            </button>
                                        </div>
                                    )}
                                    <Form onSubmit={handleSubmit}>
                                        <Row form>
                                            <Col md={6}>
                                                <FormGroup className="form-group-custom">
                                                    <Label for="nombre_contacto">Nombre de Contacto</Label>
                                                    <Input
                                                        type="text"
                                                        id="nombre_contacto"
                                                        value={nombreContacto}
                                                        onChange={handleNombreContactoChange}
                                                        required
                                                    />
                                                </FormGroup>
                                            </Col>
                                            <Col md={6}>
                                                <FormGroup className="form-group-custom">
                                                    <Label for="telefono">Teléfono</Label>
                                                    <Input
                                                        type="text"
                                                        id="telefono"
                                                        value={telefono}
                                                        onChange={handleTelefonoChange}
                                                        required
                                                    />
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                        <Row form>
                                            <Col md={6}>
                                                <FormGroup className="form-group-custom">
                                                    <Label for="direccion">Dirección</Label>
                                                    <Input
                                                        type="text"
                                                        id="direccion"
                                                        value={direccion}
                                                        onChange={handleDireccionChange}
                                                        required
                                                        invalid={!isDireccionValid}
                                                    />
                                                    {!isDireccionValid && (
                                                        <FormFeedback className="text-danger">
                                                            La dirección es obligatoria.
                                                        </FormFeedback>
                                                    )}
                                                </FormGroup>
                                            </Col>
                                            <Col md={6}>
                                                <FormGroup className="form-group-custom">
                                                    <Label for="departamento">Departamento</Label>
                                                    <Input
                                                        type="select"
                                                        id="departamento"
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
                                                <FormGroup className="form-group-custom">
                                                    <Label for="municipio">Municipio</Label>
                                                    <Input
                                                        type="select"
                                                        id="municipio"
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
                                        </Row>
                                        <Row form>
                                            <Col md={12}>
                                                <FormGroup className="form-group-custom">
                                                    <Label for="referencia">Referencia</Label>
                                                    <Input
                                                        type="text"
                                                        id="referencia"
                                                        value={referencia}
                                                        onChange={handleReferenciaChange}
                                                    />
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                        <Button color="primary" type="submit">Guardar Dirección</Button>
                                    </Form>
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
