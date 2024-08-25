import { useState, useEffect } from "react";
import { Avatar, AvatarImage, AvatarFallback, Button } from "@/components/ui/avatar";
import { FilePenIcon, DeleteIcon, MenuIcon, FlagIcon } from "@/components/ui/icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export default function PerfilCliente() {
    const [cliente, setCliente] = useState(null);
    const [profileComplete, setProfileComplete] = useState(false); // Estado para verificar si el perfil está completo
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCliente = async () => {
            try {
                const response = await axios.get(`${API_URL}/perfil-cliente`, {
                    headers: {
                        Authorization: `Bearer ${token}` // Reemplaza `token` con el token de autenticación adecuado
                    }
                });

                setCliente(response.data.cliente);

                // Verifica si el perfil está completo
                const isProfileComplete = response.data.cliente.nombre_comercial && response.data.cliente.telefono; // Ajusta según los campos requeridos
                setProfileComplete(isProfileComplete);

                // Redirige si el perfil no está completo
                if (!isProfileComplete) {
                    alert("Por favor, completa tu perfil para continuar.");
                    navigate('/editar-perfil');
                }
            } catch (error) {
                console.error("Error fetching cliente data:", error);
            }
        };

        fetchCliente();
    }, [navigate]);

    const handleDeleteAccount = async () => {
        try {
            // Lógica para eliminar la cuenta (dependerá del endpoint que utilices)
            alert("Cuenta eliminada.");
        } catch (error) {
            console.error("Error al eliminar cuenta:", error);
        }
    };

    if (!cliente) {
        return <p>Loading...</p>;
    }

    return (
        <div className="flex flex-col items-center w-full min-h-screen p-4">
            <header className="flex items-center justify-between w-full p-4 border-b">
                <div className="flex items-center">
                    <MenuIcon className="w-6 h-6 mr-2" />
                    <FlagIcon className="w-8 h-6" />
                </div>
                <div className="text-right">
                    <p className="text-xs">VP8.00</p>
                    <p className="text-xs">SV</p>
                </div>
            </header>
            <main className="flex flex-col items-center w-full max-w-4xl p-4">
                <Avatar className="w-24 h-24 mb-4">
                    <AvatarImage src="/placeholder-user.jpg" alt="Profile Picture" />
                    <AvatarFallback>BA</AvatarFallback>
                </Avatar>
                <h1 className="text-2xl font-bold text-center">{cliente.nombre} {cliente.apellido}</h1>
                <p className="text-center text-muted-foreground">{cliente.email}</p>
                <div className="flex justify-between w-full mt-4">
                    <p className="text-sm">Código: {cliente.dui || '-'}</p>
                    <p className="text-sm">Cuenta: {cliente.nombre_comercial || 'Estandar'}</p>
                </div>
                <nav className="flex justify-center w-full mt-4 border-b">
                    <a href="#" className="px-4 py-2 text-blue-600 border-b-2 border-blue-600">
                        Datos generales
                    </a>
                </nav>
                <div className="w-full mt-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                            <p className="font-bold">Nombre</p>
                            <p>{cliente.nombre}</p>
                        </div>
                        <div>
                            <p className="font-bold">Apellido</p>
                            <p>{cliente.apellido}</p>
                        </div>
                        <div>
                            <p className="font-bold">Correo electronico</p>
                            <p>{cliente.email}</p>
                        </div>
                        <div>
                            <p className="font-bold">DUI</p>
                            <p>{cliente.dui || '-'}</p>
                        </div>
                        <div>
                            <p className="font-bold">Teléfono</p>
                            <p>{cliente.telefono}</p>
                        </div>
                        <div>
                            <p className="font-bold">Dirección</p>
                            <p>{cliente.direccion}</p>
                        </div>
                    </div>
                </div>
                <div className="flex justify-around w-full mt-8">
                    <Button variant="outline" className="flex flex-col items-center" onClick={() => navigate('/editar-perfil')}>
                        <FilePenIcon className="w-6 h-6 mb-1" />
                        Editar
                    </Button>
                    <Button variant="destructive" className="flex flex-col items-center" onClick={handleDeleteAccount}>
                        <DeleteIcon className="w-6 h-6 mb-1" />
                        Eliminar Cuenta
                    </Button>
                </div>
            </main>
            <footer className="fixed bottom-0 left-0 right-0 p-2 bg-white border-t">
                <p className="text-center text-xs">31°C Mayorm. nublado</p>
            </footer>
        </div>
    );
}
