import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
  console.error("API_URL no está definida en las variables de entorno.");
}

const loginClient = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/login-cliente`, { email, password });
    if (response.data.token) {
      // Guardar el token y detalles del usuario en localStorage
      localStorage.setItem("authToken", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      localStorage.setItem("clienteId", response.data.user.id); // Guardar el ID del cliente
      return response.data.token;
    } else {
      // Manejar el caso donde el token no está presente en la respuesta
      console.warn("El token no se encuentra en la respuesta.");
      return null;
    }
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    throw new Error("Error al iniciar sesión. Verifica tus credenciales.");
  }
};

const logout = () => {
  // Eliminar el token y detalles del usuario al cerrar sesión
  localStorage.removeItem("authToken");
  localStorage.removeItem("user");
  localStorage.removeItem("clienteId"); // Eliminar el ID del cliente al cerrar sesión
  // Redirigir al login para asegurar que el usuario vea la página de inicio de sesión
  window.location.href = "/login";
};

const getCurrentUserToken = () => {
  // Obtener el token actual del usuario
  return localStorage.getItem("authToken");
};

const getUserDetails = () => {
  // Obtener los detalles del usuario desde localStorage
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

const getClienteId = () => {
  // Obtener el ID del cliente desde localStorage
  return localStorage.getItem("clienteId");
};

const authService = {
  loginClient,
  logout,
  getCurrentUserToken,
  getUserDetails,
  getClienteId,
};

export default authService;
