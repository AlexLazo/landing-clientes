import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Modal from 'react-modal';
import styles from "/src/styles/PerfilCliente.module.css";
import '../styles/perfilCliente.css'
import { Container, 
    Row, 
    Col, 
    Nav, 
    NavLink, 
    Button, 
    Spinner, 
    ListGroup, 
    ListGroupItem  } from 'reactstrap';
import { Pagination } from '@mui/material'; // Importa el componente Pagination de MUI


const API_URL = import.meta.env.VITE_API_URL;

Modal.setAppElement('#root');

export default function PerfilCliente() {
    const [cliente, setCliente] = useState(null);
    const [direcciones, setDirecciones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [confirmDeleteModalIsOpen, setConfirmDeleteModalIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('datos-generales');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const DIRECTIONS_PER_PAGE = 3;
    const navigate = useNavigate();
    const [tiposPersona, setTiposPersona] = useState({});
    const [departamentos, setDepartamentos] = useState({});
const [municipios, setMunicipios] = useState({});
const [municipiosPorDepartamento, setMunicipiosPorDepartamento] = useState({}); 
    
    useEffect(() => {
        const fetchCliente = async () => {
            const token = localStorage.getItem("authToken");
    
            if (!token) {
                navigate("/login");
                return;
            }
    
            try {
                const response = await axios.get(`${API_URL}/perfil-cliente`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
    
                setCliente(response.data.cliente);
    
                if (!response.data.cliente.telefono) {
                    setModalIsOpen(true);
                }
            } catch (error) {
                if (error.response && error.response.status === 404) {
                    navigate('/agregar-cliente');
                } else {
                    console.error("Error fetching cliente data:", error);
                }
            } finally {
                setLoading(false);
            }
        };
    
        fetchCliente();
    }, [navigate]);
    
    useEffect(() => {
        const fetchTiposPersona = async () => {
            const token = localStorage.getItem("authToken");
        if (!token) {
            console.error("No hay token de autorización.");
            return; // Sal de la función si no hay token
        }
            try {
                const response = await axios.get(`${API_URL}/tipoPersona`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                
                // Aquí asegúrate de que response.data sea un array
                if (Array.isArray(response.data)) {
                    const tiposMap = response.data.reduce((acc, tipo) => {
                        acc[tipo.id] = tipo.nombre;
                        return acc;
                    }, {});
                    setTiposPersona(tiposMap);
                } 
            } catch (error) {
                console.error("Error fetching tipos de persona:", error);
            }
        };
        const fetchDepartamentos = async () => {
            const token = localStorage.getItem("authToken");
            if (!token) {
                console.error("No hay token de autorización.");
                return;
            }
    
            try {
                const response = await axios.get(`${API_URL}/dropdown/get_departamentos`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
    
                if (Array.isArray(response.data)) {
                    const deptosMap = response.data.reduce((acc, depto) => {
                        acc[depto.id] = depto.nombre;
                        return acc;
                    }, {});
                    setDepartamentos(deptosMap);
                } else {
                    console.error("La respuesta no es un array:", response.data);
                }
            } catch (error) {
                console.error("Error fetching departamentos:", error);
            }
        };

        fetchTiposPersona();
        fetchDepartamentos();
        
    }, [currentPage, navigate]);
    
    useEffect(() => {
        const token = localStorage.getItem("authToken"); // Obtiene el token aquí
    
        const fetchMunicipios = async () => {
            // Verifica que cliente e id_departamento existen antes de intentar hacer la solicitud
            if (cliente && cliente.id_departamento && token) {
                try {
                    const response = await axios.get(`${API_URL}/dropdown/get_municipio/${cliente.id_departamento}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
    
                    // Verifica que la respuesta tenga datos en la estructura esperada
                    if (Array.isArray(response.data.municipio)) {
                        setMunicipiosPorDepartamento(prev => ({
                            ...prev,
                            [cliente.id_departamento]: response.data.municipio
                        }));
                    } else {
                        console.warn("La respuesta no contiene un array de municipios:", response.data);
                    }
                } catch (error) {
                    console.error("Error al obtener los municipios:", error);
                }
            }
        };
    
        fetchMunicipios();
    }, [cliente?.id_departamento]); // Solo ejecuta cuando id_departamento cambia
    
    
    
    
    

    useEffect(() => {
        const fetchDirecciones = async () => {
            const token = localStorage.getItem('authToken');

            if (!token) {
                navigate('/login');
                return;
            }

            try {
                const { data: clienteData } = await axios.get(`${API_URL}/perfil-cliente`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                const clienteId = clienteData.cliente.id;

                const { data: direccionesData } = await axios.get(`${API_URL}/direcciones`, {
                    params: { id_cliente: clienteId, page: currentPage },
                    headers: { Authorization: `Bearer ${token}` }
                });

                setDirecciones(direccionesData.direcciones || []);
                setTotalPages(direccionesData.totalPages || 1);
            } catch (error) {
                console.error("Error fetching direcciones:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDirecciones();
    }, [currentPage, navigate]);

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    const handleDeleteAccount = () => {
        setConfirmDeleteModalIsOpen(true);
    };

    const handleConfirmDelete = async () => {
        const token = localStorage.getItem("authToken");

        if (!token) {
            navigate("/login");
            return;
        }

        try {
            await axios.delete(`${API_URL}/perfil-cliente`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            alert("Cuenta eliminada.");
            localStorage.removeItem("authToken");
            navigate("/login");
        } catch (error) {
            console.error("Error al eliminar cuenta:", error);
        } finally {
            setConfirmDeleteModalIsOpen(false);
        }
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };

    const handleAddData = () => {
        navigate('/agregar-cliente');
        closeModal();
    };

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    if (loading) {
        return <p className={styles.loading}>Cargando...</p>;
    }

    if (!cliente) {
        return <p className={styles.error}>No se encontró la información del cliente.</p>;
    }

    return (
        <Container className="profileContainer">
            <div className="profileContent" >
                <div className="headerLeft">
                    <div className="headerText">
                        <h2>{cliente.nombre || '-'} {cliente.apellido || '-'}</h2>
                        <p>{cliente.email || '-'}</p>
                    </div>
                </div>
                <div className="headerRight">
                    <p className="clientCode">Código: {cliente.id || 'N/A'}</p>
                </div>
            </div>

            <Nav className="navMenu">
                <NavLink
                    href="#datos-generales"
                    className={`navLink ${activeTab === 'datos-generales' ? 'active' : ''}`}
                    onClick={() => handleTabClick('datos-generales')}
                >
                    Datos Generales
                </NavLink>
                <NavLink
                    href="#direcciones"
                    className={`navLink ${activeTab === 'direcciones' ? 'active' : ''}`}
                    onClick={() => handleTabClick('direcciones')}
                >
                    Direcciones favoritas
                </NavLink>
            </Nav>

            <div className="profileContainer">
                {activeTab === 'datos-generales' && (
                    <div className="profileDetails">
                        <div className="detailsGrid">
                            <div>
                                <p className="detailsLabel">DUI:</p>
                                <p>{cliente.dui || '-'}</p>
                            </div>
                            <div>
                                <p className="detailsLabel">Teléfono:</p>
                                <p>{cliente.telefono || '-'}</p>
                            </div>
                            <div>
                                <p className="detailsLabel">Razon Social:</p>
                                <p>{cliente.nombre_comercial || '-'}</p>
                            </div>
                            <div>
                                <p className="detailsLabel">Tipo Persona:</p>
                                <p>{tiposPersona[cliente.id_tipo_persona] || '-'}</p>
                            </div>
                            <div>
                                <p className="detailsLabel">Es Contribuyente:</p>
                                <p>{cliente.es_contribuyente ? 'Sí' : 'No'}</p>
                            </div>
                            <div>
                                <p className="detailsLabel">Departamento:</p>
                                <p>{departamentos[cliente.id_departamento] || '-'}</p>
                            </div>
                            <div>
                                <p className="detailsLabel">Municipio:</p>
                                <p>{municipiosPorDepartamento[cliente.id_departamento]?.find(
            (municipio) => municipio.id === cliente.id_municipio)?.nombre || '-'}
                                </p>
                            </div>
                            <div>
                                <p className="detailsLabel">NIT:</p>
                                <p>{cliente.nit || '-'}</p>
                            </div>
                            <div>
                                <p className="detailsLabel">NRC:</p>
                                <p>{cliente.nrc || '-'}</p>
                            </div>
                            <div>
                                <p className="detailsLabel">Giro:</p>
                                <p>{cliente.giro || '-'}</p>
                            </div>
                            <div>
                                <p className="detailsLabel">Nombre Comercial:</p>
                                <p>{cliente.nombre_empresa || '-'}</p>
                            </div>
                            <div>
                                <p className="detailsLabel">Dirección:</p>
                                <p>{cliente.direccion || '-'}</p>
                            </div>
                        </div>
                    </div>
                )}
                {activeTab === 'direcciones' && (
                    <div className="direccionesContent">
                        {loading ? (
                            <div className="loading">
                                <Spinner color="primary" />
                            </div>
                        ) : (
                            <>
                                {direcciones.length === 0 ? (
                                    <div className="emptyMessage">No tienes direcciones registradas.</div>
                                ) : (
                                    <ListGroup className="listGroup">
                                        {direcciones.map((direccion) => (
                                            <ListGroupItem key={direccion.id} className="listItem">
                                                <div className="direccionDetails">
                                                    <h4 className="direccionTitle">{direccion.direccion}</h4>
                                                    <p><strong>Nombre de Contacto:</strong> {direccion.nombre_contacto}</p>
                                                    <p><strong>Teléfono:</strong> {direccion.telefono}</p>
                                                    <p><strong>Referencia:</strong> {direccion.referencia}</p>
                                                </div>
                                            </ListGroupItem>
                                        ))}
                                    </ListGroup>
                                )}
                            </>
                        )}
                    </div>
                )}
            </div>

            {activeTab === 'datos-generales' && (
                <div className="actions">
                    <Button onClick={() => navigate(`/editar-cliente`)} className="editButton">
                        Editar Perfil
                    </Button>
                </div>
            )}

            {/* Modal for Profile Incompletion */}
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Complete Your Profile"
                className="modal"
                overlayClassName="overlay"
            >
                <h2>Completa tu perfil</h2>
                <p>Por favor, ingresa los datos necesarios para completar tu perfil.</p>
                <Button onClick={handleAddData} className="addDataButton">
                    Agregar Datos
                </Button>
                <Button onClick={closeModal} className="closeModalButton">
                    Cerrar
                </Button>
            </Modal>
        </Container>
    );
};