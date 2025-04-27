import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Container, Row, Col, Button } from 'react-bootstrap';
import './CustomizationForm.css';

const CustomizationForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    material: '',
    colorDescription: '',
    additionalNotes: '',
    selectedTailor: '',
    productType: 'home-decor', // default value
  });
  const [measurements, setMeasurements] = useState({});
  const [tailors, setTailors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const materialOptions = [
    'Cotton',
    'Silk',
    'Linen',
    'Polyester',
    'Wool',
    'Velvet',
    'Other'
  ];

  useEffect(() => {
    fetchTailors();
  }, []);

  const fetchTailors = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/tailors/active');
      setTailors(response.data);
    } catch (error) {
      console.error('Error fetching tailors:', error);
      setError('Failed to load tailors. Please try again later.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const requestData = {
        ...formData,
        measurements,
      };

      await axios.post('http://localhost:5000/api/customization', requestData);
      setSuccess(true);
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        address: '',
        material: '',
        colorDescription: '',
        additionalNotes: '',
        selectedTailor: '',
        productType: 'home-decor',
      });
      setMeasurements({});
    } catch (error) {
      console.error('Error submitting form:', error);
      setError('Failed to submitt customization request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  return (
    <Container className="customization-form-container">
      <h2 className="form-title">Home Decor Customization</h2>
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Name <span className="required">*</span></Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Email <span className="required">*</span></Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Phone <span className="required">*</span></Form.Label>
              <Form.Control
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Material <span className="required">*</span></Form.Label>
              <Form.Select
                name="material"
                value={formData.material}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Material</option>
                {materialOptions.map((material) => (
                  <option key={material} value={material}>
                    {material}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        <Form.Group className="mb-3">
          <Form.Label>Delivery Address <span className="required">*</span></Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Select Tailor <span className="required">*</span></Form.Label>
          <Form.Select
            name="selectedTailor"
            value={formData.selectedTailor}
            onChange={handleInputChange}
            required
          >
            <option value="">Choose a tailor...</option>
            {tailors.map((tailor) => (
              <option key={tailor._id} value={tailor._id}>
                {tailor.name} - {tailor.specialization.join(', ')}
              </option>
            ))}
          </Form.Select>
          <Form.Text className="text-muted">
            Select a tailor based on their specialization for your customization needs
          </Form.Text>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Color & Pattern Description <span className="required">*</span></Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="colorDescription"
            value={formData.colorDescription}
            onChange={handleInputChange}
            placeholder="Please describe the colors and patterns you want in detail..."
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Additional Notes</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="additionalNotes"
            value={formData.additionalNotes}
            onChange={handleInputChange}
            placeholder="Any special requirements or additional information..."
          />
        </Form.Group>

        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">Customization request submitted successfully!</div>}
        
        <Button 
          type="submit" 
          variant="primary" 
          disabled={loading}
          className="submit-button"
        >
          {loading ? 'Submitting...' : 'Submit Request'}
        </Button>
      </Form>
    </Container>
  );
};

export default CustomizationForm; 