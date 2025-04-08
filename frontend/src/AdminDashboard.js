import React, { useState, useEffect } from 'react';
import { Table, Badge, Button, Spinner, Modal, Form, Card, Row, Col } from 'react-bootstrap';
import { Line, Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import axios from 'axios';
import './AdminDashboard.css';

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend
);

// Order status configurations
const ORDER_STATUSES = {
    PENDING: { value: 'Pending', color: '#ffc107' },
    CONFIRMED: { value: 'Confirmed', color: '#17a2b8' },
    PROCESSING: { value: 'Processing', color: '#007bff' },
    SHIPPED: { value: 'Shipped', color: '#6c757d' },
    DELIVERED: { value: 'Delivered', color: '#28a745' },
    CANCELLED: { value: 'Cancelled', color: '#dc3545' }
};

// Menu items configuration
const MENU_ITEMS = [
    { id: 'dashboard', icon: 'fas fa-chart-line', label: 'Dashboard' },
    { id: 'orders', icon: 'fas fa-shopping-bag', label: 'Orders' },
    { id: 'reports', icon: 'fas fa-chart-bar', label: 'Reports' },
    { id: 'settings', icon: 'fas fa-cog', label: 'Settings' }
];

function AdminDashboard() {
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editedStatus, setEditedStatus] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [showOrderDetails, setShowOrderDetails] = useState(false);
    const [activeMenu, setActiveMenu] = useState('orders');
    const [dashboardStats, setDashboardStats] = useState({
        totalOrders: 0,
        todayOrders: 0,
        totalRevenue: 0,
        pendingOrders: 0
    });

    const calculateDashboardStats = React.useCallback(() => {
        const today = new Date().toDateString();
        const stats = {
            totalOrders: orders.length,
            todayOrders: orders.filter(order =>
                new Date(order.createdAt).toDateString() === today
            ).length,
            totalRevenue: orders.reduce((sum, order) => sum + order.totalAmount, 0),
            pendingOrders: orders.filter(order =>
                order.status === 'Pending' || order.status === 'Processing'
            ).length
        };
        setDashboardStats(stats);
    }, [orders]);

    useEffect(() => {
        const fetchAllData = async () => {
            setLoading(true);
            try {
                await fetchOrders();
                calculateDashboardStats();
            } catch (err) {
                console.error('Error fetching data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchAllData();
    }, [calculateDashboardStats]);

    const fetchOrders = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/orders');
            setOrders(response.data);
        } catch (err) {
            console.error('Failed to fetch orders:', err);
        }
    };

    const handleUpdateStatus = async (orderId, newStatus) => {
        try {
            await axios.patch(`http://localhost:5000/api/orders/${orderId}`, {
                status: newStatus
            });
            fetchOrders();
            setShowEditModal(false);
        } catch (err) {
            console.error('Failed to update status:', err);
        }
    };

    const handleDeleteOrder = async (orderId) => {
        if (window.confirm('Are you sure you want to delete this order?')) {
            try {
                await axios.delete(`http://localhost:5000/api/orders/${orderId}`);
                fetchOrders();
                if (selectedOrder && selectedOrder._id === orderId) {
                    setSelectedOrder(null);
                }
            } catch (err) {
                console.error('Failed to delete order:', err);
            }
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString();
    };

    const filteredOrders = orders.filter(order => {
        const searchLower = searchTerm.toLowerCase();
        return (
            order.orderNumber.toLowerCase().includes(searchLower) ||
            `${order.customer.firstName} ${order.customer.lastName}`.toLowerCase().includes(searchLower)
        );
    });

    const handleViewOrder = (order) => {
        setSelectedOrder(order);
        setShowOrderDetails(true);
    };

    const handleCloseDetails = () => {
        setSelectedOrder(null);
        setShowOrderDetails(false);
    };

    const renderReports = () => (
        <div className="section-container">
            <h4 className="section-title">Reports & Analytics</h4>
            <Row className="mb-4">
                <Col md={6}>
                    <Card className="report-card">
                        <Card.Body>
                            <h5>Sales Overview</h5>
                            <Line
                                data={{
                                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                                    datasets: [{
                                        label: 'Monthly Sales',
                                        data: [12, 19, 3, 5, 2, 3],
                                        borderColor: '#4F032A',
                                        tension: 0.4
                                    }]
                                }}
                                options={{
                                    responsive: true,
                                    plugins: {
                                        legend: { position: 'bottom' }
                                    }
                                }}
                            />
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6}>
                    <Card className="report-card">
                        <Card.Body>
                            <h5>Popular Products</h5>
                            <Bar
                                data={{
                                    labels: ['Product 1', 'Product 2', 'Product 3', 'Product 4', 'Product 5'],
                                    datasets: [{
                                        label: 'Units Sold',
                                        data: [12, 19, 3, 5, 2],
                                        backgroundColor: '#4F032A'
                                    }]
                                }}
                                options={{
                                    responsive: true,
                                    plugins: {
                                        legend: { position: 'bottom' }
                                    }
                                }}
                            />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    );

    return (
        <div className="admin-container">
            <div className="admin-sidebar">
                <div className="sidebar-header">
                    <h3>Order Management</h3>
                </div>
                <div className="sidebar-menu">
                    {MENU_ITEMS.map(item => (
                        <div
                            key={item.id}
                            className={`menu-item ${activeMenu === item.id ? 'active' : ''}`}
                            onClick={() => setActiveMenu(item.id)}
                        >
                            <i className={item.icon}></i>
                            {item.label}
                        </div>
                    ))}
                </div>
            </div>

            <div className="admin-main">
                {activeMenu === 'dashboard' && (
                    <div className="dashboard-overview">
                        <h4 className="section-title">Dashboard Overview</h4>
                        <div className="stats-grid">
                            <Card className="stat-card">
                                <Card.Body>
                                    <div className="stat-icon orders">
                                        <i className="fas fa-shopping-cart"></i>
                                    </div>
                                    <h6>Total Orders</h6>
                                    <h3>{dashboardStats.totalOrders}</h3>
                                </Card.Body>
                            </Card>
                            <Card className="stat-card">
                                <Card.Body>
                                    <div className="stat-icon revenue">
                                        <i className="fas fa-dollar-sign"></i>
                                    </div>
                                    <h6>Total Revenue</h6>
                                    <h3>LKR {dashboardStats.totalRevenue.toFixed(2)}</h3>
                                </Card.Body>
                            </Card>
                            <Card className="stat-card">
                                <Card.Body>
                                    <div className="stat-icon pending">
                                        <i className="fas fa-clock"></i>
                                    </div>
                                    <h6>Pending Orders</h6>
                                    <h3>{dashboardStats.pendingOrders}</h3>
                                </Card.Body>
                            </Card>
                            <Card className="stat-card">
                                <Card.Body>
                                    <div className="stat-icon today">
                                        <i className="fas fa-calendar-day"></i>
                                    </div>
                                    <h6>Today's Orders</h6>
                                    <h3>{dashboardStats.todayOrders}</h3>
                                </Card.Body>
                            </Card>
                        </div>
                    </div>
                )}
                {activeMenu === 'orders' && (
                    <>
                        <div className="admin-header">
                            <h2>Order Management</h2>
                            <div className="search-bar">
                                <i className="fas fa-search search-icon"></i>
                                <input
                                    type="text"
                                    placeholder="Search by Order ID or Customer Name..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="search-input"
                                />
                                {searchTerm && (
                                    <button
                                        className="clear-search"
                                        onClick={() => setSearchTerm('')}
                                    >
                                        <i className="fas fa-times"></i>
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="content-container">
                            <div className="orders-section">
                                <div className="table-container">
                                    <Table hover className="orders-table">
                                        <thead>
                                            <tr>
                                                <th>Order #</th>
                                                <th>Date</th>
                                                <th>Customer</th>
                                                <th>Total</th>
                                                <th>Status</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredOrders.map((order) => (
                                                <tr key={order._id}>
                                                    <td>{order.orderNumber}</td>
                                                    <td>{formatDate(order.createdAt)}</td>
                                                    <td>{order.customer.firstName} {order.customer.lastName}</td>
                                                    <td>LKR {order.totalAmount}</td>
                                                    <td>
                                                        <Badge
                                                            className={`status-badge ${order.status.toLowerCase()}`}
                                                            onClick={() => {
                                                                setEditedStatus(order.status);
                                                                setSelectedOrder(order);
                                                                setShowEditModal(true);
                                                            }}
                                                            style={{
                                                                backgroundColor: ORDER_STATUSES[order.status.toUpperCase()]?.color,
                                                                cursor: 'pointer'
                                                            }}
                                                        >
                                                            {order.status}
                                                        </Badge>
                                                    </td>
                                                    <td>
                                                        <div className="action-buttons">
                                                            <Button
                                                                variant="outline-primary"
                                                                size="sm"
                                                                onClick={() => handleViewOrder(order)}
                                                                className="action-btn view-btn"
                                                            >
                                                                <i className="fas fa-eye me-1"></i> View
                                                            </Button>
                                                            <Button
                                                                variant="outline-danger"
                                                                size="sm"
                                                                onClick={() => handleDeleteOrder(order._id)}
                                                                className="action-btn delete-btn"
                                                            >
                                                                <i className="fas fa-trash me-1"></i> Delete
                                                            </Button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                </div>
                            </div>
                        </div>
                    </>
                )}
                {activeMenu === 'reports' && renderReports()}
            </div>

            {/* Edit Status Modal */}
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)} className="status-modal">
                <Modal.Header closeButton>
                    <Modal.Title>Update Order Status</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>Current Status: </Form.Label>
                            <Badge
                                className={`status-badge ${selectedOrder?.status.toLowerCase()}`}
                                style={{
                                    backgroundColor: ORDER_STATUSES[selectedOrder?.status?.toUpperCase()]?.color,
                                    marginLeft: '10px'
                                }}
                            >
                                {selectedOrder?.status}
                            </Badge>
                            <Form.Select
                                className="mt-3"
                                value={editedStatus}
                                onChange={(e) => setEditedStatus(e.target.value)}
                            >
                                {Object.values(ORDER_STATUSES).map(status => (
                                    <option
                                        key={status.value}
                                        value={status.value}
                                        style={{ color: status.color }}
                                    >
                                        {status.value}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        onClick={() => handleUpdateStatus(selectedOrder._id, editedStatus)}
                    >
                        Update Status
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Order Details Modal */}
            <Modal
                show={showOrderDetails}
                onHide={handleCloseDetails}
                size="lg"
                className="order-details-modal"
            >
                <Modal.Header closeButton>
                    <Modal.Title>Order Details #{selectedOrder?.orderNumber}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedOrder && (
                        <div className="order-details">
                            <div className="order-status-section">
                                <Badge className={`status-badge ${selectedOrder.status.toLowerCase()}`}>
                                    {selectedOrder.status}
                                </Badge>
                                <p className="order-date">
                                    Ordered on: {formatDate(selectedOrder.createdAt)}
                                </p>
                            </div>
                            <div className="customer-section">
                                <h5>Customer Information</h5>
                                <div className="info-grid">
                                    <p><strong>Name:</strong> {selectedOrder.customer.firstName} {selectedOrder.customer.lastName}</p>
                                    <p><strong>Email:</strong> {selectedOrder.customer.email}</p>
                                    <p><strong>Phone:</strong> {selectedOrder.customer.phone}</p>
                                    <p><strong>Address:</strong> {selectedOrder.customer.address}</p>
                                </div>
                            </div>
                            <div className="items-section">
                                <h5>Ordered Items</h5>
                                <div className="items-list">
                                    {selectedOrder.items.map((item, index) => (
                                        <div key={index} className="item-card">
                                            <img
                                                src={`http://localhost:5000${item.image}`}
                                                alt={item.title}
                                                className="item-image"
                                                onError={(e) => {
                                                    e.target.src = '/placeholder-image.png';
                                                    e.target.onerror = null;
                                                }}
                                            />
                                            <div className="item-details">
                                                <h6>{item.title}</h6>
                                                <p>Quantity: {item.quantity}</p>
                                                <p className="item-price">LKR {item.price.toFixed(2)}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="order-summary">
                                <div className="total-row">
                                    <span>Subtotal:</span>
                                    <span>LKR {selectedOrder.totalAmount}</span>
                                </div>
                                <div className="total-row">
                                    <span>Shipping:</span>
                                    <span className="free-shipping">Free</span>
                                </div>
                                <div className="total-row grand-total">
                                    <span>Total Amount:</span>
                                    <span>LKR {selectedOrder.totalAmount}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseDetails}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default AdminDashboard;
