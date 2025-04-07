import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import './AboutUs.css';
import CustomNavbar from './Navbar'; // Import the new Navbar component

// Local images from public folder
const images = {
    heroBackground: '/images/hero-bg.jpg',
    impactBackground: '/images/impact-bg.jpg',
    sustainableFashion: '/images/sustainable-fashion.jpg',
    community: '/images/community.jpg'
};

function AboutUs() {
    return (
        <div className="about-us-page">
            <CustomNavbar />
            {/* Hero Section */}
            <div className="hero-section" style={{
                background: `linear-gradient(rgba(79, 3, 42, 0.9), rgba(79, 3, 42, 0.7)),
                            url(${images.heroBackground}) center/cover no-repeat`
            }}>
                <h1 className="fade-in">Welcome to Punarvasthra</h1>
                <p className="slide-up">Reviving Tradition, Sustaining Fashion</p>
            </div>

            {/* Mission Section */}
            <Container className="section mission-section">
                <Row className="align-items-center">
                    <Col md={6} className="fade-in">
                        <h2>Our Mission</h2>
                        <p>At Punarvasthra, we're revolutionizing the way we think about traditional fashion. Our platform focuses on reducing textile waste by creating a sustainable ecosystem for sarees - giving them a second life and preserving their timeless beauty.</p>
                    </Col>
                    <Col md={6} className="fade-in">
                        <div className="image-container">
                            <img src={images.sustainableFashion} alt="Sustainable Fashion" className="rounded-image" />
                        </div>
                    </Col>
                </Row>
            </Container>

            {/* What We Do Section */}
            <Container className="section what-we-do-section">
                <h2 className="text-center mb-5 fade-in">What We Do</h2>
                <Row>
                    <Col md={3} className="service-card slide-up">
                        <div className="service-icon">🔄</div>
                        <h3>Buy & Sell</h3>
                        <p>Connect with sellers and buyers to give pre-loved sarees a new home</p>
                    </Col>
                    <Col md={3} className="service-card slide-up">
                        <div className="service-icon">↔️</div>
                        <h3>Exchange</h3>
                        <p>Swap your sarees with other fashion enthusiasts</p>
                    </Col>
                    <Col md={3} className="service-card slide-up">
                        <div className="service-icon">✨</div>
                        <h3>Upcycle</h3>
                        <p>Transform old sarees into stunning new fashion pieces</p>
                    </Col>
                    <Col md={3} className="service-card slide-up">
                        <div className="service-icon">♻️</div>
                        <h3>Sustain</h3>
                        <p>Contribute to reducing fashion waste and environmental impact</p>
                    </Col>
                </Row>
            </Container>

            {/* Impact Section */}
            <div className="impact-section" style={{
                background: `linear-gradient(rgba(79, 3, 42, 0.95), rgba(79, 3, 42, 0.95)),
                            url(${images.impactBackground}) center/cover no-repeat`
            }}>
                <Container>
                    <h2 className="text-center mb-5 fade-in">Our Impact</h2>
                    <Row className="impact-stats">
                        <Col md={4} className="stat-card zoom-in">
                            <div className="stat-number">1000+</div>
                            <div className="stat-label">Sarees Recycled</div>
                        </Col>
                        <Col md={4} className="stat-card zoom-in">
                            <div className="stat-number">500+</div>
                            <div className="stat-label">Happy Customers</div>
                        </Col>
                        <Col md={4} className="stat-card zoom-in">
                            <div className="stat-number">200+</div>
                            <div className="stat-label">Upcycled Designs</div>
                        </Col>
                    </Row>
                </Container>
            </div>

            {/* Sustainability Goals */}
            <Container className="section sustainability-section">
                <h2 className="text-center mb-5 fade-in">Our Sustainability Goals</h2>
                <Row>
                    <Col md={4} className="goal-card slide-up">
                        <div className="goal-icon">🌱</div>
                        <h3>Reduce Waste</h3>
                        <p>Minimize textile waste by promoting reuse and recycling</p>
                    </Col>
                    <Col md={4} className="goal-card slide-up">
                        <div className="goal-icon">👗</div>
                        <h3>Preserve Tradition</h3>
                        <p>Keep traditional saree craftsmanship alive</p>
                    </Col>
                    <Col md={4} className="goal-card slide-up">
                        <div className="goal-icon">🤝</div>
                        <h3>Empower Community</h3>
                        <p>Create opportunities for artisans and fashion enthusiasts</p>
                    </Col>
                </Row>
            </Container>

            {/* Join Us Section */}
            <div className="join-us-section">
                <Container>
                    <Row className="align-items-center">
                        <Col md={6} className="fade-in">
                            <h2 className="mb-4" style={{ color: '#4F032A' }}>Join Our Movement</h2>
                            <p className="lead">Be part of the sustainable fashion revolution. Whether you're looking to buy, sell, or transform sarees, Punarvasthra is your platform for conscious fashion choices.</p>
                        </Col>
                        <Col md={6} className="fade-in">
                            <div className="image-container" style={{ 
                                maxHeight: '400px',
                                overflow: 'hidden',
                                borderRadius: '10px',
                                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
                            }}>
                                <img 
                                    src="/community.jpg" 
                                    alt="Join Our Community" 
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover'
                                    }}
                                />
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
        </div>
    );
}

export default AboutUs; 