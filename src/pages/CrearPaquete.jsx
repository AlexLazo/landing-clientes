import React, { useState, useEffect, useCallback } from "react";
import { Card, CardBody, Container, Form, FormGroup, Label, Input, Button, FormFeedback, Row, Col, CardHeader, } from "reactstrap";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import '../styles/DatosPaquetesPreOrden.css';

export default function DatosPaquetePreOrden() {
  const { idCliente } = useParams();
  const [cliente, setCliente] = useState(null);
  const [tiposPaquete, setTiposPaquete] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [empaques, setEmpaques] = useState([]);
  const [tarifas, setTarifas] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedAddressRecol, setSelectedAddressRecol] = useState(null);
  const [commonData, setCommonData] = useState({
    id_estado_paquete: "3", // Assuming '1' is the ID for "recepción"
    fecha_envio: "",
    fecha_entrega_estimada: "",
    fecha_entrega: "",
    id_tipo_entrega: "1",
    instrucciones_entrega: "",
  });
  const [paquetes, setPaquetes] = useState([
    {
      id_tipo_paquete: "",
      id_empaque: "",
      peso: "",
      descripcion: "",
      precio: "",
      tamano_paquete: "",
    },
  ]);
  const [errors, setErrors] = useState({
    commonData: {},
    paquetes: [],
  });

  const token = localStorage.getItem("authToken");
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("authToken");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const { data: clienteData } = await axios.get(`${API_URL}/perfil-cliente`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const clienteId = clienteData.cliente.id;
        setCliente(clienteData.cliente || {});

        const [tiposPaqueteRes, empaquesRes, tarifasRes] = await Promise.all([
          axios.get(`${API_URL}/dropdown/get_tipo_paquete`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${API_URL}/dropdown/get_empaques`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${API_URL}/tarifa-destinos`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        console.log("Tipos Paquete Response:", tiposPaqueteRes.data);
        console.log("Empaques Response:", empaquesRes.data);
        console.log("Tarifas Response:", tarifasRes.data);

        setTiposPaquete(tiposPaqueteRes.data.tipo_paquete || []);
        setEmpaques(empaquesRes.data.empaques || []);
        setTarifas(tarifasRes.data || []);

        const storedAddress = JSON.parse(localStorage.getItem("selectedRecoleccion"));
        setSelectedAddressRecol(storedAddress);
        console.log("Selected address:", storedAddress);

        const storedAddressEntre = JSON.parse(localStorage.getItem("selectedEntrega"));
        setSelectedAddress(storedAddressEntre);
        console.log("Selected address for recollect:", storedAddressEntre);

      } catch (error) {
        handleError(error);
      }
    };

    const handleError = (error) => {
      if (error.response) {
        setError(`Error: ${error.response.data.message || "Error al cargar los datos."}`);
      } else {
        setError("Error al cargar los datos.");
      }
    };

    fetchData();
  }, [navigate, API_URL]);

  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "peso":
      case "precio":
        if (isNaN(value) || value <= 0) {
          error = "El valor debe ser un número positivo.";
        }
        break;

      case "id_tipo_paquete":
      case "id_empaque":
      case "tamano_paquete":
        if (!value) {
          error = "Debe seleccionar una opción.";
        }
        break;

      case "descripcion":
      case "instrucciones_entrega":
        if (!value.trim()) {
          error = "Debe rellenar este campo.";
        }
        break;

      default:
        break;
    }

    return error;
  };

  const handleChangeCommonData = (e) => {
    const { name, value } = e.target;
    setCommonData((prev) => ({ ...prev, [name]: value }));

    const error = validateField(name, value);
    setErrors((prev) => ({
      ...prev,
      commonData: { ...prev.commonData, [name]: error },
    }));

    // Recalculate prices for all packages
    const updatedPaquetes = paquetes.map((paquete) => ({
      ...paquete,
      precio: calculatePrice(paquete.tamano_paquete),
    }));
    setPaquetes(updatedPaquetes);
  };

  const getTamanoPaqueteString = (tamanoPaquete) => {
    switch (tamanoPaquete) {
      case "1":
        return "pequeno";
      case "2":
        return "mediano";
      case "3":
        return "grande";
      default:
        return "";
    }
  };

  // Datos para los tamaños de paquete
  const tamanoPaqueteData = {
    "1": {
      descripcion: "Ideal para documentos y objetos pequeños.",
      imagen: "./src/assets/Paquete1.png", // Reemplaza con la ruta real
    },
    "2": {
      descripcion: "Para objetos de tamaño mediano, como ropa o regalos.",
      imagen: "./src/assets/Paquete2.png",
    },
    "3": {
      descripcion: "Perfecto para artículos grandes o múltiples elementos.",
      imagen: "./src/assets/Paquete3.png", // Reemplaza con la ruta real
    },
  };

  const calculatePrice = (tamanoPaquete) => {
    if (!selectedAddress || !tamanoPaquete) {
      console.log("Missing selectedAddress or tamanoPaquete", {
        selectedAddress,
        tamanoPaquete,
      });
      return "Precio no disponible";
    }

    const isSanMiguelUrban =
      selectedAddress.id_departamento === 12 &&
      selectedAddress.id_municipio === 215;

    let tarifaType = isSanMiguelUrban ? "tarifa urbana" : "tarifa rural";

    const tarifa = tarifas.find(
      (t) =>
        t.tamano_paquete === getTamanoPaqueteString(tamanoPaquete) &&
        t.departamento === selectedAddress.departamento_nombre &&
        t.municipio === selectedAddress.municipio_nombre &&
        t.tarifa === tarifaType
    );

    let price = 0;

    if (!tarifa) {
      const generalTarifa = tarifas.find(
        (t) =>
          t.tamano_paquete === getTamanoPaqueteString(tamanoPaquete) &&
          t.departamento === selectedAddress.departamento_nombre &&
          t.tarifa === tarifaType
      );

      if (generalTarifa) {
        price = generalTarifa.monto;
      } else {
        return "Tarifa no encontrada";
      }
    } else {
      price = tarifa.monto;
    }

    // Asegurarse de que price es un número antes de sumarle 1
    const finalPrice = parseFloat(price) + 1;

    // Añadir $1 al precio por el costo de recolección y redondear a 2 decimales
    return finalPrice.toFixed(2);  // Redondea a 2 decimales
  };


  const handleChangePaquete = (index, e) => {
    const { name, value } = e.target;
    const updatedPaquetes = [...paquetes];
    updatedPaquetes[index] = { ...updatedPaquetes[index], [name]: value };

    if (name === "tamano_paquete") {
      const calculatedPrice = calculatePrice(value);
      updatedPaquetes[index].precio = calculatedPrice || "Precio no disponible";
    }

    setPaquetes(updatedPaquetes);

    const error = validateField(name, value);
    setErrors((prev) => {
      const newPaquetesErrors = [...(prev.paquetes || [])];
      newPaquetesErrors[index] = { ...newPaquetesErrors[index], [name]: error };
      return { ...prev, paquetes: newPaquetesErrors };
    });

    console.log("Updated paquete:", updatedPaquetes[index]);
  };

  const agregarPaquete = () => {
    setPaquetes((prev) => [
      ...prev,
      {
        id_tipo_paquete: "",
        id_empaque: "",
        peso: "",
        descripcion: "",
        precio: "",
        tamano_paquete: "",
      },
    ]);
    setErrors((prev) => ({
      ...prev,
      paquetes: [...prev.paquetes, {}],
    }));
  };

  // Función para manejar el clic en la imagen
  const handleImageClick = (imagen) => {
    setSelectedImage(imagen);
    setModalOpen(true);
  };

  // Función para cerrar el modal al hacer clic en la imagen ampliada
  const handleModalImageClick = () => {
    setModalOpen(false);
  };

  const removerPaquete = (index) => {
    setPaquetes((prev) => prev.filter((_, idx) => idx !== index));
    setErrors((prev) => ({
      ...prev,
      paquetes: prev.paquetes.filter((_, idx) => idx !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields
    let isValid = true;
    let newErrors = {
      commonData: {},
      paquetes: paquetes.map(() => ({})),
    };

    // Validate common data
    Object.keys(commonData).forEach((key) => {
      const error = validateField(key, commonData[key]);
      if (error) {
        newErrors.commonData[key] = error;
        isValid = false;
      }
    });

    // Validate paquetes
    paquetes.forEach((paquete, index) => {
      Object.keys(paquete).forEach((key) => {
        const error = validateField(key, paquete[key]);
        if (error) {
          newErrors.paquetes[index][key] = error;
          isValid = false;
        }
      });
    });

    setErrors(newErrors);

    if (!isValid) {
      toast.error(
        "Por favor, corrija los errores en el formulario antes de enviar."
      );
      return;
    }

    const detalles = paquetes.map((paquete) => ({
      ...commonData,
      ...paquete,
      id_direccion: selectedAddress ? selectedAddress.id : null,
    }));

    const totalPrice = detalles.reduce(
      (sum, detalle) => sum + parseFloat(detalle.precio || 0),
      0
    );

    console.log("Submitting form:", { detalles, totalPrice, commonData });

    navigate(`/GenerarPreOrden/${idCliente}`, {
      state: {
        detalles: detalles,
        totalPrice: totalPrice,
        commonData: commonData,
      },
    });
  };

  return (
    <Container fluid>
      <h1 className="text-center titulo-pasos">
        Agregar datos de los Paquetes para Pre-Orden
      </h1>
      <Card>
        <CardHeader className="CardHeaderDatosPAquetes">
          {cliente && selectedAddress && (
            <h3>Nombre de contacto: {selectedAddress.nombre_contacto}</h3>
          )}
          {selectedAddress && (
            <h6>Dirección seleccionada para entrega: {selectedAddress.direccion}</h6>
          )}
          {cliente && selectedAddressRecol && (
            <h3>Nombre de contacto: {selectedAddressRecol.nombre_contacto}</h3>
          )}
          {selectedAddressRecol && (
            <h6>Dirección seleccionada para recolección: {selectedAddressRecol.direccion}</h6>
          )}
        </CardHeader>
        <CardBody>
          <Form onSubmit={handleSubmit}>
            <Card className="mb-3">
              <CardBody>
                <h5>Datos Comunes para todos los Paquetes</h5>
                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="estado_paquete">Estado del Paquete</Label>
                      <Input
                        type="text"
                        name="estado_paquete"
                        id="estado_paquete"
                        value="En Espera de Recolección"
                        disabled
                      />
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="tipo_entrega">Tipo de Entrega</Label>
                      <Input
                        type="text"
                        name="tipo_entrega"
                        id="tipo_entrega"
                        value="Entrega Normal"
                        disabled
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md={12}>
                    <FormGroup>
                      <Label for="instrucciones_entrega">
                        Instrucciones de Entrega <span style={{ color: 'red' }}>*</span>
                      </Label>
                      <Input
                        type="text"
                        name="instrucciones_entrega"
                        id="instrucciones_entrega"
                        value={commonData.instrucciones_entrega}
                        onChange={handleChangeCommonData}
                        invalid={!!errors.commonData.instrucciones_entrega}
                      />
                      {errors.commonData.instrucciones_entrega && (
                        <FormFeedback>
                          {errors.commonData.instrucciones_entrega}
                        </FormFeedback>
                      )}
                    </FormGroup>
                  </Col>
                </Row>
              </CardBody>
            </Card>

            {paquetes.map((paquete, index) => (
              <Card key={index} className="mb-3">
                <CardBody>
                  <h5>Paquete {index + 1}</h5>
                  <Row>
                    <Col md={6}>
                      <FormGroup>
                        <Label for={`id_tipo_paquete_${index}`}>Tipo de Paquete <span style={{ color: 'red' }}>*</span></Label>
                        <Input
                          type="select"
                          name="id_tipo_paquete"
                          id={`id_tipo_paquete_${index}`}
                          value={paquete.id_tipo_paquete}
                          onChange={(e) => handleChangePaquete(index, e)}
                          invalid={!!errors.paquetes[index]?.id_tipo_paquete}
                        >
                          <option value="">Selecciona un tipo de paquete</option>
                          {tiposPaquete.map((tipo) => (
                            <option key={tipo.id} value={tipo.id}>
                              {tipo.nombre}
                            </option>
                          ))}
                        </Input>
                        {errors.paquetes[index]?.id_tipo_paquete && (
                          <FormFeedback>{errors.paquetes[index].id_tipo_paquete}</FormFeedback>
                        )}
                      </FormGroup>

                      </Col>
                    <Col md={6}>
                      <FormGroup>
                        <Label for={`id_empaque_${index}`}>Tipo de Empaque <span style={{ color: 'red' }}>*</span></Label>
                        <Input
                          type="select"
                          name="id_empaque"
                          id={`id_empaque_${index}`}
                          value={paquete.id_empaque}
                          onChange={(e) => handleChangePaquete(index, e)}
                          invalid={!!errors.paquetes[index]?.id_empaque}
                        >
                          <option value="">Selecciona un tipo de empaque</option>
                          {empaques.map((empaque) => (
                            <option key={empaque.id} value={empaque.id}>
                              {empaque.empaquetado}
                            </option>
                          ))}
                        </Input>
                        {errors.paquetes[index]?.id_empaque && (
                          <FormFeedback>{errors.paquetes[index].id_empaque}</FormFeedback>
                        )}
                      </FormGroup>
                    </Col>

                  </Row>

                  <Row>
                    <Col md={12}>
                      <FormGroup>
                        <Label for={`tamano_paquete_${index}`}>
                          Tamaño del Paquete <span style={{ color: 'red' }}>*</span>
                        </Label>
                        <Input
                          type="select"
                          name="tamano_paquete"
                          id={`tamano_paquete_${index}`}
                          value={paquete.tamano_paquete}
                          onChange={(e) => handleChangePaquete(index, e)}
                          invalid={!!(errors.paquetes[index]?.tamano_paquete)}
                        >
                          <option value="">Seleccione un tamaño</option>
                          <option value="1">Pequeño</option>
                          <option value="2">Mediano</option>
                          <option value="3">Grande</option>
                        </Input>
                        {errors.paquetes[index]?.tamano_paquete && (
                          <FormFeedback>
                            {errors.paquetes[index].tamano_paquete}
                          </FormFeedback>
                        )}
                      </FormGroup>

                      {/* Mostrar la descripción y la imagen si hay un tamaño seleccionado */}
                      {paquete.tamano_paquete && (
                        <div className="tamano-paquete-info">
                          <p>{tamanoPaqueteData[paquete.tamano_paquete].descripcion}</p>
                          <img
                            src={tamanoPaqueteData[paquete.tamano_paquete].imagen}
                            alt={getTamanoPaqueteString(paquete.tamano_paquete)}
                            style={{ width: "150px", height: "auto", cursor: "pointer" }} // Ajusta el tamaño
                            onClick={() => handleImageClick(tamanoPaqueteData[paquete.tamano_paquete].imagen)} // Maneja el clic en la imagen
                          />
                        </div>
                      )}
                      
                      {/* Modal para mostrar imagen grande */}
                      {modalOpen && (
                        <div className="modal" onClick={handleModalImageClick}>
                          <div className="modal-content">
                            <span className="close" onClick={() => setModalOpen(false)}>&times;</span>
                            <img
                              src={selectedImage}
                              alt="Imagen ampliada"
                              style={{ width: "100%", height: "auto", cursor: "pointer" }}
                              onClick={handleModalImageClick} // Cierra el modal al hacer clic en la imagen
                            />
                          </div>
                        </div>
                      )}
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <FormGroup>
                        <Label for={`peso_${index}`}>Peso <span style={{ color: 'red' }}>*</span></Label>
                        <Input
                          type="number"
                          name="peso"
                          id={`peso_${index}`}
                          value={paquete.peso}
                          onChange={(e) => handleChangePaquete(index, e)}
                          invalid={!!(errors.paquetes[index]?.peso)}
                        />
                        {errors.paquetes[index]?.peso && (
                          <FormFeedback>{errors.paquetes[index].peso}</FormFeedback>
                        )}
                      </FormGroup>
                      </Col>
                      <Col md={6}>

                      <FormGroup>
                        <Label for={`precio_${index}`}>Precio</Label>
                        <Input
                          type="text"
                          name="precio"
                          id={`precio_${index}`}
                          value={paquete.precio}
                          readOnly
                          invalid={!!(errors.paquetes[index]?.precio)}
                        />
                        {errors.paquetes[index]?.precio && (
                          <FormFeedback>{errors.paquetes[index].precio}</FormFeedback>
                        )}
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={12}>
                      <FormGroup>
                        <Label for={`descripcion_${index}`}>Descripción <span style={{ color: 'red' }}>*</span></Label>
                        <Input
                          type="text"
                          name="descripcion"
                          id={`descripcion_${index}`}
                          value={paquete.descripcion}
                          onChange={(e) => handleChangePaquete(index, e)}
                          invalid={!!(errors.paquetes[index]?.descripcion)}
                        />
                        {errors.paquetes[index]?.descripcion && (
                          <FormFeedback>{errors.paquetes[index].descripcion}</FormFeedback>
                        )}
                      </FormGroup>
                    </Col>
                  </Row>

                  {modalOpen && (
                    <div className="modal" onClick={handleModalImageClick}>
                      <div className="modal-content">
                        <span className="close" onClick={() => setModalOpen(false)}>&times;</span>
                        <img
                          src={selectedImage}
                          alt="Imagen ampliada"
                          style={{ width: "100%", height: "auto", cursor: "pointer" }}
                          onClick={handleModalImageClick} // Cierra el modal al hacer clic en la imagen
                        />
                      </div>
                    </div>
                  )}

                  {index > 0 && (
                    <Row className="mt-3">
                      <Col>
                        <Button
                          color="danger"
                          onClick={() => removerPaquete(index)}
                        >
                          Eliminar Paquete
                        </Button>
                      </Col>
                    </Row>
                  )}
                </CardBody>
              </Card>
            ))}
            <Row className="mb-3">
              <Col className="d-flex justify-content-start">
                <Button
                  color="primary"
                  onClick={agregarPaquete}
                  disabled={paquetes.length >= 3} // Limita a un máximo de 3 paquetes
                >
                  Agregar Paquete
                </Button>
              </Col>
            </Row>
            <Button type="submit" color="success">Enviar</Button>
          </Form>
        </CardBody>
      </Card>
    </Container>
  );
}  