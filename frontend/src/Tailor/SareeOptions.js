import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const SareeOptions = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isWebsiteSaree = location.pathname === '/website-saree';

  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#FFF5F5',
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
      cursor: 'pointer',
      border: 'none',
      background: 'none',
      padding: '10px',
    },
    title: {
      color: '#FF1493',
      fontSize: '2.5rem',
      textAlign: 'center',
      marginBottom: '40px',
      width: '100%',
    },
    optionsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '30px',
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px',
    },
    optionCard: {
      backgroundColor: 'white',
      borderRadius: '15px',
      overflow: 'hidden',
      boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
      transition: 'transform 0.3s ease',
      cursor: 'pointer',
      textDecoration: 'none',
      color: 'inherit',
    },
    cardImage: {
      width: '100%',
      height: '250px',
      objectFit: 'cover',
    },
    cardContent: {
      padding: '20px',
      textAlign: 'center',
    },
    cardTitle: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      marginBottom: '10px',
      color: '#333',
    },
    cardDescription: {
      fontSize: '1rem',
      color: '#666',
      marginBottom: '10px',
    },
  };

  const options = [
    {
      title: 'Lehenga',
      description: 'Transform into an elegant lehenga set',
      image: '/images/lehenga.jpg',
      path: isWebsiteSaree ? '/customize/website-lehenga' : '/customize/lehenga'
    },
    {
      title: 'Cushion Covers & Curtains',
      description: 'Beautiful home decor items',
      image: '/images/cushion.jpg',
      path: '/customize/home-decor'
    },
    {
      title: 'Frock',
      description: 'Stylish frocks for all occasions',
      image: '/images/frock.jpg',
      path: '/customize/frock'
    },
    {
      title: 'Bags',
      description: 'Trendy and practical bags',
      image: '/images/bag.jpg',
      path: '/customize/bags'
    },
    {
      title: 'Kitchen Linen',
      description: 'Functional kitchen accessories',
      image: '/images/kitchen.jpg',
      path: '/customize/kitchen'
    },
    {
      title: 'Bed Sheets',
      description: 'Comfortable and stylish bedding',
      image: '/images/bedsheet.jpg',
      path: '/customize/bedding'
    }
  ];

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button 
          onClick={() => navigate(-1)} 
          style={styles.backButton}
        >
          ←
        </button>
      </div>
      
      <h1 style={styles.title}>What would you like your saree to become?</h1>
      
      <div style={styles.optionsGrid}>
        {options.map((option, index) => (
          <Link
            key={index}
            to={option.path}
            style={styles.optionCard}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-10px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <img 
              src={option.image} 
              alt={option.title}
              style={styles.cardImage}
            />
            <div style={styles.cardContent}>
              <h2 style={styles.cardTitle}>{option.title}</h2>
              <p style={styles.cardDescription}>{option.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SareeOptions; 