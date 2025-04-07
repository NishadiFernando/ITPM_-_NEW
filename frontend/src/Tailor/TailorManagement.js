import React, { useState, useEffect } from 'react';
import { Table, Button, Badge, Modal, Form, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import './TailorManagement.css';

const TailorManagement = () => {
  const [tailors, setTailors] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTailor, setSelectedTailor] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    specialization: [],
    profileImage: null,
    status: 'Active'
  });

  useEffect(() => {
    fetchTailors();
  }, []);

  const fetchTailors = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/tailors');
      setTailors(response.data);
    } catch (error) {
      console.error('Error fetching tailors:', error);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSpecializationChange = (specialization) => {
    setFormData(prev => {
      const updatedSpecializations = prev.specialization.includes(specialization)
        ? prev.specialization.filter(s => s !== specialization)
        : [...prev.specialization, specialization];
      return {
        ...prev,
        specialization: updatedSpecializations
      };
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          profileImage: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Form data before submission:', formData); // Debug log
      
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('phone', formData.phone);
      formDataToSend.append('address', formData.address);
      formDataToSend.append('status', formData.status);
      formDataToSend.append('specialization', JSON.stringify(formData.specialization));

      // Handle file upload
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput && fileInput.files[0]) {
        formDataToSend.append('profileImage', fileInput.files[0]);
      }

      let response;
      if (selectedTailor) {
        // Update existing tailor
        response = await axios.put(
          `http://localhost:5000/api/tailors/${selectedTailor._id}`, 
          formDataToSend,
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
        );
      } else {
        // Create new tailor
        response = await axios.post(
          'http://localhost:5000/api/tailors', 
          formDataToSend,
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
        );
      }

      console.log('Server response:', response.data); // Debug log

      if (response.data) {
        await fetchTailors(); // Refresh the tailors list
        handleCloseModal();
        alert(selectedTailor ? 'Tailor updated successfully!' : 'Tailor added successfully!');
      }
    } catch (error) {
      console.error('Error saving tailor:', error);
      alert(error.response?.data?.message || 'Failed to save tailor. Please try again.');
    }
  };

  const handleEdit = (tailor) => {
    setSelectedTailor(tailor);
    setFormData({
      name: tailor.name,
      email: tailor.email,
      phone: tailor.phone,
      address: tailor.address,
      specialization: tailor.specialization,
      profileImage: tailor.profileImage,
      status: tailor.status
    });
    setShowEditModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this tailor?')) {
      try {
        await axios.delete(`http://localhost:5000/api/tailors/${id}`);
        fetchTailors();
      } catch (error) {
        console.error('Error deleting tailor:', error);
        alert('Failed to delete tailor. Please try again.');
      }
    }
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setSelectedTailor(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: '',
      specialization: [],
      profileImage: null,
      status: 'Active'
    });
  };

  const renderProfileImage = (image, name) => {
    if (image) {
      // Prepend the backend URL to the image path
      const imageUrl = `http://localhost:5000${image}`;
      return <img src={imageUrl} alt={name} className="profile-image" />;
    }
    return (
      <div className="profile-initial">
        {name.charAt(0).toUpperCase()}
      </div>
    );
  };

  return (
    <div className="tailor-management">
      <div className="header">
        <h2>Tailor Management</h2>
        <Button variant="primary" onClick={() => setShowAddModal(true)} className="add-button">
          + Add New Tailor
        </Button>
      </div>

      <Table hover className="tailor-table">
        <thead>
          <tr>
            <th>Profile</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Address</th>
            <th>Specialization</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tailors.map((tailor) => (
            <tr key={tailor._id}>
              <td>{renderProfileImage(tailor.profileImage, tailor.name)}</td>
              <td>{tailor.name}</td>
              <td>{tailor.email}</td>
              <td>{tailor.phone}</td>
              <td style={{ maxWidth: '200px', whiteSpace: 'pre-wrap' }}>{tailor.address}</td>
              <td>
                {tailor.specialization.map((spec) => (
                  <Badge key={spec} className="specialization-badge">
                    {spec}
                  </Badge>
                ))}
              </td>
              <td>
                <Badge className={`status-badge ${tailor.status.toLowerCase()}`}>
                  {tailor.status}
                </Badge>
              </td>
              <td>
                <Button variant="link" onClick={() => handleEdit(tailor)} className="action-button">
                  👁️
                </Button>
                <Button variant="link" onClick={() => handleEdit(tailor)} className="action-button">
                  ✏️
                </Button>
                <Button variant="link" onClick={() => handleDelete(tailor._id)} className="action-button">
                  🗑️
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showAddModal || showEditModal} onHide={handleCloseModal} size="lg">
        <Form onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>{selectedTailor ? 'Edit Tailor' : 'Add New Tailor'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Phone</Form.Label>
                  <Form.Control
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Status</Form.Label>
                  <Form.Select
                    value={formData.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Address</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                required
                placeholder="Enter complete address"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Profile Image</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
              {formData.profileImage && (
                <div className="mt-2">
                  <img
                    src={formData.profileImage.startsWith('data:') 
                      ? formData.profileImage 
                      : `http://localhost:5000${formData.profileImage}`}
                    alt="Preview"
                    style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '50%' }}
                  />
                </div>
              )}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Specialization</Form.Label>
              <div className="specialization-checkboxes">
                {['Lehenga', 'Saree', 'Blouse', 'Frock', 'Bags', 'Home Decor'].map((spec) => (
                  <Form.Check
                    key={spec}
                    type="checkbox"
                    label={spec}
                    checked={formData.specialization.includes(spec)}
                    onChange={() => handleSpecializationChange(spec)}
                    className="specialization-checkbox"
                  />
                ))}
              </div>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              {selectedTailor ? 'Update' : 'Add'} Tailor
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default TailorManagement; 