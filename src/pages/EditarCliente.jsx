// src/pages/EditarCliente.js
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FormGroup, Label, Input, Button, FormFeedback, Row, Col } from "reactstrap";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "/src/styles/Clientes.css";

const formatDate = (date) => {
  if (!date) return "";
  const [year, month, day] = date.split(' ')[0].split('-');
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
};

const EditarCliente = () => {
  const { id } = useParams(); // Get client ID from URL
  const navigate = useNavigate();
  const [cliente, setCliente] = useState(null);
  const [error, setError] = useState("");
  const [isDuiValid, setIsDuiValid] = useState(true);
  const [isTelefonoValid, setIsTelefonoValid] = useState(true);
  const [isNitValid, setIsNitValid] = useState(true);

  useEffect(() => {
    // Fetch client data on component mount
    const fetchCliente = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/perfil-cliente/${id}`);
        setCliente(response.data);
      } catch (err) {
        console.error("Error al obtener el cliente:", err);
        toast.error("Error al obtener los datos del cliente.");
      }
    };

    fetchCliente();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCliente((prev) => ({ ...prev, [name]: value }));
  };

  const validateDui = (dui) => {
    const regex = /^[0-9]{8}-[0-9]{1}$/;
    setIsDuiValid(regex.test(dui));
  };

  const validateTelefono = (telefono) => {
    const regex = /^[0-9]{8}$/;
    setIsTelefonoValid(regex.test(telefono));
  };

  const validateNit = (nit) => {
    const regex = /^[0-9]{4}-[0-9]{6}-[0-9]{3}$/;
    setIsNitValid(regex.test(nit));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isDuiValid || !isTelefonoValid || !isNitValid) {
      setError("Por favor, corrige los errores en el formulario.");
      return;
    }

    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/actualizar-perfil-cliente/${id}`, cliente);
      toast.success("Cliente actualizado exitosamente.");
      navigate("/clientes"); // Redirect to the clients list or another page
    } catch (err) {
      const errorMessage = err.response?.data.message || "Error al guardar los cambios.";
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  if (!cliente) return <div>Cargando...</div>;

  return (
    <div className="editar-cliente-page">
      <h1>Editar Cliente</h1>
      <form onSubmit={handleSubmit}>
        <Row>
          <Col md={6}>
            <FormGroup>
              <Label for="nombre">Nombre</Label>
              <Input
                type="text"
                id="nombre"
                name="nombre"
                value={cliente.nombre}
                onChange={handleChange}
                invalid={!cliente.nombre}
              />
              <FormFeedback>Por favor, ingresa el nombre del cliente.</FormFeedback>
            </FormGroup>
          </Col>
          <Col md={6}>
            <FormGroup>
              <Label for="apellido">Apellido</Label>
              <Input
                type="text"
                id="apellido"
                name="apellido"
                value={cliente.apellido}
                onChange={handleChange}
                invalid={!cliente.apellido}
              />
              <FormFeedback>Por favor, ingresa el apellido del cliente.</FormFeedback>
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <FormGroup>
              <Label for="dui">DUI</Label>
              <Input
                type="text"
                id="dui"
                name="dui"
                value={cliente.dui}
                onChange={(e) => {
                  handleChange(e);
                  validateDui(e.target.value);
                }}
                invalid={!isDuiValid}
              />
              <FormFeedback>El DUI debe tener el formato 12345678-9.</FormFeedback>
            </FormGroup>
          </Col>
          <Col md={6}>
            <FormGroup>
              <Label for="telefono">Teléfono</Label>
              <Input
                type="text"
                id="telefono"
                name="telefono"
                value={cliente.telefono}
                onChange={(e) => {
                  handleChange(e);
                  validateTelefono(e.target.value);
                }}
                invalid={!isTelefonoValid}
              />
              <FormFeedback>El teléfono debe tener 8 dígitos.</FormFeedback>
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <FormGroup>
              <Label for="nit">NIT</Label>
              <Input
                type="text"
                id="nit"
                name="nit"
                value={cliente.nit}
                onChange={(e) => {
                  handleChange(e);
                  validateNit(e.target.value);
                }}
                invalid={!isNitValid}
              />
              <FormFeedback>El NIT debe tener el formato 1234-567890-123.</FormFeedback>
            </FormGroup>
          </Col>
          {/* Add other form fields as needed */}
        </Row>
        {error && <div className="error-message">{error}</div>}
        <Button color="primary" type="submit">Guardar Cambios</Button>
        <Button color="secondary" onClick={() => navigate("/clientes")}>Cancelar</Button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default EditarCliente;
