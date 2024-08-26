import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from './services/AuthContext';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import Sidebar from './components/Layout/Sidebar'; // Importa el Sidebar
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

const AppContent = () => {
  const location = useLocation();
  
  // Verifica si la ruta actual está en una de las páginas de autenticación
  const isAuthPage = [
    '/login',
    '/email-verification',
    '/forget-password',
    '/reset-password',
    '/register'
  ].includes(location.pathname);
  
  // Verifica si la ruta actual está en una de las páginas de cliente
  const isClientPage = [
    '/perfil-cliente',
    '/editar-cliente',
    '/agregar-cliente',
    '/ordenes',
    '/rastreo',
    '/eliminar-cuenta'
  ].some(path => location.pathname.startsWith(path));
  
  console.log('Current Path:', location.pathname);
  console.log('isClientPage:', isClientPage);

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
            <Route path="/perfil-cliente" element={<PerfilCliente />} />
            <Route path="/editar-cliente" element={<EditarCliente />} />
            <Route path="/agregar-cliente" element={<AgregarCliente />} />
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
