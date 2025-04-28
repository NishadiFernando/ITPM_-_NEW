import React from 'react';
import { Container, Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

const CustomNavbar = ({ onWishlistClick, onSearchClick }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (
    location.pathname === '/admin' ||
    location.pathname === '/admin/add' ||
    location.pathname === '/admin/edit'
  ) {
    return null;
  }

  return (
    <Navbar expand="lg" className="custom-navbar">
      <Container>
        <Navbar.Brand as={Link} to="/home" className="custom-logo">
          Punarvasthra
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/home" className="nav-link-custom">
              Saree Collection
            </Nav.Link>
            <Nav.Link as={Link} to="/flash-sale" className="nav-link-custom">
              Flash Sale
            </Nav.Link>
            <Nav.Link as={Link} to="/tailor-home" className="nav-link-custom">
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
            <Nav.Link onClick={onSearchClick} className="nav-link-custom">
              🔍
            </Nav.Link>
            <NavDropdown 
              title="👤" 
              id="profile-dropdown"
              align="end"
              className="nav-link-custom"
            >
              <NavDropdown.Item onClick={handleLogout}>
                Logout
              </NavDropdown.Item>
            </NavDropdown>
            <Nav.Link onClick={onWishlistClick} className="nav-link-custom">
              ❤
            </Nav.Link>
            <Nav.Link as={Link} to="/cart" className="nav-link-custom">
              🛒
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default CustomNavbar;