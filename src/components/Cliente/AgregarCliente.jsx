import React, { useState, useEffect } from "react";
import { Card, CardBody, Col, Row, Container, Form, FormGroup, Label, Input, Button, Alert, FormFeedback } from "reactstrap";
import AuthService from "/src/services/authService";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import "/src/styles/AgregarCliente.css";
import Select from 'react-select';

const API_URL = import.meta.env.VITE_API_URL;

const AgregarCliente = () => {
    const [nitErrorMessage, setNitErrorMessage] = useState(""); // Estado para el mensaje de error del NIT
    const [formData, setFormData] = useState({ nit: '', });
    const [isDuiValid, setIsDuiValid] = useState(true);
    const [isTelefonoValid, setIsTelefonoValid] = useState(true);
    const [isNitValid, setIsNitValid] = useState(true);
    const [telefonoError, setTelefonoError] = useState("");
    const [isNrcValid, setIsNrcValid] = useState(true);
    const [tiposPersonas, setTiposPersonas] = useState([]);
    const [fechaRegistro, setFechaRegistro] = useState(new Date().toISOString().split('T')[0]);
    const [departamentos, setDepartamentos] = useState([]);
    const [municipiosPorDepartamento, setMunicipiosPorDepartamento] = useState({});
    const [nombres, setNombres] = useState("");
    const [apellidos, setApellidos] = useState("");
    const [tipoPersona, setTipoPersona] = useState("");
    const [dui, setDui] = useState("");
    const [telefono, setTelefono] = useState("");
    const [direccion, setDireccion] = useState("");
    const [departamento, setDepartamento] = useState("");
    const [municipio, setMunicipio] = useState("");
    const [esContribuyente, setEsContribuyente] = useState(false);
    const [nombreComercial, setNombreComercial] = useState("");
    const [nit, setNit] = useState("");
    const [nrc, setNrc] = useState("");
    const [giro, setGiro] = useState(""); // Guardar la descripción seleccionada
    const [giros, setGiros] = useState([]); // Lista de giros desde la API
    const [filteredGiros, setFilteredGiros] = useState([]); // Lista filtrada
    const [searchGiro, setSearchGiro] = useState(""); // Término de búsqueda para giro
    const [nombreEmpresa, setNombreEmpresa] = useState("");
    const [alertaExito, setAlertaExito] = useState(false);
    const [alertaError, setAlertaError] = useState(false);
    const [errorMensaje, setErrorMensaje] = useState("");

    const navigate = useNavigate();

    const token = AuthService.getCurrentUser();

    useEffect(() => {
        const fetchTiposPersonas = async () => {
            try {
                const response = await axios.get(`${API_URL}/dropdown/get_tipo_persona`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                if (response.data.tipo_persona && Array.isArray(response.data.tipo_persona)) {
                    setTiposPersonas(response.data.tipo_persona);
                } else {
                    console.error("Respuesta no válida para tipos de personas:", response.data);
                }
            } catch (error) {
                console.error("Error al obtener los tipos de personas:", error);
            }
        };
        fetchTiposPersonas();
    }, [token]);

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

    useEffect(() => {
        const fetchGiros = async () => {
            try {
                const response = await axios.get(`${API_URL}/dropdown/giros`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (response.data.actividadEconomica) {
                    setGiros(response.data.actividadEconomica); // Guardamos los giros correctamente
                    setFilteredGiros(response.data.actividadEconomica); // Iniciamos con todos los giros
                } else {
                    console.error("Error en la respuesta de giros", response.data);
                }
            } catch (error) {
                console.error("Error al obtener los giros:", error);
            }
        };
        fetchGiros();
    }, [token]);

    const handleSearchGiro = (inputValue) => {
        const searchTerm = inputValue.toLowerCase();
        setSearchGiro(searchTerm);

        if (searchTerm.length > 0) {
            const filtered = giros.filter((g) => {
                const codigo = g.st_codigo ? String(g.st_codigo).toLowerCase() : "";
                const descripcion = g.st_descripcion ? g.st_descripcion.toLowerCase() : "";
                return codigo.includes(searchTerm) || descripcion.includes(searchTerm);
            });
            setFilteredGiros(filtered);
        } else {
            setFilteredGiros(giros); // Mostrar todos los giros si no hay búsqueda
        }
    };

    const handleGiroSelect = (selectedOption) => {
        if (selectedOption) {
            setGiro(selectedOption.label); // Guardar la descripción del giro seleccionada
            setSearchGiro(selectedOption.label); // Mostrar la descripción en el campo de búsqueda
            setFilteredGiros(giros); // Restablecer la lista completa
        } else {
            setGiro(""); // Limpiar si se selecciona "clear"
            setSearchGiro("");
            setFilteredGiros(giros); // Mostrar todos los giros si se limpia
        }
    };
    const handleDuiChange = (e) => {
        let value = e.target.value.replace(/[^\d]/g, ""); // Eliminar caracteres no numéricos

        if (value.length > 0 && value[0] !== "0") {
            value = "0" + value;
        }

        let formattedDui = value;
        if (formattedDui.length > 8) {
            formattedDui = formattedDui.slice(0, 8) + "-" + formattedDui.slice(8, 9);
        }
        const isValid = formattedDui.length === 10 && formattedDui.match(/^0\d{7}-\d{1}$/);
        setDui(formattedDui);
        setIsDuiValid(isValid);
    };

    const handleTelefonoChange = (e) => {
        let telefonoValue = e.target.value.replace(/[^\d]/g, "");

        // Verificar si el primer dígito es 6 o 7
        if (telefonoValue.length > 0 && !["6", "7", "2"].includes(telefonoValue[0])) {
            setTelefonoError("El número de teléfono debe comenzar con 6, 7 o 2");
            setIsTelefonoValid(false);
            // Prevent further input by not updating state by default
            return;
        } else {
            setTelefonoError("");
        }

        // Limit to 8 digits
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


    const handleNitChange = (event) => {
        const value = event.target.value || ""; // Asegúrate de que el valor no sea undefined

        // Eliminar caracteres no numéricos
        let nitSanitized = value.replace(/[^\d]/g, "");

        // Limitar la longitud máxima a 14 caracteres
        if (nitSanitized.length > 14) {
            nitSanitized = nitSanitized.slice(0, 14);
        }

        // Validar longitud y formato del NIT
        let errorMessage = "";
        if (nitSanitized.length !== 14 && nitSanitized.length > 0) {
            errorMessage = "El NIT debe tener 14 dígitos.";
        } else {
            // Validar los primeros 4 dígitos
            const primerosDosDigitos = parseInt(nitSanitized.substring(0, 2), 10);
            const segundosDosDigitos = parseInt(nitSanitized.substring(2, 4), 10);
            const dia = parseInt(nitSanitized.substring(4, 6), 10);
            const mes = parseInt(nitSanitized.substring(6, 8), 10);

            if (primerosDosDigitos < 1 || primerosDosDigitos > 14) {
                errorMessage = "Los primeros dos dígitos deben estar entre 01 y 14.";
            } else if (segundosDosDigitos < 1 || segundosDosDigitos > 35) {
                errorMessage = "Los segundos dos dígitos deben estar entre 01 y 35.";
            } else if (dia < 1 || dia > 31 || mes < 1 || mes > 12) {
                errorMessage = "La fecha en el NIT no es válida.";
            }
        }

        // Formatear el NIT con guiones
        let nitFormatted = nitSanitized;
        if (nitSanitized.length > 4) {
            nitFormatted = `${nitSanitized.substring(0, 4)}-${nitSanitized.substring(4)}`;
        }
        if (nitSanitized.length > 10) {
            nitFormatted = `${nitSanitized.substring(0, 4)}-${nitSanitized.substring(4, 10)}-${nitSanitized.substring(10)}`;
        }
        if (nitSanitized.length === 14) {
            nitFormatted = `${nitSanitized.substring(0, 4)}-${nitSanitized.substring(4, 10)}-${nitSanitized.substring(10, 13)}-${nitSanitized.charAt(13)}`;
        }

        console.log('Sanitized NIT:', nitSanitized); // Verifica el NIT sanitizado
        console.log('Formatted NIT:', nitFormatted); // Verifica el NIT formateado

        // Actualizar el estado y el mensaje de error
        setNit(value); // Mantener el valor ingresado
        setIsNitValid(errorMessage === "");
        setFormData(prevData => ({ ...prevData, nit: nitFormatted })); // Actualizar el NIT en formData
        setNitErrorMessage(errorMessage); // Actualizar el mensaje de error del NIT
    };


    const handleNrcChange = (e) => {
        let nrcValue = e.target.value.replace(/[^\d]/g, ""); // Eliminar caracteres no numéricos
        if (nrcValue.length > 7) {
            nrcValue = nrcValue.slice(0, 7);
        }

        // Formatear NRC según el patrón ######-#
        if (nrcValue.length > 6) {
            nrcValue = nrcValue.slice(0, 6) + "-" + nrcValue.slice(6);
        }

        setNrc(nrcValue);

        // Validación del NRC
        const isValid = nrcValue.length === 8 && /^\d{6}-\d{1}$/.test(nrcValue);
        setIsNrcValid(isValid);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validaciones de campos
        if (!isTelefonoValid || tipoPersona === "") {
            setAlertaError(true);
            setErrorMensaje("Por favor, revisa los campos requeridos.");
            return;
        }

        // Obtener la fecha actual en formato YYYY/MM/DD
        const fechaActual = new Date().toISOString().split('T')[0].replace(/-/g, "/");
        const giroValue = tipoPersona === "2" ? giro : null;

        // Datos del cliente
        const clienteData = {
            nombre: nombres,
            apellido: apellidos,
            id_tipo_persona: tipoPersona,
            dui,
            telefono,
            direccion,
            id_departamento: departamento,
            id_municipio: municipio,
            es_contribuyente: esContribuyente ? 1 : 0,
            nombre_comercial: tipoPersona === "1" ? null : nombreComercial,
            nombre_empresa:nombreEmpresa,
            nit: tipoPersona === "1" ? null : nit,
            nrc: tipoPersona === "1" ? null : nrc,
            giro: giroValue, // Usamos la descripción del giro como valor
            fecha_registro: fechaActual, // Utiliza la fecha actual
            id_estado: 1
        };

        console.log("Datos a enviar:", clienteData);

        try {
            const response = await axios.post(`${API_URL}/crear-perfil-cliente`, clienteData, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                }
            });

            console.log("Cliente registrado:", response.data);
            setAlertaExito(true);
            setTimeout(() => navigate('/perfil-cliente'), 2000);
            resetForm();
            setAlertaError(false);
        } catch (error) {
            console.error("Error de solicitud:", error);
            handleError(error);
        }
    };


    const resetForm = () => {
        setNombres("");
        setApellidos("");
        setTipoPersona("");
        setDui("");
        setTelefono("");
        setFechaRegistro("");
        setDireccion("");
        setDepartamento("");
        setMunicipio("");
        setEsContribuyente(false);
        setNombreComercial("");
        setNit("");
        setNrc("");
        setGiro("");
        setNombreEmpresa("");
    };

    const handleError = (error) => {
        let errorMessage = "Hubo un error al procesar la solicitud. Por favor, inténtalo de nuevo.";

        // Imprime la respuesta completa del error para verificar su estructura
        console.error("Error completo:", error);

        if (error.response && error.response.data) {
            const errorData = error.response.data;

            // Imprime la estructura del errorData para ver cómo se presenta realmente
            console.error("Error data:", errorData);

            // Revisa si `errorData.error` es un objeto y contiene los errores esperados
            if (errorData.error) {
                const errors = errorData.error;

                if (errors.dui && errors.dui.length > 0) {
                    errorMessage = "El DUI ya está registrado.";
                } else if (errors.telefono && errors.telefono.length > 0) {
                    errorMessage = "El teléfono ya está registrado.";
                } else if (errors.nit && errors.nit.length > 0) {
                    errorMessage = "El NIT ya está registrado.";
                }
            }
        }

        // Imprime el mensaje final del error para depuración
        console.error("Error message:", errorMessage);
        setAlertaExito(false);
        setAlertaError(true);
        setErrorMensaje(errorMessage);
    };


    const handleDepartamentoChange = (e) => {
        const selectedDepartamento = e.target.value;
        setDepartamento(selectedDepartamento);
        setMunicipio("");
    };

    const handleTipoPersonaChange = (e) => {
        const selectedTipoPersona = e.target.value;
        setTipoPersona(selectedTipoPersona);
        if (selectedTipoPersona !== "2") {
            setEsContribuyente(false);
            setNit("");
            setNrc("");
            setGiro("");
            setNombreEmpresa("");
        }
    };


    const isJuridicalPerson = tipoPersona === "2";

    const toggleAlertas = () => {
        setAlertaExito(false);
        setAlertaError(false);
        setErrorMensaje("");
    };
    const currentYear = new Date().getFullYear();
    const currentMonth = String(new Date().getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const minDate = `${currentYear}-${currentMonth}-01`;
    const maxDate = new Date(currentYear, new Date().getMonth() + 1, 0).toISOString().split('T')[0]; // Last day of the current month

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid className="container-custom">
                    <Row>
                        <Col lg="12">
                            <Card>
                                <CardBody>
                                    {/* Título del formulario */}
                                    <h3 className="form-title">Registra tus datos</h3>

                                    {alertaExito && (
                                        <div className="alert-custom alert-success-custom">
                                            <span>¡Cliente registrado exitosamente!</span>
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
                                        {/* Campos del formulario organizados en dos columnas por fila */}
                                        <Row form>
                                            <Col md={6}>
                                                <FormGroup className="form-group-custom">
                                                    <Label for="nombres">Nombres <span style={{ color: 'red' }}>*</span></Label>
                                                    <Input
                                                        type="text"
                                                        id="nombres"
                                                        value={nombres}
                                                        onChange={(e) => setNombres(e.target.value)}
                                                        required
                                                    />
                                                </FormGroup>
                                            </Col>
                                            <Col md={6}>
                                                <FormGroup className="form-group-custom">
                                                    <Label for="apellidos">Apellidos <span style={{ color: 'red' }}>*</span></Label>
                                                    <Input
                                                        type="text"
                                                        id="apellidos"
                                                        value={apellidos}
                                                        onChange={(e) => setApellidos(e.target.value)}
                                                        required
                                                    />
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                        <Row form>
                                            <Col md={6}>
                                                <FormGroup className="form-group-custom">
                                                    <Label for="tipoPersona">Tipo de Persona <span style={{ color: 'red' }}>*</span></Label>
                                                    <Input
                                                        type="select"
                                                        id="tipoPersona"
                                                        value={tipoPersona}
                                                        onChange={handleTipoPersonaChange}
                                                        required
                                                    >
                                                        <option value="">Seleccione</option>
                                                        {tiposPersonas.map((tp) => (
                                                            <option key={tp.id} value={tp.id}>
                                                                {tp.nombre}
                                                            </option>
                                                        ))}
                                                    </Input>
                                                </FormGroup>
                                            </Col>
                                            <Col md={6}>
                                                {tipoPersona !== "2" && ( // Condición para mostrar el campo DUI solo si tipoPersona no es jurídica
                                                    <FormGroup className="form-group-custom">
                                                        <Label for="dui">DUI <span style={{ color: 'red' }}>*</span></Label>
                                                        <Input
                                                            type="text"
                                                            id="dui"
                                                            value={dui}
                                                            onChange={handleDuiChange}
                                                            required
                                                            maxLength="10"
                                                            invalid={!isDuiValid}
                                                            disabled={tipoPersona === "2"} // Deshabilitado si es jurídica
                                                        />
                                                        {!isDuiValid && (
                                                            <FormFeedback className="text-danger">
                                                                El DUI ingresado no es válido. Debe tener el formato 02345678-9.
                                                            </FormFeedback>
                                                        )}
                                                    </FormGroup>
                                                )}
                                            </Col>
                                        </Row>
                                        <Row form>
                                            <Col md={6}>
                                                <FormGroup className="form-group-custom">
                                                    <Label for="telefono">Teléfono <span style={{ color: 'red' }}>*</span></Label>
                                                    <Input
                                                        type="text"
                                                        id="telefono"
                                                        value={telefono}
                                                        onChange={handleTelefonoChange}
                                                        required
                                                        maxLength="9"
                                                        invalid={!isTelefonoValid}
                                                    />
                                                    {telefonoError && (
                                                        <FormFeedback className="text-danger">{telefonoError}</FormFeedback>
                                                    )}
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                        <Row form>
                                            <Col md={6}>
                                                <FormGroup className="form-group-custom">
                                                    <Label for="direccion">Dirección <span style={{ color: 'red' }}>*</span></Label>
                                                    <Input
                                                        type="text"
                                                        id="direccion"
                                                        value={direccion}
                                                        onChange={(e) => setDireccion(e.target.value)}
                                                        required
                                                    />
                                                </FormGroup>
                                            </Col>
                                            <Col md={6}>
                                                <FormGroup className="form-group-custom">
                                                    <Label for="departamento">Departamento <span style={{ color: 'red' }}>*</span></Label>
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
                                                    <Label for="municipio">Municipio <span style={{ color: 'red' }}>*</span></Label>
                                                    <Input
                                                        type="select"
                                                        id="municipio"
                                                        value={municipio}
                                                        onChange={(e) => setMunicipio(e.target.value)}
                                                        required
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
                                            <Col md={6}>
                                                <FormGroup className="form-group-custom">
                                                    <Label htmlFor="esContribuyente">¿Es Contribuyente? <span style={{ color: 'red' }}>*</span></Label>
                                                    <Input
                                                        type="checkbox"
                                                        id="esContribuyente"
                                                        checked={esContribuyente}
                                                        onChange={(e) => setEsContribuyente(e.target.checked)}
                                                    />
                                                </FormGroup>
                                            </Col>
                                            <Col md={6}>
                                                <FormGroup className="form-group-custom">
                                                <Label htmlFor="nombreEmpresa">Nombre Comercial <span style={{ color: 'red' }}>*</span></Label>
                                                            <Input
                                                                type="text"
                                                                id="nombreEmpresa"
                                                                value={nombreEmpresa}
                                                                onChange={(e) => setNombreEmpresa(e.target.value)}
                                                            />
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                        {tipoPersona === "2" && ( // Si es persona jurídica
                                            <>
                                                <Row form>
                                                    <Col md={6}>
                                                        <FormGroup className="form-group-custom">
                                                            <Label htmlFor="nit">NIT <span style={{ color: 'red' }}>*</span></Label>
                                                            <Input
                                                                type="text"
                                                                id="nit"
                                                                value={formData.nit}
                                                                onChange={handleNitChange}
                                                                invalid={!isNitValid}
                                                            />
                                                            {!isNitValid && nitErrorMessage && (
                                                                <FormFeedback className="text-danger">
                                                                    {nitErrorMessage}
                                                                </FormFeedback>
                                                            )}
                                                        </FormGroup>
                                                    </Col>
                                                    <Col md={6}>
                                                        <FormGroup className="form-group-custom">
                                                            <Label htmlFor="nrc">NRC <span style={{ color: 'red' }}>*</span></Label>
                                                            <Input
                                                                type="text"
                                                                id="nrc"
                                                                value={nrc}
                                                                onChange={handleNrcChange}
                                                                invalid={!isNrcValid}
                                                            />
                                                            {!isNrcValid && (
                                                                <FormFeedback className="text-danger">
                                                                    El NRC ingresado no es válido.
                                                                </FormFeedback>
                                                            )}
                                                        </FormGroup>
                                                    </Col>
                                                </Row>
                                                <Row form>
                                                    <Col md={6}>
                                                        <FormGroup>
                                                            <Label htmlFor="giro">Giro <span style={{ color: 'red' }}>*</span></Label>
                                                            <Select
                                                                id="searchGiro"
                                                                value={filteredGiros.find(g => g.st_descripcion === searchGiro)} // Para mostrar el valor seleccionado
                                                                onChange={handleGiroSelect} // Manejador para la selección
                                                                onInputChange={handleSearchGiro} // Manejador para la búsqueda
                                                                options={giros.map(g => ({
                                                                    value: g.sk_actividadeco,
                                                                    label: `${g.st_codigo} - ${g.st_descripcion}`
                                                                }))}
                                                                placeholder="Buscar giro por código o descripción"
                                                                isClearable
                                                                isSearchable
                                                            />
                                                        </FormGroup>
                                                    </Col>
                                                    <Col md={6}>
                                                    <FormGroup className="form-group-custom">
                                                    <Label htmlFor="nombreComercial">Razon Social <span style={{ color: 'red' }}>*</span></Label>
                                                    <Input
                                                        type="text"
                                                        id="nombreComercial"
                                                        value={nombreComercial}
                                                        onChange={(e) => setNombreComercial(e.target.value)}
                                                    />

                                                        </FormGroup>
                                                    </Col>
                                                </Row>
                                            </>
                                        )}

                                        <Row form>
                                            <Col md={12}>
                                                <Button type="submit" color="primary">Guardar</Button>
                                            </Col>
                                        </Row>
                                    </Form>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    );
}

export default AgregarCliente;