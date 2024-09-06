import { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Alert, Input, Spinner, ListGroup, ListGroupItem } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/PreOrden.module.css'; // Asegúrate de que el archivo esté en la ruta correcta

const API_URL = import.meta.env.VITE_API_URL;

const TIPOS_PAGO = [
  { id: 1, nombre: 'Efectivo' },
  { id: 2, nombre: 'Tarjeta' }
];

const PreOrden = () => {
  const [cliente, setCliente] = useState(null);
  const [direcciones, setDirecciones] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    id_direccion: '',
    id_tipo_pago: '',
    total_pagar: '',
    concepto: ''
  });
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [direccionToEdit, setDireccionToEdit] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const DIRECTIONS_PER_PAGE = 5;
  const totalPages = Math.ceil(direcciones.length / DIRECTIONS_PER_PAGE);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('authToken');

      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const { data: clienteData } = await axios.get(`${API_URL}/perfil-cliente`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        setCliente(clienteData.cliente);

        const { data: direccionesData } = await axios.get(`${API_URL}/direcciones`, {
          params: { id_cliente: clienteData.cliente.id, search: searchQuery },
          headers: { Authorization: `Bearer ${token}` }
        });

        setDirecciones(direccionesData.direcciones || []);
      } catch (error) {
        setError('Error al cargar datos.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate, searchQuery]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const token = localStorage.getItem('authToken');

    try {
      await axios.post(`${API_URL}/ordenes-cliente`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccessMessage('Pre Orden creada con éxito.');
    } catch (error) {
      setError('Error al crear la pre orden.');
    }
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSave = async (updatedDireccion) => {
    const token = localStorage.getItem('authToken');
    try {
      await axios.put(`${API_URL}/direcciones/${updatedDireccion.id}`, updatedDireccion, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDirecciones(direcciones.map(direccion =>
        direccion.id === updatedDireccion.id ? updatedDireccion : direccion
      ));
      setModalOpen(false);
    } catch (error) {
      setError('Error al actualizar dirección.');
    }
  };

  return (
    <div className={styles.preOrdenContainer}>
      <div className={styles.header}>
        <h1 className={styles.title}>Crear Pre-Orden</h1>
      </div>
      {loading ? (
        <div className={styles.loading}>
          <Spinner color="primary" />
        </div>
      ) : (
        <>
          {successMessage && <Alert color="success" className={styles.alert}>{successMessage}</Alert>}
          {error && <Alert color="danger" className={styles.alert}>{error}</Alert>}
          <form className={styles.preOrdenForm} onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label htmlFor="id_direccion">Dirección:</label>
              <select
                id="id_direccion"
                name="id_direccion"
                value={formData.id_direccion}
                onChange={handleChange}
                required
              >
                <option value="">Seleccione una dirección</option>
                {direcciones.map((direccion) => (
                  <option key={direccion.id} value={direccion.id}>
                    {direccion.direccion}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="id_tipo_pago">Tipo de Pago:</label>
              <select
                id="id_tipo_pago"
                name="id_tipo_pago"
                value={formData.id_tipo_pago}
                onChange={handleChange}
                required
              >
                <option value="">Seleccione un tipo de pago</option>
                {TIPOS_PAGO.map((pago) => (
                  <option key={pago.id} value={pago.id}>
                    {pago.nombre}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="total_pagar">Total a Pagar:</label>
              <input
                type="number"
                id="total_pagar"
                name="total_pagar"
                value={formData.total_pagar}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="concepto">Concepto:</label>
              <input
                type="text"
                id="concepto"
                name="concepto"
                value={formData.concepto}
                onChange={handleChange}
                required
              />
            </div>
            <Button className={styles.submitButton} type="submit">Crear Pre Orden</Button>
          </form>
        </>
      )}
    </div>
  );
};

export default PreOrden;
