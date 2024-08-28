import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './ForgetResetPassword.module.css';

const ForgetPassword = () => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const navigate = useNavigate();

  // Función para validar el formato de correo electrónico
  const validateEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  // Manejar el cambio en el campo de correo electrónico
  const handleCorreoChange = (e) => {
    const value = e.target.value;
    setEmail(value);

    if (!validateEmail(value)) {
      setEmailError('Por favor, ingrese un correo electrónico válido.');
    } else {
      setEmailError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (emailError) {
      return; // No enviar la solicitud si hay un error en el correo electrónico
    }

    setIsSending(true);

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/password/forget-password`, { email });
      if (response.data.success) {
        setMessage('Se ha enviado un enlace de restablecimiento a tu email.');
        setTimeout(() => {
          navigate('/reset-password');
        }, 4000); // Redirigir después de 4 segundos
      }
    } catch (error) {
      setMessage('Error al enviar el enlace. Verifique su email.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className={styles.formContainer}>
      <div className={styles.formCard}>
        <h1 className={styles.formTitle}>Olvidé mi Contraseña</h1>
        {message && (
          <div className={`${styles.message} ${message.includes('enviado') ? styles.success : styles.error}`}>
            {message}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Correo Electrónico</label>
            <input
              type="email"
              value={email}
              onChange={handleCorreoChange}
              placeholder="Ingresa tu correo electrónico"
              className={`${styles.formInput} ${emailError ? styles.invalidInput : ''}`}
              required
            />
            {emailError && <div className={styles.formFeedback}>{emailError}</div>}
          </div>
          <button type="submit" className={styles.submitButton} disabled={isSending || emailError}>
            {isSending ? 'Enviando...' : 'Enviar Enlace de Restablecimiento'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgetPassword;
