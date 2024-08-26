import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

// Validate API_URL
if (!API_URL) {
  console.error("API_URL is not defined in the environment variables.");
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
    console.error("Login failed:", error);
    throw new Error("Login failed. Please check your credentials and try again.");
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
  const id = localStorage.getItem("clienteId");
  return id ? id : null;
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
