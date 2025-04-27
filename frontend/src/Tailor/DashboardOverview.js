import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { 
  FaShoppingBag, 
  FaChartLine, 
  FaCheckCircle, 
  FaClock,
  FaUsers,
  FaTshirt,
  FaRulerCombined
} from 'react-icons/fa';
import './DashboardOverview.css';

const DashboardOverview = () => {
  const [stats, setStats] = useState({
    activeTailors: 5,
    totalCustomizations: 25,
    measurementRequests: 8,
    ordersToday: 0,
    totalOrders: 16,
    completedOrders: 1,
    pendingOrders: 14
  });

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/dashboard/stats');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    }
  };

  return (
    <Container fluid className="dashboard-container">
      <div className="dashboard-header">
        <h2>Dashboard Overview</h2>
        <p>Welcome back, Admin!</p>
      </div>

      <div className="quick-stats">
        <div className="stat-card">
          <div className="stat-icon-wrapper">
            <FaUsers />
          </div>
          <div className="stat-content">
            <p>Active Tailors</p>
            <h3>{stats.activeTailors}</h3>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper">
            <FaTshirt />
          </div>
          <div className="stat-content">
            <p>Total Customizations</p>
            <h3>{stats.totalCustomizations}</h3>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper">
            <FaRulerCombined />
          </div>
          <div className="stat-content">
            <p>Measurement Requests</p>
            <h3>{stats.measurementRequests}</h3>
          </div>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <FaShoppingBag />
          </div>
          <div className="stat-content">
            <p>Today's Orders</p>
            <h3>{stats.ordersToday}</h3>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">
            <FaChartLine />
          </div>
          <div className="stat-content">
            <p>Total Orders</p>
            <h3>{stats.totalOrders}</h3>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <FaCheckCircle />
          </div>
          <div className="stat-content">
            <p>Completed</p>
            <h3>{stats.completedOrders}</h3>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <FaClock />
          </div>
          <div className="stat-content">
            <p>Pending</p>
            <h3>{stats.pendingOrders}</h3>
          </div>
        </div>
      </div>

      <div className="mt-5">
        <h3 className="section-title">Recent Orders</h3>
        <div className="content-card">
          <p className="text-center text-muted">No recent orders available</p>
        </div>
      </div>

      <div className="mt-5">
        <h3 className="section-title">Popular Products</h3>
        <div className="content-card">
          <p className="text-center text-muted">No popular products available</p>
        </div>
      </div>
    </Container>
  );
};

export default DashboardOverview;
