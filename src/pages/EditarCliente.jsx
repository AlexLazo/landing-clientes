import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import '../styles/EditarCliente.css'; // Import the new CSS file

const API_URL = import.meta.env.VITE_API_URL;

const EditarCliente = () => {
    const navigate = useNavigate();
    const [cliente, setCliente] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchCliente = async () => {
            try {
                const token = localStorage.getItem("token");
                const clienteId = localStorage.getItem("clienteId");

                if (!clienteId) {
                    navigate('/perfil-cliente');
                    return;
                }

                const response = await axios.get(`${API_URL}/perfil-cliente`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                setCliente(response.data.cliente);
            } catch (err) {
                setError("Error al cargar datos del cliente.");
                console.error("Error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchCliente();
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCliente((prevCliente) => ({
            ...prevCliente,
            [name]: value
        }));
    };

    const handleSave = async () => {
        try {
            const token = localStorage.getItem("token");

            await axios.put(`${API_URL}/perfil-cliente`, cliente, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            alert("Perfil actualizado con éxito.");
            navigate(`/perfil-cliente`);
        } catch (err) {
            setError("Error al guardar los cambios.");
            console.error("Error:", err);
        }
    };

    if (loading) {
        return <p className="editar-cliente-loading">Cargando...</p>;
    }

    if (error) {
        return <p className="editar-cliente-error">{error}</p>;
    }

    return (
        <div className="editar-cliente-container">
            <header className="editar-cliente-header">
                <button className="editar-cliente-back-button" onClick={() => navigate("/perfil-cliente")}>
                    Regresar
                </button>
            </header>
            <main className="editar-cliente-main-content">
                <h1 className="editar-cliente-title">Editar Perfil</h1>
                <form className="editar-cliente-form">
                    <div className="editar-cliente-form-group">
                        <label className="editar-cliente-label">Nombre Comercial</label>
                        <input
                            type="text"
                            name="nombre_comercial"
                            value={cliente?.nombre_comercial || ''}
                            onChange={handleChange}
                            className="editar-cliente-input"
                        />
                    </div>
                    <div className="editar-cliente-form-group">
                        <label className="editar-cliente-label">Teléfono</label>
                        <input
                            type="tel"
                            name="telefono"
                            value={cliente?.telefono || ''}
                            onChange={handleChange}
                            className="editar-cliente-input"
                        />
                    </div>
                    <div className="editar-cliente-form-group">
                        <label className="editar-cliente-label">Dirección</label>
                        <input
                            type="text"
                            name="direccion"
                            value={cliente?.direccion || ''}
                            onChange={handleChange}
                            className="editar-cliente-input"
                        />
                    </div>
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
            <footer className="editar-cliente-footer">
                <p>© 2024 Mi Aplicación</p>
            </footer>
        </div>
    );
};

export default EditarCliente;
