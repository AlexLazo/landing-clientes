import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
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
import PreOrder from './pages/PreOrden';
import HistorialOrdenesCliente from "./pages/HistorialOrdenes";
import Faq from './pages/FAQ';
import GenerarPreOrden from './pages/GenerarPreOrden';
import CrearPaquete from './pages/CrearPaquete';
import PreOrdenExpress from './pages/PreOrdenExpress';
import GenerarPreOrdenExpress from './pages/GenerarPreOrdenExpress';
import CrearPaqueteExpress from './pages/CrearPaqueteExpress';
import TrackingPage from './pages/Tracking';
import PaquetesTrackingScreen from './pages/PaquetesTrackingScreen';
import Pagos from './pages/Pagos';
import NotFound from './pages/NotFound';

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
    '/pre-orden',
    '/historial-ordenes',
    '/GenerarPreOrden',
    '/pre-ordenexpress',
    '/GenerarPreOrdenExpress',
    '/PaquetesTrackingScreen',
    '/TrackingPage',
    '/pagos'
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
            <Route path="/pre-orden" element={<PrivateRoute element={<PreOrder />} />} />
            <Route path="/historial-ordenes" element={<PrivateRoute element={<HistorialOrdenesCliente />} />} />
            <Route path="/GenerarPreOrden/:idCliente" element={<PrivateRoute element={<GenerarPreOrden />} />} />
            <Route path="/crearPaquete/:idCliente" element={<PrivateRoute element={<CrearPaquete />} />} />
            <Route path="/pre-ordenexpress" element={<PrivateRoute element={<PreOrdenExpress />} />} />
            <Route path="/GenerarPreOrdenExpress/:idCliente" element={<PrivateRoute element={<GenerarPreOrdenExpress />} />} />
            <Route path="/crearPaqueteExpress/:idCliente" element={<PrivateRoute element={<CrearPaqueteExpress />} />} />
            <Route path="/PaquetesTrackingScreen/:id" element={<PrivateRoute element={<PaquetesTrackingScreen />} />} />
            <Route path="/TrackingPage" element={<PrivateRoute element={<TrackingPage />} />} />
            <Route path="/pagos" element={<PrivateRoute element={<Pagos />} />} />

            {/* Ruta 404 */}
            <Route path="*" element={<NotFound />} />
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
