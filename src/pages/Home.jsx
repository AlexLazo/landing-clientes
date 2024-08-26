import React from 'react';
import '../styles/Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <header className="hero-section">
        <div className="hero-content">
          <h1>Mr. Paquetes SV</h1>
          <h2>«Conectando destinos, siempre a tiempo y seguro»</h2>
          <p>Estamos dedicados a transformar la experiencia de envió de paquetes en San Miguel, El Salvador. Confiabilidad, rapidez y tecnología avanzada son los pilares que nos permiten ofrecer un servicio excepcional. Descubre más sobre nosotros y cómo podemos ayudarte a simplificar tus necesidades de logística.</p>
          <button className="cta-button">Sobre Nosotros</button>
        </div>
      </header>

    <section className="two-column-services">      
    </section>

      <section className="join-us">
        <div className="join-us-card">
          <h1>¡Únete a Mr. Paquetes SV y Descubre Nuestro Servicio!          
          </h1>
          <p>¿Listo para experimentar el mejor servicio de envío y logística en San Miguel, El Salvador? En Mr. Paquetes, te ofrecemos más que solo envíos; te brindamos una experiencia sin igual basada en confiabilidad, rapidez y tecnología avanzada.</p>
          <button>Registrate</button>
          <p>¿Necesitas ayuda? Contáctanos</p>
        </div>
      </section>

      <section className="contact-form">
        <h2>Contact Us</h2>
        <form>
          <input type="text" placeholder="Your Name" required />
          <input type="email" placeholder="Your Email" required />
          <textarea placeholder="Your Message" required></textarea>
          <button type="submit" className="cta-button">Send Message</button>
        </form>
      </section>
    </div>
  );
};
export default Home;
