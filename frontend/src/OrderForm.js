import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import CustomNavbar from './Navbar';
import axios from 'axios';

function OrderForm() {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [paymentMethod, setPaymentMethod] = useState('cod');
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        postalCode: '',
        additionalInfo: '',
        shippingAddress: '',
        sameAsBilling: true
    });
    const [cardDetails, setCardDetails] = useState({
        cardNumber: '',
        cardHolder: '',
        expiryDate: '',
        cvv: ''
    });
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [orderNumber, setOrderNumber] = useState('');

    // Load cart items and calculate total
    useEffect(() => {
        try {
            const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
            setCartItems(savedCart);
            const total = savedCart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            setTotalPrice(total);
        } catch (error) {
            console.error('Error loading cart:', error);
        }
    }, []);

    const handleInputChange = (e) => {
        const { name, value, checked, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handlePaymentMethodChange = (e) => {
        setPaymentMethod(e.target.value);
    };

    const handleCardDetailsChange = (e) => {
        setCardDetails(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const orderData = {
                customer: formData,
                items: cartItems,
                totalAmount: totalPrice,
                paymentMethod,
                additionalInfo: formData.additionalInfo
            };

            const response = await axios.post('http://localhost:5000/api/orders', orderData);
            
            if (response.data) {
                setOrderNumber(response.data.orderNumber);
                setShowSuccessModal(true);
                localStorage.removeItem('cart');
            }
        } catch (error) {
            console.error('Error submitting order:', error);
            alert('There was an error placing your order. Please try again.');
        }
    };

    const handleCloseAndRedirect = () => {
        setShowSuccessModal(false);
        localStorage.removeItem('cart');
        navigate('/');
    };

    return (
        <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
            <CustomNavbar />
            <Container className="mt-5">
                <h2 style={{ color: '#4F032A', marginBottom: '1.5rem', fontWeight: '600' }}>
                    Checkout
                </h2>
                <Row>
                    {/* Left Column - Form */}
                    <Col md={8}>
                        <Card style={{ boxShadow: '0 2px 4px rgba(0,0,0,0.1)', border: 'none', marginBottom: '2rem' }}>
                            <Card.Body style={{ padding: '2rem' }}>
                                <Form onSubmit={handleSubmit}>
                                    {/* Billing & Shipping Section */}
                                    <h4 style={{ color: '#4F032A', marginBottom: '1.5rem', fontWeight: '500' }}>
                                        Billing & Shipping Details
                                    </h4>
                                    
                                    <Row>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>First Name*</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="firstName"
                                                    value={formData.firstName}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Last Name*</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="lastName"
                                                    value={formData.lastName}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Email*</Form.Label>
                                                <Form.Control
                                                    type="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Phone*</Form.Label>
                                                <Form.Control
                                                    type="tel"
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    <Form.Group className="mb-3">
                                        <Form.Label>Billing Address*</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="address"
                                            value={formData.address}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </Form.Group>

                                    <Row>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>City*</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="city"
                                                    value={formData.city}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Postal Code*</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="postalCode"
                                                    value={formData.postalCode}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    <Form.Group className="mb-3">
                                        <Form.Check
                                            type="checkbox"
                                            name="sameAsBilling"
                                            label="Shipping address same as billing"
                                            checked={formData.sameAsBilling}
                                            onChange={handleInputChange}
                                        />
                                    </Form.Group>

                                    {!formData.sameAsBilling && (
                                        <Form.Group className="mb-3">
                                            <Form.Label>Shipping Address</Form.Label>
                                            <Form.Control
                                                as="textarea"
                                                rows={3}
                                                name="shippingAddress"
                                                value={formData.shippingAddress}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </Form.Group>
                                    )}

                                    <Form.Group className="mb-4">
                                        <Form.Label>Order Notes (Optional)</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={3}
                                            name="additionalInfo"
                                            value={formData.additionalInfo}
                                            onChange={handleInputChange}
                                            placeholder="Special notes for delivery"
                                        />
                                    </Form.Group>

                                    {/* Payment Method Section */}
                                    <h4 style={{ color: '#4F032A', marginTop: '2rem', marginBottom: '1.5rem' }}>
                                        Payment Method
                                    </h4>
                                    <div style={{
                                        border: '1px solid #dee2e6',
                                        padding: '1.5rem',
                                        borderRadius: '8px',
                                        backgroundColor: '#f8f9fa',
                                        marginBottom: '1.5rem'
                                    }}>
                                        <Form.Check
                                            type="radio"
                                            id="cod"
                                            name="paymentMethod"
                                            label="Cash on Delivery"
                                            value="cod"
                                            checked={paymentMethod === 'cod'}
                                            onChange={handlePaymentMethodChange}
                                            className="mb-3"
                                        />
                                        <Form.Check
                                            type="radio"
                                            id="card"
                                            name="paymentMethod"
                                            label="Credit/Debit Card"
                                            value="card"
                                            checked={paymentMethod === 'card'}
                                            onChange={handlePaymentMethodChange}
                                        />
                                    </div>

                                    {/* Card Details Section */}
                                    {paymentMethod === 'card' && (
                                        <div style={{
                                            border: '1px solid #dee2e6',
                                            padding: '1.5rem',
                                            borderRadius: '8px',
                                            backgroundColor: '#fff',
                                            marginBottom: '1.5rem'
                                        }}>
                                            <h5 style={{ marginBottom: '1rem', color: '#4F032A' }}>
                                                Card Details
                                            </h5>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Card Number*</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="cardNumber"
                                                    value={cardDetails.cardNumber}
                                                    onChange={handleCardDetailsChange}
                                                    placeholder="1234 5678 9012 3456"
                                                    required={paymentMethod === 'card'}
                                                    maxLength="16"
                                                />
                                            </Form.Group>

                                            <Form.Group className="mb-3">
                                                <Form.Label>Card Holder Name*</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="cardHolder"
                                                    value={cardDetails.cardHolder}
                                                    onChange={handleCardDetailsChange}
                                                    required={paymentMethod === 'card'}
                                                />
                                            </Form.Group>

                                            <Row>
                                                <Col md={6}>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>Expiry Date*</Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            name="expiryDate"
                                                            value={cardDetails.expiryDate}
                                                            onChange={handleCardDetailsChange}
                                                            placeholder="MM/YY"
                                                            required={paymentMethod === 'card'}
                                                            maxLength="5"
                                                        />
                                                    </Form.Group>
                                                </Col>
                                                <Col md={6}>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>CVV*</Form.Label>
                                                        <Form.Control
                                                            type="password"
                                                            name="cvv"
                                                            value={cardDetails.cvv}
                                                            onChange={handleCardDetailsChange}
                                                            required={paymentMethod === 'card'}
                                                            maxLength="3"
                                                        />
                                                    </Form.Group>
                                                </Col>
                                            </Row>
                                        </div>
                                    )}

                                    <Button 
                                        variant="primary" 
                                        type="submit" 
                                        style={{
                                            width: '100%',
                                            backgroundColor: '#4F032A',
                                            borderColor: '#4F032A',
                                            padding: '0.75rem',
                                            fontSize: '1.1rem',
                                            fontWeight: '500',
                                            marginTop: '1rem'
                                        }}
                                    >
                                        {paymentMethod === 'cod' ? 'Place Order' : 'Pay & Place Order'}
                                    </Button>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>

                    {/* Right Column - Order Summary with Images */}
                    <Col md={4}>
                        <Card style={{ 
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)', 
                            border: 'none',
                            position: 'sticky',
                            top: '20px'
                        }}>
                            <Card.Body style={{ padding: '1.5rem' }}>
                                <h4 style={{ 
                                    color: '#4F032A', 
                                    marginBottom: '1.5rem', 
                                    fontWeight: '500',
                                    borderBottom: '2px solid #4F032A',
                                    paddingBottom: '0.5rem'
                                }}>
                                    Order Summary
                                </h4>

                                {/* Selected Items with Images */}
                                <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                                    {cartItems.map(item => (
                                        <div key={item._id} style={{ 
                                            marginBottom: '1rem',
                                            padding: '1rem',
                                            backgroundColor: '#fff',
                                            borderRadius: '8px',
                                            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                                        }}>
                                            <div style={{ 
                                                display: 'flex', 
                                                alignItems: 'center',
                                                gap: '1rem'
                                            }}>
                                                {/* Item Image */}
                                                <div style={{
                                                    width: '80px',
                                                    height: '80px',
                                                    borderRadius: '8px',
                                                    overflow: 'hidden',
                                                    flexShrink: 0
                                                }}>
                                                    <img
                                                        src={`http://localhost:5000${item.image}`}
                                                        alt={item.title}
                                                        style={{
                                                            width: '100%',
                                                            height: '100%',
                                                            objectFit: 'cover'
                                                        }}
                                                    />
                                                </div>

                                                {/* Item Details */}
                                                <div style={{ flex: 1 }}>
                                                    <h6 style={{ 
                                                        margin: '0 0 0.5rem 0',
                                                        color: '#333',
                                                        fontWeight: '500'
                                                    }}>
                                                        {item.title}
                                                    </h6>
                                                    <div style={{ 
                                                        display: 'flex', 
                                                        justifyContent: 'space-between',
                                                        alignItems: 'center',
                                                        color: '#666',
                                                        fontSize: '0.9rem'
                                                    }}>
                                                        <span>Quantity: {item.quantity}</span>
                                                        <span style={{ 
                                                            fontWeight: '500',
                                                            color: '#4F032A'
                                                        }}>
                                                            LKR {item.price * item.quantity}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Order Totals */}
                                <div style={{ 
                                    marginTop: '1.5rem',
                                    padding: '1rem',
                                    backgroundColor: '#f8f9fa',
                                    borderRadius: '8px'
                                }}>
                                    <div style={{ 
                                        display: 'flex', 
                                        justifyContent: 'space-between',
                                        marginBottom: '0.5rem'
                                    }}>
                                        <span style={{ color: '#666' }}>Subtotal:</span>
                                        <span style={{ fontWeight: '500' }}>
                                            LKR {totalPrice}
                                        </span>
                                    </div>
                                    <div style={{ 
                                        display: 'flex', 
                                        justifyContent: 'space-between',
                                        marginBottom: '0.5rem'
                                    }}>
                                        <span style={{ color: '#666' }}>Shipping:</span>
                                        <span style={{ 
                                            color: '#28a745', 
                                            fontWeight: '500'
                                        }}>
                                            Free
                                        </span>
                                    </div>
                                    <hr style={{ 
                                        margin: '1rem 0',
                                        borderColor: '#dee2e6'
                                    }} />
                                    <div style={{ 
                                        display: 'flex', 
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}>
                                        <strong style={{ 
                                            fontSize: '1.1rem',
                                            color: '#333'
                                        }}>
                                            Total:
                                        </strong>
                                        <strong style={{ 
                                            fontSize: '1.2rem',
                                            color: '#4F032A'
                                        }}>
                                            LKR {totalPrice}
                                        </strong>
                                    </div>
                                </div>

                                {/* Order Protection Notice */}
                                <div style={{ 
                                    marginTop: '1.5rem',
                                    padding: '1rem',
                                    backgroundColor: '#e8f4fd',
                                    borderRadius: '8px',
                                    fontSize: '0.9rem',
                                    color: '#0066cc'
                                }}>
                                    <div style={{ 
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem'
                                    }}>
                                        <span style={{ fontSize: '1.2rem' }}>🛡️</span>
                                        <span>Your order is protected by our secure payment system</span>
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>

            {/* Success Modal */}
            <Modal
                show={showSuccessModal}
                onHide={handleCloseAndRedirect}
                centered
                backdrop="static"
                keyboard={false}
            >
                <Modal.Body style={{
                    padding: '3rem',
                    textAlign: 'center',
                    backgroundColor: '#fff',
                    borderRadius: '10px'
                }}>
                    <div style={{
                        width: '80px',
                        height: '80px',
                        margin: '0 auto 2rem',
                        backgroundColor: '#4F032A',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <span style={{
                            fontSize: '40px',
                            color: '#fff'
                        }}>
                            ✓
                        </span>
                    </div>

                    <h3 style={{
                        color: '#4F032A',
                        marginBottom: '1rem',
                        fontWeight: '600'
                    }}>
                        Order Successfully Placed!
                    </h3>

                    <p style={{
                        color: '#666',
                        fontSize: '1.1rem',
                        marginBottom: '1.5rem'
                    }}>
                        Thank you for shopping with us!
                    </p>

                    <div style={{
                        backgroundColor: '#f8f9fa',
                        padding: '1rem',
                        borderRadius: '8px',
                        marginBottom: '1.5rem'
                    }}>
                        <p style={{
                            margin: '0',
                            color: '#333',
                            fontWeight: '500'
                        }}>
                            Order Number:
                            <br />
                            <span style={{
                                color: '#4F032A',
                                fontSize: '1.2rem'
                            }}>
                                {orderNumber}
                            </span>
                        </p>
                    </div>

                    <p style={{
                        color: '#666',
                        fontSize: '0.9rem',
                        marginBottom: '2rem'
                    }}>
                        You will receive an email confirmation shortly with your order details.
                    </p>

                    <Button
                        onClick={handleCloseAndRedirect}
                        style={{
                            backgroundColor: '#4F032A',
                            borderColor: '#4F032A',
                            padding: '0.75rem 2rem',
                            fontSize: '1.1rem',
                            width: '100%'
                        }}
                    >
                        Continue Shopping
                    </Button>
                </Modal.Body>
            </Modal>
        </div>
    );
}

export default OrderForm;