import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
  console.error("API_URL no está definida en las variables de entorno.");
}

const loginClient = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/login-cliente`, { email, password });
    if (response.data.token) {
      localStorage.setItem("authToken", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      localStorage.setItem("clienteId", response.data.user.id);
      //console.log('Token almacenado:', response.data.token); // Log para depuración
      return response.data.token;
    } else {
      throw new Error("No se recibió un token en la respuesta.");
    }
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    // Manejo específico del error según el tipo de error o respuesta del servidor
    throw new Error("Error al iniciar sesión. Verifique sus credenciales y vuelva a intentarlo.");
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
