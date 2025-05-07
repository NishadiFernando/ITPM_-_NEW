import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CustomNavbar from '../Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';
import { motion } from 'framer-motion'; // Add this import

const TailorHome = () => {
  const navigate = useNavigate();
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 1,
        staggerChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  };

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
      backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(86, 0, 39, 0.8)), url('/images/saree-collage.jpg')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed', // Parallax effect
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      color: 'white',
      transition: 'all 0.5s ease-in-out',
    },
    header: {
      fontSize: '4.5rem',
      fontWeight: 'bold',
      marginBottom: '1rem',
      textAlign: 'center',
      textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
      fontFamily: "'Playfair Display', serif",
    },
    subheader: {
      fontSize: '2rem',
      marginBottom: '2.5rem',
      textAlign: 'center',
      textShadow: '1px 1px 3px rgba(0,0,0,0.2)',
      fontFamily: "'Poppins', sans-serif",
      maxWidth: '800px',
      lineHeight: '1.4',
    },
    buttonContainer: {
      display: 'flex',
      gap: '2rem',
      zIndex: 2,
    },
    button: {
      padding: '15px 35px',
      fontSize: '1.2rem',
      cursor: 'pointer',
      border: 'none',
      borderRadius: '50px',
      textDecoration: 'none',
      transition: 'all 0.3s ease',
      fontFamily: "'Poppins', sans-serif",
      fontWeight: '600',
      boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
      display: 'inline-block',
      textTransform: 'uppercase',
      letterSpacing: '1px',
    },
    primaryButton: {
      background: 'linear-gradient(45deg, #FFD700, #FFA500)',
      color: '#560027',
      border: 'none',
      '&:hover': {
        transform: 'translateY(-3px)',
        boxShadow: '0 6px 20px rgba(255,215,0,0.4)',
      }
    },
    secondaryButton: {
      backgroundColor: 'transparent',
      border: '2px solid #FFD700',
      color: '#FFD700',
      position: 'relative',
      overflow: 'hidden',
      zIndex: 1,
      '&:hover': {
        color: '#560027',
        borderColor: 'transparent',
        background: 'linear-gradient(45deg, #FFD700, #FFA500)',
        transform: 'translateY(-3px)',
      }
    }
  };

  const handleWishlistClick = (e) => e.preventDefault();
  const handleSearchClick = (e) => e.preventDefault();
  const handleCustomizeClick = () => navigate('/customization');

  return (
    <div style={styles.container}>
      <CustomNavbar 
        onWishlistClick={handleWishlistClick} 
        onSearchClick={handleSearchClick} 
      />
      
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={styles.backgroundImage}
      >
        <motion.h1
          variants={itemVariants}
          style={styles.header}
        >
          Your Vision, Our Craft
        </motion.h1>
        
        <motion.p
          variants={itemVariants}
          style={styles.subheader}
        >
          Breathe New Life into Your Sarees - Custom Creations Just for You!
        </motion.p>
        
        <motion.div
          variants={itemVariants}
          style={styles.buttonContainer}
        >
          <motion.button 
            whileHover={{ 
              scale: 1.05,
              boxShadow: '0 8px 25px rgba(255,215,0,0.5)',
              backgroundColor: '#FFE55C'
            }}
            whileTap={{ scale: 0.95 }}
            transition={{
              type: "spring",
              stiffness: 500,
              damping: 15
            }}
            onClick={handleCustomizeClick}
            style={{ ...styles.button, ...styles.primaryButton }}
          >
            Customize Now
          </motion.button>
          
          <motion.div 
            whileHover={{ 
              scale: 1.05,
              boxShadow: '0 8px 25px rgba(255,215,0,0.3)'
            }}
            whileTap={{ scale: 0.95 }}
            transition={{
              type: "spring",
              stiffness: 500,
              damping: 15
            }}
          >
            <Link 
              to="/our-tailors" 
              style={{ ...styles.button, ...styles.secondaryButton }}
            >
              Our Tailors
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default TailorHome;