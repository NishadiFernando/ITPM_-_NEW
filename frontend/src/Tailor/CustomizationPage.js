import React from 'react';
import { Link } from 'react-router-dom';

const CustomizationPage = () => {
  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#f8f9fa',
      padding: '20px',
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '40px',
    },
    backButton: {
      textDecoration: 'none',
      color: '#000',
      fontSize: '24px',
      marginRight: '20px',
    },
    content: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px',
      backgroundColor: 'white',
      borderRadius: '15px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    },
    title: {
      color: '#FF1493',
      fontSize: '2.5rem',
      textAlign: 'center',
      marginBottom: '20px',
    },
    subtitle: {
      color: '#666',
      textAlign: 'center',
      fontSize: '1.2rem',
      marginBottom: '40px',
    },
    optionsContainer: {
      display: 'flex',
      justifyContent: 'center',
      gap: '30px',
      flexWrap: 'wrap',
    },
    optionCard: {
      width: '300px',
      padding: '30px',
      borderRadius: '10px',
      textAlign: 'center',
      cursor: 'pointer',
      textDecoration: 'none',
      transition: 'transform 0.2s',
    },
    websiteSaree: {
      backgroundColor: '#2C3E50',
      color: 'white',
    },
    ownSaree: {
      backgroundColor: '#8E44AD',
      color: 'white',
    },
    cardIcon: {
      fontSize: '40px',
      marginBottom: '15px',
    },
    cardTitle: {
      fontSize: '1.5rem',
      marginBottom: '10px',
    },
    cardDescription: {
      fontSize: '1rem',
      opacity: '0.9',
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <Link to="/tailor-home" style={styles.backButton}>←</Link>
      </div>
      
      <div style={styles.optionsContainer}>
        <Link 
          to="/saree-options/website" 
          style={{...styles.optionCard, ...styles.websiteSaree}}
        >
          <h2>Our Website Saree</h2>
          <p>Saree purchased from our website - (GET 20% OFF)</p>
        </Link>

        <Link 
          to="/saree-options/own" 
          style={{...styles.optionCard, ...styles.ownSaree}}
        >
          <h2>Your Own Saree</h2>
          <p>Upload and customize your personal saree</p>
        </Link>
      </div>
    </div>
  );
};

export default CustomizationPage;