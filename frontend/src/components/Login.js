import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Alert, Nav } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isAdmin) {
      // Admin login check
      if (email === 'tailor' && password === 'tailor123') {
        localStorage.setItem('isAdmin', 'true');
        navigate('/admin/dashboard');
        return;
      } else {
        setError('Invalid admin credentials');
        return;
      }
    }

    try {
      const response = await axios.post('http://localhost:5000/api/users/login', {
        email,
        password
      });
      
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      navigate('/home');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <Container>
      <Row className="justify-content-md-center mt-5">
        <Col md={6}>
          <div className="text-center mb-4">
            <h2 style={{ color: '#4F032A' }}>Welcome to Punarvasthra</h2>
            <p>Please login to continue</p>
          </div>
          
          <div className="text-center mb-3">
            <Button
              variant={isAdmin ? "primary" : "outline-primary"}
              onClick={() => setIsAdmin(true)}
              className="mx-2"
              style={{ 
                backgroundColor: isAdmin ? '#4F032A' : 'white',
                borderColor: '#4F032A',
                color: isAdmin ? 'white' : '#4F032A'
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
                color: !isAdmin ? 'white' : '#4F032A'
              }}
            >
              User Login
            </Button>
          </div>

          {error && <Alert variant="danger">{error}</Alert>}
          
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>{isAdmin ? 'Username' : 'Email address'}</Form.Label>
              <Form.Control
                type={isAdmin ? 'text' : 'email'}
                placeholder={isAdmin ? 'Enter username' : 'Enter email'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>

            <Button 
              variant="primary" 
              type="submit"
              style={{ 
                backgroundColor: '#4F032A', 
                borderColor: '#4F032A',
                width: '100%'
              }}
            >
              Login
            </Button>

            {!isAdmin && (
              <div className="text-center mt-3">
                <p>Don't have an account? <Link to="/signup">Sign up</Link></p>
              </div>
            )}
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default Login;