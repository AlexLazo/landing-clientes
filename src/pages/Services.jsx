import React from 'react';
import '../styles/Services.css';
import { Link } from "react-router-dom";
import servicio1 from '../assets/images/servicio-de-paqueteria-21.jpg';
import servicio2 from '../assets/images/servicio-de-paqueteria-14.jpg';
import servicio3 from '../assets/images/servicio-de-paqueteria-11.jpg';
import servicio4 from '../assets/images/servicio-de-paqueteria-10.jpg';
import servicio5 from '../assets/images/servicio-de-paqueteria-17.jpg';
import servicio6 from '../assets/images/servicio-de-paqueteria-8.jpg';
import servicio7 from '../assets/images/servicio-de-paqueteria-15.jpg';

const Services = () => {
  return (
    <div className="services-container">
      <header className="services-hero">
        {/* HEADER*/}
      <div className='service-content'>
      <section className="service-section">
      <div className='content-service'>


      <div className='text-container-service'>
        <h1>Nuestros Servicios</h1>
        <br />
        <p>
        Descubre en En Mr. Paquetes, nos dedicamos a ofrecer soluciones logísticas completas y eficientes para satisfacer las necesidades de nuestros clientes. A continuación, te presentamos los principales servicios que ofrecemos:
        </p>
      </div>

      <div className='image-container-service'>
        <img src={servicio7} alt="Empaque" />
      </div>
      </div>
    </section>
    </div>
      </header>

{/* SERViCIO 1*/}
      <div className='w-service-content'>
      <section className="w-service-section">
      <div className='w-content-service'>
      <div className='w-image-container-service'>
        <img src={servicio1} alt="Empaque" />
      </div>
      <div className='w-text-container-service'>
        <h1>Recolección de Paquetes</h1>
        <br />
        <p>
        Nuestro equipo de profesionales se encarga de recoger tus paquetes directamente asegurándonos de que el proceso sea rápido y sin complicaciones.
        </p>
      </div>
      </div>
    </section>
    </div>

{/* SERViCIO 2*/}
    <div className='w-service-content'>
      <section className="w-service-section">
      <div className='w-content-service'>

      <div className='w-text-container-service'>
        <h1>Envío de Paquetes</h1>
        <br />
        <p>
        Garantizamos que tus paquetes lleguen a cualquier destino dentro de nuestra cobertura de manera eficiente.
        </p>
      </div>

      <div className='w-image-container-service'>
        <img src={servicio2} alt="Empaque" />
      </div>
      </div>
    </section>
    </div>

{/* SERViCIO 3*/}
<div className='service-content'>
      <section className="service-section">
      <div className='content-service'>

      <div className='image-container-service'>
        <img src={servicio3} alt="Empaque" />
      </div>
      <div className='text-container-service'>
        <h1>Entrega de Paquetes</h1>
        <br />
        <p>
        Comprometidos con la puntualidad, nos aseguramos de que tus paquetes lleguen a su destino en el tiempo acordado, cumpliendo con los plazos establecidos.
        </p>
      </div>
      </div>
    </section>
    </div>

{/* SERViCIO 4*/}
<div className='service-content'>
      <section className="service-section">
      <div className='content-service'>

      <div className='text-container-service'>
        <h1>Seguimiento de Paquetes</h1>
        <br />
        <p>
        A través de nuestra plataforma en línea, puedes rastrear el estado de tus paquetes en cualquier momento, desde la recolección hasta la entrega final.
        </p>
      </div>

      <div className='image-container-service'>
        <img src={servicio4} alt="Empaque" />
      </div>
      </div>
    </section>
    </div>

{/* SERViCIO 5*/}
<div className='w-service-content'>
      <section className="w-service-section">
      <div className='w-content-service'>

      <div className='w-image-container-service'>
        <img src={servicio5} alt="Empaque" />
      </div>

      <div className='w-text-container-service'>
        <h1>Embalaje y Protección</h1>
        <br />
        <p>
        Utilizamos materiales de embalaje de alta calidad para garantizar que tus paquetes estén completamente protegidos durante el tránsito, reduciendo el riesgo de daños.
        </p>
      </div>
      </div>
    </section>
    </div>

{/* SERViCIO 6*/}
<div className='w-service-content'>
      <section className="w-service-section">
      <div className='w-content-service'>

      <div className='w-text-container-service'>
        <h1>Asesoría Logística</h1>
        <br />
        <p>
        Nuestro equipo de expertos está disponible para ofrecerte asesoría personalizada sobre el mejor tipo de embalaje para tus envíos, ayudándote a elegir la solución más adecuada para tus necesidades específicas.
        </p>
      </div>

      <div className='w-image-container-service'>
        <img src={servicio6} alt="Empaque" />
      </div>
      </div>
    </section>
    </div>

    <section className="services-contact">
        <div className="services-contact-card">
          <h1>¿Necesitas más información?</h1>
          <p>¡Estamos aquí para ayudarte! Si tienes alguna pregunta o necesitas más detalles sobre nuestros servicios, no dudes en ponerte en contacto con nosotros. Nuestro equipo está disponible para resolver tus dudas y ofrecerte la asistencia que necesites.</p>
          <Link to="/contact" className="cta-button"> Contáctanos</Link>
        </div>
      </section>

    </div>
  );
};

export default Services;
