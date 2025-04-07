import React, { useState, useEffect } from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { 
  FaShoppingBag, 
  FaCheckCircle, 
  FaClock, 
  FaChartLine,
  FaTshirt,
  FaUsers,
  FaUserTie
} from 'react-icons/fa';
import axios from 'axios';
import './DashboardOverview.css';

const DashboardOverview = () => {
  const [stats, setStats] = useState({
    ordersToday: 0,
    totalOrders: 0,
    completedOrders: 0,
    pendingOrders: 0,
    totalProducts: 0,
    totalCustomers: 0,
    totalTailors: 0
  });

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/dashboard/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    }
  };

  const cards = [
    {
      title: 'Orders Today',
      value: stats.ordersToday,
      icon: <FaShoppingBag />,
      color: '#4F032A',
      bgColor: '#FFE6E6'
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: <FaChartLine />,
      color: '#1A237E',
      bgColor: '#E8EAF6'
    },
    {
      title: 'Completed Orders',
      value: stats.completedOrders,
      icon: <FaCheckCircle />,
      color: '#1B5E20',
      bgColor: '#E8F5E9'
    },
    {
      title: 'Pending Orders',
      value: stats.pendingOrders,
      icon: <FaClock />,
      color: '#E65100',
      bgColor: '#FFF3E0'
    },
    {
      title: 'Total Products',
      value: stats.totalProducts,
      icon: <FaTshirt />,
      color: '#311B92',
      bgColor: '#EDE7F6'
    },
    {
      title: 'Total Customers',
      value: stats.totalCustomers,
      icon: <FaUsers />,
      color: '#B71C1C',
      bgColor: '#FFEBEE'
    },
    {
      title: 'Total Tailors',
      value: stats.totalTailors,
      icon: <FaUserTie />,
      color: '#006064',
      bgColor: '#E0F7FA'
    }
  ];

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="header-content">
          <h2>Dashboard Overview</h2>
          <p>Welcome to your dashboard</p>
        </div>
        <button className="refresh-button" onClick={fetchDashboardStats}>
          ⟳
        </button>
      </div>

      <Row className="stats-grid">
        {cards.map((card, index) => (
          <Col key={index} lg={3} md={4} sm={6} xs={12} className="mb-4">
            <Card 
              className="stat-card"
              style={{
                borderTop: `4px solid ${card.color}`,
                backgroundColor: card.bgColor
              }}
            >
              <Card.Body>
                <div className="stat-icon" style={{ color: card.color }}>
                  {card.icon}
                </div>
                <div className="stat-content">
                  <h3 className="stat-value">{card.value}</h3>
                  <p className="stat-label">{card.title}</p>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Row className="mt-4">
        <Col md={12}>
          <Card className="summary-card">
            <Card.Body>
              <h3>Quick Summary</h3>
              <div className="summary-item">
                <span>Active Orders</span>
                <span className="value">{stats.pendingOrders}</span>
              </div>
              <div className="summary-item">
                <span>Completion Rate</span>
                <span className="value">
                  {stats.totalOrders ? 
                    Math.round((stats.completedOrders / stats.totalOrders) * 100) : 0}%
                </span>
              </div>
              <div className="summary-item">
                <span>Active Tailors</span>
                <span className="value">{stats.totalTailors}</span>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardOverview;
