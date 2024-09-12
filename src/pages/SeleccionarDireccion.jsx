import React from 'react';
import { Button, Table } from 'reactstrap';
import PropTypes from 'prop-types';

const SeleccionarDireccion = ({ direcciones, onDireccionSelect }) => {
    const handleSelect = (direccion) => {
        localStorage.setItem("selectedAddress", JSON.stringify(direccion));
        onDireccionSelect(direccion);
    };

    return (
        <div>
            <h2>Selecciona una Dirección</h2>
            <Table striped>
                <thead>
                    <tr>
                        <th>Nombre Contacto</th>
                        <th>Dirección</th>
                        <th>Acción</th>
                    </tr>
                </thead>
                <tbody>
                    {direcciones.map((direccion) => (
                        <tr key={direccion.id}>
                            <td>{direccion.nombre_contacto}</td>
                            <td>{direccion.direccion}</td>
                            <td>
                                <Button 
                                    color="primary" 
                                    onClick={() => handleSelect(direccion)}
                                >
                                    Seleccionar
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
};

SeleccionarDireccion.propTypes = {
    direcciones: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number.isRequired,
        nombre_contacto: PropTypes.string.isRequired,
        direccion: PropTypes.string.isRequired,
        departamento_nombre: PropTypes.string.isRequired,
        municipio_nombre: PropTypes.string.isRequired,
    })).isRequired,
    onDireccionSelect: PropTypes.func.isRequired,
};

export default SeleccionarDireccion;
