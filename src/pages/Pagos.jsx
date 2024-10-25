import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, CardBody, Table, Button, Modal, ModalHeader, ModalBody, Form, FormGroup, Label, Input, Alert } from 'reactstrap';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { Elements, CardNumberElement, CardExpiryElement, CardCvcElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import AuthService from '../services/authService';
import '../styles/Pago.css';

const API_URL = import.meta.env.VITE_API_URL;
const stripePromise = loadStripe('pk_test_51Q6E4KRvIsJDdA8nFbJqmapNRLfgWj8UgGCVXQyjlpqF9Y7X8ir2mioU9b38tL4XCX9EttGYHyrSFegtjIvZ1G1g00iWNDKcCQ');

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: '#32325d',
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: 'antialiased',
      fontSize: '16px',
      '::placeholder': {
        color: '#aab7c4'
      }
    },
    invalid: {
      color: '#fa755a',
      iconColor: '#fa755a'
    }
  }
};

const CheckoutForm = ({ selectedOrder, toggleModal, updateOrders }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cardholderName, setCardholderName] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    if (!stripe || !elements) {
      console.log('Stripe.js has not loaded yet.');
      setLoading(false);
      return;
    }

    const cardNumberElement = elements.getElement(CardNumberElement);
    const cardExpiryElement = elements.getElement(CardExpiryElement);
    const cardCvcElement = elements.getElement(CardCvcElement);

    try {
      const { token, error } = await stripe.createToken(cardNumberElement, {
        name: cardholderName,
      });

      if (error) {
        console.log('Error creating token:', error);
        setError(error.message);
        setLoading(false);
        return;
      }

      console.log('Stripe Token:', token);

      const expiryDate = new Date(token.card.exp_year, token.card.exp_month - 1);
      const formattedExpiry = `${(expiryDate.getMonth() + 1).toString().padStart(2, '0')}/${expiryDate.getFullYear()}`;

      const paymentData = {
        nombre_titular: cardholderName,
        numero_tarjeta: token.card.number || token.card.last4.padStart(16, '*'),
        fecha_vencimiento: formattedExpiry,
        cvv: token.card.cvc || '***',
        amount: selectedOrder.total_pagar * 100, // Convert to cents
        token: token.id
      };

      console.log('Payment Data:', paymentData);

      const response = await axios.post(`${API_URL}/ordenes/${selectedOrder.id}/procesar-pago`, paymentData, {
        headers: { Authorization: `Bearer ${AuthService.getCurrentUser()}` }
      });

      console.log('Server Response:', response.data);

      if (response.data.success) {
        toast.success("Pago procesado con éxito. Se ha enviado un comprobante a tu correo.");
        updateOrders(selectedOrder.id);
        toggleModal();
      } else {
        setError(response.data.message || 'Error al procesar el pago');
      }
    } catch (err) {
      console.error('Payment Error:', err);
      if (err.response && err.response.data && err.response.data.errors) {
        const errorMessages = Object.values(err.response.data.errors).flat();
        setError(errorMessages.join(' '));
      } else {
        setError('Ocurrió un error al procesar tu pago. Por favor, intenta de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <FormGroup>
        <Label for="cardholderName">Nombre del titular de la tarjeta</Label>
        <Input
          type="text"
          id="cardholderName"
          value={cardholderName}
          onChange={(e) => setCardholderName(e.target.value)}
          placeholder="Nombre completo"
          required
        />
      </FormGroup>
      <FormGroup>
        <Label for="cardNumber">Número de tarjeta</Label>
        <CardNumberElement
          id="cardNumber"
          options={{
            ...CARD_ELEMENT_OPTIONS,
            showIcon: true
          }}
          className="form-control"
        />
      </FormGroup>
      <Row>
        <Col md={6}>
          <FormGroup>
            <Label for="cardExpiry">Fecha de expiración</Label>
            <CardExpiryElement
              id="cardExpiry"
              options={CARD_ELEMENT_OPTIONS}
              className="form-control"
            />
          </FormGroup>
        </Col>
        <Col md={6}>
          <FormGroup>
            <Label for="cardCvc">CVC</Label>
            <CardCvcElement
              id="cardCvc"
              options={CARD_ELEMENT_OPTIONS}
              className="form-control"
            />
          </FormGroup>
        </Col>
      </Row>
      {error && <Alert color="danger" className="mt-3">{error}</Alert>}
      <div className="d-flex justify-content-between mt-4">
        <Button color="secondary" onClick={toggleModal}>
          Cancelar
        </Button>
        <Button color="primary" type="submit" disabled={!stripe || loading}>
          {loading ? 'Procesando...' : `Pagar $${selectedOrder.total_pagar}`}
        </Button>
      </div>
    </Form>
  );
};

const ProcesarPago = () => {
  const navigate = useNavigate();
  const [pendingOrders, setPendingOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const fetchPendingOrders = async () => {
      const token = localStorage.getItem('authToken');

      if (!token) {
        console.error("Token de autenticación no disponible.");
        return;
      }

      try {
        const { data: clienteData } = await axios.get(`${API_URL}/perfil-cliente`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const clienteId = clienteData.cliente.id;

        const response = await axios.get(`${API_URL}/ordenes`, {
          params: {
            id_cliente: clienteId,
            estado_pago: 'pendiente'
          },
          headers: { Authorization: `Bearer ${token}` }
        });

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
  }, []);

  const handleProcessPayment = (order) => {
    setSelectedOrder(order);
    setModalOpen(true);
  };

  const toggleModal = () => {
    setModalOpen(!modalOpen);
    if (!modalOpen) {
      setSelectedOrder(null);
    }
  };

  const updateOrders = (paidOrderId) => {
    setPendingOrders(prevOrders => prevOrders.filter(order => order.id !== paidOrderId));
  };

  if (loading) {
    return <div>Cargando...</div>;
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
                {error ? (
                  <Alert color="danger">{error}</Alert>
                ) : pendingOrders.length === 0 ? (
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
                            <Button color="primary" onClick={() => handleProcessPayment(order)}>
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

      <Modal
        isOpen={modalOpen}
        toggle={toggleModal}
        className="custom-modal" // Añade la clase CSS personalizada
      >
        <ModalHeader toggle={toggleModal}>Pago con Tarjeta</ModalHeader>
        <ModalBody>
          {selectedOrder && (
            <Elements stripe={stripePromise}>
              <CheckoutForm
                selectedOrder={selectedOrder}
                toggleModal={toggleModal}
                updateOrders={updateOrders}
              />
            </Elements>
          )}
        </ModalBody>
      </Modal>

    </div>
  );
};

export default ProcesarPago;