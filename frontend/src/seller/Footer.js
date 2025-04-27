import React from 'react';
import { Link } from 'react-router-dom';
import { FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-column">
        <h3>Punarvasthra</h3>
        <p>Premium saree collections for all occasions. Quality fabrics with exquisite designs.</p>
      </div>
      <div className="footer-column">
        <h3>Quick Links</h3>
        <ul className="footer-links">
          <li><Link to="/" className="footer-link">Home</Link></li>
          <li><Link to="/category" className="footer-link">Category</Link></li>
          <li><Link to="/seller-dashboard" className="footer-link">Seller-Dashboard</Link></li>
          <li><Link to="/admin-dashboard" className="footer-link">Admin-Dashboard</Link></li>
          <li><Link to="/about" className="footer-link">About us</Link></li>
        </ul>
      </div>
      <div className="footer-column">
        <h3>Contact Us</h3>
        <ul className="contact-info">
          <li>
            <FaPhone className="contact-icon" />
            <span>+1 (123) 456-7890</span>
          </li>
          <li>
            <FaEnvelope className="contact-icon" />
            <a href="mailto:contact@punarvastra.com" className="contact-link">contact@punarvastra.com</a>
          </li>
          <li>
            <FaMapMarkerAlt className="contact-icon" />
            <span>123 Fashion Street, Textile City</span>
          </li>
        </ul>
      </div>
    </footer>
  );
}

export default Footer;