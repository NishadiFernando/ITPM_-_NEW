import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import './TailorAdmin.css';
import CustomizationRequests from './CustomizationRequests';
import TailorManagement from './TailorManagement';
import DashboardOverview from './DashboardOverview';

const TailorAdmin = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('dashboard');

  const styles = {
    sidebar: {
      backgroundColor: '#4F032A',
      minHeight: '100vh',
      color: 'white',
      padding: '20px 0',
    },
    sidebarBrand: {
      fontSize: '24px',
      fontWeight: 'bold',
      padding: '0 20px 20px',
      borderBottom: '1px solid rgba(255,255,255,0.1)',
      marginBottom: '20px',
    },
    sidebarItem: {
      padding: '15px 20px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      transition: 'background-color 0.3s',
    },
    sidebarItemActive: {
      backgroundColor: 'rgba(255,255,255,0.1)',
      borderLeft: '4px solid #FF1493',
    },
    mainContent: {
      backgroundColor: '#f5f5f5',
      minHeight: '100vh',
      padding: '20px',
    },
    logoutButton: {
      marginTop: 'auto',
      padding: '15px 20px',
      color: 'white',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      transition: 'background-color 0.3s',
      border: 'none',
      backgroundColor: 'transparent',
      width: '100%',
      textAlign: 'left',
    }
  };

  const handleLogout = () => {
    // Clear any stored data
    localStorage.removeItem('tailorId');
    localStorage.removeItem('tailorRole');
    // Navigate to home page
    navigate('/');
  };

  return (
    <Container fluid>
      <Row>
        {/* Sidebar */}
        <Col md={2} style={styles.sidebar}>
          <div style={styles.sidebarBrand}>Punarvastra</div>
          
          <div 
            style={{
              ...styles.sidebarItem,
              ...(activeSection === 'dashboard' ? styles.sidebarItemActive : {})
            }}
            onClick={() => setActiveSection('dashboard')}
          >
            <span>⬜</span> Dashboard Overview
          </div>
          
          <div 
            style={{
              ...styles.sidebarItem,
              ...(activeSection === 'tailor' ? styles.sidebarItemActive : {})
            }}
            onClick={() => setActiveSection('tailor')}
          >
            <span>👥</span> Tailor Management
          </div>
          
          <div 
            style={{
              ...styles.sidebarItem,
              ...(activeSection === 'requests' ? styles.sidebarItemActive : {})
            }}
            onClick={() => setActiveSection('requests')}
          >
            <span>📋</span> Customization Requests
          </div>

          <button style={styles.logoutButton} onClick={handleLogout}>
            <span>🚪</span> Logout
          </button>
        </Col>

        {/* Main Content */}
        <Col md={10} style={styles.mainContent}>
          {activeSection === 'dashboard' && <DashboardOverview />}
          {activeSection === 'tailor' && <TailorManagement />}
          {activeSection === 'requests' && <CustomizationRequests />}
        </Col>
      </Row>
    </Container>
  );
};

export default TailorAdmin; 