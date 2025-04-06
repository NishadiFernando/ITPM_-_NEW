import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Navbar, Nav, Container, Row, Col, Card, Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import AddSaree from './add_saree';
import AdminEdit from './admin_edit';
import AboutUs from './AboutUs';
import Admin from './Admin';
import FlashSale from './FlashSale';

// Customer Page (View Sarees with All Details)
function CustomerPage({ showWishlist, setShowWishlist, showSearch, setShowSearch }) {
    const [sarees, setSarees] = useState([]);
    const [selectedSaree, setSelectedSaree] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [activeSection, setActiveSection] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
    const [isZoomed, setIsZoomed] = useState(false);
    const [wishlist, setWishlist] = useState([]);
    const [searchMainColor, setSearchMainColor] = useState('');
    const [searchFabric, setSearchFabric] = useState('');
    const [filteredSarees, setFilteredSarees] = useState([]);

    // Initialize wishlist from localStorage
    useEffect(() => {
        const savedWishlist = localStorage.getItem('wishlist');
        if (savedWishlist) {
            setWishlist(JSON.parse(savedWishlist));
        }
    }, []);

    useEffect(() => {
        axios.get('http://localhost:5000/api/sarees')
            .then(res => {
                setSarees(res.data);
                setFilteredSarees(res.data);
            })
            .catch(err => {
                console.log(err);
                setError('Failed to fetch sarees');
            })
            .finally(() => setLoading(false));
    }, []);

    const handleViewDetails = (saree) => {
        setSelectedSaree(saree); // Set the selected saree to display its details
        setQuantity(1); // Reset quantity to 1 when viewing a new saree
        setActiveSection(null); // Hide both sections by default when viewing a new saree
    };

    const handleCloseDetails = () => {
        setSelectedSaree(null); // Close the detailed view
        setQuantity(1); // Reset quantity when closing the detailed view
        setActiveSection(null); // Hide both sections when closing the detailed view
    };

    const handleBuyNow = (saree) => {
        // Placeholder for Buy Now functionality
        alert(`Proceeding to buy: ${saree.title} (Quantity: ${quantity})`);
    };

    const handleAddToCart = (saree) => {
        // Placeholder for Add to Cart functionality
        alert(`Added to cart: ${saree.title} (Quantity: ${quantity})`);
    };

    const handleAddToWishlist = (saree) => {
        const isInWishlist = wishlist.some(item => item._id === saree._id);
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
        const newWishlist = wishlist.filter(item => item._id !== sareeId);
        setWishlist(newWishlist);
        localStorage.setItem('wishlist', JSON.stringify(newWishlist));
    };

    const handleIncrement = () => {
        setQuantity(prev => prev + 1);
    };

    const handleDecrement = () => {
        setQuantity(prev => (prev > 1 ? prev - 1 : 1)); // Prevent quantity from going below 1
    };

    const showDetails = () => {
        setActiveSection('details'); // Show details and hide shipping
    };

    const showShipping = () => {
        setActiveSection('shipping'); // Show shipping and hide details
    };

    const handleSearch = () => {
        // Filter sarees based on search criteria
        const filtered = sarees.filter(saree => {
            const mainColorMatch = !searchMainColor || 
                (saree.mainColor && saree.mainColor.toLowerCase() === searchMainColor.toLowerCase());
            
            const fabricMatch = !searchFabric || 
                (saree.fabric && saree.fabric.toLowerCase() === searchFabric.toLowerCase());

            return mainColorMatch && fabricMatch;
        });

        setFilteredSarees(filtered);
        console.log('Search Results:', filtered); // Debug log
    };

    // Add this effect to initialize filtered sarees when component mounts
    useEffect(() => {
        if (sarees.length > 0) {
            setFilteredSarees(sarees);
        }
    }, [sarees]);

    // Add this effect to handle search results display
    useEffect(() => {
        if (showSearch) {
            handleSearch();
        }
    }, [searchMainColor, searchFabric]);

    const handleSearchClick = () => {
        // Implementation of search click functionality
        console.log('Search click functionality not implemented');
    };

    return (
        <div className="customer-page">
            {/* Import Google Fonts */}
            <link
                href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap"
                rel="stylesheet"
            />

            {/* Add Animations via <style> Tag */}
            <style>
                {`
                    @keyframes popUp {
                        0% {
                            transform: scale(0.5);
                            opacity: 0;
                        }
                        100% {
                            transform: scale(1);
                            opacity: 1;
                        }
                    }

                    @keyframes slideIn {
                        0% {
                            transform: translateX(-100%);
                            opacity: 0;
                        }
                        100% {
                            transform: translateX(0);
                            opacity: 1;
                        }
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

            {/* Detailed View */}
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
                            {/* Saree Details */}
                            <Col md={6}>
                                <h2 className="detailed-view-title">{selectedSaree.title}</h2>
                                {/* Price and Stock Status */}
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

                                {/* Information Section Below Price */}
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

                                {/* Buttons Section */}
                                <div style={{ marginTop: '20px', marginBottom: '20px' }}>
                                    {/* Action Buttons (Buy Now, Add to Cart, Wishlist) */}
                                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                                        {/* Buy Now Button with Sliding Animation and Conditional Shake */}
                                        <Button
                                            className="buy-now-slide"
                                            disabled={selectedSaree.stockAvailability === 'Out of Stock'} // Disable if out of stock
                                            style={{
                                                backgroundColor: selectedSaree.stockAvailability === 'Out of Stock' ? '#ccc' : '#000',
                                                borderColor: selectedSaree.stockAvailability === 'Out of Stock' ? '#ccc' : '#000',
                                                color: selectedSaree.stockAvailability === 'Out of Stock' ? '#666' : '#fff',
                                                padding: '15px 40px',
                                                fontSize: '20px',
                                                marginRight: '10px',
                                                boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                                                opacity: selectedSaree.stockAvailability === 'Out of Stock' ? 0.6 : 1,
                                                animation: selectedSaree.stockAvailability === 'In Stock' ? 'shake 1.5s ease infinite' : 'none', // Apply shake only if in stock
                                            }}
                                            onClick={() => handleBuyNow(selectedSaree)}
                                        >
                                            Buy Now
                                        </Button>

                                        {/* Add to Cart Icon */}
                                        <OverlayTrigger
                                            placement="top"
                                            overlay={<Tooltip>Add to Cart</Tooltip>}
                                        >
                                            <Button
                                                className="large-buy-now-btn"
                                                style={{ padding: '10px 15px', fontSize: '16px' }}
                                                onClick={() => handleAddToCart(selectedSaree)}
                                            >
                                                🛒
                                            </Button>
                                        </OverlayTrigger>

                                        {/* Wishlist Icon */}
                                        <OverlayTrigger
                                            placement="top"
                                            overlay={<Tooltip>Add to Wishlist</Tooltip>}
                                        >
                                            <Button
                                                className="large-buy-now-btn"
                                                style={{ marginLeft: '10px', padding: '10px 15px', fontSize: '16px' }}
                                                onClick={() => handleAddToWishlist(selectedSaree)}
                                            >
                                                ❤️
                                            </Button>
                                        </OverlayTrigger>
                                    </div>

                                    {/* Quantity Selector */}
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

                                    {/* Description and Shipping Buttons */}
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

                                    {/* Conditionally Show Saree Details Below Buttons */}
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

                                    {/* Conditionally Show Shipping and Return Info Below Buttons */}
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

                                {/* Centered Back Arrow */}
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
                    <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        marginBottom: '20px'
                    }}>
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
                                transition: 'background-color 0.3s'
                            }}
                        >
                            Back to Collection
                        </Button>
                    </div>
                    
                    <div style={{ 
                        backgroundColor: '#fff',
                        padding: '20px',
                        borderRadius: '10px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                        marginBottom: '30px'
                    }}>
                        <Row>
                            <Col md={5}>
                                <div style={{ marginBottom: '15px' }}>
                                    <label style={{ 
                                        display: 'block', 
                                        marginBottom: '5px',
                                        color: '#4F032A',
                                        fontWeight: 'bold'
                                    }}>
                                        Search by Main Color
                                    </label>
                                    <select
                                        value={searchMainColor}
                                        onChange={(e) => setSearchMainColor(e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '10px',
                                            border: '1px solid #ddd',
                                            borderRadius: '5px',
                                            fontSize: '16px',
                                            backgroundColor: '#fff'
                                        }}
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
                                    <label style={{ 
                                        display: 'block', 
                                        marginBottom: '5px',
                                        color: '#4F032A',
                                        fontWeight: 'bold'
                                    }}>
                                        Search by Fabric
                                    </label>
                                    <select
                                        value={searchFabric}
                                        onChange={(e) => setSearchFabric(e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '10px',
                                            border: '1px solid #ddd',
                                            borderRadius: '5px',
                                            fontSize: '16px',
                                            backgroundColor: '#fff'
                                        }}
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
                                    style={{
                                        width: '100%',
                                        backgroundColor: '#4F032A',
                                        borderColor: '#4F032A',
                                        padding: '10px',
                                        fontSize: '16px',
                                        marginBottom: '15px'
                                    }}
                                >
                                    Search
                                </Button>
                            </Col>
                        </Row>
                    </div>

                    {/* Display search results */}
                    {filteredSarees.length > 0 ? (
                        <Row>
                            {filteredSarees.map(saree => (
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
                                                <div className="out-of-stock-badge">
                                                    Out of Stock
                                                </div>
                                            )}
                                        </div>
                                        <Card.Body>
                                            <Card.Title className="saree-title">{saree.title}</Card.Title>
                                            <Card.Text className="saree-price">LKR {saree.price}</Card.Text>
                                            <Button
                                                className="view-details-btn"
                                                onClick={() => handleViewDetails(saree)}
                                            >
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
                    <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        marginBottom: '20px'
                    }}>
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
                            {wishlist.map(saree => (
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
                                                style={{
                                                    transition: 'transform 0.3s ease-out',
                                                    cursor: 'zoom-in'
                                                }}
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
                /* Saree List */
                <Container className="mt-5">
                    <Row>
                        {sarees.map(saree => (
                            <Col md={3} key={saree._id} className="mb-4">
                                <Card className="saree-card">
                                    {/* Image with Out of Stock Sticker */}
                                    <div style={{ position: 'relative' }}>
                                        <Card.Img
                                            variant="top"
                                            src={`http://localhost:5000${saree.image}` || 'https://via.placeholder.com/300x400'}
                                            alt={saree.title}
                                            className="saree-image"
                                        />
                                        {saree.stockAvailability === 'Out of Stock' && (
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
                                        {saree.occasion === 'Sale' && saree.stockAvailability !== 'Out of Stock' && (
                                            <div className="sale-badge">SALE</div>
                                        )}
                                    </div>
                                    <Card.Body>
                                        <Card.Title className="saree-title">{saree.title}</Card.Title>
                                        <div className="saree-price-container">
                                            {saree.occasion === 'Sale' && saree.salePrice ? (
                                                <>
                                                    <span className="original-price">LKR {saree.price}</span>
                                                    <span className="sale-price">LKR {saree.salePrice}</span>
                                                </>
                                            ) : (
                                                <span className="sale-price">LKR {saree.price}</span>
                                            )}
                                        </div>
                                        <div className="saree-details">
                                            <p>
                                                <strong>Color:</strong>
                                                <span
                                                    className="color-swatch"
                                                    style={{
                                                        backgroundColor: saree.color || '#ccc',
                                                        display: 'inline-block',
                                                        width: '20px',
                                                        height: '20px',
                                                        marginLeft: '10px',
                                                        verticalAlign: 'middle',
                                                        border: '1px solid #ccc',
                                                    }}
                                                ></span>
                                            </p>
                                        </div>
                                        <Button
                                            className="view-details-btn"
                                            onClick={() => handleViewDetails(saree)}
                                        >
                                            View Details
                                        </Button>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </Container>
            )}
        </div>
    );
}

// Main App Component
function App() {
    const location = useLocation();
    const [showWishlist, setShowWishlist] = useState(false);
    const [showSearch, setShowSearch] = useState(false);

    const handleWishlistClick = (e) => {
        e.preventDefault();
        setShowWishlist(prev => !prev);
        setShowSearch(false); // Close search when opening wishlist
    };

    const handleSearchClick = (e) => {
        e.preventDefault();
        setShowSearch(prev => !prev);
        setShowWishlist(false); // Close wishlist when opening search
    };

    // Reset views when changing routes
    useEffect(() => {
        setShowWishlist(false);
        setShowSearch(false);
    }, [location.pathname]);

    return (
        <div className="App">
            {/* Conditionally render the Navbar only on the customer page */}
            {location.pathname !== '/admin' && 
             location.pathname !== '/admin/add' && 
             location.pathname !== '/admin/edit' && (
                <Navbar expand="lg" className="custom-navbar">
                    <Container>
                        <Navbar.Brand as={Link} to="/" className="custom-logo">
                            Punarvasthra
                        </Navbar.Brand>
                        <Navbar.Toggle aria-controls="basic-navbar-nav" />
                        <Navbar.Collapse id="basic-navbar-nav">
                            <Nav className="me-auto">
                                <Nav.Link as={Link} to="/" className="nav-link-custom">Saree Collection</Nav.Link>
                                <Nav.Link as={Link} to="/flash-sale" className="nav-link-custom">Flash Sale</Nav.Link>
                                <Nav.Link href="#customization" className="nav-link-custom">Customization</Nav.Link>
                                <Nav.Link href="#sell-your-saree" className="nav-link-custom">Sell Your Saree</Nav.Link>
                                <Nav.Link as={Link} to="/about" className="nav-link-custom">About Us</Nav.Link>
                            </Nav>
                            <Nav>
                                <Nav.Link 
                                    href="#search" 
                                    className="nav-link-custom"
                                    onClick={handleSearchClick}
                                >
                                    🔍
                                </Nav.Link>
                                <Nav.Link 
                                    href="#profile" 
                                    className="nav-link-custom"
                                >
                                    👤
                                </Nav.Link>
                                <Nav.Link 
                                    href="#wishlist" 
                                    className="nav-link-custom"
                                    onClick={handleWishlistClick}
                                >
                                    ❤️
                                </Nav.Link>
                                <Nav.Link href="#cart" className="nav-link-custom">🛒</Nav.Link>
                            </Nav>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>
            )}

            {/* Routes */}
            <Routes>
                <Route 
                    path="/" 
                    element={
                        <CustomerPage 
                            showWishlist={showWishlist} 
                            setShowWishlist={setShowWishlist}
                            showSearch={showSearch}
                            setShowSearch={setShowSearch}
                        />
                    } 
                />
                <Route path="/admin" element={<Admin />} />
                <Route path="/admin/add" element={<AddSaree />} />
                <Route path="/admin/edit" element={<AdminEdit />} />
                <Route path="/about" element={<AboutUs />} />
                <Route path="/flash-sale" element={<FlashSale />} />
            </Routes>
        </div>
    );
}

// Wrap App with Router to use useLocation
export default function AppWrapper() {
    return (
        <Router>
            <App />
        </Router>
    );
}