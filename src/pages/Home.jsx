import React from 'react';
import '../styles/Home.css';
import empaque from '../assets/images/servicio-de-paqueteria-19.jpg';
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="home-container">
      <header className="hero-section">
        <div className="hero-content">
          <h1>Mr. Paquetes SV</h1>
          <h2>«Conectando destinos, siempre a tiempo y seguro»</h2>
          <p>Estamos dedicados a transformar la experiencia de envió de paquetes en San Miguel, El Salvador. Confiabilidad, rapidez y tecnología avanzada son los pilares que nos permiten ofrecer un servicio excepcional. Descubre más sobre nosotros y cómo podemos ayudarte a simplificar tus necesidades de logística.</p>
          <br />
          <Link to="/about" className="cta-button"> Sobre Nosotros</Link>
        </div>
      </header>

<div className='services-container'>
    <section className="services-section">
      <div className='content-services'>
      <div className='image-container-services'>
        <img src={empaque} alt="Persona empacando" />
      </div>
      <div className='text-container-services'>
        <h1>Simplificando la Logística</h1>
        <br />
        <p>
          En Mr. Paquetes, entendemos que cada cliente tiene necesidades únicas, por lo que adaptamos nuestras soluciones logísticas para ofrecer un servicio de entregas confiable; nuestra dedicación a la puntualidad e innovación la cual garantiza que cada paquete llegue a su destino de manera rápida y segura, superando siempre tus expectativas.
        </p>
        <p>
          Nuestro equipo de atención al cliente está siempre disponible para asistirte y asegurarte una experiencia de envío fluida y sin preocupaciones.
        </p>
        <p>
          Descubre cómo podemos ayudarte a conectar destinos de manera eficiente y segura.
        </p>
        <br />
        <Link to="/services" className="cta-button"> Nuestros Servicios</Link>
      </div> 
      </div>
    </section>
</div>

      <section className="join-us">
        <div className="join-us-card">
          <h1>¡Únete a Mr. Paquetes SV y Descubre Nuestro Servicio!          
          </h1>
          <p>¿Listo para experimentar el mejor servicio de envío y logística en San Miguel, El Salvador? En Mr. Paquetes, te ofrecemos más que solo envíos; te brindamos una experiencia sin igual basada en confiabilidad, rapidez y tecnología avanzada.</p>
          <Link to="/register" className="cta-button"> Registrate</Link>
          <br /> <br />
          <p>¿Necesitas ayuda? <Link to="/Contact" >Contáctanos</Link></p>
        </div>
      </section>

      {/* <section className="contact-form">
        <h2>Contact Us</h2>
        <form>
          <input type="text" placeholder="Your Name" required />
          <input type="email" placeholder="Your Email" required />
          <textarea placeholder="Your Message" required></textarea>
          <button type="submit" className="cta-button">Send Message</button>
        </form>
      </section> */}
    </div>
  );
};
export default Home;
