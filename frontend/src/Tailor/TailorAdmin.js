import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import DashboardOverview from './DashboardOverview';
import TailorManagement from './TailorManagement';
import CustomizationRequests from './CustomizationRequests';
import './TailorAdmin.css';

const TailorAdmin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeSection, setActiveSection] = useState('dashboard');

  useEffect(() => {
    const path = location.pathname.split('/').pop();
    if (path === 'management') {
      setActiveSection('tailor');
    } else if (path === 'requests') {
      setActiveSection('requests');
    } else {
      setActiveSection('dashboard');
    }
  }, [location]);

  const handleNavigation = (section) => {
    setActiveSection(section);
    switch(section) {
      case 'tailor':
        navigate('/tailor-admin/management');
        break;
      case 'requests':
        navigate('/tailor-admin/requests');
        break;
      default:
        navigate('/tailor-admin');
    }
  };

  const renderContent = () => {
    switch(activeSection) {
      case 'tailor':
        return <TailorManagement />;
      case 'requests':
        return <CustomizationRequests />;
      case 'dashboard':
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <Container fluid>
      <Row>
        <Col md={2} className="sidebar" style={{
          backgroundColor: '#4F032A',
          minHeight: '100vh',
          color: 'white',
          padding: '20px 0',
          position: 'fixed',
          width: '250px'
        }}>
          <div className="sidebar-brand">Punarvastra</div>
          
          <div 
            className={`sidebar-item ${activeSection === 'dashboard' ? 'active' : ''}`}
            onClick={() => handleNavigation('dashboard')}
          >
            <span>⬜</span> Dashboard Overview
          </div>
          
          <div 
            className={`sidebar-item ${activeSection === 'tailor' ? 'active' : ''}`}
            onClick={() => handleNavigation('tailor')}
          >
            <span>👥</span> Tailor Management
          </div>

          <div 
            className={`sidebar-item ${activeSection === 'requests' ? 'active' : ''}`}
            onClick={() => handleNavigation('requests')}
          >
            <span>📋</span> Customization Requests
          </div>
          
          <div 
            className="logout-button"
            onClick={() => {
              localStorage.removeItem('isAdmin');
              navigate('/login');
            }}
          >
            <span>🚪</span> Logout
          </div>
        </Col>

        <Col md={10} className="main-content" style={{ marginLeft: '250px' }}>
          {renderContent()}
        </Col>
      </Row>
    </Container>
  );
};

export default TailorAdmin;