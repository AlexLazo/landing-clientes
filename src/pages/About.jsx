import React from 'react';
import '../styles/About.css';
import valores from '../assets/images/servicio-de-paqueteria-22.jpg';
import mision from '../assets/images/servicio-de-paqueteria-24.jpg';
import vision from '../assets/images/servicio-de-paqueteria-25.jpg';
import cuscatlan from '../assets/alianzas/alianzas-banco-cuscatlan-logo.jpg';
import agricola from '../assets/alianzas/alianzas-bancoagricola-logo.png';
import camarasal from '../assets/alianzas/alianzas-camarasal-logo.png';
import fgk from '../assets/alianzas/alianzas-fundacion-gk-logo.jpg';
import canada from '../assets/alianzas/alianzas-la-canada-empaques-logo.jpg';
import univo from '../assets/alianzas/alianzas-univo-logo.jpg';
import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className="about-container">
      <section className="about-section">
        <div className='content-about'>
          <div className='text-container-about'>
            <h1>MISIÓN</h1>
            <p>
              «En Mr. Paquetes, nos dedicamos a ofrecer servicios de envío y logística de alta calidad, asegurando que cada paquete llegue a su destino de manera rápida y segura, superando las expectativas de nuestros clientes.»
            </p>
            <p>“Conectando destinos, siempre a tiempo y seguro”</p>
            <Link to="/services" className="cta-button">¿Qué ofrecemos?</Link>
          </div>
          <div className='image-container-about'>
            <img src={mision} alt="Misión" />
          </div>
        </div>
      </section>

      <section className="about-section about-section-v">
        <div className='content-about-v'>
          <div className='image-container-about-v'>
            <img src={vision} alt="Visión" />
          </div>
          <div className='text-container-about-v'>
            <h1>VISIÓN</h1>
            <p>
              «Ser la empresa líder en servicios de paquetería en la región oriental de El Salvador, reconocidos por nuestra eficiencia, innovación y compromiso con la satisfacción del cliente.»
            </p>
          </div>
        </div>
      </section>

      <section className="about-section">
        <div className='content-about'>
          <div className='text-container-about'>
            <h1>VALORES</h1>
            <p>
              En Mr. Paquetes, estamos guiados por un conjunto de valores fundamentales que definen nuestra identidad y dirección. Estos valores son el corazón de nuestra empresa y nos impulsan a proporcionar un servicio excepcional en cada interacción.
            </p>
            <ul>
              <li><strong>Puntualidad.</strong></li>
              <li><strong>Confiabilidad.</strong></li>
              <li><strong>Innovación.</strong></li>
              <li><strong>Servicio al cliente.</strong></li>
              <li><strong>Responsabilidad.</strong></li>
              <li><strong>Sostenibilidad.</strong></li>
            </ul>
            <Link to="/services" className="cta-button">Conoce nuestros servicios</Link>
          </div>
          <div className='image-container-about'>
            <img src={valores} alt="Valores" />
          </div>
        </div>
      </section>

      <section className="alianzas">
        <div className="alianzas-card">
          <h1>¡Nuestros Aliados!</h1>
          <p>En Mr. Paquetes, creemos en la fuerza de las alianzas estratégicas para ofrecer un servicio más completo y eficiente a nuestros clientes. Hemos establecido colaboraciones con diversas empresas y organizaciones en el país.</p>
          <div className="alianza">
            <a href="https://www.bancocuscatlan.com" target="_blank" rel="noopener noreferrer">
              <img src={cuscatlan} alt="Banco Cuscatlán" className="alianza-img" />
            </a>
            <a href="https://www.lacañadapaquetes.com" target="_blank" rel="noopener noreferrer">
              <img src={canada} alt="La Cañada Empaques" className='alianza-img' />
            </a>
            <a href="https://www.bancoagricola.com" target="_blank" rel="noopener noreferrer">
              <img src={agricola} alt="Banco Agrícola" className='alianza-img' />
            </a>
            <a href="https://fundaciongloriakriete.org" target="_blank" rel="noopener noreferrer">
              <img src={fgk} alt="Fundación Gloria Kriete" className='alianza-img' />
            </a>
            <a href="https://camarasal.com" target="_blank" rel="noopener noreferrer">
              <img src={camarasal} alt="Camarasal" className='alianza-img' />
            </a>
            <a href="https://www.univo.edu.sv" target="_blank" rel="noopener noreferrer">
              <img src={univo} alt="UNIVO" className='alianza-img' />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
