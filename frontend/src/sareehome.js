import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import CustomNavbar from './Navbar'; // Import the new Navbar component

function CustomerPage() {
  // State declarations
  const [showMainContent, setShowMainContent] = useState(false);
  const [showWishlist, setShowWishlist] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [sarees, setSarees] = useState([]);
  const [selectedSaree, setSelectedSaree] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeSection, setActiveSection] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState([]);
  const [searchMainColor, setSearchMainColor] = useState('');
  const [searchFabric, setSearchFabric] = useState('');
  const [filteredSarees, setFilteredSarees] = useState([]);

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes fadeInDown {
        from {
          opacity: 0;
          transform: translateY(-20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  useEffect(() => {
    setShowWishlist(false);
    setShowSearch(false);
  }, []);

  useEffect(() => {
    const savedWishlist = localStorage.getItem('wishlist');
    if (savedWishlist) {
      setWishlist(JSON.parse(savedWishlist));
    }
  }, []);

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/sarees')
      .then((res) => {
        console.log('Fetched sarees:', res.data);
        setSarees(res.data);
        setFilteredSarees(res.data);
      })
      .catch((err) => {
        setError('Failed to fetch sarees');
        console.error('Error fetching sarees:', err);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (sarees.length > 0) {
      setFilteredSarees(sarees);
    }
  }, [sarees]);

  // Define handleSearch first using useCallback
  const handleSearch = useCallback(() => {
    const filtered = sarees.filter((saree) => {
      const mainColorMatch =
        !searchMainColor ||
        (saree.mainColor && saree.mainColor.toLowerCase() === searchMainColor.toLowerCase());
      const fabricMatch =
        !searchFabric ||
        (saree.fabric && saree.fabric.toLowerCase() === searchFabric.toLowerCase());
      return mainColorMatch && fabricMatch;
    });
    setFilteredSarees(filtered);
    console.log('Search Results:', filtered);
  }, [sarees, searchMainColor, searchFabric]);

  // Now useEffect can safely use handleSearch
  useEffect(() => {
    if (showSearch) {
      handleSearch();
    }
  }, [searchMainColor, searchFabric, showSearch, handleSearch]);

  const handleWishlistClick = (e) => {
    e.preventDefault();
    setShowWishlist((prev) => !prev);
    setShowSearch(false);
  };

  const handleSearchClick = (e) => {
    e.preventDefault();
    setShowSearch((prev) => !prev);
    setShowWishlist(false);
  };

  const handleViewDetails = (saree) => {
    setSelectedSaree(saree);
    setQuantity(1);
    setActiveSection(null);
  };

  const handleCloseDetails = () => {
    setSelectedSaree(null);
    setQuantity(1);
    setActiveSection(null);
  };

  const handleBuyNow = (saree) => {
    alert(`Proceeding to buy: ${saree.title} (Quantity: ${quantity})`);
  };

  const handleAddToCart = (saree) => {
    alert(`Added to cart: ${saree.title} (Quantity: ${quantity})`);
  };

  const handleAddToWishlist = (saree) => {
    const isInWishlist = wishlist.some((item) => item._id === saree._id);
    if (!isInWishlist) {
      const newWishlist = [...wishlist, saree];
      setWishlist(newWishlist);
      localStorage.setItem('wishlist', JSON.stringify(newWishlist));
      alert('Added to wishlist!');
    } else {
      alert('This saree is already in your wishlist!');
    }
  };

  const handleRemoveFromWishlist = (sareeId) => {
    const newWishlist = wishlist.filter((item) => item._id !== sareeId);
    setWishlist(newWishlist);
    localStorage.setItem('wishlist', JSON.stringify(newWishlist));
  };

  const handleIncrement = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleDecrement = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const showDetails = () => {
    setActiveSection('details');
  };

  const showShipping = () => {
    setActiveSection('shipping');
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const styles = {
    landingPage: {
      minHeight: '100vh',
      background: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), 
                  url('https://images.unsplash.com/photo-1610030468707-b09b6da0da89?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      color: 'white',
      textAlign: 'center',
      padding: '20px'
    },
    title: {
      fontSize: '4rem',
      fontFamily: "'Playfair Display', serif",
      marginBottom: '20px',
      animation: 'fadeInDown 1s ease-out'
    },
    subtitle: {
      fontSize: '1.5rem',
      fontFamily: "'Poppins', sans-serif",
      marginBottom: '30px',
      maxWidth: '800px',
      lineHeight: '1.6',
      animation: 'fadeInUp 1s ease-out 0.5s both'
    },
    getStartedBtn: {
      padding: '15px 40px',
      fontSize: '1.2rem',
      backgroundColor: '#D4AF37',
      border: 'none',
      borderRadius: '30px',
      transition: 'all 0.3s ease',
      animation: 'fadeInUp 1s ease-out 1s both'
    },
    footer: {
      backgroundColor: '#4F032A',
      color: 'white',
      padding: '40px 0',
      marginTop: 'auto'
    }
  };

  const renderLandingPage = () => (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <div style={styles.landingPage}>
        <h1 style={styles.title}>Welcome  to Punarvasthra</h1>
        <p style={styles.subtitle}>
          Discover the elegance of traditional sarees reimagined for the modern era. 
          From vintage treasures to contemporary designs, explore our curated collection 
          of sustainable fashion that celebrates the artistry of Sri Lankan heritage.
        </p>
        <Button 
          style={styles.getStartedBtn}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = '#B4912F';
            e.target.style.transform = 'translateY(-3px)';
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = '#D4AF37';
            e.target.style.transform = 'translateY(0)';
          }}
          onClick={() => setShowMainContent(true)}
        >
          Get Started
        </Button>

        {/* Feature Highlights */}
        <Container className="mt-5">
          <Row>
            {[
              { icon: '🌟', title: 'Vintage Collection', desc: 'Carefully curated pre-loved sarees' },
              { icon: '✨', title: 'Custom Design', desc: 'Personalize your perfect saree' },
              { icon: '♻️', title: 'Sustainable Fashion', desc: 'Supporting eco-friendly choices' }
            ].map((feature, index) => (
              <Col md={4} key={index} className="text-center mb-4" style={{
                animation: `fadeInUp 1s ease-out ${1.5 + index * 0.2}s both`
              }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>{feature.icon}</div>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>{feature.title}</h3>
                <p style={{ fontSize: '1rem', opacity: 0.9 }}>{feature.desc}</p>
              </Col>
            ))}
          </Row>
        </Container>
      </div>

      {/* Footer */}
      <footer style={styles.footer}>
        <Container>
          <Row>
            <Col md={4} className="mb-4">
              <h4 style={{ color: '#D4AF37', marginBottom: '20px' }}>About Punarvasthra</h4>
              <p>Reviving tradition through sustainable fashion. We bring you the finest collection of vintage and new sarees.</p>
            </Col>
            <Col md={4} className="mb-4">
              <h4 style={{ color: '#D4AF37', marginBottom: '20px' }}>Quick Links</h4>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                <li><a href="/about" style={{ color: 'white', textDecoration: 'none' }}>About Us</a></li>
                <li><a href="/customize" style={{ color: 'white', textDecoration: 'none' }}>Customization</a></li>
                <li><a href="/our-tailors" style={{ color: 'white', textDecoration: 'none' }}>Our Tailors</a></li>
              </ul>
            </Col>
            <Col md={4} className="mb-4">
              <h4 style={{ color: '#D4AF37', marginBottom: '20px' }}>Contact Us</h4>
              <p>📧 info@punarvasthra.com</p>
              <p>📞 +94 11 234 5678</p>
              <p>📍 Colombo, Sri Lanka</p>
            </Col>
          </Row>
          <Row>
            <Col className="text-center mt-4">
              <p style={{ marginBottom: 0, borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px' }}>
                © 2025 Punarvasthra. All rights reserved.
              </p>
            </Col>
          </Row>
        </Container>
      </footer>
    </div>
  );

  return (
    <div className="customer-page">
      {!showMainContent ? (
        renderLandingPage()
      ) : (
        <>
          <CustomNavbar
            onWishlistClick={handleWishlistClick}
            onSearchClick={handleSearchClick}
          />

          {/* Import Google Fonts */}
          <link
            href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap"
            rel="stylesheet"
          />

          {/* Add Animations via <style> Tag */}
          <style>
            {`
              @keyframes popUp {
                0% { transform: scale(0.5); opacity: 0; }
                100% { transform: scale(1); opacity: 1; }
              }

              @keyframes slideIn {
                0% { transform: translateX(-100%); opacity: 0; }
                100% { transform: translateX(0); opacity: 1; }
              }

              @keyframes shake {
                0% { transform: translateX(0); }
                10% { transform: translateX(-5px) rotate(-2deg); }
                20% { transform: translateX(5px) rotate(2deg); }
                30% { transform: translateX(-5px) rotate(-2deg); }
                40% { transform: translateX(5px) rotate(2deg); }
                50% { transform: translateX(-3px) rotate(-1deg); }
                60% { transform: translateX(3px) rotate(1deg); }
                70% { transform: translateX(-3px) rotate(-1deg); }
                80% { transform: translateX(3px) rotate(1deg); }
                90% { transform: translateX(-1px) rotate(0deg); }
                100% { transform: translateX(0); }
              }

              .price-pop-up {
                animation: popUp 0.5s ease-out forwards;
              }

              .buy-now-slide {
                animation: slideIn 0.7s ease-out forwards;
              }
            `}
          </style>

          {/* Rest of the CustomerPage content remains unchanged */}
          {selectedSaree && (
            <Container className="mt-5">
              <div className="detailed-view-container">
                <Row>
                  <Col md={6} style={{ position: 'relative' }}>
                    <div className="image-container" style={{ position: 'relative', overflow: 'hidden' }}>
                      <img
                        src={`http://localhost:5000${selectedSaree.image}`}
                        alt={selectedSaree.title}
                        className="detailed-view-image"
                        style={{ width: '100%', height: 'auto' }}
                        onMouseMove={(e) => {
                          const { left, top, width, height } = e.target.getBoundingClientRect();
                          const x = (e.clientX - left) / width * 100;
                          const y = (e.clientY - top) / height * 100;
                          e.target.style.transformOrigin = `${x}% ${y}%`;
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.transform = 'scale(1.5)';
                          e.target.style.transition = 'transform 0.3s ease-out';
                          e.target.style.cursor = 'zoom-in';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.transform = 'scale(1)';
                        }}
                      />
                    </div>
                    {selectedSaree.stockAvailability === 'Out of Stock' && (
                      <div
                        style={{
                          position: 'absolute',
                          top: '20px',
                          right: '20px',
                          backgroundColor: '#FF0000',
                          color: '#fff',
                          padding: '10px 20px',
                          fontSize: '16px',
                          fontWeight: 'bold',
                          transform: 'rotate(-15deg)',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
                          borderRadius: '5px',
                        }}
                      >
                        Out of Stock
                      </div>
                    )}
                  </Col>
                  <Col md={6}>
                    <h2 className="detailed-view-title">{selectedSaree.title}</h2>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                      <p
                        className="price-pop-up"
                        style={{
                          fontSize: '36px',
                          fontWeight: 'bold',
                          color: '#fff',
                          background: 'linear-gradient(90deg, #FFD700, #FF8C00)',
                          padding: '10px 20px',
                          borderRadius: '8px',
                          display: 'inline-block',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                          marginRight: '15px',
                          marginBottom: '0',
                        }}
                      >
                        Price: LKR {selectedSaree.price}
                      </p>
                      {selectedSaree.stockAvailability === 'In Stock' && (
                        <span
                          style={{
                            fontSize: '20px',
                            fontWeight: 'bold',
                            color: '#0000FF',
                            display: 'inline-block',
                          }}
                        >
                          In Stock
                        </span>
                      )}
                    </div>
                    <div
                      style={{
                        marginBottom: '20px',
                        fontFamily: "'Poppins', sans-serif",
                        fontSize: '14px',
                        color: '#333',
                      }}
                    >
                      <p style={{ margin: '5px 0' }}>
                        <span style={{ marginRight: '8px', fontSize: '16px' }}>🚚</span>
                        FREE Shipping on orders in Sri Lanka
                      </p>
                      <p style={{ margin: '5px 0' }}>
                        <span style={{ marginRight: '8px', fontSize: '16px' }}>🏭</span>
                        DIRECT FROM MANUFACTURER
                      </p>
                      <p style={{ margin: '5px 0' }}>
                        <span style={{ marginRight: '8px', fontSize: '16px' }}>🏆</span>
                        TRUSTED BRAND SINCE 2025
                      </p>
                      <p style={{ margin: '5px 0' }}>
                        <span style={{ marginRight: '8px', fontSize: '16px' }}>✅</span>
                        100% ORIGINAL PRODUCT
                      </p>
                      <p style={{ margin: '5px 0' }}>
                        <span style={{ marginRight: '8px', fontSize: '16px' }}>⚡</span>
                        24 HOURS EXPRESS SHIPPING
                      </p>
                    </div>
                    <div style={{ marginTop: '20px', marginBottom: '20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                        <Button
                          className="buy-now-slide"
                          disabled={selectedSaree.stockAvailability === 'Out of Stock'}
                          style={{
                            backgroundColor: selectedSaree.stockAvailability === 'Out of Stock' ? '#ccc' : '#000',
                            borderColor: selectedSaree.stockAvailability === 'Out of Stock' ? '#ccc' : '#000',
                            color: selectedSaree.stockAvailability === 'Out of Stock' ? '#666' : '#fff',
                            padding: '15px 40px',
                            fontSize: '20px',
                            marginRight: '10px',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                            opacity: selectedSaree.stockAvailability === 'Out of Stock' ? 0.6 : 1,
                            animation: selectedSaree.stockAvailability === 'In Stock' ? 'shake 1.5s ease infinite' : 'none',
                          }}
                          onClick={() => handleBuyNow(selectedSaree)}
                        >
                          Buy Now
                        </Button>
                        <OverlayTrigger placement="top" overlay={<Tooltip>Add to Cart</Tooltip>}>
                          <Button
                            className="large-buy-now-btn"
                            style={{ padding: '10px 15px', fontSize: '16px' }}
                            onClick={() => handleAddToCart(selectedSaree)}
                          >
                            🛒
                          </Button>
                        </OverlayTrigger>
                        <OverlayTrigger placement="top" overlay={<Tooltip>Add to Wishlist</Tooltip>}>
                          <Button
                            className="large-buy-now-btn"
                            style={{ marginLeft: '10px', padding: '10px 15px', fontSize: '16px' }}
                            onClick={() => handleAddToWishlist(selectedSaree)}
                          >
                            ❤
                          </Button>
                        </OverlayTrigger>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', marginBottom: '15px' }}>
                        <Button
                          style={{
                            backgroundColor: '#FFD700',
                            borderColor: '#FFD700',
                            color: '#000',
                            padding: '5px 10px',
                            fontSize: '16px',
                            marginRight: '10px',
                            transition: 'background-color 0.3s',
                          }}
                          onMouseEnter={(e) => (e.target.style.backgroundColor = '#FF8C00')}
                          onMouseLeave={(e) => (e.target.style.backgroundColor = '#FFD700')}
                          onClick={handleDecrement}
                        >
                          −
                        </Button>
                        <span
                          style={{
                            fontSize: '18px',
                            fontWeight: 'bold',
                            backgroundColor: '#fff',
                            padding: '5px 15px',
                            borderRadius: '5px',
                            border: '1px solid #ccc',
                            margin: '0 10px',
                          }}
                        >
                          {quantity}
                        </span>
                        <Button
                          style={{
                            backgroundColor: '#FFD700',
                            borderColor: '#FFD700',
                            color: '#000',
                            padding: '5px 10px',
                            fontSize: '16px',
                            marginLeft: '10px',
                            transition: 'background-color 0.3s',
                          }}
                          onMouseEnter={(e) => (e.target.style.backgroundColor = '#FF8C00')}
                          onMouseLeave={(e) => (e.target.style.backgroundColor = '#FFD700')}
                          onClick={handleIncrement}
                        >
                          +
                        </Button>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', marginBottom: '15px' }}>
                        <Button
                          style={{
                            backgroundColor: '#000',
                            borderColor: '#000',
                            color: '#fff',
                            padding: '8px 20px',
                            fontSize: '16px',
                            marginRight: '10px',
                            transition: 'background-color 0.3s',
                          }}
                          onMouseEnter={(e) => (e.target.style.backgroundColor = '#333')}
                          onMouseLeave={(e) => (e.target.style.backgroundColor = '#000')}
                          onClick={showDetails}
                        >
                          Description
                        </Button>
                        <Button
                          style={{
                            backgroundColor: '#000',
                            borderColor: '#000',
                            color: '#fff',
                            padding: '8px 20px',
                            fontSize: '16px',
                            transition: 'background-color 0.3s',
                          }}
                          onMouseEnter={(e) => (e.target.style.backgroundColor = '#333')}
                          onMouseLeave={(e) => (e.target.style.backgroundColor = '#000')}
                          onClick={showShipping}
                        >
                          Shipping & Return
                        </Button>
                      </div>
                      {activeSection === 'details' && (
                        <div style={{ marginBottom: '20px' }}>
                          <p><strong>Main Color:</strong> {selectedSaree.mainColor}</p>
                          <p>
                            <strong>Color:</strong>
                            <span
                              className="color-swatch-detailed"
                              style={{
                                backgroundColor: selectedSaree.color || '#ccc',
                                display: 'inline-block',
                                width: '20px',
                                height: '20px',
                                marginLeft: '10px',
                                verticalAlign: 'middle',
                                border: '1px solid #ccc',
                              }}
                            ></span>
                          </p>
                          <p><strong>Fabric:</strong> {selectedSaree.fabric}</p>
                          <p><strong>Stock Availability:</strong> {selectedSaree.stockAvailability}</p>
                          <p><strong>Stock:</strong> {selectedSaree.stock}</p>
                          <p><strong>Customization:</strong> {selectedSaree.customization}</p>
                          <p><strong>Occasion:</strong> {selectedSaree.occasion}</p>
                          <p><strong>Design Pattern:</strong> {selectedSaree.designPattern}</p>
                          <p><strong>Embroidery Style:</strong> {selectedSaree.embroideryStyle}</p>
                          <p><strong>Description:</strong></p>
                          <ul className="description-points">
                            {selectedSaree.description.split('\n').map((point, index) => (
                              point.trim() && <li key={index}>{point.trim()}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {activeSection === 'shipping' && (
                        <div style={{ marginBottom: '20px' }}>
                          <h4 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px' }}>
                            Shipping and Return Information
                          </h4>
                          <ul style={{ paddingLeft: '20px', listStyleType: 'disc', color: '#333' }}>
                            <li style={{ marginBottom: '5px' }}>Free shipping on orders over LKR 5000.</li>
                            <li style={{ marginBottom: '5px' }}>Returns accepted within 30 days of purchase.</li>
                            <li style={{ marginBottom: '5px' }}>For more details, please contact our customer support.</li>
                          </ul>
                        </div>
                      )}
                    </div>
                    <div style={{ textAlign: 'center', marginTop: '30px' }}>
                      <Button
                        variant="link"
                        onClick={handleCloseDetails}
                        style={{
                          fontSize: '24px',
                          color: '#FFD700',
                          textDecoration: 'none',
                        }}
                      >
                        ←
                      </Button>
                    </div>
                  </Col>
                </Row>
              </div>
            </Container>
          )}

          {showSearch ? (
            <Container className="mt-5">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ color: '#4F032A', margin: 0 }}>Search Sarees</h2>
                <Button
                  onClick={() => setShowSearch(false)}
                  className="back-to-collection-btn"
                  style={{
                    backgroundColor: '#4F032A',
                    borderColor: '#4F032A',
                    color: '#fff',
                    padding: '8px 20px',
                    fontSize: '16px',
                    borderRadius: '25px',
                    transition: 'background-color 0.3s',
                  }}
                >
                  Back to Collection
                </Button>
              </div>
              <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginBottom: '30px' }}>
                <Row>
                  <Col md={5}>
                    <div style={{ marginBottom: '15px' }}>
                      <label style={{ display: 'block', marginBottom: '5px', color: '#4F032A', fontWeight: 'bold' }}>
                        Search by Main Color
                      </label>
                      <select
                        value={searchMainColor}
                        onChange={(e) => setSearchMainColor(e.target.value)}
                        style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px', fontSize: '16px', backgroundColor: '#fff' }}
                      >
                        <option value="">Select Main Color</option>
                        <option value="Red">Red</option>
                        <option value="Blue">Blue</option>
                        <option value="Green">Green</option>
                        <option value="Yellow">Yellow</option>
                        <option value="Purple">Purple</option>
                        <option value="Pink">Pink</option>
                        <option value="Orange">Orange</option>
                        <option value="Brown">Brown</option>
                        <option value="Black">Black</option>
                        <option value="White">White</option>
                        <option value="Gold">Gold</option>
                        <option value="Silver">Silver</option>
                      </select>
                    </div>
                  </Col>
                  <Col md={5}>
                    <div style={{ marginBottom: '15px' }}>
                      <label style={{ display: 'block', marginBottom: '5px', color: '#4F032A', fontWeight: 'bold' }}>
                        Search by Fabric
                      </label>
                      <select
                        value={searchFabric}
                        onChange={(e) => setSearchFabric(e.target.value)}
                        style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px', fontSize: '16px', backgroundColor: '#fff' }}
                      >
                        <option value="">Select Fabric</option>
                        <option value="Cotton Sarees">Cotton Sarees</option>
                        <option value="Silk Sarees">Silk Sarees</option>
                        <option value="Linen Sarees">Linen Sarees</option>
                        <option value="Georgette Sarees">Georgette Sarees</option>
                        <option value="Chiffon Sarees">Chiffon Sarees</option>
                        <option value="Crepe Sarees">Crepe Sarees</option>
                        <option value="Net Sarees">Net Sarees</option>
                        <option value="Banarasi Sarees">Banarasi Sarees</option>
                        <option value="Kanchipuram Sarees">Kanchipuram Sarees</option>
                        <option value="Bathik">Bathik</option>
                      </select>
                    </div>
                  </Col>
                  <Col md={2} className="d-flex align-items-end">
                    <Button
                      onClick={handleSearch}
                      style={{ width: '100%', backgroundColor: '#4F032A', borderColor: '#4F032A', padding: '10px', fontSize: '16px', marginBottom: '15px' }}
                    >
                      Search
                    </Button>
                  </Col>
                </Row>
              </div>
              {filteredSarees.length > 0 ? (
                <Row>
                  {filteredSarees.map((saree) => (
                    <Col md={3} key={saree._id} className="mb-4">
                      <Card className="saree-card">
                        <div className="image-container">
                          <Card.Img
                            variant="top"
                            src={`http://localhost:5000${saree.image}`}
                            alt={saree.title}
                            className="saree-image"
                          />
                          {saree.stockAvailability === 'Out of Stock' && (
                            <div className="out-of-stock-badge">Out of Stock</div>
                          )}
                        </div>
                        <Card.Body>
                          <Card.Title className="saree-title">{saree.title}</Card.Title>
                          <Card.Text className="saree-price">LKR {saree.price}</Card.Text>
                          <div className="saree-color">
                            <span>Color:</span>
                            <span className="color-dot" style={{ backgroundColor: saree.color }}></span>
                            <span>{saree.mainColor}</span>
                          </div>
                          <Button className="view-details-btn" onClick={() => handleViewDetails(saree)}>
                            View Details
                          </Button>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              ) : (
                <div className="text-center mt-4">
                  <p>No sarees found matching your search criteria.</p>
                </div>
              )}
            </Container>
          ) : showWishlist ? (
            <Container>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ color: '#4F032A', margin: 0 }}>My Wishlist</h2>
                <Button
                  onClick={() => setShowWishlist(false)}
                  style={{
                    backgroundColor: '#4F032A',
                    borderColor: '#4F032A',
                    color: '#fff',
                    padding: '8px 20px',
                    fontSize: '16px',
                    transition: 'background-color 0.3s',
                  }}
                  onMouseEnter={(e) => (e.target.style.backgroundColor = '#6B0B3D')}
                  onMouseLeave={(e) => (e.target.style.backgroundColor = '#4F032A')}
                >
                  Back to Collection
                </Button>
              </div>
              {wishlist.length === 0 ? (
                <div className="text-center">
                  <p>Your wishlist is empty. Add some beautiful sarees!</p>
                </div>
              ) : (
                <Row>
                  {wishlist.map((saree) => (
                    <Col md={3} key={saree._id} className="mb-4">
                      <Card className="saree-card">
                        <div className="image-container" style={{ position: 'relative', overflow: 'hidden' }}>
                          <Card.Img
                            variant="top"
                            src={`http://localhost:5000${saree.image}`}
                            className="saree-image"
                            onMouseMove={(e) => {
                              const { left, top, width, height } = e.target.getBoundingClientRect();
                              const x = (e.clientX - left) / width * 100;
                              const y = (e.clientY - top) / height * 100;
                              e.target.style.transformOrigin = `${x}% ${y}%`;
                            }}
                            style={{ transition: 'transform 0.3s ease-out', cursor: 'zoom-in' }}
                            onMouseEnter={(e) => {
                              e.target.style.transform = 'scale(1.5)';
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.transform = 'scale(1)';
                            }}
                          />
                        </div>
                        <Card.Body>
                          <Card.Title className="saree-title">{saree.title}</Card.Title>
                          <Card.Text className="saree-price">LKR {saree.price}</Card.Text>
                          <div className="saree-color">
                            <span>Color:</span>
                            <span className="color-dot" style={{ backgroundColor: saree.color }}></span>
                            <span>{saree.mainColor}</span>
                          </div>
                          <Button
                            className="view-details-btn mb-2"
                            onClick={() => handleViewDetails(saree)}
                            style={{ width: '100%' }}
                          >
                            View Details
                          </Button>
                          <Button
                            variant="outline-danger"
                            onClick={() => handleRemoveFromWishlist(saree._id)}
                            style={{ width: '100%' }}
                          >
                            Remove from Wishlist
                          </Button>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              )}
            </Container>
          ) : (
            <Container className="mt-5">
              <Row>
                {sarees.map((saree) => {
                  console.log('Rendering saree:', saree);
                  const imageUrl = `http://localhost:5000${saree.image}`;
                  console.log('Image URL:', imageUrl);
                  return (
                    <Col md={3} key={saree._id} className="mb-4">
                      <Card className="saree-card">
                        <div style={{ position: 'relative' }}>
                          <Card.Img
                            variant="top"
                            src={imageUrl}
                            alt={saree.title}
                            className="saree-image"
                            onError={(e) => {
                              console.error('Image failed to load:', imageUrl);
                              e.target.src = 'https://via.placeholder.com/300x400';
                            }}
                          />
                          {saree.stockAvailability === 'Out of Stock' && (
                            <div className="out-of-stock-badge">Out of Stock</div>
                          )}
                          {saree.onSale && <div className="sale-badge">Sale</div>}
                        </div>
                        <Card.Body>
                          <Card.Title className="saree-title">{saree.title}</Card.Title>
                          <Card.Text className="saree-price">LKR {saree.price}</Card.Text>
                          <div className="saree-color">
                            <span>Color:</span>
                            <span className="color-dot" style={{ backgroundColor: saree.color }}></span>
                            <span>{saree.mainColor}</span>
                          </div>
                          <Button className="view-details-btn" onClick={() => handleViewDetails(saree)}>
                            View Details
                          </Button>
                        </Card.Body>
                      </Card>
                    </Col>
                  );
                })}
              </Row>
            </Container>
          )}
        </>
      )}
    </div>
  );
}

export default CustomerPage;