import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

// Validar que API_URL esté definida
if (!API_URL) {
  console.error("API_URL no está definida en las variables de entorno.");
}

// Método para iniciar sesión como cliente
const loginClient = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/login-cliente`, { email, password });
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      localStorage.setItem("clienteId", response.data.user.id); // Guardar el ID del cliente
      return response.data.token;
    }
    return null;
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    throw new Error("Error al iniciar sesión. Por favor, verifica tus credenciales e inténtalo de nuevo.");
  }
};

// Método para cerrar sesión
const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("clienteId"); // Eliminar el ID del cliente al cerrar sesión
};

// Método para obtener el token del usuario actual
const getCurrentUser = () => {
  return localStorage.getItem("token");
};

// Método para obtener los detalles del usuario actual
const getUserDetails = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

// Método para obtener el ID del cliente actual
const getClienteId = () => {
  return localStorage.getItem("clienteId");
};

// Exporta el servicio de autenticación
const AuthService = {
  loginClient,
  logout,
  getCurrentUser,
  getUserDetails,
  getClienteId, // Exportar el método para obtener el ID del cliente
};

export default AuthService;
