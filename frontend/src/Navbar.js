import React from 'react';
import { Container, Navbar, Nav } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'; // Assuming the styles are in App.css

const CustomNavbar = ({ onWishlistClick, onSearchClick }) => {
  const location = useLocation();

  // Conditionally render navbar based on the current path
  if (
    location.pathname === '/admin' ||
    location.pathname === '/admin/add' ||
    location.pathname === '/admin/edit'
  ) {
    return null; // Don't render navbar on admin pages
  }

  return (
    <Navbar expand="lg" className="custom-navbar">
      <Container>
        <Navbar.Brand as={Link} to="/" className="custom-logo">
          Punarvasthra
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/" className="nav-link-custom">
              Saree Collection
            </Nav.Link>
            <Nav.Link as={Link} to="/flash-sale" className="nav-link-custom">
              Flash Sale
            </Nav.Link>
            {/* Updated Customization link to use Link and point to /customization */}
            <Nav.Link as={Link} to="/customization" className="nav-link-custom">
              Customization
            </Nav.Link>
            <Nav.Link href="#sell-your-saree" className="nav-link-custom">
              Sell Your Saree
            </Nav.Link>
            <Nav.Link as={Link} to="/about" className="nav-link-custom">
              About Us
            </Nav.Link>
          </Nav>
          <Nav>
            <Nav.Link
              as={Link}
              to="#search"
              className="nav-link-custom"
              onClick={onSearchClick}
            >
              🔍
            </Nav.Link>
            <Nav.Link as={Link} to="#profile" className="nav-link-custom">
              👤
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="#wishlist"
              className="nav-link-custom"
              onClick={onWishlistClick}
            >
              ❤
            </Nav.Link>
            <Nav.Link as={Link} to="#cart" className="nav-link-custom">
              🛒
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default CustomNavbar;