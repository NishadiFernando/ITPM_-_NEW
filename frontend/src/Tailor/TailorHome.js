import React from 'react';
import { Link } from 'react-router-dom';

const TailorHome = () => {
  const styles = {
    container: {
      position: 'relative',
      width: '100%',
      height: '100vh',
      overflow: 'hidden',
    },
    backgroundImage: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      backgroundImage: `linear-gradient(rgba(86, 0, 39, 0.85), rgba(86, 0, 39, 0.85)), url('/images/saree-collage.jpg')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      color: 'white',
    },
    header: {
      fontSize: '4rem',
      fontWeight: 'bold',
      marginBottom: '1rem',
      textAlign: 'center',
    },
    subheader: {
      fontSize: '1.8rem',
      marginBottom: '2rem',
      textAlign: 'center',
    },
    buttonContainer: {
      display: 'flex',
      gap: '1rem',
    },
    button: {
      padding: '12px 24px',
      fontSize: '1.1rem',
      cursor: 'pointer',
      border: 'none',
      borderRadius: '4px',
      textDecoration: 'none',
      transition: 'transform 0.2s',
    },
    primaryButton: {
      backgroundColor: '#FFD700',
      color: '#560027',
      fontWeight: 'bold',
    },
    secondaryButton: {
      backgroundColor: 'transparent',
      border: '2px solid #FFD700',
      color: '#FFD700',
    },
    nav: {
      position: 'absolute',
      top: 0,
      width: '100%',
      padding: '1rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: 'rgba(255, 255, 255, 0.9)',  // Changed to white background with opacity
    },
    logo: {
      color: '#000000',  // Changed to black
      fontSize: '2rem',
      fontStyle: 'italic',
      textDecoration: 'none',
    },
    navLinks: {
      display: 'flex',
      gap: '2rem',
    },
    navLink: {
      color: '#000000',  // Changed to black
      textDecoration: 'none',
      fontSize: '1.1rem',
    },
  };

  return (
    <div style={styles.container}>
      <nav style={styles.nav}>
        <Link to="/" style={styles.logo}>
         
        </Link>
        <div style={styles.navLinks}>
          <Link to="/" style={styles.navLink}></Link>
          <Link to="/our-tailors" style={styles.navLink}></Link>
          <Link to="/customize" style={styles.navLink}></Link>
        </div>
      </nav>
      <div style={styles.backgroundImage}>
        <h1 style={styles.header}>Your Vision, Our Craft</h1>
        <p style={styles.subheader}>Breathe New Life into Your Sarees - Custom Creations Just for You!</p>
        <div style={styles.buttonContainer}>
          <Link to="/customize" style={{...styles.button, ...styles.primaryButton}}>
            CUSTOMIZE NOW
          </Link>
          <Link to="/our-tailors" style={{...styles.button, ...styles.secondaryButton}}>
            OUR TAILORS
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TailorHome; 
