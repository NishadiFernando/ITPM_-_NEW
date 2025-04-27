import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'; // Removed Link import
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import CustomNavbar from './Navbar'; // Import the new Navbar component

function CustomerPage() {
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
  const navigate = useNavigate();

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

  useEffect(() => {
    if (showSearch) {
      handleSearch();
    }
  }, [searchMainColor, searchFabric, showSearch, handleSearch]);

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

  const handleAddToCart = (saree) => {
    // Get existing cart
    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    // Check if item already exists
    const existingItemIndex = existingCart.findIndex(item => item._id === saree._id);
    
    if (existingItemIndex !== -1) {
        // Update quantity if item exists
        existingCart[existingItemIndex].quantity += quantity;
    } else {
        // Add new item with quantity
        const cartItem = {
            _id: saree._id,
            title: saree.title,
            price: saree.price,
            image: saree.image,
            mainColor: saree.mainColor,
            fabric: saree.fabric,
            quantity: quantity
        };
        existingCart.push(cartItem);
    }
    
    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(existingCart));
    alert(`Added ${quantity} ${saree.title} to cart`);
    setQuantity(1);
  };

  const handleBuyNow = (saree) => {
    handleAddToCart(saree);
    navigate('/cart');
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

  return (
    <div className="customer-page">
      {/* Use the CustomNavbar component */}
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

          .saree-card {
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            height: 100%;
            display: flex;
            flex-direction: column;
          }

          .saree-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
          }

          .button-container {
            display: flex;
            flex-direction: column;
            gap: 10px;
            margin-top: auto;
          }

          .view-details-btn {
            background-color: #4F032A;
            border-color: #4F032A;
            color: white;
            width: 100%;
            padding: 8px 15px;
            transition: all 0.3s ease;
          }

          .view-details-btn:hover {
            background-color: #6B0B3D;
            border-color: #6B0B3D;
            transform: translateY(-2px);
          }

          .add-to-cart-btn {
            background-color: #FFD700;
            border-color: #FFD700;
            color: #000;
            width: 100%;
            padding: 8px 15px;
            font-weight: 500;
            transition: all 0.3s ease;
          }

          .add-to-cart-btn:hover {
            background-color: #FF8C00;
            border-color: #FF8C00;
            color: #000;
            transform: translateY(-2px);
          }

          .add-to-cart-btn:disabled {
            background-color: #ccc;
            border-color: #ccc;
            color: #666;
            cursor: not-allowed;
          }

          .saree-card .card-body {
            display: flex;
            flex-direction: column;
            height: 100%;
            padding: 1.25rem;
          }

          .saree-title {
            font-size: 1.1rem;
            font-weight: 600;
            margin-bottom: 0.5rem;
            color: #333;
          }

          .saree-price {
            font-size: 1.2rem;
            font-weight: bold;
            color: #4F032A;
            margin-bottom: 0.5rem;
          }

          .saree-color {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 1rem;
          }

          .color-dot {
            display: inline-block;
            width: 15px;
            height: 15px;
            border-radius: 50%;
            border: 1px solid #ddd;
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
                      <div className="saree-color mb-2">
                        <span>Color:</span>
                        <span className="color-dot" style={{ backgroundColor: saree.color }}></span>
                        <span>{saree.mainColor}</span>
                      </div>
                      <div className="button-container">
                        <Button 
                          className="view-details-btn mb-2"
                          onClick={() => handleViewDetails(saree)}
                        >
                          View Details
                        </Button>
                        <Button 
                          className="add-to-cart-btn"
                          variant="primary" 
                          onClick={() => handleAddToCart(saree)}
                          disabled={saree.stockAvailability === 'Out of Stock'}
                        >
                          <i className="fas fa-shopping-cart me-2"></i>
                          Add to Cart
                        </Button>
                      </div>
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
                      <div className="saree-color mb-2">
                        <span>Color:</span>
                        <span className="color-dot" style={{ backgroundColor: saree.color }}></span>
                        <span>{saree.mainColor}</span>
                      </div>
                      <div className="button-container">
                        <Button 
                          className="view-details-btn mb-2"
                          onClick={() => handleViewDetails(saree)}
                        >
                          View Details
                        </Button>
                        <Button 
                          className="add-to-cart-btn"
                          variant="primary" 
                          onClick={() => handleAddToCart(saree)}
                          disabled={saree.stockAvailability === 'Out of Stock'}
                        >
                          <i className="fas fa-shopping-cart me-2"></i>
                          Add to Cart
                        </Button>
                      </div>
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
                      <div className="saree-color mb-2">
                        <span>Color:</span>
                        <span className="color-dot" style={{ backgroundColor: saree.color }}></span>
                        <span>{saree.mainColor}</span>
                      </div>
                      <div className="button-container">
                        <Button 
                          className="view-details-btn mb-2"
                          onClick={() => handleViewDetails(saree)}
                        >
                          View Details
                        </Button>
                        <Button 
                          className="add-to-cart-btn"
                          variant="primary" 
                          onClick={() => handleAddToCart(saree)}
                          disabled={saree.stockAvailability === 'Out of Stock'}
                        >
                          <i className="fas fa-shopping-cart me-2"></i>
                          Add to Cart
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              );
            })}
          </Row>
        </Container>
      )}
    </div>
  );
}

export default CustomerPage;