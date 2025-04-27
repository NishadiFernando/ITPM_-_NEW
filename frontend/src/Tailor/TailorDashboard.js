import React, { useState, useEffect } from 'react';
import { Table, Badge, Button, Spinner, Modal, Form, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import './TailorDashboard.css';

function TailorDashboard() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showDetails, setShowDetails] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [error, setError] = useState(null);
    const [statusFilter, setStatusFilter] = useState('all');

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await axios.get('http://localhost:5000/api/tailor/requests');
            setRequests(response.data);
        } catch (error) {
            console.error('Error fetching requests:', error);
            setError('Failed to load requests. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleViewDetails = (request) => {
        setSelectedRequest(request);
        setShowDetails(true);
    };

    return (
        <div className="tailor-dashboard">
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
            
            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}
            
            {loading ? (
                <div className="loading">
                    <Spinner animation="border" variant="primary" />
                </div>
            ) : (
                <Table responsive hover>
                    <thead>
                        <tr>
                            <th>Request ID</th>
                            <th>Customer</th>
                            <th>Service</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {requests.map((request) => (
                            <tr key={request._id}>
                                <td>{request.requestId}</td>
                                <td>{request.customerName}</td>
                                <td>{request.serviceType}</td>
                                <td>
                                    <Badge bg={request.status === 'Pending' ? 'warning' : 'success'}>
                                        {request.status}
                                    </Badge>
                                </td>
                                <td>
                                    <Button 
                                        variant="outline-primary" 
                                        size="sm"
                                        onClick={() => handleViewDetails(request)}
                                    >
                                        <i className="fas fa-eye me-1"></i>
                                        View Details
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}

            <Modal show={showDetails} onHide={() => setShowDetails(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Request Details #{selectedRequest?.requestId}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedRequest && (
                        <Form className="request-details">
                            <Row>
                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label htmlFor="customerName">Customer</Form.Label>
                                        <Form.Control
                                            id="customerName"
                                            name="customerName"
                                            type="text"
                                            value={selectedRequest.customerName}
                                            readOnly
                                        />
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label htmlFor="serviceType">Service</Form.Label>
                                        <Form.Control
                                            id="serviceType"
                                            name="serviceType"
                                            type="text"
                                            value={selectedRequest.serviceType}
                                            readOnly
                                        />
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label htmlFor="status">Status</Form.Label>
                                        <Form.Control
                                            id="status"
                                            name="status"
                                            type="text"
                                            value={selectedRequest.status}
                                            readOnly
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label htmlFor="requestId">Request ID</Form.Label>
                                        <Form.Control
                                            id="requestId"
                                            name="requestId"
                                            type="text"
                                            value={selectedRequest.requestId}
                                            readOnly
                                        />
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label htmlFor="createdDate">Date</Form.Label>
                                        <Form.Control
                                            id="createdDate"
                                            name="createdDate"
                                            type="text"
                                            value={new Date(selectedRequest.createdAt).toLocaleDateString()}
                                            readOnly
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                        </Form>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button 
                        variant="secondary" 
                        onClick={() => setShowDetails(false)}
                        id="closeModalBtn"
                        name="closeModalBtn"
                    >
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

const styles = {
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem'
    },
    title: {
        color: '#4F032A',
        margin: 0
    },
    filterContainer: {
        display: 'flex',
        alignItems: 'center',
        gap: '1rem'
    }
};

export default TailorDashboard;