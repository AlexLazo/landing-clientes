import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Spinner, Alert, Container, Row, Col, Card, CardBody, CardTitle, ListGroup, ListGroupItem, Button } from 'reactstrap';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/PaqueteScreen.css';

const API_URL = import.meta.env.VITE_API_URL;

const PaquetesTrackingScreen = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [paquetes, setPaquetes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Función para validar el token
    const isTokenValid = () => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            navigate('/login');
            return false;
        }
        // Aquí puedes agregar lógica adicional para verificar la expiración del tok
        return true;
    };

    const fetchData = async (url, options) => {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        return await response.json();
    };

    const mapPaquetesToTimeline = (paquetes) => {
        if (!Array.isArray(paquetes)) {
            return [];
        }

        const groupedPaquetes = paquetes.reduce((acc, paquete) => {
            const date = new Date(paquete.fecha_movimiento).setHours(0, 0, 0, 0);
            if (!acc[date]) {
                acc[date] = [];
            }
            acc[date].push({
                title: paquete.estado,
                subtitle: paquete.numero_ingreso,
                date: new Date(paquete.fecha_movimiento).getTime(),
            });
            return acc;
        }, {});

        return Object.keys(groupedPaquetes).map(date => ({
            date: parseInt(date, 10),
            data: groupedPaquetes[date],
        }));
    };

    useEffect(() => {
        const getPaquetes = async () => {
            if (!isTokenValid()) return;


            try {
                const response = await fetchData(
                    `${API_URL}/paquete/tracking-paquete/${id}`,
                    { headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` } }
                );

                console.log("Datos recibidos de la API:", response); // Verificar qué está devolviendo la API

                if (Array.isArray(response)) {
                    const timelineData = mapPaquetesToTimeline(response);
                    setPaquetes(timelineData);
                } else {
                    throw new Error("Formato de datos inválido recibido");
                }
            } catch (error) {
                setError("No tienes órdenes disponibles!");
                toast.error(error.message);
            } finally {
                setLoading(false);
            }
        };
        getPaquetes();
    }, [id]);

    if (loading) {
        return <Spinner color="primary" />;
    }

    return (
        <Container>
            <Row>
                <Col>
                    {error && <Alert color="danger">{error}</Alert>}
                    <div style={{ position: 'relative', padding: '2rem 0' }}>
                        <div style={{ position: 'absolute', left: '50%', top: '0', transform: 'translateX(-50%)', height: '100%', borderLeft: '2px dashed #007bff' }}></div>
                        {paquetes.map((item, index) => (
                            <div key={index} style={{ position: 'relative', marginBottom: '2rem', paddingLeft: '2rem' }}>
                                <Card className='card-Tracking'>
                                    <CardBody>
                                        <CardTitle tag="h5">Fecha: {new Date(item.date).toLocaleDateString()}</CardTitle>
                                        <ListGroup>
                                            {item.data.map((paquete, idx) => (
                                                <ListGroupItem key={idx} style={{ marginBottom: '0.5rem', borderRadius: '5px' }}>
                                                    <strong>{paquete.title}</strong> - {paquete.subtitle}
                                                </ListGroupItem>
                                            ))}
                                        </ListGroup>
                                    </CardBody>
                                </Card>
                                <div style={{ position: 'absolute', left: '-12px', top: '15px', width: '20px', height: '20px', borderRadius: '50%', backgroundColor: '#007bff', boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)' }}></div>
                            </div>
                        ))}
                    </div>
                </Col>
            </Row>
            <Button color="primary" onClick={() => navigate('/TrackingPage')} style={{ marginTop: '1rem' }}>
                Regresar
            </Button>
            <ToastContainer />
        </Container>
    );
};

export default PaquetesTrackingScreen;
