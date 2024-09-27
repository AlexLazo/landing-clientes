import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ListGroup, ListGroupItem, Spinner, Alert, Container, Row, Col, Card, CardBody, Table, Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label, Input, FormFeedback } from 'reactstrap';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AuthService from '../services/authService';
import '../styles/PreOrden.css';

const API_URL = import.meta.env.VITE_API_URL;

export default function ProcesarPago() {
  const { idCliente } = useParams();
  const navigate = useNavigate();
  const [pendingOrders, setPendingOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [cardData, setCardData] = useState({
    nombre_titular: '',
    numero_tarjeta: '',
    fecha_vencimiento: '',
    cvv: ''
  });
  const [errors, setErrors] = useState({});
  const [loadingModal, setLoadingModal] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    console.log("Fetching orders for client ID:", idCliente);

    const fetchPendingOrders = async () => {
      try {
        const token = AuthService.getCurrentUser();
        if (!token) {
          throw new Error("Token de autenticación no disponible.");
        }

        const response = await axios.get(`${API_URL}/ordenes`, {
          params: {
            id_cliente: idCliente,
            estado_pago: 'pendiente'
          },
          headers: { Authorization: `Bearer ${token}` }
        });

        console.log("Datos de la respuesta:", response.data);
        const orders = response.data.data || [];
        setPendingOrders(orders);
        setError(null);
      } catch (error) {
        console.error("Error al obtener órdenes pendientes:", error);
        setError(`Error al obtener órdenes pendientes: ${error.response?.data?.message || error.message}`);
        toast.error(`Error al obtener órdenes pendientes: ${error.response?.data?.message || error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchPendingOrders();
  }, [idCliente]);

  const validateCardData = () => {
    let validationErrors = {};
  
    if (!cardData.nombre_titular.trim()) {
      validationErrors.nombre_titular = "Este campo es requerido";
    }
  
    const cleanedCardNumber = cardData.numero_tarjeta.replace(/\s/g, '');
    if (!cleanedCardNumber.match(/^\d{16}$/)) {
      validationErrors.numero_tarjeta = "Debe ser un número de tarjeta válido (16 dígitos)";
    }
  
    const [month, year] = cardData.fecha_vencimiento.split('/');
    if (!cardData.fecha_vencimiento.match(/^(0[1-9]|1[0-2])\/\d{2}$/)) {
      validationErrors.fecha_vencimiento = "Formato inválido. Use mm/aa";
    } else {
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear() % 100; // Obtener solo los últimos dos dígitos del año actual
      const currentMonth = currentDate.getMonth() + 1; // Los meses en JavaScript son 0-indexados
  
      if (parseInt(month) < 1 || parseInt(month) > 12) {
        validationErrors.fecha_vencimiento = "El mes debe estar entre 01 y 12";
      } else if (parseInt(year) < currentYear || (parseInt(year) === currentYear && parseInt(month) < currentMonth)) {
        validationErrors.fecha_vencimiento = "La fecha de vencimiento debe ser una fecha futura";
      }
    }
  
    if (!cardData.cvv.match(/^\d{3}$/)) {
      validationErrors.cvv = "El CVV debe ser de 3 dígitos";
    }
  
    return validationErrors;
  };  

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    let formattedValue = value;
    if (name === "numero_tarjeta") {
      formattedValue = value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
    } else if (name === "fecha_vencimiento") {
      formattedValue = value.replace(/[^0-9]/g, '').slice(0, 4);
      if (formattedValue.length > 2) {
        formattedValue = `${formattedValue.slice(0, 2)}/${formattedValue.slice(2)}`;
      }
    }

    setCardData({ ...cardData, [name]: formattedValue });
  };

  const handleConfirm = async () => {
    const validationErrors = validateCardData();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoadingModal(true);
    setSubmitError("");

    try {
      // Clean the card number to remove spaces before sending
      const cleanedCardData = {
        ...cardData,
        numero_tarjeta: cardData.numero_tarjeta.replace(/\s/g, ''),
        fecha_vencimiento: `${cardData.fecha_vencimiento.split('/')[0]}/${'20' + cardData.fecha_vencimiento.split('/')[1]}` // Cambia el año a 20XX
      };      

      const response = await axios.post(`${API_URL}/ordenes/${selectedOrder}/procesar-pago`, cleanedCardData, {
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${AuthService.getCurrentUser()}` }
      });

      console.log(response.data);

      setCardData({
        nombre_titular: "",
        numero_tarjeta: "",
        fecha_vencimiento: "",
        cvv: "",
      });

      toast.success("Pago procesado con éxito. Se ha enviado un comprobante al correo del cliente.");
      setPendingOrders(prevOrders => prevOrders.filter(order => order.id !== selectedOrder));
      toggleModal(); // Close the modal
    } catch (err) {
      if (err.response) {
        setSubmitError(err.response.data.message || 'Error al procesar el pago');
      } else {
        setSubmitError('Error de conexión');
      }
      console.error(err);
    } finally {
      setLoadingModal(false);
    }
  };

  const handleProcessPayment = (orderId) => {
    setSelectedOrder(orderId); // Set the order to be processed
    setModalOpen(true); // Open the modal
  };

  const toggleModal = () => {
    setModalOpen(!modalOpen);
    if (modalOpen) {
      setCardData({
        nombre_titular: '',
        numero_tarjeta: '',
        fecha_vencimiento: '',
        cvv: ''
      });
      setErrors({});
      setSubmitError('');
    }
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="preOrdenContainer">
      <Container fluid>
        <ToastContainer />
        <h1 className="text-center mb-4">Procesar Pago</h1>
        <Row>
          <Col lg={12}>
            <Card>
              <CardBody>
                <h4 className="card-title mb-4">Órdenes Pendientes de Pago</h4>
                {pendingOrders.length === 0 ? (
                  <p>No hay órdenes pendientes de pago para este cliente.</p>
                ) : (
                    <Table className="table" responsive>
                    <thead>
                      <tr>
                        <th>ID Orden</th>
                        <th>Fecha</th>
                        <th>Total a Pagar</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pendingOrders.map((order) => (
                        <tr key={order.id}>
                          <td>{order.id}</td>
                          <td>{new Date(order.created_at).toLocaleDateString()}</td>
                          <td>${order.total_pagar}</td>
                          <td>
                            <Button color="primary" onClick={() => handleProcessPayment(order.id)}>
                              Procesar Pago
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                )}
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row className="mt-3">
          <Col>
            <Button color="secondary" onClick={() => navigate('/historial-ordenes')}>
              Volver a Gestión de Órdenes
            </Button>
          </Col>
        </Row>
      </Container>

      {/* Payment Modal */}
      <Modal isOpen={modalOpen} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>Pago con Tarjeta</ModalHeader>
        <ModalBody>
          {submitError && <p style={{ color: 'red' }}>{submitError}</p>}
          <FormGroup>
            <Label for="nombre_titular">Nombre del Titular</Label>
            <Input
              type="text"
              name="nombre_titular"
              id="nombre_titular"
              maxLength="50"
              value={cardData.nombre_titular}
              onChange={handleInputChange}
              invalid={!!errors.nombre_titular}
            />
            <FormFeedback style={{ color: 'red' }}>{errors.nombre_titular}</FormFeedback>
          </FormGroup>
          <FormGroup>
            <Label for="numero_tarjeta">Número de Tarjeta</Label>
            <Input
              type="text"
              name="numero_tarjeta"
              id="numero_tarjeta"
              maxLength="19"
              value={cardData.numero_tarjeta}
              onChange={handleInputChange}
              invalid={!!errors.numero_tarjeta}
            />
            <FormFeedback style={{ color: 'red' }}>{errors.numero_tarjeta}</FormFeedback>
          </FormGroup>
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label for="fecha_vencimiento">Fecha de Vencimiento (mm/aa)</Label>
                <Input
                  type="text"
                  name="fecha_vencimiento"
                  id="fecha_vencimiento"
                  maxLength="5"
                  value={cardData.fecha_vencimiento}
                  onChange={handleInputChange}
                  invalid={!!errors.fecha_vencimiento}
                />
                <FormFeedback style={{ color: 'red' }}>{errors.fecha_vencimiento}</FormFeedback>
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label for="cvv">CVV</Label>
                <Input
                  type="text"
                  name="cvv"
                  id="cvv"
                  maxLength="3"
                  value={cardData.cvv}
                  onChange={handleInputChange}
                  invalid={!!errors.cvv}
                />
                <FormFeedback style={{ color: 'red' }}>{errors.cvv}</FormFeedback>
              </FormGroup>
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleConfirm} disabled={loadingModal}>
            {loadingModal ? 'Procesando...' : 'Confirmar Pago'}
          </Button>
          <Button color="secondary" onClick={toggleModal}>
            Cancelar
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
