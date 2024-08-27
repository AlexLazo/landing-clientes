import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/FAQ.css';

function FAQ() {
    return (
        <div className="faq-container">
        <header className="faq-section">
            <div className="faq-content">
                <h1>FAQs</h1>
                <hr />
                <h4>¿Qué servicios ofrece Mr. Paquetes?</h4>
                <br />
                        <p>Ofrecemos una variedad de servicios logísticos, incluyendo recolección de paquetes a domicilio, opciones de envío estándar y exprés, entrega puntual, seguimiento en tiempo real, embalaje y protección de alta calidad, y servicios especializados como envío de carga pesada, soluciones para e-commerce, logística inversa, entregas programadas, y mucho más.</p>
                        <br />
                            <hr />

                            <h4>¿Cómo puedo rastrear mi paquete?</h4>
                <br />
                        <p>Puedes rastrear tu paquete de manera sencilla y en cualquier momento a través de nuestra plataforma en línea. Regístrate e inicia sesión para obtener actualizaciones en tiempo real sobre la ubicación y el estado de tu paquete. Al crear tu cuenta, también podrás gestionar todos tus envíos de manera más eficiente, acceder a tu historial de envíos y conocer el estado de tus paquetes.</p>
                        <br />
                            <hr />

                            <h4>¿Qué opciones de embalaje ofrecen?</h4>
                <br />
                        <p>Proveemos materiales de embalaje de alta calidad y ofrecemos asesoría profesional para ayudarte a seleccionar el mejor tipo de embalaje para tus envíos, asegurando que tus paquetes estén protegidos durante el tránsito.</p>
                        <br />
                            <hr />

                            <h4>¿Qué debo hacer si mi paquete no ha llegado?</h4>
                <br />
                        <p>Si tu paquete no ha llegado en el tiempo estimado, puedes rastrearlo en nuestra plataforma en línea para verificar su estado. Si necesitas asistencia adicional, contáctanos a través de nuestro servicio de atención al cliente.</p>
                        <br />
                        <hr />
            </div>
        </header>
        </div>
        );
}

export default FAQ;