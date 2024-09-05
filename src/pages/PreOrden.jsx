import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/PreOrden.module.css';

const API_URL = import.meta.env.VITE_API_URL;

const PreOrden = () => {
  const [cliente, setCliente] = useState(null);
  const [direcciones, setDirecciones] = useState([]);
  const [tipoPago, setTipoPago] = useState([]);
  const [formData, setFormData] = useState({
    id_direccion: '',
    id_tipo_pago: '',
    total_pagar: '',
    id_estado_paquetes: '',
    costo_adicional: '',
    concepto: '',
    tipo_documento: '',
    tipo_orden: '',
    detalles: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClienteData = async () => {
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
      } catch (error) {
        setError('Error al cargar los datos del cliente.');
      } finally {
        setLoading(false);
      }
    };

    const fetchDireccionesYPago = async () => {
      const token = localStorage.getItem('authToken');

      try {
        // Obtener direcciones del cliente
        const { data: direccionesData } = await axios.get(`${API_URL}/direcciones`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { id_cliente: cliente?.id }
        });
        setDirecciones(direccionesData.direcciones);

        // Obtener tipos de pago
        const { data: pagosData } = await axios.get(`${API_URL}/tipo-pago`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTipoPago(pagosData.tipo_pago);
      } catch (error) {
        setError('Error al cargar direcciones o tipos de pago.');
      }
    };

    fetchClienteData();
    if (cliente) {
      fetchDireccionesYPago();
    }
  }, [navigate, cliente]);

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

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Crear Pre Orden</h1>
      {successMessage && <p>{successMessage}</p>}
      <form onSubmit={handleSubmit}>
        <div>
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
        <div>
          <label htmlFor="id_tipo_pago">Tipo de Pago:</label>
          <select
            id="id_tipo_pago"
            name="id_tipo_pago"
            value={formData.id_tipo_pago}
            onChange={handleChange}
            required
          >
            <option value="">Seleccione un tipo de pago</option>
            {tipoPago.map((pago) => (
              <option key={pago.id} value={pago.id}>
                {pago.nombre}
              </option>
            ))}
          </select>
        </div>
        {/* Otros campos del formulario */}
        <div>
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
        <div>
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
        <button type="submit">Crear Pre Orden</button>
      </form>
    </div>
  );
};

export default PreOrden;
