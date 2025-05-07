import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import CustomNavbar from '../Navbar';

const CustomizationPage = () => {
  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #2C3E50 0%, #3498db 100%)',
      padding: '0',
    },
    mainContent: {
      padding: '40px 20px',
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '30px',
      maxWidth: '1200px',
      margin: '0 auto',
    },
    backButton: {
      display: 'flex',
      alignItems: 'center',
      textDecoration: 'none',
      color: '#ffffff',
      fontSize: '16px',
      padding: '12px 24px',
      borderRadius: '30px',
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      border: '1px solid rgba(255, 255, 255, 0.3)',
    },
    backButtonText: {
      marginLeft: '8px',
      fontWeight: '500',
    },
    content: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px',
    },
    title: {
      color: '#ffffff',
      fontSize: '2.5rem',
      textAlign: 'center',
      marginBottom: '20px',
      fontFamily: "'Poppins', sans-serif",
      fontWeight: '600',
      textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
    },
    subtitle: {
      color: '#E0E0E0',
      textAlign: 'center',
      fontSize: '1.2rem',
      marginBottom: '50px',
      fontFamily: "'Poppins', sans-serif",
      fontWeight: '400',
    },
    optionsContainer: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '30px',
      maxWidth: '900px',
      margin: '0 auto',
      padding: '20px',
    },
    optionCard: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '40px 30px',
      borderRadius: '15px',
      textAlign: 'center',
      cursor: 'pointer',
      textDecoration: 'none',
      transition: 'all 0.3s ease',
      minHeight: '250px',
      boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)',
    },
    websiteSaree: {
      background: 'linear-gradient(135deg, #00b09b, #96c93d)',
      color: 'white',
    },
    ownSaree: {
      background: 'linear-gradient(135deg, #667eea, #764ba2)',
      color: 'white',
    },
    cardTitle: {
      fontSize: '1.8rem',
      marginBottom: '20px',
      fontFamily: "'Poppins', sans-serif",
      color: '#ffffff',
      fontWeight: '600',
    },
    cardDescription: {
      fontSize: '1.1rem',
      lineHeight: '1.6',
      fontFamily: "'Poppins', sans-serif",
      color: '#ffffff',
      opacity: '0.9',
    },
    highlight: {
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      padding: '5px 10px',
      borderRadius: '5px',
      fontWeight: '500',
      display: 'inline-block',
      marginTop: '10px',
    },
    icon: {
      fontSize: '2.5rem',
      marginBottom: '20px',
      color: '#ffffff',
    }
  };

  return (
    <div style={styles.container}>
      <CustomNavbar />
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        style={styles.mainContent}
      >
        <div style={styles.header}>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to="/tailor-home" style={styles.backButton}>
              <span>←</span>
              <span style={styles.backButtonText}>Back to Home</span>
            </Link>
          </motion.div>
        </div>

        <motion.h1
          initial={{ y: -30 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", stiffness: 100 }}
          style={styles.title}
        >
          Choose Your Customization Path
        </motion.h1>

        <motion.p
          initial={{ y: 30 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", stiffness: 100 }}
          style={styles.subtitle}
        >
          Select your preferred way to customize your saree
        </motion.p>
        
        <div style={styles.optionsContainer}>
          <motion.div
            whileHover={{ 
              scale: 1.03,
              boxShadow: '0 15px 30px rgba(0, 0, 0, 0.2)'
            }}
            whileTap={{ scale: 0.98 }}
          >
            <Link 
              to="/saree-options/website" 
              style={{...styles.optionCard, ...styles.websiteSaree}}
            >
              <span style={styles.icon}>🛍️</span>
              <h2 style={styles.cardTitle}>Website Collection</h2>
              <p style={styles.cardDescription}>
                Choose from our exclusive collection
                <span style={styles.highlight}>20% OFF on all items</span>
              </p>
            </Link>
          </motion.div>

          <motion.div
            whileHover={{ 
              scale: 1.03,
              boxShadow: '0 15px 30px rgba(0, 0, 0, 0.2)'
            }}
            whileTap={{ scale: 0.98 }}
          >
            <Link 
              to="/saree-options/own" 
              style={{...styles.optionCard, ...styles.ownSaree}}
            >
              <span style={styles.icon}>✨</span>
              <h2 style={styles.cardTitle}>Custom Saree</h2>
              <p style={styles.cardDescription}>
                Customize your own saree
                <span style={styles.highlight}>5% OFF on all items</span>
              </p>
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default CustomizationPage;