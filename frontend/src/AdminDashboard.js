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
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { format } from 'date-fns';
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

const options = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top',
        },
        title: {
            display: true,
            text: 'Dashboard Analytics',
        },
    },
};

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

    // Update the handleUpdateStatus function
    const handleUpdateStatus = async (orderId, newStatus) => {
        if (!orderId || !newStatus) {
            alert('Invalid order or status');
            return;
        }

        try {
            setLoading(true);
            const response = await axios.put(`http://localhost:5000/api/orders/${orderId}/status`, {
                status: newStatus
            });

            if (response.data) {
                // Update local state
                setOrders(prevOrders => 
                    prevOrders.map(order => 
                        order._id === orderId ? { ...order, status: newStatus } : order
                    )
                );
                
                // Refresh dashboard stats
                calculateDashboardStats();
                
                // Close modal and show success
                setShowEditModal(false);
                alert('Order status updated successfully!');
            }
        } catch (error) {
            console.error('Update failed:', error);
            alert(error.response?.data?.message || 'Failed to update order status');
        } finally {
            setLoading(false);
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

    const generatePDFReport = () => {
        const doc = new jsPDF();
        
        // Add logo and title
        doc.setFontSize(24);
        doc.setTextColor(79, 3, 42); // #4F032A
        doc.text('Punarvasthra', 105, 20, { align: 'center' });
        
        // Add subtitle
        doc.setFontSize(16);
        doc.setTextColor(102, 102, 102);
        doc.text('Daily Orders Report', 105, 30, { align: 'center' });
        
        // Add date
        doc.setFontSize(12);
        doc.text(`Generated on: ${format(new Date(), 'dd/MM/yyyy HH:mm')}`, 105, 40, { align: 'center' });

        // Add decorative line
        doc.setDrawColor(79, 3, 42);
        doc.setLineWidth(0.5);
        doc.line(20, 45, 190, 45);

        // Add statistics in a styled table
        const stats = [
            ['Total Orders:', dashboardStats.totalOrders],
            ['Today\'s Orders:', dashboardStats.todayOrders],
            ['Total Revenue:', `LKR ${dashboardStats.totalRevenue.toFixed(2)}`],
            ['Pending Orders:', dashboardStats.pendingOrders]
        ];

        doc.autoTable({
            startY: 55,
            head: [['Statistics', 'Value']],
            body: stats,
            theme: 'grid',
            headStyles: { 
                fillColor: [79, 3, 42],
                fontSize: 12,
                halign: 'center'
            },
            styles: { 
                cellPadding: 5,
                fontSize: 10,
                halign: 'left'
            },
            alternateRowStyles: {
                fillColor: [245, 245, 245]
            }
        });

        // Add orders table with improved styling
        const orderData = filteredOrders.map(order => [
            order.orderNumber,
            format(new Date(order.createdAt), 'dd/MM/yyyy'),
            `${order.customer.firstName} ${order.customer.lastName}`,
            `LKR ${order.totalAmount.toFixed(2)}`,
            order.status
        ]);

        doc.autoTable({
            startY: doc.lastAutoTable.finalY + 15,
            head: [['Order #', 'Date', 'Customer', 'Total', 'Status']],
            body: orderData,
            theme: 'grid',
            headStyles: {
                fillColor: [79, 3, 42],
                fontSize: 11,
                halign: 'center'
            },
            styles: {
                cellPadding: 5,
                fontSize: 10,
                halign: 'left'
            },
            columnStyles: {
                0: { cellWidth: 30 },
                1: { cellWidth: 30 },
                2: { cellWidth: 50 },
                3: { cellWidth: 40 },
                4: { cellWidth: 30 }
            },
            alternateRowStyles: {
                fillColor: [245, 245, 245]
            }
        });

        // Add footer
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(10);
            doc.setTextColor(150);
            doc.text(
                `Page ${i} of ${pageCount}`,
                doc.internal.pageSize.width / 2,
                doc.internal.pageSize.height - 10,
                { align: 'center' }
            );
        }

        // Save the PDF
        doc.save(`punarvasthra-orders-report-${format(new Date(), 'dd-MM-yyyy')}.pdf`);
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

    const data = {
        labels: ['January', 'February', 'March', 'April', 'May', 'June'],
        datasets: [
            {
                label: 'Orders',
                data: [12, 19, 3, 5, 2, 3],
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
            }
        ]
    };

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
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h4 className="section-title">Dashboard Overview</h4>
                        </div>
                        
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
                        <div style={{ width: '80%', margin: '0 auto' }}>
                            <Line options={options} data={data} />
                        </div>
                    </div>
                )}
                {activeMenu === 'orders' && (
                    <div className="orders-section">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h4 className="section-title">Orders Management</h4>
                            <div className="order-actions">
                                <Button 
                                    variant="primary" 
                                    onClick={generatePDFReport}
                                    className="export-btn me-2"
                                >
                                    <i className="fa-solid fa-file-pdf me-2"></i>
                                    Download Report
                                </Button>
                            </div>
                        </div>
                        <div className="table-container">
                            <div className="mb-3">
                                <Form.Control
                                    type="text"
                                    placeholder="Search orders..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="search-input"
                                />
                            </div>
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
                                    {filteredOrders.map(order => (
                                        <tr key={order._id}>
                                            <td>{order.orderNumber}</td>
                                            <td>{formatDate(order.createdAt)}</td>
                                            <td>{`${order.customer.firstName} ${order.customer.lastName}`}</td>
                                            <td>LKR {order.totalAmount}</td>
                                            <td>
                                                <Badge
                                                    className={`status-badge ${order.status.toLowerCase()}`}
                                                    style={{
                                                        backgroundColor: ORDER_STATUSES[order.status.toUpperCase()]?.color
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
                                                        className="action-btn me-2"
                                                        title="View Order"
                                                    >
                                                        <i className="fa-solid fa-eye"></i>
                                                    </Button>
                                                    <Button
                                                        variant="outline-warning"
                                                        size="sm"
                                                        onClick={() => {
                                                            setEditedStatus(order.status);
                                                            setSelectedOrder(order);
                                                            setShowEditModal(true);
                                                        }}
                                                        className="action-btn me-2"
                                                        title="Edit Order"
                                                    >
                                                        <i className="fa-solid fa-pen-to-square"></i>
                                                    </Button>
                                                    <Button
                                                        variant="outline-danger"
                                                        size="sm"
                                                        onClick={() => handleDeleteOrder(order._id)}
                                                        className="action-btn"
                                                        title="Delete Order"
                                                    >
                                                        <i className="fa-solid fa-trash-can"></i>
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </div>
                    </div>
                )}
                {activeMenu === 'reports' && renderReports()}
            </div>

            {/* Edit Status Modal */}
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)} className="status-modal">
                <Modal.Header closeButton>
                    <Modal.Title>Update Order Status</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedOrder && (
                        <Form>
                            <Form.Group>
                                <Form.Label>Current Status:</Form.Label>
                                <Badge
                                    className={`status-badge ${selectedOrder.status.toLowerCase()}`}
                                    style={{
                                        backgroundColor: ORDER_STATUSES[selectedOrder.status.toUpperCase()]?.color,
                                        marginLeft: '10px'
                                    }}
                                >
                                    {selectedOrder.status}
                                </Badge>
                                <Form.Select
                                    className="mt-3"
                                    value={editedStatus}
                                    onChange={(e) => setEditedStatus(e.target.value)}
                                >
                                    {Object.entries(ORDER_STATUSES).map(([key, status]) => (
                                        <option key={key} value={status.value}>
                                            {status.value}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </Form>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowEditModal(false)} disabled={loading}>
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        onClick={() => selectedOrder && handleUpdateStatus(selectedOrder._id, editedStatus)}
                        disabled={loading || !selectedOrder}
                    >
                        {loading ? (
                            <>
                                <Spinner
                                    as="span"
                                    animation="border"
                                    size="sm"
                                    role="status"
                                    aria-hidden="true"
                                    className="me-2"
                                />
                                Updating...
                            </>
                        ) : (
                            'Update Status'
                        )}
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
