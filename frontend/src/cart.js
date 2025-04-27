import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import CustomNavbar from './Navbar';
import './App.css';

function Cart() {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);

    useEffect(() => {
        try {
            // Get cart items from localStorage
            const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
            console.log('Loaded cart:', savedCart); // Debug log
            if (Array.isArray(savedCart) && savedCart.length > 0) {
                setCartItems(savedCart);
            }
        } catch (error) {
            console.error('Error loading cart:', error);
        }
    }, []);

    useEffect(() => {
        // Calculate total price whenever cart items change
        const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        setTotalPrice(total);
        // Save updated cart to localStorage
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);

    const handleQuantityChange = (itemId, newQuantity) => {
        if (newQuantity > 0) {
            setCartItems(cartItems.map(item => 
                item._id === itemId ? { ...item, quantity: newQuantity } : item
            ));
        }
    };

    const handleRemoveItem = (itemId) => {
        setCartItems(cartItems.filter(item => item._id !== itemId));
    };

    const handleCheckout = () => {
        console.log('Checkout clicked');
        if (cartItems.length > 0) {
            console.log('Navigating to order form');
            navigate('/order-form');
        } else {
            console.log('Cart is empty');
            alert('Your cart is empty!');
        }
    };

    if (cartItems.length === 0) {
        return (
            <Container className="mt-5">
                <h2>Your cart is empty</h2>
                <Button onClick={() => navigate('/')}>Continue Shopping</Button>
            </Container>
        );
    }

    return (
        <div className="cart-page">
            <CustomNavbar />
            <Container className="mt-5">
                <h2 className="mb-4">Shopping Cart</h2>
                <Row>
                    <Col md={8}>
                        {cartItems.map(item => (
                            <Card className="mb-4" key={item._id}>
                                <Card.Body>
                                    <Row>
                                        <Col md={4}>
                                            <img
                                                src={`http://localhost:5000${item.image}`}
                                                alt={item.title}
                                                style={{
                                                    width: '100%',
                                                    height: 'auto',
                                                    objectFit: 'cover',
                                                    borderRadius: '8px'
                                                }}
                                            />
                                        </Col>
                                        <Col md={8}>
                                            <div className="d-flex justify-content-between align-items-start">
                                                <div>
                                                    <h4>{item.title}</h4>
                                                    <p className="text-muted">Color: {item.mainColor}</p>
                                                    <p className="text-muted">Fabric: {item.fabric}</p>
                                                </div>
                                                <Button 
                                                    variant="link" 
                                                    className="text-danger"
                                                    onClick={() => handleRemoveItem(item._id)}
                                                >
                                                    ✕
                                                </Button>
                                            </div>
                                            <div className="mt-3 d-flex align-items-center">
                                                <Form.Label className="me-3 mb-0">Quantity:</Form.Label>
                                                <Form.Control
                                                    type="number"
                                                    value={item.quantity}
                                                    onChange={(e) => handleQuantityChange(item._id, parseInt(e.target.value))}
                                                    min="1"
                                                    style={{ width: '80px' }}
                                                />
                                            </div>
                                            <h5 className="mt-3">Price: LKR {item.price * item.quantity}</h5>
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>
                        ))}
                    </Col>
                    <Col md={4}>
                        <Card>
                            <Card.Body>
                                <h4 className="mb-4">Order Summary</h4>
                                <div className="d-flex justify-content-between mb-3">
                                    <span>Subtotal:</span>
                                    <span>LKR {totalPrice}</span>
                                </div>
                                <div className="d-flex justify-content-between mb-3">
                                    <span>Shipping:</span>
                                    <span>Free</span>
                                </div>
                                <hr />
                                <div className="d-flex justify-content-between mb-4">
                                    <strong>Total:</strong>
                                    <strong>LKR {totalPrice}</strong>
                                </div>
                                <Button 
                                    variant="primary" 
                                    className="w-100"
                                    onClick={handleCheckout}
                                >
                                    Proceed to Checkout
                                </Button>
                                <Button 
                                    variant="outline-secondary" 
                                    className="w-100 mt-2"
                                    onClick={() => navigate('/')}
                                >
                                    Continue Shopping
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default Cart;