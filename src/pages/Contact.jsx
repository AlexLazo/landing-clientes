import React from 'react';
import '../styles/Contact.css';
import whatsapp from '../assets/redes/redes-whatsapp-logo.png'
import facebook from '../assets/redes/redes-facebook-logo.png'
import gmail from '../assets/redes/redes-gmail-logo.png'
import instagram from '../assets/redes/redes-instagram-logo.png'
import maps from '../assets/redes/redes-maps-logo.png'
import tiktok from '../assets/redes/redes-tiktok-logo.png'
import twitter from '../assets/redes/redes-x-twitter-logo.png'

const Contact = () => {
  return (
    <div className="contact-container">
      <section className="contact-board">
        <div className="contact-board-card">
          <h1>¿Cómo contactarse con nosotros?</h1>
          <p>En Mr. Paquetes, estamos siempre disponibles para ayudarte con cualquier consulta o necesidad que puedas tener. No dudes en ponerte en contacto con nosotros a través de los siguientes medios:</p>

{/*TELEFONO*/}
          <div className="contact-info-telefono">
            <div className='contact-telefono-group'>
              <div className='contact-telefono-row'>
                <h3>Teléfono</h3>
                <a href="https://wa.me/50312345678"><img src={whatsapp} alt="" /></a>
              </div>
            </div>
            <div className='contact-telefono-info'>
              <p>Nuestro equipo de atención al cliente está disponible para asistirte de lunes a viernes, de 8:00 AM a 6:00 PM.</p>
              </div>
          </div>

{/*CORREO*/}
          <div className="contact-info-email">
            <div className='contact-email-group'>
              <div className='contact-email-row'>
                <h3>Correo Electronico</h3>
                <a href="mailto:contacto@mrpaquetes.com"><img src={gmail} alt="" /></a>
              </div>
            </div>
            <div className='contact-email-info'>
              <p>Envíanos un correo electrónico y te responderemos a la brevedad posible. Estamos aquí para ayudarte con cualquier pregunta sobre nuestros servicios.</p>
              </div>
          </div>
          
{/*REDES SOCIALES*/}
          <div className="contact-info-social">
            <div className='contact-social-group'>
              <div className='contact-social-row'>
                <h3>Redes Sociales</h3>
                <a href="https://www.facebook.com/mrpaquetessv"><img src={facebook} alt="" /></a>
                <a href="https://x.com/mrpaquetessv"><img src={twitter} alt="" /></a>
                <a href="https://www.instagram.com/mrpaquetessv/"><img src={instagram} alt="" /></a>
                <a href="https://www.tiktok.com/mrpaquetessv"><img src={tiktok} alt="" /></a>
              </div>
            </div>
            <div className='contact-social-info'>
              <p>Síguenos en nuestras redes sociales para estar al tanto de las últimas noticias, promociones y actualizaciones:</p>
              </div>
          </div>
          
{/*VISITANOS*/}
          <div className="contact-info-visit">
            <div className='contact-visit-group'>
              <div className='contact-visit-row'>
                <h3>Visítanos</h3>
                <a href="https://maps.app.goo.gl/h6WdoKFQ9ZHiN4HS9"><img src={maps} alt="" /></a>
              </div>
            </div>
            <div className='contact-visit-info'>
              <p>Nuestro horario de atención es: <br /> Lunes a Viernes: 8:00 AM – 6:00 PM Sábados: 8:00 AM – 1:00 PM</p>
              </div>
          </div>
          
        </div>
      </section>













    </div>
  );
};

export default Contact;
