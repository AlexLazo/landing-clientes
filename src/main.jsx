import React from 'react';
import ReactDOM from 'react-dom/client'; // Importa createRoot desde 'react-dom/client'
import App from './App';
//import './styles/index.css'; // Optional: For global styles
import './styles/LoginCliente.css';
import './styles/LoginClientForm.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
