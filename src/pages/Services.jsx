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
        <div className='service-content'>
          <section className="service-section">
            <div className='content-service'>
              <div className='text-container-service'>
                <h1>Nuestros Servicios</h1>
                <p>Descubre en Mr. Paquetes, nos dedicamos a ofrecer soluciones logísticas completas y eficientes para satisfacer las necesidades de nuestros clientes. A continuación, te presentamos los principales servicios que ofrecemos:</p>
              </div>
              <div className='image-container-service'>
                <img src={servicio7} alt="Empaque" />
              </div>
            </div>
          </section>
        </div>
      </header>

      {/* Service Sections */}
      {[
        {
          title: "Recolección de Paquetes",
          description: "Nuestro equipo de profesionales se encarga de recoger tus paquetes directamente asegurándonos de que el proceso sea rápido y sin complicaciones.",
          image: servicio1,
          alt: "Recolección de Paquetes",
        },
        {
          title: "Envío de Paquetes",
          description: "Garantizamos que tus paquetes lleguen a cualquier destino dentro de nuestra cobertura de manera eficiente.",
          image: servicio2,
          alt: "Envío de Paquetes",
        },
        {
          title: "Entrega de Paquetes",
          description: "Comprometidos con la puntualidad, nos aseguramos de que tus paquetes lleguen a su destino en el tiempo acordado, cumpliendo con los plazos establecidos.",
          image: servicio3,
          alt: "Entrega de Paquetes",
        },
        {
          title: "Seguimiento de Paquetes",
          description: "A través de nuestra plataforma en línea, puedes rastrear el estado de tus paquetes en cualquier momento, desde la recolección hasta la entrega final.",
          image: servicio4,
          alt: "Seguimiento de Paquetes",
        },
        {
          title: "Embalaje y Protección",
          description: "Utilizamos materiales de embalaje de alta calidad para garantizar que tus paquetes estén completamente protegidos durante el tránsito, reduciendo el riesgo de daños.",
          image: servicio5,
          alt: "Embalaje y Protección",
        },
        {
          title: "Asesoría Logística",
          description: "Nuestro equipo de expertos está disponible para ofrecerte asesoría personalizada sobre el mejor tipo de embalaje para tus envíos, ayudándote a elegir la solución más adecuada para tus necesidades específicas.",
          image: servicio6,
          alt: "Asesoría Logística",
        }
      ].map((service, index) => (
        <div key={index} className={index % 2 === 0 ? 'w-service-content' : 'service-content'}>
          <section className={index % 2 === 0 ? "w-service-section" : "service-section"}>
            <div className={index % 2 === 0 ? 'w-content-service' : 'content-service'}>
              {index % 2 === 0 ? (
                <>
                  <div className='w-image-container-service'>
                    <img src={service.image} alt={service.alt} />
                  </div>
                  <div className='w-text-container-service'>
                    <h1>{service.title}</h1>
                    <p>{service.description}</p>
                  </div>
                </>
              ) : (
                <>
                  <div className='image-container-service'>
                    <img src={service.image} alt={service.alt} />
                  </div>
                  <div className='text-container-service'>
                    <h1>{service.title}</h1>
                    <p>{service.description}</p>
                  </div>
                </>
              )}
            </div>
          </section>
        </div>
      ))}

      {/* Contact Section */}
      <section className="services-contact">
        <div className="services-contact-card">
          <h1>¿Necesitas más información?</h1>
          <p>¡Estamos aquí para ayudarte! Si tienes alguna pregunta o necesitas más detalles sobre nuestros servicios, no dudes en ponerte en contacto con nosotros. Nuestro equipo está disponible para resolver tus dudas y ofrecerte la asistencia que necesites.</p>
          <Link to="/contact" className="cta-button">Contáctanos</Link>
        </div>
      </section>
    </div>
  );
};

export default Services;
