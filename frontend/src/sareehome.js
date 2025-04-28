import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Link } from 'react-router-dom';
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

  return (
    <div className="customer-page">
      <CustomNavbar
        onWishlistClick={handleWishlistClick}
        onSearchClick={handleSearchClick}
      />
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
    </div>
  );
}

export default CustomerPage;