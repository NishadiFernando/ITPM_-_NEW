import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function Footer() {
    return (
        <footer style={{
            backgroundColor: '#4F032A',
            color: 'white',
            padding: '3rem 0 2rem 0',
            marginTop: '2rem'
        }}>
            <Container>
                <Row>
                    <Col md={4} className="mb-4">
                        <h5 style={{ fontWeight: 'bold', marginBottom: '1.5rem' }}>Punarvasthra</h5>
                        <p style={{ fontSize: '0.9rem' }}>
                            Reviving tradition through sustainable fashion.
                            Your destination for pre-loved sarees and conscious fashion choices.
                        </p>
                    </Col>
                    <Col md={3} className="mb-4">
                        <h5 style={{ fontWeight: 'bold', marginBottom: '1.5rem' }}>Quick Links</h5>
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            <li className="mb-2"><Link to="/sareehome" style={{ color: 'white', textDecoration: 'none' }}>Home</Link></li>
                            <li className="mb-2"><Link to="/about" style={{ color: 'white', textDecoration: 'none' }}>About Us</Link></li>
                            <li className="mb-2"><Link to="/customization" style={{ color: 'white', textDecoration: 'none' }}>Customization</Link></li>
                            <li className="mb-2"><Link to="/flash-sale" style={{ color: 'white', textDecoration: 'none' }}>Flash Sale</Link></li>
                        </ul>
                    </Col>
                    <Col md={3} className="mb-4">
                        <h5 style={{ fontWeight: 'bold', marginBottom: '1.5rem' }}>Contact Us</h5>
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            <li className="mb-2">📧 info@punarvasthra.com</li>
                            <li className="mb-2">📞 +94 11 234 5678</li>
                            <li className="mb-2">📍 Colombo, Sri Lanka</li>
                        </ul>
                    </Col>
                    <Col md={2} className="mb-4">
                        <h5 style={{ fontWeight: 'bold', marginBottom: '1.5rem' }}>Follow Us</h5>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <a href="#" style={{ color: 'white', fontSize: '1.5rem' }}>📱</a>
                            <a href="#" style={{ color: 'white', fontSize: '1.5rem' }}>💻</a>
                            <a href="#" style={{ color: 'white', fontSize: '1.5rem' }}>📸</a>
                        </div>
                    </Col>
                </Row>
                <hr style={{ borderColor: 'rgba(255,255,255,0.1)', margin: '2rem 0' }} />
                <div style={{ textAlign: 'center', fontSize: '0.9rem' }}>
                    <p>&copy; {new Date().getFullYear()} Punarvasthra. All rights reserved.</p>
                </div>
            </Container>
        </footer>
    );
}

export default Footer;