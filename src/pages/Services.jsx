import React from 'react';
import '../styles/Services.css';

const Services = () => {
  return (
    <div className="services-container">
      <header className="services-hero">
        <h1>Our Services</h1>
        <p>Discover the range of services we offer to meet your package delivery needs.</p>
      </header>
      <section className="services-list">
        <div className="service-item">
          <h2>Express Delivery</h2>
          <p>Need it fast? Our express delivery ensures your package arrives within 24 hours.</p>
        </div>
        <div className="service-item">
          <h2>International Shipping</h2>
          <p>Ship globally with our reliable international shipping service. Track your package in real-time.</p>
        </div>
        <div className="service-item">
          <h2>Same-Day Delivery</h2>
          <p>For urgent deliveries within the same day, our dedicated team ensures timely arrival.</p>
        </div>
        <div className="service-item">
          <h2>Package Tracking</h2>
          <p>Keep an eye on your shipment’s journey with our advanced package tracking system.</p>
        </div>
        <div className="service-item">
          <h2>Custom Solutions</h2>
          <p>Need a tailored solution? Contact us for customized delivery options that fit your needs.</p>
        </div>
      </section>
    </div>
  );
};

export default Services;
