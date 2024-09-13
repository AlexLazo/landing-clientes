import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, CardBody, Form, FormGroup, Label, Input, Button, FormFeedback } from "reactstrap";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AuthService from "../services/authService";

const API_URL = import.meta.env.VITE_API_URL;

export default function GenerarPreOrden() {
  const location = useLocation();
  const navigate = useNavigate();
  const { idCliente } = useParams();
  const [cliente, setCliente] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    id_cliente: idCliente,
    nombre_contacto: "",
    telefono: "",
    id_direccion: "",
    id_tipo_pago: 1,
    id_estado_paquete: 1,
    id_estado_paquetes: 1,
    total_pagar: 0,
    concepto: "Envío de paquetes",
    tipo_documento: "consumidor_final",
    detalles: [],
  });

  const token = localStorage.getItem("authToken");
  const [errors, setErrors] = useState({});
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [addressChanged, setAddressChanged] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('authToken');
  
      if (!token) {
        navigate('/login');
        return;
      }
  
      try {
        // Obtener datos del cliente
        const { data: clienteData } = await axios.get(`${API_URL}/perfil-cliente`, {
          headers: { Authorization: `Bearer ${token}` }
        });
  
        const clienteId = clienteData.cliente.id;
  
        if (!clienteId) {
          throw new Error("ID del cliente no disponible.");
        }
  
        // Obtener la dirección almacenada
        const storedAddress = JSON.parse(localStorage.getItem("selectedAddress") || "{}");
        setSelectedAddress(storedAddress);
  
        // Configurar el estado de formData
        setFormData(prevState => ({
          ...prevState,
          id_cliente: clienteId,
          nombre_contacto: storedAddress.nombre_contacto || "",
          telefono: storedAddress.telefono || "",
          id_direccion: Number(storedAddress.id) || 0,
          total_pagar: location.state?.totalPrice || 0,
          detalles: (location.state?.detalles || []).map(detalle => ({
            ...detalle,
            id_tipo_paquete: Number(detalle.id_tipo_paquete),
            id_empaque: Number(detalle.id_empaque),
            peso: Number(detalle.peso),
            id_estado_paquete: 1,
            id_tamano_paquete: Number(detalle.tamano_paquete),
            id_tipo_entrega: 1,
            id_direccion: Number(storedAddress.id),
            precio: Number(detalle.precio),
            fecha_envio: new Date().toISOString().split("T")[0] + "T00:00:00",
            descripcion_contenido: detalle.descripcion || "",
          })),
          ...location.state?.commonData
        }));
      } catch (error) {
        console.error("Error al obtener datos:", error);
        toast.error("Error al obtener datos");
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, [navigate, location.state]);

  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "nombre_contacto":
      case "telefono":
      case "concepto":
        if (!value.trim()) {
          error = "Este campo es requerido";
        }
        break;
      case "total_pagar":
        if (isNaN(value) || Number(value) < 0) {
          error = "Debe ser un número positivo";
        }
        break;
      case "id_tipo_pago":
      case "tipo_documento":
        if (!value) {
          error = "Debe seleccionar una opción";
        }
        break;
      default:
        break;
    }
    return error;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => {
      const updatedState = {
        ...prevState,
        [name]: value,
      };

      if (name === "nombre_contacto" || name === "telefono") {
        if (value !== selectedAddress[name]) {
          setAddressChanged(true);
        } else {
          setAddressChanged(false);
        }
      }

      return updatedState;
    });

    const error = validateField(name, value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: error,
    }));
  };

  const updateAddress = async () => {
    if (addressChanged && selectedAddress && selectedAddress.id) {
      try {
        const token = AuthService.getCurrentUser();
        const response = await axios.put(
          `${API_URL}/direcciones/${selectedAddress.id}`,
          {
            nombre_contacto: formData.nombre_contacto,
            telefono: formData.telefono,
            id_departamento: selectedAddress.id_departamento,
            id_municipio: selectedAddress.id_municipio,
            direccion: selectedAddress.direccion,
            referencia: selectedAddress.referencia,
            id_cliente: idCliente,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          console.log("Dirección actualizada con éxito");

          const updatedAddress = {
            ...selectedAddress,
            nombre_contacto: formData.nombre_contacto,
            telefono: formData.telefono,
          };
          setSelectedAddress(updatedAddress);
          localStorage.setItem(
            "selectedAddress",
            JSON.stringify(updatedAddress)
          );

          setAddressChanged(false);
        } else {
          throw new Error("La respuesta del servidor no fue exitosa");
        }
      } catch (error) {
        console.error("Error al actualizar la dirección:", error);
        toast.error(
          "Error al actualizar la dirección: " +
            (error.response?.data?.message || error.message)
        );
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let newErrors = {};
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) {
        newErrors[key] = error;
      }
    });
  
    setErrors(newErrors);
  
    if (Object.keys(newErrors).length > 0) {
      toast.error("Por favor, corrija los errores en el formulario antes de enviar.");
      return;
    }
  
    try {
      const token = AuthService.getClienteId();
      console.log("Token:", token);

      await updateAddress();
  
      const orderData = {
        id_cliente: formData.id_cliente,
        nombre_contacto: formData.nombre_contacto,
        telefono: formData.telefono,
        id_direccion: Number(formData.id_direccion),
        id_tipo_pago: Number(formData.id_tipo_pago),
        total_pagar: Number(formData.total_pagar),
        concepto: formData.concepto,
        tipo_documento: formData.tipo_documento,
        detalles: formData.detalles,
        id_estado_paquete: Number(formData.id_estado_paquete),
        id_estado_paquetes: Number(formData.id_estado_paquetes),
      };
  
      console.log("Order Data:", JSON.stringify(orderData, null, 2));
  
      const response = await axios.post(`${API_URL}/ordenes-cliente`, orderData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
  
      console.log("Response Data:", response.data);
  
      if (response.status === 201) {
        toast.success("Pre-orden creada con éxito");
        navigate(`/preordenes/${response.data.id}`);
      } else {
        throw new Error(`La respuesta del servidor no fue exitosa: ${response.status}`);
      }
    } catch (error) {
      console.error("Error al crear la pre-orden:", error);
      if (error.response) {
        console.error("Detalles del error:", error.response.data);
        toast.error("Error al crear la pre-orden: " + (error.response.data.message || error.message));
      } else {
        toast.error("Error al crear la pre-orden: " + error.message);
      }
    }
  };

  if (loading) {
    return (
      <Container>
        <Row className="justify-content-center mt-5">
          <Col md={6} className="text-center">
            <h2>Cargando...</h2>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container>
      <Row>
        <Col md={12} className="my-3">
          <Card>
            <CardBody>
              <h3 className="text-center mb-4">Generar Pre-Orden</h3>
              <Form onSubmit={handleSubmit}>
                <FormGroup>
                  <Label for="nombre_contacto">Nombre del Contacto</Label>
                  <Input
                    type="text"
                    name="nombre_contacto"
                    id="nombre_contacto"
                    value={formData.nombre_contacto}
                    onChange={handleInputChange}
                    invalid={!!errors.nombre_contacto}
                  />
                  <FormFeedback>{errors.nombre_contacto}</FormFeedback>
                </FormGroup>
                <FormGroup>
                  <Label for="telefono">Teléfono</Label>
                  <Input
                    type="text"
                    name="telefono"
                    id="telefono"
                    value={formData.telefono}
                    onChange={handleInputChange}
                    invalid={!!errors.telefono}
                  />
                  <FormFeedback>{errors.telefono}</FormFeedback>
                </FormGroup>
                <FormGroup>
                          <Label for="id_direccion">Dirección</Label>
                          <Input
                            type="select"
                            name="id_direccion"
                            id="id_direccion"
                            value={formData.id_direccion}
                            onChange={handleInputChange}
                            invalid={!!errors.id_direccion}
                          >
                            <option value="">Seleccione una dirección</option>
                            {selectedAddress && (
                              <option value={selectedAddress.id}>
                                {selectedAddress.direccion}
                              </option>
                            )}
                          </Input>
                          <FormFeedback>{errors.id_direccion}</FormFeedback>
                        </FormGroup>
                <FormGroup>
                  <Label for="id_tipo_pago">Tipo de Pago</Label>
                  <Input
                    type="select"
                    name="id_tipo_pago"
                    id="id_tipo_pago"
                    value={formData.id_tipo_pago}
                    onChange={handleInputChange}
                    invalid={!!errors.id_tipo_pago}
                  >
                    <option value="1">Efectivo</option>
                    <option value="2">Tarjeta</option>
                    <option value="3">Transferencia</option>
                    {/* Otros tipos de pago */}
                  </Input>
                  <FormFeedback>{errors.id_tipo_pago}</FormFeedback>
                </FormGroup>
                <FormGroup>
                  <Label for="total_pagar">Total a Pagar</Label>
                  <Input
                    type="number"
                    name="total_pagar"
                    id="total_pagar"
                    value={formData.total_pagar}
                    onChange={handleInputChange}
                    readOnly
                    invalid={!!errors.total_pagar}
                  />
                  <FormFeedback>{errors.total_pagar}</FormFeedback>
                </FormGroup>
                <FormGroup>
                  <Label for="concepto">Concepto</Label>
                  <Input
                    type="text"
                    name="concepto"
                    id="concepto"
                    value={formData.concepto}
                    onChange={handleInputChange}
                    invalid={!!errors.concepto}
                  />
                  <FormFeedback>{errors.concepto}</FormFeedback>
                </FormGroup>
                <FormGroup>
                  <Label for="tipo_documento">Tipo de Documento</Label>
                  <Input
                    type="select"
                    name="tipo_documento"
                    id="tipo_documento"
                    value={formData.tipo_documento}
                    onChange={handleInputChange}
                    invalid={!!errors.tipo_documento}
                  >
                    <option value="consumidor_final">Consumidor Final</option>
                    <option value="empresa">Empresa</option>
                  </Input>
                  <FormFeedback>{errors.tipo_documento}</FormFeedback>
                </FormGroup>
                <Button type="submit" color="primary">Generar Pre-Orden</Button>
              </Form>
            </CardBody>
          </Card>
        </Col>
      </Row>
      <ToastContainer />
    </Container>
  );
}
