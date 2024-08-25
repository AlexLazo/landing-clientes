import React from 'react';
import '../styles/Contact.css';

const Contact = () => {
  return (
    <div className="contact-container">
      <header className="contact-hero">
        <h1>Contact Us</h1>
        <p>We'd love to hear from you. Get in touch with us for any queries or support.</p>
      </header>
      <section className="contact-info">
        <div className="contact-details">
          <h2>Our Address</h2>
          <p>1234 Shipping Lane, Logistics City, LC 56789</p>
        </div>
        <div className="contact-details">
          <h2>Phone</h2>
          <p>(123) 456-7890</p>
        </div>
        <div className="contact-details">
          <h2>Email</h2>
          <p>support@fastship.com</p>
        </div>
      </section>
      <section className="contact-form">
        <h2>Send Us a Message</h2>
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

export default Contact;
