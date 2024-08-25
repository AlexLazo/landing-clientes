import React from 'react';
import '../styles/About.css';

const About = () => {
  return (
    <div className="about-container">
      <header className="about-hero">
        <h1>About Us</h1>
        <p>Learn more about our mission and values.</p>
      </header>
      <section className="about-content">
        <div className="about-section">
          <h2>Our Mission</h2>
          <p>
            Our mission is to provide fast, reliable, and secure package delivery services to ensure
            our customers' satisfaction and success. We are dedicated to innovation and continuous
            improvement in logistics.
          </p>
        </div>
        <div className="about-section">
          <h2>Our Values</h2>
          <ul>
            <li><strong>Customer Focus:</strong> Putting our customers at the heart of everything we do.</li>
            <li><strong>Integrity:</strong> Maintaining the highest standards of professionalism and ethics.</li>
            <li><strong>Innovation:</strong> Continuously seeking better ways to enhance our services.</li>
            <li><strong>Teamwork:</strong> Fostering a collaborative environment to achieve common goals.</li>
          </ul>
        </div>
        <div className="about-section">
          <h2>Our History</h2>
          <p>
            Founded in 2010, FastShip has grown from a small local courier service into a global leader
            in package delivery. Our commitment to excellence and customer satisfaction has driven our
            success over the years.
          </p>
        </div>
      </section>
    </div>
  );
};

export default About;
