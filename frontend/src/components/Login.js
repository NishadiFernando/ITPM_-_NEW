import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Alert, Card } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (isAdmin) {
      // Admin login checks
      if (email === 'admin' && password === 'admin123') {
        localStorage.setItem('isAdmin', 'admin');
        navigate('/admin/dashboard');
        return;
      } 
      else if (email === 'tailor' && password === 'tailor123') {
        localStorage.setItem('isAdmin', 'tailor');
        navigate('/tailor-admin');
        return;
      }
      else if (email === 'nishadi' && password === 'nishadi123') {
        localStorage.setItem('isAdmin', 'manager');
        navigate('/admin');
        return;
      }
      setError('Invalid admin credentials');
      return;
    }

    // Regular user login
    try {
      const response = await axios.post('http://localhost:5000/api/users/login', {
        email,
        password
      });
      
      if (response.data && response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        navigate('/sareehome');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <Container>
      <Row className="justify-content-md-center mt-5">
        <Col md={6}>
          <Card className="shadow-sm" style={{ borderRadius: '15px', border: 'none' }}>
            <Card.Body className="p-5">
              <div className="text-center mb-4">
                <h2 style={{ color: '#4F032A', fontWeight: '600' }}>Welcome to Punarvasthra</h2>
                <p className="text-muted">Please login to continue</p>
              </div>
              
              <div className="text-center mb-4">
                <Button
                  variant={isAdmin ? "primary" : "outline-primary"}
                  onClick={() => setIsAdmin(true)}
                  className="mx-2"
                  style={{ 
                    backgroundColor: isAdmin ? '#4F032A' : 'white',
                    borderColor: '#4F032A',
                    color: isAdmin ? 'white' : '#4F032A',
                    borderRadius: '8px',
                    padding: '8px 20px'
                  }}
                >
                  Admin Login
                </Button>
                <Button
                  variant={!isAdmin ? "primary" : "outline-primary"}
                  onClick={() => setIsAdmin(false)}
                  className="mx-2"
                  style={{ 
                    backgroundColor: !isAdmin ? '#4F032A' : 'white',
                    borderColor: '#4F032A',
                    color: !isAdmin ? 'white' : '#4F032A',
                    borderRadius: '8px',
                    padding: '8px 20px'
                  }}
                >
                  User Login
                </Button>
              </div>

              {error && <Alert variant="danger" className="mb-4">{error}</Alert>}
              
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-4">
                  <Form.Label className="fw-medium">{isAdmin ? 'Username' : 'Email address'}</Form.Label>
                  <Form.Control
                    type={isAdmin ? 'text' : 'email'}
                    placeholder={isAdmin ? 'Enter username' : 'Enter email'}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={{ padding: '12px', borderRadius: '8px' }}
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label className="fw-medium">Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={{ padding: '12px', borderRadius: '8px' }}
                  />
                </Form.Group>

                <Button 
                  variant="primary" 
                  type="submit"
                  className="mt-2"
                  style={{ 
                    backgroundColor: '#4F032A', 
                    borderColor: '#4F032A',
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    fontWeight: '500'
                  }}
                >
                  Login
                </Button>

                {!isAdmin && (
                  <div className="text-center mt-4">
                    <p className="text-muted mb-0">
                      Don't have an account? <Link to="/signup" style={{ color: '#4F032A', textDecoration: 'none', fontWeight: '500' }}>Sign up</Link>
                    </p>
                  </div>
                )}
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Login;