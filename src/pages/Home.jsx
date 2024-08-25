import React from 'react';
import '../styles/Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <header className="hero-section">
        <div className="hero-content">
          <h1>Welcome to Mr. Paquetes</h1>
          <p>Your reliable partner for fast and secure package delivery.</p>
          <button className="cta-button">Get Started</button>
        </div>
      </header>
      <section className="services">
        <h2>Our Services</h2>
        <div className="service-cards">
          <div className="service-card">
            <h3>Express Delivery</h3>
            <p>Get your packages delivered within 24 hours with our express service.</p>
          </div>
          <div className="service-card">
            <h3>International Shipping</h3>
            <p>Ship globally with real-time tracking and exceptional support.</p>
          </div>
          <div className="service-card">
            <h3>Package Tracking</h3>
            <p>Monitor your shipment’s progress with our advanced tracking system.</p>
          </div>
        </div>
      </section>
      <section className="testimonials">
        <h2>What Our Clients Say</h2>
        <div className="testimonial-card">
          <p>"FastShip transformed our delivery process. Fast, reliable, and cost-effective!"</p>
          <span>- Jane Doe, CEO of TechCorp</span>
        </div>
        <div className="testimonial-card">
          <p>"Their international shipping is top-notch. We trust FastShip for all our global needs."</p>
          <span>- John Smith, Logistics Manager</span>
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
