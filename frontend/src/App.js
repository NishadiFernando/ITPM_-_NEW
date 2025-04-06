import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Navbar, Nav, Container, Row, Col, Card, Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import CustomerPage from './sareehome';
import AddSaree from './add_saree';
import AdminEdit from './admin_edit';
import AboutUs from './AboutUs';
import Admin from './Admin';
import FlashSale from './FlashSale';
 
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
function AppWrapper() {
    return (
        <Router>
            <App />
        </Router>
    );
}
 
export default AppWrapper;
 