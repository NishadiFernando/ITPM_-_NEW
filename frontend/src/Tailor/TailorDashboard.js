import React, { useState, useEffect } from 'react';
import { Table, Button, Badge, Modal, Form, Row, Col, Card } from 'react-bootstrap';
import axios from 'axios';
import './TailorDashboard.css';

const TailorDashboard = () => {
  const [requests, setRequests] = useState([]);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [tailors, setTailors] = useState([]);

  // Styles
  const styles = {
    container: {
      padding: '20px',
      maxWidth: '1200px',
      margin: '0 auto',
      backgroundColor: '#f8f9fa',
      minHeight: '100vh',
    },
    header: {
      marginBottom: '30px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '20px',
      backgroundColor: 'white',
      borderRadius: '10px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    },
    title: {
      color: '#4F032A',
      fontSize: '28px',
      fontWeight: 'bold',
    },
    filterContainer: {
      marginBottom: '20px',
      display: 'flex',
      gap: '15px',
      alignItems: 'center',
    },
    table: {
      backgroundColor: 'white',
      borderRadius: '10px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
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
      transition: 'all 0.3s ease',
      '&:hover': {
        backgroundColor: '#3a0220',
      },
    },
    updateButton: {
      backgroundColor: '#28a745',
      border: 'none',
      transition: 'all 0.3s ease',
    },
    modalLabel: {
      fontWeight: 'bold',
      marginBottom: '5px',
      color: '#4F032A',
    },
    modalTitle: {
      color: '#4F032A',
      marginBottom: '15px',
      borderBottom: '2px solid #4F032A',
      paddingBottom: '10px',
    },
    imageContainer: {
      display: 'flex',
      gap: '15px',
      flexWrap: 'wrap',
      marginBottom: '20px',
    },
    image: {
      width: '200px',
      height: '200px',
      objectFit: 'cover',
      borderRadius: '10px',
      boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
      transition: 'transform 0.3s ease',
      cursor: 'pointer',
      '&:hover': {
        transform: 'scale(1.05)',
      },
    },
    statusButton: {
      margin: '5px',
      transition: 'all 0.3s ease',
    },
    infoCard: {
      marginBottom: '20px',
      borderRadius: '10px',
      boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
    },
    cardHeader: {
      backgroundColor: '#4F032A',
      color: 'white',
      padding: '10px 15px',
      borderTopLeftRadius: '10px',
      borderTopRightRadius: '10px',
    },
  };

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/customization-requests');
      setRequests(response.data);
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fix the useEffect dependency warning by using useCallback
  const memoizedFetchRequests = React.useCallback(fetchRequests, []);

  useEffect(() => {
    memoizedFetchRequests();
    fetchTailors();
  }, [memoizedFetchRequests]);

  const fetchTailors = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/tailors');
      setTailors(response.data);
    } catch (error) {
      console.error('Error fetching tailors:', error);
    }
  };

  const handleViewRequest = (request) => {
    setSelectedRequest(request);
    setShowViewModal(true);
  };

  const handleUpdateStatus = async (requestId, newStatus) => {
    try {
      await axios.patch(`http://localhost:5000/api/customization-requests/${requestId}/status`, {
        status: newStatus
      });
      memoizedFetchRequests();
      setShowViewModal(false);
      alert(`Request status updated to ${newStatus.replace('_', ' ')}`);
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status. Please try again.');
    }
  };

  const getStatusBadgeColor = (status) => {
    const colors = {
      pending: '#ffc107',
      in_progress: '#4F032A',
      completed: '#28a745',
      cancelled: '#dc3545'
    };
    return colors[status] || '#6c757d';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTailorName = (tailorId) => {
    const tailor = tailors.find(t => t._id === tailorId);
    return tailor ? tailor.name : 'Unknown Tailor';
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>My Assigned Requests</h1>
        <div style={styles.filterContainer}>
          <span style={{ color: '#4F032A', fontWeight: 'bold' }}>Filter by Status:</span>
          <Form.Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ width: '200px' }}
          >
            <option value="all">All Requests</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </Form.Select>
        </div>
      </div>

      {loading ? (
        <div className="text-center p-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <Table responsive hover style={styles.table}>
          <thead className="bg-light">
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Product Type</th>
              <th>Assigned Tailor</th>
              <th>Status</th>
              <th>Created Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request) => (
              <tr key={request._id}>
                <td>{request._id.slice(-6).toUpperCase()}</td>
                <td>{request.name}</td>
                <td>{request.productType}</td>
                <td>{getTailorName(request.tailor)}</td>
                <td>
                  <Badge
                    style={{
                      ...styles.badge,
                      backgroundColor: getStatusBadgeColor(request.status)
                    }}
                  >
                    {request.status.replace('_', ' ').toUpperCase()}
                  </Badge>
                </td>
                <td>{formatDate(request.createdAt)}</td>
                <td>
                  <Button
                    style={styles.viewButton}
                    size="sm"
                    onClick={() => handleViewRequest(request)}
                  >
                    View Details
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <Modal show={showViewModal} onHide={() => setShowViewModal(false)} size="lg">
        <Modal.Header closeButton style={styles.cardHeader}>
          <Modal.Title>Request Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedRequest && (
            <div>
              <Row>
                <Col md={6}>
                  <Card style={styles.infoCard}>
                    <Card.Header style={styles.cardHeader}>
                      <h5 className="mb-0">Customer Information</h5>
                    </Card.Header>
                    <Card.Body>
                      <p><strong>Name:</strong> {selectedRequest.name}</p>
                      <p><strong>Email:</strong> {selectedRequest.email}</p>
                      <p><strong>Phone:</strong> {selectedRequest.phone}</p>
                      <p><strong>Address:</strong> {selectedRequest.address}</p>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={6}>
                  <Card style={styles.infoCard}>
                    <Card.Header style={styles.cardHeader}>
                      <h5 className="mb-0">Product Details</h5>
                    </Card.Header>
                    <Card.Body>
                      <p><strong>Product Type:</strong> {selectedRequest.productType}</p>
                      <p><strong>Material:</strong> {selectedRequest.material}</p>
                      <p><strong>Color Description:</strong> {selectedRequest.colorDescription}</p>
                      <p><strong>Assigned Tailor:</strong> {getTailorName(selectedRequest.tailor)}</p>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              <Card style={styles.infoCard}>
                <Card.Header style={styles.cardHeader}>
                  <h5 className="mb-0">Measurements</h5>
                </Card.Header>
                <Card.Body>
                  <Row>
                    {Object.entries(selectedRequest.measurements).map(([key, value]) => (
                      <Col md={6} key={key}>
                        <p><strong>{key}:</strong> {value}</p>
                      </Col>
                    ))}
                  </Row>
                </Card.Body>
              </Card>

              <Card style={styles.infoCard}>
                <Card.Header style={styles.cardHeader}>
                  <h5 className="mb-0">Special Notes</h5>
                </Card.Header>
                <Card.Body>
                  <p>{selectedRequest.specialNotes || 'No special notes'}</p>
                </Card.Body>
              </Card>

              <Card style={styles.infoCard}>
                <Card.Header style={styles.cardHeader}>
                  <h5 className="mb-0">Images</h5>
                </Card.Header>
                <Card.Body>
                  <div style={styles.imageContainer}>
                    {selectedRequest.images?.map((image, index) => (
                      <img
                        key={index}
                        src={`http://localhost:5000${image}`}
                        alt={`Request ${index + 1}`}
                        style={styles.image}
                        onClick={() => window.open(`http://localhost:5000${image}`, '_blank')}
                      />
                    ))}
                  </div>
                </Card.Body>
              </Card>

              <Card style={styles.infoCard}>
                <Card.Header style={styles.cardHeader}>
                  <h5 className="mb-0">Update Status</h5>
                </Card.Header>
                <Card.Body>
                  <div className="d-flex flex-wrap gap-2">
                    {selectedRequest.status !== 'in_progress' && (
                      <Button
                        variant="info"
                        style={styles.statusButton}
                        onClick={() => handleUpdateStatus(selectedRequest._id, 'in_progress')}
                      >
                        Mark as In Progress
                      </Button>
                    )}
                    {selectedRequest.status !== 'completed' && (
                      <Button
                        variant="success"
                        style={styles.statusButton}
                        onClick={() => handleUpdateStatus(selectedRequest._id, 'completed')}
                      >
                        Mark as Completed
                      </Button>
                    )}
                    {selectedRequest.status !== 'cancelled' && (
                      <Button
                        variant="danger"
                        style={styles.statusButton}
                        onClick={() => handleUpdateStatus(selectedRequest._id, 'cancelled')}
                      >
                        Cancel Request
                      </Button>
                    )}
                  </div>
                </Card.Body>
              </Card>
            </div>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default TailorDashboard;