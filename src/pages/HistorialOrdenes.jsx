import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  ListGroup,
  ListGroupItem,
  Spinner,
  Alert,
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
import { FaShareAlt } from "react-icons/fa";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import styles from "../styles/HistorialOrdenes.module.css";

const API_URL = import.meta.env.VITE_API_URL;
const ORDENES_PER_PAGE = 2;

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

  const generatePDF = (order) => {
    const doc = new jsPDF();
    
    // Título del documento
    doc.setFontSize(18);
    doc.setFont("Helvetica", "bold");
    doc.text(`Orden #${order.id}`, 10, 20);
    
    // Información de la orden
    doc.setFontSize(12);
    doc.setFont("Helvetica", "normal");
    doc.text(`Concepto: ${order.concepto}`, 10, 30);
    doc.text(`Número de Seguimiento: ${order.numero_seguimiento}`, 10, 40);
    doc.text(`Total a Pagar: $${order.total_pagar}`, 10, 50);
    doc.text(`Tipo de Pago: ${order.tipo_pago}`, 10, 60);
  
    // Tabla de detalles
    autoTable(doc, {
      startY: 70, // Comenzar la tabla a 70 unidades de la parte superior
      head: [['Descripción', 'Precio', 'Fecha de Entrega']],
      body: order.detalles.map(paquete => [
        paquete.descripcion,
        `$${paquete.precio}`,
        new Date(paquete.fecha_entrega).toLocaleDateString()
      ]),
      margin: { left: 10, right: 10 },
      styles: {
        cellPadding: 8,
        fontSize: 10,
        halign: 'left',
        valign: 'middle'
      },
      headStyles: {
        fillColor: [0, 123, 255], // Azul
        textColor: [255, 255, 255], // Blanco
        fontSize: 12,
      },
      bodyStyles: {
        fillColor: [240, 240, 240], // Gris claro
      },
      theme: 'striped'
    });
  
    // Agregar un pie de página
    doc.setFontSize(10);
    doc.setFont("Helvetica", "italic");
    doc.text("Generado por Sistema de Gestión de Órdenes", 10, doc.internal.pageSize.height - 10);
  
    return doc.output('blob');
  };
  
  const handleShare = async (order) => {
    try {
      const pdfBlob = generatePDF(order);

      if (navigator.share) {
        navigator.share({
          title: `Orden #${order.id}`,
          text: `Orden #${order.id} - ${order.concepto}\nTotal a Pagar: $${order.total_pagar}`,
          files: [new File([pdfBlob], `orden-${order.id}.pdf`, { type: 'application/pdf' })],
        });
      } else {
        alert("Compartir no es compatible con este navegador.");
      }
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  return (
    <Container className={styles.historialOrdenesContainer}>
      <Card className={styles.headerCard}>
        <CardHeader className={styles.headerContent}>
          <h1 className={styles.title}>Historial de Órdenes</h1>
        </CardHeader>
      </Card>

      {loading ? (
        <div className={styles.loading}>
          <Spinner color="primary" />
        </div>
      ) : error ? (
        <Alert color="danger" className={styles.alert}>
          {error}
        </Alert>
      ) : ordenes.length === 0 ? (
        <Alert color="info" className={styles.alert}>
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
                      <Row className={styles.headerRow}>
                        <Col>
                          <h4 className={styles.ordenTitle}>
                            Orden #{orden.id} - {orden.concepto}
                          </h4>
                        </Col>
                        <Col className={styles.headerActions}>
                          <Badge color="primary" pill>
                            {orden.estado || "En proceso"}
                          </Badge>
                          <Button
                            color="link"
                            onClick={() => handleShare(orden)}
                            className={styles.shareButton}
                          >
                            <FaShareAlt size={20} />
                          </Button>
                        </Col>
                      </Row>
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
