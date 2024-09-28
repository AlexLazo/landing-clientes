import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'reactstrap';
import '../styles/NotFound.css'; // Asegúrate de crear un archivo CSS para estilos opcionales

const NotFound = () => {
    return (
        <div className="notFoundContainer">
            <h1>404 - Página No Encontrada</h1>
            <p>Lo sentimos, la página que buscas no existe.</p>
            <Link to="/">
                <Button color="primary">Volver a la Página Principal</Button>
            </Link>
        </div>
    );
};

export default NotFound;
