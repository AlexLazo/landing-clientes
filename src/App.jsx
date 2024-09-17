import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from './services/AuthContext';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import Sidebar from './components/Layout/Sidebar';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Services from './pages/Services';
import LoginClientePage from './pages/LoginClientePage';
import RegisterCliente from './pages/RegisterCliente';
import Logout from './components/Login/Logout';
import EmailVerification from './pages/EmailVerification';
import ForgetPassword from './components/Login/ForgetPassword';
import ResetPassword from './components/Login/ResetPassword';
import PerfilCliente from './pages/PerfilCliente';
import EditarCliente from './pages/EditarCliente';
import AgregarCliente from "./components/Cliente/AgregarCliente";
import DireccionesCliente from './pages/DireccionesCliente';
import AgregarDireccion from './pages/AgregarDireccion';
import TrackingOrden from './pages/TrackingOrden';
import PreOrder from './pages/PreOrden';
import HistorialOrdenesCliente from "./pages/HistorialOrdenes";
import Faq from './pages/FAQ';
import GenerarPreOrden from './pages/GenerarPreOrden';
import CrearPaquete from './pages/CrearPaquete';

// Componente para proteger rutas privadas
const PrivateRoute = ({ element, ...rest }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? element : <Navigate to="/login" />;
};

const AppContent = () => {
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  const isAuthPage = [
    '/login',
    '/email-verification',
    '/forget-password',
    '/reset-password',
    '/register'
  ].includes(location.pathname);

  const isClientPage = [
    '/perfil-cliente',
    '/editar-cliente',
    '/agregar-cliente',
    '/direcciones-cliente',
    '/agregar-direccion',
    '/tracking',
    '/pre-orden',
    '/historial-ordenes',
    '/GenerarPreOrden'
  ].some(path => location.pathname.startsWith(path));

  console.log('Current Path:', location.pathname);
  console.log('isClientPage:', isClientPage);
  console.log('isAuthenticated:', isAuthenticated);

  return (
    <>
      {!isAuthPage && !isClientPage && <Header />}
      <div className={`app-container ${isClientPage ? 'with-sidebar' : ''}`}>
        {isClientPage && <Sidebar />}
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<LoginClientePage />} />
            <Route path="/register" element={<RegisterCliente />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/email-verification" element={<EmailVerification />} />
            <Route path="/forget-password" element={<ForgetPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/faq" element={<Faq />} />

            {/* Rutas protegidas */}
            <Route path="/perfil-cliente" element={<PrivateRoute element={<PerfilCliente />} />} />
            <Route path="/editar-cliente" element={<PrivateRoute element={<EditarCliente />} />} />
            <Route path="/agregar-cliente" element={<PrivateRoute element={<AgregarCliente />} />} />
            <Route path="/direcciones-cliente" element={<PrivateRoute element={<DireccionesCliente />} />} />
            <Route path="/agregar-direccion" element={<PrivateRoute element={<AgregarDireccion />} />} />
            <Route path="/tracking" element={<PrivateRoute element={<TrackingOrden />} />} />
            <Route path="/pre-orden" element={<PrivateRoute element={<PreOrder />} />} />
            <Route path="/historial-ordenes" element={<PrivateRoute element={<HistorialOrdenesCliente />} />} />
            <Route path="/GenerarPreOrden/:idCliente" element={<PrivateRoute element={<GenerarPreOrden/>} />} />
            <Route path="/crearPaquete/:idCliente" element={<PrivateRoute element={<CrearPaquete/>} />} />

            
          </Routes>
        </main>
      </div>
      {!isAuthPage && !isClientPage && <Footer />}
    </>
  );
};

const App = () => (
  <Router>
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  </Router>

);

export default App;
