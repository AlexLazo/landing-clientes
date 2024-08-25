import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './services/AuthContext';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
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
import PrivateRoute from './components/PrivateRoute'; // Importa el componente de ruta protegida

// Importa el componente de perfil de cliente existente
import PerfilCliente from './pages/PerfilCliente';

const AppContent = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  return (
    <>
      {!isLoginPage && <Header />}
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
          
          {/* Rutas protegidas */}
          <Route 
            path="/profile" 
            element={
              <PrivateRoute>
                <PerfilCliente />
              </PrivateRoute>
            } 
          />
          {/* Agrega más rutas protegidas según sea necesario */}
        </Routes>
        
      </main>
      {!isLoginPage && <Footer />}
    </>
  );
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
};

export default App;
