import React from 'react';
import { Link } from 'react-router-dom';
import Footer from './Footer';
import './Home.css';

function Home() {
  return (
    <div className="home-page">
      {/* Navbar */}
      <nav className="navbar">
        <Link to="/" className="custom-logo">
          Punarvasthra
        </Link>
        <ul className="nav-links">
          <li>
            <Link to="/" className="nav-link">Home</Link>
          </li>
          <li>
            <Link to="/seller-dashboard" className="nav-link">Seller-Dashboard</Link>
          </li>
          <li>
            <Link to="/admin-dashboard" className="nav-link">Admin-Dashboard</Link>
          </li>
          <li>
            <Link to="/about" className="nav-link">About us</Link>
          </li>
          <li>
            <Link to="/category" className="nav-link">Category</Link>
          </li>
        </ul>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <h1>Well come to Punarvasthra</h1>
        <p>To sell your preloved saree come and sell your sarees with thousands of customers from all the world. Join our platform and sell your saree.</p>
        <Link to="/seller-form" className="cta-button">
          Sell Your Saree here
        </Link>
      </section>

      <Footer />
    </div>
  );
}

export default Home;