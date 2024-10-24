import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import '../styles/EditarCliente.css';

const API_URL = import.meta.env.VITE_API_URL;

const EditarCliente = () => {
    const navigate = useNavigate();
    const [cliente, setCliente] = useState({
        nombre: '',
        apellido: '',
        direccion: '',
        telefono: '',
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchCliente = async () => {
            try {
                const token = localStorage.getItem("authToken");
                const clienteId = localStorage.getItem("clienteId");

                if (!token) {
                    setError("Token de autenticación no encontrado.");
                    navigate('/login');
                    return;
                }

                if (!clienteId) {
                    setError("Cliente ID no encontrado.");
                    navigate('/perfil-cliente');
                    return;
                }

                const response = await axios.get(`${API_URL}/perfil-cliente`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                console.log('Cliente data:', response.data); // Verifica la respuesta aquí
                setCliente(response.data.cliente || {}); // Asegúrate de que `cliente` siempre sea un objeto
            } catch (err) {
                handleFetchError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchCliente();
    }, [navigate]);

    const createAuthHeader = (token) => ({
        Authorization: `Bearer ${token}`,
    });

    const handleFetchError = (err) => {
        if (err.response && err.response.status === 401) {
            setError("No autorizado. Por favor, inicie sesión nuevamente.");
            navigate('/login');
        } else {
            setError("Error al cargar datos del cliente.");
        }
        console.error("Error:", err);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCliente((prevCliente) => ({
            ...prevCliente,
            [name]: value,
        }));
    };

    const handleSave = async () => {
        try {
            const token = localStorage.getItem("authToken");
            const clienteId = localStorage.getItem("clienteId");

            if (!token) {
                setError("Token de autenticación no encontrado.");
                navigate('/login');
                return;
            }

            await axios.put(`${API_URL}/actualizar-perfil-cliente`, cliente, {
                headers: createAuthHeader(token),
            });

            alert("Perfil actualizado con éxito.");
            navigate(`/perfil-cliente`);
        } catch (err) {
            handleSaveError(err);
        }
    };

    const handleSaveError = (err) => {
        if (err.response && err.response.status === 400) {
            setError("Datos de cliente inválidos. Por favor, revisa los campos.");
        } else if (err.response && err.response.status === 401) {
            setError("No autorizado. Por favor, inicie sesión nuevamente.");
            navigate('/login');
        } else {
            setError("Error al guardar los cambios.");
        }
        console.error("Error:", err);
    };

    if (loading) {
        return (
            <div className="editar-cliente-loading">
                <div className="spinner"></div>
                <p>Cargando...</p>
            </div>
        );
    }

    if (error) {
        return <p className="editar-cliente-error">{error}</p>;
    }

    return (
        <div className="editar-cliente-container">
            <header className="editar-cliente-header">
            </header>
            <main className="editar-cliente-main-content">
                <h1 className="editar-cliente-title">Editar Perfil</h1>
                <form className="editar-cliente-form">
                    {[
                        { name: "nombre", type: "text", label: "Nombres"},
                        { name: "apellido", type: "text", label: "Apellidos" },
                        { name: "direccion", type: "text", label: "Dirección" },
                        { name: "telefono", type: "tel", label: "Teléfono" },
                    ].map(({ name, type, label }) => (
                        <div key={name} className="editar-cliente-form-group">
                            <label className="editar-cliente-label">
                                {label}
                            </label>
                            <input
                                type={type}
                                name={name}
                                value={cliente[name] || ''} // Asegúrate de que `cliente[name]` sea un string vacío si es undefined
                                onChange={handleChange}
                                className="editar-cliente-input"
                            />
                        </div>
                    ))}
                    <div className="editar-cliente-button-group">
                        <button
                            type="button"
                            className="editar-cliente-button editar-cliente-button-outline"
                            onClick={() => navigate(`/perfil-cliente`)}
                        >
                            Cancelar
                        </button>
                        <button
                            type="button"
                            className="editar-cliente-button editar-cliente-button-primary"
                            onClick={handleSave}
                        >
                            Guardar
                        </button>
                    </div>
                </form>
            </main>
        </div>
    );
};

export default EditarCliente;
