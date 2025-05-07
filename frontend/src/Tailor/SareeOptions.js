import React from 'react';
import { useParams, Link } from 'react-router-dom';
import CustomNavbar from '../Navbar';

const SareeOptions = () => {
  const { type } = useParams();

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #2C3E50 0%, #3498db 100%)',
      padding: '0',
    },
    mainContent: {
      padding: '20px',
      maxWidth: '1200px',
      margin: '0 auto',
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '30px',
    },
    backButton: {
      display: 'flex',
      alignItems: 'center',
      textDecoration: 'none',
      color: '#ffffff',
      fontSize: '16px',
      padding: '12px 24px',
      borderRadius: '8px',
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      border: '1px solid rgba(255, 255, 255, 0.3)',
      transition: 'all 0.3s ease',
    },
    backButtonText: {
      marginLeft: '8px',
      fontWeight: '500',
    },
    title: {
      color: '#ffffff',
      fontSize: '2.2rem',
      textAlign: 'center',
      marginBottom: '35px',
      fontFamily: "'Poppins', sans-serif",
      fontWeight: '600',
      transition: 'opacity 0.3s ease',
    },
    optionsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '25px',
      padding: '15px',
    },
    optionCard: {
      backgroundColor: '#ffffff',
      borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      textDecoration: 'none',
      color: 'inherit',
      transition: 'all 0.3s ease',
      transform: 'translateY(0)',
      cursor: 'pointer',
    },
    cardImage: {
      width: '100%',
      height: '220px',
      objectFit: 'cover',
      transition: 'transform 0.3s ease',
    },
    cardContent: {
      padding: '20px',
      textAlign: 'center',
      backgroundColor: '#E3F2FD',
      transition: 'background-color 0.3s ease',
    },
    cardTitle: {
      fontSize: '1.5rem',
      fontWeight: '600',
      marginBottom: '10px',
      color: '#1565C0',
      fontFamily: "'Poppins', sans-serif",
    },
    cardDescription: {
      fontSize: '1.1rem',
      color: '#2C3E50',
      marginBottom: '10px',
      fontFamily: "'Poppins', sans-serif",
      lineHeight: '1.5',
    },
  };

  const options = [
    {
      title: 'Lehenga',
      description: 'Transform into an elegant lehenga set',
      image: '/images/lehenga.jpg',
      path: `/customize/${type}-lehenga`
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

  const handleCardHover = (event) => {
    event.currentTarget.style.transform = 'translateY(-5px)';
    event.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.15)';
  };

  const handleCardLeave = (event) => {
    event.currentTarget.style.transform = 'translateY(0)';
    event.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
  };

  return (
    <div style={styles.container}>
      <CustomNavbar />
      <div style={styles.mainContent}>
        <div style={styles.header}>
          <Link 
            to="/customization" 
            style={styles.backButton}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.3)'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'}
          >
            <span>←</span>
            <span style={styles.backButtonText}>Back</span>
          </Link>
        </div>

        <h1 style={styles.title}>
          {type === 'website' ? 'Website Saree' : 'Own Saree'} Options
        </h1>

        <div style={styles.optionsGrid}>
          {options.map((option, index) => (
            <Link
              key={index}
              to={option.path}
              style={styles.optionCard}
              onMouseEnter={handleCardHover}
              onMouseLeave={handleCardLeave}
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
    </div>
  );
};

export default SareeOptions;