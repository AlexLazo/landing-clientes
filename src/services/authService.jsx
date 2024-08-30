import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
  console.error("API_URL no está definida en las variables de entorno.");
}

const loginClient = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/login-cliente`, { email, password });
    if (response.data.token) {
      //console.log('Token recibido:', response.data.token);
      localStorage.setItem("authToken", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      localStorage.setItem("clienteId", response.data.user.id);
      return response.data.token;
    }
    return null;
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    throw new Error("Error al iniciar sesión.");
  }
};

const logout = () => {
  localStorage.removeItem("authToken");
  localStorage.removeItem("user");
  localStorage.removeItem("clienteId");
};

const getCurrentUser = () => {
  return localStorage.getItem("authToken");
};

const getUserDetails = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

const getClienteId = () => {
  return localStorage.getItem("clienteId");
};

const authService = {
  loginClient,
  logout,
  getCurrentUser,
  getUserDetails,
  getClienteId,
};

export default authService;
