import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const EditarCliente = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [cliente, setCliente] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchCliente = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get(`${API_URL}/perfil-cliente/${id}`, {
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
    }, [id]);

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

            await axios.put(`${API_URL}/perfil-cliente/${id}`, cliente, {
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
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div className="flex flex-col items-center w-full min-h-screen p-4">
            <header className="flex items-center justify-between w-full p-4 border-b">
                <button onClick={() => navigate("/perfil-cliente")}>
                    <span>Regresar</span>
                </button>
                <div className="text-right">
                    <p className="text-xs">VP8.00</p>
                    <p className="text-xs">SV</p>
                </div>
            </header>
            <main className="flex flex-col items-center w-full max-w-4xl p-4">
                <h1 className="text-2xl font-bold">Editar Perfil</h1>
                <form className="w-full max-w-md mt-4">
                    <div className="mb-4">
                        <label className="block text-sm font-medium">Nombre Comercial</label>
                        <input
                            type="text"
                            name="nombre_comercial"
                            value={cliente?.nombre_comercial || ''}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium">Teléfono</label>
                        <input
                            type="tel"
                            name="telefono"
                            value={cliente?.telefono || ''}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium">Dirección</label>
                        <input
                            type="text"
                            name="direccion"
                            value={cliente?.direccion || ''}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                    </div>
                    <div className="flex justify-between">
                        <button
                            type="button"
                            className="btn-outline"
                            onClick={() => navigate(`/perfil-cliente`)}
                        >
                            Cancelar
                        </button>
                        <button
                            type="button"
                            className="btn-primary"
                            onClick={handleSave}
                        >
                            Guardar
                        </button>
                    </div>
                </form>
            </main>
            <footer className="fixed bottom-0 left-0 right-0 p-2 bg-white border-t">
                <p className="text-center text-sm">© 2024 Mi Aplicación</p>
            </footer>
        </div>
    );
};

export default EditarCliente;
