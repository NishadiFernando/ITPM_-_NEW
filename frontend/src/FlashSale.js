import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './App.css';

function FlashSale() {
    const [saleSarees, setSaleSarees] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('http://localhost:5000/api/sarees')
            .then(res => {
                // Filter sarees where occasion is 'Sale'
                const saleItems = res.data.filter(saree => saree.occasion === 'Sale');
                setSaleSarees(saleItems);
            })
            .catch(err => console.log(err));
    }, []);

    const handleViewDetails = (saree) => {
        // Store the saree details in sessionStorage
        sessionStorage.setItem('selectedSaree', JSON.stringify(saree));
        navigate('/');
    };

    return (
        <Container className="mt-5">
            <div className="flash-sale-header" style={{
                textAlign: 'center',
                marginBottom: '40px',
                animation: 'glow 2s ease-in-out infinite alternate'
            }}>
                <h1 style={{
                    color: '#4F032A',
                    fontFamily: 'Playfair Display, serif',
                    fontSize: '3rem',
                    marginBottom: '20px'
                }}>Flash Sale</h1>
                <p style={{
                    color: '#666',
                    fontSize: '1.2rem',
                    maxWidth: '800px',
                    margin: '0 auto'
                }}>Discover amazing deals on our exclusive collection of sarees!</p>
            </div>

            {saleSarees.length > 0 ? (
                <Row>
                    {saleSarees.map(saree => (
                        <Col md={3} key={saree._id} className="mb-4">
                            <Card className="saree-card">
                                <div style={{ position: 'relative' }}>
                                    <Card.Img
                                        variant="top"
                                        src={`http://localhost:5000${saree.image}`}
                                        alt={saree.title}
                                        className="saree-image"
                                    />
                                    <div className="sale-badge">SALE</div>
                                </div>
                                <Card.Body>
                                    <Card.Title className="saree-title">{saree.title}</Card.Title>
                                    <div className="saree-price-container">
                                        <span className="original-price">LKR {saree.price}</span>
                                        <span className="sale-price">LKR {saree.salePrice}</span>
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
            ) : (
                <div className="text-center mt-5">
                    <h3 style={{ color: '#666' }}>No sale items available at the moment.</h3>
                    <p>Check back later for exciting deals!</p>
                </div>
            )}
        </Container>
    );
}

export default FlashSale; 