import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../styles/Direcciones.module.css';

const ModalEditarDireccion = ({ isOpen, onClose, direccion, onSave }) => {
    const [formData, setFormData] = useState({
        direccion: '',
        nombre_contacto: '',
        telefono: '',
        notas: '',
        id_cliente: '',
        id_departamento: '',
        id_municipio: '',
        referencia: ''
    });
    const [error, setError] = useState(null);

    useEffect(() => {
        if (direccion) {
            setFormData({
                direccion: direccion.direccion || '',
                nombre_contacto: direccion.nombre_contacto || '',
                telefono: direccion.telefono || '',
                notas: direccion.notas || '',
                id_cliente: direccion.id_cliente || '',
                id_departamento: direccion.id_departamento || '',
                id_municipio: direccion.id_municipio || '',
                referencia: direccion.referencia || ''
            });
        }
    }, [direccion]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSave = async () => {
        const token = localStorage.getItem('authToken');
        const API_URL = import.meta.env.VITE_API_URL;

        try {
            setError(null); // Clear previous errors
            await axios.put(`${API_URL}/direcciones/${direccion.id}`, formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            onSave(); // Notify the parent component to refetch data
        } catch (error) {
            console.error('Error updating address:', error);
            setError('Error al actualizar la dirección. Por favor, inténtelo de nuevo.');
        }
    };

    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlayEdit}>
            <div className={styles.modalContentEdit}>
                <h2>Editar Dirección</h2>
                {error && <div className={styles.errorMessage}>{error}</div>}
                <div className={styles.modalFormGroup}>
                    <label htmlFor="direccion">Dirección</label>
                    <input
                        type="text"
                        id="direccion"
                        name="direccion"
                        value={formData.direccion}
                        onChange={handleChange}
                    />
                </div>
                <div className={styles.modalFormGroup}>
                    <label htmlFor="nombre_contacto">Nombre de Contacto</label>
                    <input
                        type="text"
                        id="nombre_contacto"
                        name="nombre_contacto"
                        value={formData.nombre_contacto}
                        onChange={handleChange}
                    />
                </div>
                <div className={styles.modalFormGroup}>
                    <label htmlFor="telefono">Teléfono</label>
                    <input
                        type="text"
                        id="telefono"
                        name="telefono"
                        value={formData.telefono}
                        onChange={handleChange}
                    />
                </div>
                <div className={styles.modalFormGroup}>
                    <label htmlFor="referencia">Referencia</label>
                    <input
                        type="text"
                        id="referencia"
                        name="referencia"
                        value={formData.referencia}
                        onChange={handleChange}
                    />
                </div>
                <div className={styles.modalButtonGroup}>
                    <button className={styles.saveButton} onClick={handleSave}>Guardar</button>
                    <button className={styles.cancelButtonEdit} onClick={onClose}>Cancelar</button>
                </div>
            </div>
        </div>
    );
};

export default ModalEditarDireccion;
