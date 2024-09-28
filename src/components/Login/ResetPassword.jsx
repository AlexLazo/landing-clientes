import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './ForgetResetPassword.module.css';
import '../Login/ForgetResetPassword.css'

const ResetPassword = ({ token }) => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordError, setNewPasswordError] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [message, setMessage] = useState('');
  const [isResetting, setIsResetting] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 8;
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    if (!validateEmail(value)) {
      setEmailError('Por favor, ingresa un correo electrónico válido.');
    } else {
      setEmailError('');
    }
  };

  const handleNewPasswordChange = (e) => {
    const value = e.target.value;
    setNewPassword(value);
    if (!validatePassword(value)) {
      setNewPasswordError('La contraseña debe tener al menos 8 caracteres.');
    } else {
      setNewPasswordError('');
    }
  };

  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);
    if (value !== newPassword) {
      setConfirmPasswordError('Las contraseñas no coinciden.');
    } else {
      setConfirmPasswordError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsResetting(true);
    setMessage('');

    if (newPassword !== confirmPassword) {
      setMessage('Las contraseñas no coinciden.');
      setIsResetting(false);
      return;
    }

    if (!validateEmail(email)) {
      setMessage('Por favor, ingresa un correo electrónico válido.');
      setIsResetting(false);
      return;
    }

    if (!validatePassword(newPassword)) {
      setMessage('La contraseña debe tener al menos 8 caracteres.');
      setIsResetting(false);
      return;
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/password/reset`, {
        email,
        otp,
        password: newPassword,
      });

      if (response.data.success) {
        setMessage('Tu contraseña ha sido restablecida.');
        setTimeout(() => {
          navigate('/login');
        }, 4000);
      } else {
        setMessage('Error al restablecer la contraseña.');
      }
    } catch (error) {
      setMessage('Error al restablecer la contraseña.');
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className={styles.formContainer}>
      <div className="formCard">
        <h1 className={styles.formTitle}>Restablecer Contraseña</h1>
        {message && (
          <div className={`${styles.message} ${message.includes('restablecida') ? styles.success : styles.error}`}>
            {message}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Correo Electrónico</label>
            <input
              type="email"
              value={email}
              onChange={handleEmailChange}
              placeholder="Ingresa tu correo electrónico"
              className={styles.formInput}
              required
            />
            {emailError && <div className={styles.error}>{emailError}</div>}
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Código de Verificación (OTP)</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Ingresa el código de verificación"
              className="formInput-RP"
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Nueva Contraseña</label>
            <input
              type="password"
              value={newPassword}
              onChange={handleNewPasswordChange}
              placeholder="Ingresa tu nueva contraseña"
              className={styles.formInput}
              required
            />
            {newPasswordError && <div className={styles.error}>{newPasswordError}</div>}
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Confirmar Contraseña</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              placeholder="Confirma tu nueva contraseña"
              className={styles.formInput}
              required
            />
            {confirmPasswordError && <div className={styles.error}>{confirmPasswordError}</div>}
          </div>
          <button type="submit" className={styles.submitButton} disabled={isResetting}>
            {isResetting ? 'Restableciendo...' : 'Restablecer Contraseña'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
