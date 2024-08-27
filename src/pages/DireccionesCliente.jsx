import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/DireccionesCliente.css';

const API_URL = import.meta.env.VITE_API_URL;

const DireccionesCliente = () => {
    const [direcciones, setDirecciones] = useState([]);
    const [form, setForm] = useState({
        id_cliente: '',
        nombre_contacto: '',
        telefono: '',
        id_departamento: '',
        id_municipio: '',
        direccion: '',
        referencia: ''
    });
    const [departamentos, setDepartamentos] = useState([]);
    const [municipiosPorDepartamento, setMunicipiosPorDepartamento] = useState({});
    const [token, setToken] = useState("");
    const navigate = useNavigate();

    // Fetch token from local storage
    useEffect(() => {
        const storedToken = localStorage.getItem('authToken');
        if (storedToken) {
            setToken(storedToken);
        } else {
            console.error('No token found in local storage');
        }
    }, []);

    // Fetch direcciones and departamentos
    useEffect(() => {
        if (token) {
            const fetchData = async () => {
                try {
                    const [direccionesResponse, departamentosResponse] = await Promise.all([
                        axios.get(`${API_URL}/direcciones`, {
                            headers: { Authorization: `Bearer ${token}` }
                        }),
                        axios.get(`${API_URL}/dropdown/get_departamentos`, {
                            headers: { Authorization: `Bearer ${token}` }
                        })
                    ]);
                    
                    setDirecciones(direccionesResponse.data.direcciones || []);
                    setDepartamentos(Array.isArray(departamentosResponse.data) ? departamentosResponse.data : []);
                } catch (error) {
                    console.error('Error fetching data:', error);
                    setDirecciones([]);
                    setDepartamentos([]);
                }
            };

            fetchData();
        }
    }, [token]);

    // Fetch municipios when department changes
    useEffect(() => {
        const fetchMunicipios = async () => {
            if (form.id_departamento) {
                try {
                    const response = await axios.get(`${API_URL}/dropdown/get_municipio/${form.id_departamento}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setMunicipiosPorDepartamento(prev => ({
                        ...prev,
                        [form.id_departamento]: response.data.municipio || []
                    }));
                } catch (error) {
                    console.error('Error fetching municipios:', error);
                }
            }
        };

        fetchMunicipios();
    }, [form.id_departamento, token]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prevForm => ({
            ...prevForm,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (form.id_cliente) {
                await axios.put(`${API_URL}/direcciones/${form.id_cliente}`, form, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } else {
                await axios.post(`${API_URL}/direcciones`, form, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }
            const response = await axios.get(`${API_URL}/direcciones`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setDirecciones(response.data.direcciones || []);
            setForm({
                id_cliente: '',
                nombre_contacto: '',
                telefono: '',
                id_departamento: '',
                id_municipio: '',
                direccion: '',
                referencia: ''
            });
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    const handleEdit = (direccion) => {
        setForm(direccion);
        navigate(`/editar-direccion/${direccion.id}`);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${API_URL}/direcciones/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const response = await axios.get(`${API_URL}/direcciones`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setDirecciones(response.data.direcciones || []);
        } catch (error) {
            console.error('Error deleting dirección:', error);
        }
    };

    return (
        <div className="direcciones-cliente-container">
            <div className="direcciones-cliente-header">
                <h1 className="direcciones-cliente-title">Direcciones del Cliente</h1>
                <button 
                    className="direcciones-cliente-button-agregar" 
                    onClick={() => navigate('/agregar-direccion')}
                >
                    Agregar Dirección
                </button>
            </div>
            <h2 className="direcciones-cliente-subtitle">Direcciones Registradas</h2>
            {direcciones.length === 0 ? (
                <p>No tienes direcciones registradas.</p>
            ) : (
                <ul className="direcciones-cliente-lista">
                    {direcciones.map(direccion => (
                        <li key={direccion.id} className="direcciones-cliente-lista-item">
                            {direccion.direccion} - {direccion.nombre_contacto}
                            <div className="direcciones-cliente-action-buttons">
                                <button 
                                    className="direcciones-cliente-button direcciones-cliente-button-editar"
                                    onClick={() => handleEdit(direccion)}
                                >
                                    Editar
                                </button>
                                <button 
                                    className="direcciones-cliente-button direcciones-cliente-button-eliminar"
                                    onClick={() => handleDelete(direccion.id)}
                                >
                                    Eliminar
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default DireccionesCliente;
