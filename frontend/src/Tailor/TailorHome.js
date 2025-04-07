import React from 'react';
import { Link } from 'react-router-dom';
import CustomNavbar from '../Navbar'; // Adjust the path based on your folder structure
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css'; // Assuming styles are in App.css

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
  };

  // Dummy handlers since TailorHome doesn't need wishlist or search functionality
  const handleWishlistClick = (e) => e.preventDefault();
  const handleSearchClick = (e) => e.preventDefault();

  return (
    <div style={styles.container}>
      {/* Use the CustomNavbar component */}
      <CustomNavbar onWishlistClick={handleWishlistClick} onSearchClick={handleSearchClick} />
      
      <div style={styles.backgroundImage}>
        <h1 style={styles.header}>Your Vision, Our Craft</h1>
        <p style={styles.subheader}>Breathe New Life into Your Sarees - Custom Creations Just for You!</p>
        <div style={styles.buttonContainer}>
          <Link to="/customize" style={{ ...styles.button, ...styles.primaryButton }}>
            CUSTOMIZE NOW
          </Link>
          <Link to="/our-tailors" style={{ ...styles.button, ...styles.secondaryButton }}>
            OUR TAILORS
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TailorHome;