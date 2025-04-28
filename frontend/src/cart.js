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
        loadCartItems();
    }, []);

    const loadCartItems = () => {
        try {
            const savedCart = localStorage.getItem('cart');
            if (savedCart) {
                const parsedCart = JSON.parse(savedCart);
                setCartItems(parsedCart);
                calculateTotal(parsedCart);
            }
        } catch (error) {
            console.error('Error loading cart:', error);
        }
    };

    const calculateTotal = (items) => {
        const total = items.reduce((sum, item) => {
            const price = parseFloat(item.price.replace('LKR ', ''));
            return sum + (price * item.quantity);
        }, 0);
        setTotalPrice(total);
    };

    const handleQuantityChange = (itemId, newQuantity) => {
        if (newQuantity > 0) {
            const updatedCart = cartItems.map(item =>
                item.id === itemId ? { ...item, quantity: newQuantity } : item
            );
            setCartItems(updatedCart);
            localStorage.setItem('cart', JSON.stringify(updatedCart));
            calculateTotal(updatedCart);
        }
    };

    const handleRemoveItem = (itemId) => {
        const updatedCart = cartItems.filter(item => item.id !== itemId);
        setCartItems(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        calculateTotal(updatedCart);
    };

    const handleCheckout = () => {
        if (cartItems.length > 0) {
            navigate('/order', { state: { cartItems, totalPrice } });
        } else {
            alert('Your cart is empty!');
        }
    };

    if (cartItems.length === 0) {
        return (
            <>
                <CustomNavbar />
                <Container className="mt-5 text-center">
                    <h2>Your cart is empty</h2>
                    <Button 
                        onClick={() => navigate('/sareehome')}
                        className="mt-3"
                        style={{
                            backgroundColor: '#4F032A',
                            border: 'none'
                        }}
                    >
                        Continue Shopping
                    </Button>
                </Container>
            </>
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
                            <Card className="mb-4" key={item.id}>
                                <Card.Body>
                                    <Row>
                                        <Col md={4}>
                                            <img
                                                src={`http://localhost:5000${item.image}`}
                                                alt={item.name}
                                                onError={(e) => {
                                                    console.error('Image failed to load:', item.image);
                                                    e.target.src = 'https://via.placeholder.com/300x400';
                                                }}
                                                style={{
                                                    width: '100%',
                                                    height: '200px',
                                                    objectFit: 'cover',
                                                    borderRadius: '8px'
                                                }}
                                            />
                                        </Col>
                                        <Col md={8}>
                                            <div className="d-flex justify-content-between align-items-start">
                                                <div>
                                                    <h4>{item.name}</h4>
                                                    <p className="text-muted">Color: {item.color}</p>
                                                </div>
                                                <Button 
                                                    variant="link" 
                                                    className="text-danger"
                                                    onClick={() => handleRemoveItem(item.id)}
                                                >
                                                    ✕
                                                </Button>
                                            </div>
                                            <div className="mt-3 d-flex align-items-center">
                                                <Form.Label className="me-3 mb-0">Quantity:</Form.Label>
                                                <Form.Control
                                                    type="number"
                                                    value={item.quantity}
                                                    onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                                                    min="1"
                                                    style={{ width: '80px' }}
                                                />
                                            </div>
                                            <h5 className="mt-3">Price: {item.price}</h5>
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
                                    onClick={handleCheckout}
                                    className="w-100"
                                    style={{
                                        backgroundColor: '#4F032A',
                                        border: 'none'
                                    }}
                                >
                                    Proceed to Checkout
                                </Button>
                                <Button 
                                    variant="outline-secondary" 
                                    className="w-100 mt-2"
                                    onClick={() => navigate('/sareehome')}
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