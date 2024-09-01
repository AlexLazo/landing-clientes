import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <div className='footer-group'>
    <footer>
      <p>&copy; {new Date().getFullYear()} Mr. Paquetes SV. All rights reserved.</p>
    </footer>
    </div>
  );
};

export default Footer;
