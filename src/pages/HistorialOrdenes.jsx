import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  ListGroup,
  ListGroupItem,
  Spinner,
  Alert,
  Input,
  Button,
  Badge,
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Row,
  Col,
  Container,
} from "reactstrap";
import { useNavigate } from "react-router-dom";
import { Pagination } from "@mui/material";
import styles from "../styles/HistorialOrdenes.module.css";

const API_URL = import.meta.env.VITE_API_URL;
const ORDENES_PER_PAGE = 10;

const HistorialOrdenesCliente = () => {
  const [ordenes, setOrdenes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [expandedOrders, setExpandedOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("authToken");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        setLoading(true);

        const fetchUrl = `${API_URL}/ordenes-cliente/ver-ordenes?page=${currentPage}`;

        const { data } = await axios.get(fetchUrl, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setOrdenes(data || []);
        setTotalPages(Math.ceil((data.total || 0) / ORDENES_PER_PAGE));
      } catch (error) {
        handleError(error);
      } finally {
        setLoading(false);
      }
    };

    const handleError = (error) => {
      if (error.response) {
        setError(
          `Error: ${
            error.response.data.message || "Error al cargar las órdenes."
          }`
        );
      } else {
        setError("Error al cargar las órdenes.");
      }
    };

    fetchData();
  }, [navigate, currentPage]);

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const toggleOrderDetails = (orderId) => {
    setExpandedOrders((prevState) =>
      prevState.includes(orderId)
        ? prevState.filter((id) => id !== orderId)
        : [...prevState, orderId]
    );
  };

  return (
    <Container className={styles.historialOrdenesContainer}>
      <Card className={styles.headerCard}>
        <CardHeader>
          <h1 className={styles.title}>Historial de Órdenes</h1>
        </CardHeader>
        {/* <CardBody>
                    <Input
                        type="text"
                        placeholder="Buscar por concepto o ID de orden"
                        className={styles.searchInput}
                        onChange={handleSearch}
                    />
                </CardBody> */}
      </Card>

      {loading ? (
        <div className={styles.loading}>
          <Spinner color="primary" />
        </div>
      ) : error ? (
        <Alert color="danger">{error}</Alert>
      ) : ordenes.length === 0 ? (
        <Alert color="info" className={styles.emptyMessage}>
          No tienes órdenes registradas.
        </Alert>
      ) : (
        <>
          <ListGroup className={styles.listGroup}>
            {ordenes
              .slice()
              .reverse()
              .map((orden) => (
                <ListGroupItem key={orden.id} className={styles.listItem}>
                  <Card className={styles.ordenCard}>
                    <CardHeader className={styles.ordenHeader}>
                      <h4 className={styles.ordenTitle}>
                        Orden #{orden.id} - {orden.concepto}
                      </h4>
                      <Badge color="primary" pill>
                        {orden.estado || "En proceso"}
                      </Badge>
                    </CardHeader>
                    <CardBody>
                      <Row>
                        <Col md={6}>
                          <p>
                            <strong>Número de Seguimiento:</strong>{" "}
                            {orden.numero_seguimiento}
                          </p>
                          <p>
                            <strong>Total a Pagar:</strong> ${orden.total_pagar}
                          </p>
                          <p>
                            <strong>Tipo de Pago:</strong> {orden.tipo_pago}
                          </p>
                        </Col>
                      </Row>
                      <Button
                        color="info"
                        onClick={() => toggleOrderDetails(orden.id)}
                        className={styles.detailsButton}
                      >
                        {expandedOrders.includes(orden.id)
                          ? "Ocultar detalles"
                          : "Ver detalles"}
                      </Button>
                    </CardBody>
                    {expandedOrders.includes(orden.id) && (
                      <CardFooter className={styles.paqueteDetails}>
                        <h4>Detalles de los Paquetes</h4>
                        {orden.detalles.map((paquete) => (
                          <Card
                            key={paquete.id_paquete}
                            className={styles.paqueteCard}
                          >
                            <CardBody>
                              <p>
                                <strong>Descripción:</strong>{" "}
                                {paquete.descripcion}
                              </p>
                              <p>
                                <strong>Precio:</strong> ${paquete.precio}
                              </p>
                              <p>
                                <strong>Fecha de Entrega:</strong>{" "}
                                {new Date(
                                  paquete.fecha_entrega
                                ).toLocaleDateString()}
                              </p>
                            </CardBody>
                          </Card>
                        ))}
                      </CardFooter>
                    )}
                  </Card>
                </ListGroupItem>
              ))}
          </ListGroup>

          <div className={styles.paginationContainer}>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
              variant="outlined"
              shape="rounded"
            />
          </div>
        </>
      )}
    </Container>
  );
};

export default HistorialOrdenesCliente;
