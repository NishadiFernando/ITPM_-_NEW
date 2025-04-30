import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import axios from 'axios';
import './OurTailors.css';

const OurTailors = () => {
  const [tailors, setTailors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTailors();
  }, []);

  const fetchTailors = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/tailors/active');
      setTailors(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching tailors:', error);
      setError('Failed to load tailors. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const renderProfileImage = (image, name) => {
    if (image) {
      return <img src={`http://localhost:5000${image}`} alt={name} className="tailor-profile-image" />;
    }
    return (
      <div className="tailor-profile-initial">
        {name.charAt(0).toUpperCase()}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading our talented tailors...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-message">{error}</div>
    );
  }

  return (
    <Container fluid className="our-tailoors">
      <h2 className="section-title">Our Expert Tailors</h2>
      <p className="section-description">
        Meet our skilled team of tailors who bring your customization dreams to life.
        Each tailor specializes in different areas to ensure the highest quality craftsmanship.
      </p>

      <Row className="justify-content-center">
        {tailors.map((tailor) => (
          <Col key={tailor._id} lg={3} md={4} sm={6} className="mb-4">
            <Card className="tailor-card text-center">
              <div className="tailor-image-container">
                {renderProfileImage(tailor.profileImage, tailor.name)}
              </div>
              <Card.Body>
                <Card.Title className="tailor-name">{tailor.name}</Card.Title>
                <div className="rating">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star} className="star">★</span>
                  ))}
                </div>
                <div className="specializatio0ns">
                  {tailor.specialization.map((spec) => (
                    <span key={spec} className="specialization-tag">
                      {spec}
                    </span>
                  ))}
                </div>
                <div className="tailor-info">
                  <p>Experience: {tailor.experience || '3'} years</p>
                  <p>Completed Orders: {tailor.completedOrders || '0'}</p>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default OurTailors; 