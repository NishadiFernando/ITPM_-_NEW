import React, { useState, useEffect, useRef } from 'react';
import { Table, Button, Badge, Modal, Form, Row, Col, InputGroup } from 'react-bootstrap';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const CustomizationRequests = () => {
  const [requests, setRequests] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [editedRequest, setEditedRequest] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchBy, setSearchBy] = useState('orderId');
  const [tailors, setTailors] = useState([]);
  const tableRef = useRef(null);

  const styles = {
    table: {
      backgroundColor: 'white',
      borderRadius: '10px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    },
    header: {
      backgroundColor: '#4F032A',
      color: 'white',
    },
    actionButton: {
      marginRight: '10px',
      padding: '5px 10px',
      fontSize: '14px',
    },
    badge: {
      padding: '8px 12px',
      borderRadius: '15px',
      fontWeight: '500',
    },
    viewButton: {
      backgroundColor: '#4F032A',
      border: 'none',
      marginRight: '5px',
    },
    editButton: {
      backgroundColor: '#FFA500',
      border: 'none',
      marginRight: '5px',
    },
    deleteButton: {
      backgroundColor: '#DC3545',
      border: 'none',
    },
    modalLabel: {
      fontWeight: 'bold',
      marginBottom: '5px',
    },
    modalSection: {
      marginBottom: '20px',
    },
    modalTitle: {
      color: '#4F032A',
      marginBottom: '15px',
    },
    searchContainer: {
      marginBottom: '20px',
    },
    searchSelect: {
      width: 'auto',
      backgroundColor: '#4F032A',
      color: 'white',
      border: 'none',
    },
    reportButton: {
      backgroundColor: '#4F032A',
      color: 'white',
      border: 'none',
      padding: '8px 16px',
      borderRadius: '5px',
      marginBottom: '20px',
      marginLeft: '10px',
    },
    headerContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px',
    }
  };

  useEffect(() => {
    fetchRequests();
    fetchTailors();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/customization-requests');
      setRequests(response.data);
    } catch (error) {
      console.error('Error fetching requests:', error);
    }
  };

  const fetchTailors = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/tailors/active');
      setTailors(response.data);
    } catch (error) {
      console.error('Error fetching tailors:', error);
    }
  };

  const handleView = (request) => {
    setSelectedRequest(request);
    setEditedRequest(null);
    setShowEditModal(true);
  };

  const handleEdit = (request) => {
    setSelectedRequest(request);
    setEditedRequest({ ...request });
    setShowEditModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this request?')) {
      try {
        console.log('Deleting request:', id);
        const response = await axios.delete(`http://localhost:5000/api/customization-requests/${id}`);
        
        if (response.status === 200) {
          console.log('Delete successful');
          alert('Request deleted successfully!');
          fetchRequests(); // Refresh the list
        }
      } catch (error) {
        console.error('Error deleting request:', error);
        alert(error.response?.data?.message || 'Failed to delete request. Please try again.');
      }
    }
  };

  const handleUpdate = async () => {
    try {
      console.log('Updating request:', selectedRequest._id);
      const formData = new FormData();

      // Append basic fields
      const basicFields = [
        'name', 'email', 'phone', 'address', 'productType', 
        'material', 'colorDescription', 'specialNotes', 'tailor', 'status'
      ];
      
      basicFields.forEach(field => {
        if (editedRequest[field] !== undefined) {
          formData.append(field, editedRequest[field]);
        }
      });

      // Handle measurements
      if (editedRequest.measurements) {
        formData.append('measurements', JSON.stringify(editedRequest.measurements));
      }

      // Handle file uploads
      if (editedRequest.newImages && editedRequest.newImages.length > 0) {
        for (let i = 0; i < editedRequest.newImages.length; i++) {
          formData.append('images', editedRequest.newImages[i]);
        }
      }

      // Handle boolean fields
      if (editedRequest.isWebsiteItem !== undefined) {
        formData.append('isWebsiteItem', editedRequest.isWebsiteItem.toString());
      }
      if (editedRequest.itemId !== undefined) {
        formData.append('itemId', editedRequest.itemId);
      }

      // Log the form data for debugging
      for (let pair of formData.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
      }

      const response = await axios.put(
        `http://localhost:5000/api/customization-requests/${selectedRequest._id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.status === 200) {
        console.log('Update successful:', response.data);
        setShowEditModal(false);
        fetchRequests(); // Refresh the list
        alert('Request updated successfully!');
      }
    } catch (error) {
      console.error('Error updating request:', error);
      alert(error.response?.data?.message || 'Failed to update request. Please try again.');
    }
  };

  const handleInputChange = (field, value) => {
    setEditedRequest(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleMeasurementChange = (field, value) => {
    setEditedRequest(prev => ({
      ...prev,
      measurements: {
        ...prev.measurements,
        [field]: value
      }
    }));
  };

  const handleFileChange = (e) => {
    setEditedRequest(prev => ({
      ...prev,
      newImages: e.target.files
    }));
  };

  const getStatusBadge = (status) => {
    const statusStyles = {
      pending: { backgroundColor: '#FFA500', color: 'white' },
      in_progress: { backgroundColor: '#4F032A', color: 'white' },
      completed: { backgroundColor: '#28A745', color: 'white' },
      cancelled: { backgroundColor: '#DC3545', color: 'white' },
    };

    return (
      <Badge style={{ ...styles.badge, ...statusStyles[status.toLowerCase()] }}>
        {status.replace('_', ' ').toUpperCase()}
      </Badge>
    );
  };

  const getTailorName = (tailorId) => {
    const tailor = tailors.find(t => t._id === tailorId);
    return tailor ? tailor.name : 'Not Assigned';
  };

  const filteredRequests = requests.filter(request => {
    const query = searchQuery.toLowerCase();
    switch (searchBy) {
      case 'orderId':
        return request._id.toLowerCase().includes(query);
      case 'customerName':
        return request.name.toLowerCase().includes(query);
      case 'productType':
        return request.productType.toLowerCase().includes(query);
      default:
        return true;
    }
  });

  const generatePDF = () => {
    const doc = new jsPDF();
    
    doc.autoTable({
      head: [['Order ID', 'Customer', 'Product Type', 'Status', 'Tailor']],
      body: requests.map(request => [
        request._id,
        request.name,
        request.productType,
        request.status,
        request.tailor
      ]),
      startY: 20,
      styles: { fontSize: 10, cellPadding: 3 },
      headStyles: { fillColor: [79, 3, 42] }
    });

    doc.save('customization-requests.pdf');
  };

  return (
    <div>
      <div style={styles.headerContainer}>
        <h2 style={{ color: '#4F032A' }}>Customization Requests</h2>
        <Button 
          style={styles.reportButton}
          onClick={generatePDF}
        >
          📊 Download Report
        </Button>
      </div>
      
      {/* Search Section */}
      <div style={styles.searchContainer}>
        <InputGroup>
          <Form.Select 
            style={styles.searchSelect}
            value={searchBy}
            onChange={(e) => setSearchBy(e.target.value)}
          >
            <option value="orderId">Order ID</option>
            <option value="customerName">Customer Name</option>
            <option value="productType">Product Type</option>
          </Form.Select>
          <Form.Control
            placeholder={`Search by ${searchBy === 'orderId' ? 'Order ID' : 
              searchBy === 'customerName' ? 'Customer Name' : 'Product Type'}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </InputGroup>
      </div>

      <Table hover style={styles.table} ref={tableRef}>
        <thead>
          <tr style={styles.header}>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Product Type</th>
            <th>Tailor</th>
            <th>Status</th>
            <th>Created At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredRequests.map((request) => (
            <tr key={request._id}>
              <td>{request._id?.substring(0, 8)}</td>
              <td>
                {request.name}<br />
                <small>{request.email}</small>
              </td>
              <td>{request.productType}</td>
              <td>{getTailorName(request.tailor)}</td>
              <td>{getStatusBadge(request.status)}</td>
              <td>{new Date(request.createdAt).toLocaleDateString()}</td>
              <td>
                <Button 
                  style={styles.viewButton}
                  onClick={() => handleView(request)}
                  title="View Details"
                >
                  👁️
                </Button>
                <Button 
                  style={styles.editButton}
                  onClick={() => handleEdit(request)}
                  title="Edit Request"
                >
                  ✏️
                </Button>
                <Button 
                  style={styles.deleteButton}
                  onClick={() => handleDelete(request._id)}
                  title="Delete Request"
                >
                  🗑️
                </Button>
              </td>
            </tr>
          ))}
          {filteredRequests.length === 0 && (
            <tr>
              <td colSpan="7" className="text-center py-4">
                No requests found matching your search criteria.
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {editedRequest ? 'Edit Request' : 'View Request'} - {selectedRequest?._id.substring(0, 8)}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {(selectedRequest && (editedRequest || selectedRequest)) && (
            <div>
              <h5 style={styles.modalTitle}>Customer Information</h5>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label style={styles.modalLabel}>Name</Form.Label>
                    <Form.Control
                      type="text"
                      value={editedRequest ? editedRequest.name : selectedRequest.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      disabled={!editedRequest}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label style={styles.modalLabel}>Email</Form.Label>
                    <Form.Control
                      type="email"
                      value={editedRequest ? editedRequest.email : selectedRequest.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      disabled={!editedRequest}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label style={styles.modalLabel}>Phone</Form.Label>
                    <Form.Control
                      type="tel"
                      value={editedRequest ? editedRequest.phone : selectedRequest.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      disabled={!editedRequest}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label style={styles.modalLabel}>Status</Form.Label>
                    <Form.Select
                      value={editedRequest ? editedRequest.status : selectedRequest.status}
                      onChange={(e) => handleInputChange('status', e.target.value)}
                      disabled={!editedRequest}
                    >
                      <option value="pending">PENDING</option>
                      <option value="in_progress">IN PROGRESS</option>
                      <option value="completed">COMPLETED</option>
                      <option value="cancelled">CANCELLED</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label style={styles.modalLabel}>Address</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={editedRequest ? editedRequest.address : selectedRequest.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  disabled={!editedRequest}
                />
              </Form.Group>

              <h5 style={styles.modalTitle}>Product Details</h5>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label style={styles.modalLabel}>Product Type</Form.Label>
                    <Form.Control
                      type="text"
                      value={editedRequest ? editedRequest.productType : selectedRequest.productType}
                      disabled
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label style={styles.modalLabel}>Material</Form.Label>
                    <Form.Select
                      value={editedRequest ? editedRequest.material : selectedRequest.material}
                      onChange={(e) => handleInputChange('material', e.target.value)}
                      disabled={!editedRequest}
                    >
                      <option value="Silk">Silk</option>
                      <option value="Cotton">Cotton</option>
                      <option value="Georgette">Georgette</option>
                      <option value="Chiffon">Chiffon</option>
                      <option value="Crepe">Crepe</option>
                      <option value="Linen">Linen</option>
                      <option value="Wool">Wool</option>
                      <option value="Polyester">Polyester</option>
                      <option value="Canvas">Canvas</option>
                      <option value="Denim">Denim</option>
                      <option value="Other">Other</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label style={styles.modalLabel}>Color Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  value={editedRequest ? editedRequest.colorDescription : selectedRequest.colorDescription}
                  onChange={(e) => handleInputChange('colorDescription', e.target.value)}
                  disabled={!editedRequest}
                />
              </Form.Group>

              <h5 style={styles.modalTitle}>Images</h5>
              <Form.Group className="mb-3">
                <Form.Label style={styles.modalLabel}>Current Images</Form.Label>
                <div className="d-flex flex-wrap gap-2 mb-3">
                  {selectedRequest.images && selectedRequest.images.map((image, index) => (
                    <img 
                      key={index}
                      src={`http://localhost:5000${image}`}
                      alt={`Request ${index + 1}`}
                      style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                    />
                  ))}
                </div>
                {editedRequest && (
                  <>
                    <Form.Label style={styles.modalLabel}>Add New Images</Form.Label>
                    <Form.Control
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </>
                )}
              </Form.Group>

              <h5 style={styles.modalTitle}>Measurements</h5>
              {selectedRequest.measurements && Object.entries(selectedRequest.measurements).map(([key, value]) => (
                <Row key={key}>
                  <Col md={12}>
                    <Form.Group className="mb-3">
                      <Form.Label style={styles.modalLabel}>{key}</Form.Label>
                      <Form.Control
                        type="text"
                        value={editedRequest ? editedRequest.measurements[key] : value}
                        onChange={(e) => handleMeasurementChange(key, e.target.value)}
                        disabled={!editedRequest}
                      />
                    </Form.Group>
                  </Col>
                </Row>
              ))}

              <h5 style={styles.modalTitle}>Additional Information</h5>
              <Form.Group className="mb-3">
                <Form.Label style={styles.modalLabel}>Special Notes</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={editedRequest ? editedRequest.specialNotes : selectedRequest.specialNotes}
                  onChange={(e) => handleInputChange('specialNotes', e.target.value)}
                  disabled={!editedRequest}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label style={styles.modalLabel}>Assigned Tailor</Form.Label>
                <Form.Select
                  value={editedRequest ? editedRequest.tailor : selectedRequest.tailor}
                  onChange={(e) => handleInputChange('tailor', e.target.value)}
                  disabled={!editedRequest}
                >
                  <option value="">Select a Tailor</option>
                  {tailors.map((tailor) => (
                    <option key={tailor._id} value={tailor._id}>
                      {tailor.name} - {tailor.specialization.join(', ')}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Close
          </Button>
          {editedRequest && (
            <Button variant="primary" onClick={handleUpdate}>
              Save Changes
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CustomizationRequests;