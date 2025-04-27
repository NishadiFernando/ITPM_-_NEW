import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { 
  FaShoppingBag, 
  FaChartLine, 
  FaCheckCircle, 
  FaClock,
  FaMoneyBillWave,
  FaTachometerAlt,
  FaUsers,
  FaClipboardList,
  FaSignOutAlt
} from 'react-icons/fa';
import axios from 'axios';
import './DashboardOverview.css';

const DashboardOverview = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    ordersToday: 0,
    totalOrders: 0,
    completedOrders: 0,
    pendingOrders: 0,
    dailyRevenue: 0,
    weeklyRevenue: 0,
    monthlyRevenue: 0
  });
  const [isLoading, setIsLoading] = useState(false);
  const [activeMenu, setActiveMenu] = useState('dashboard');

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/dashboard/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    }
    setIsLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('isAdmin');
    navigate('/login');
  };

  const formatCurrency = (amount) => {
    return Number(amount || 0).toLocaleString();
  };

  const sidebarItems = [
    { icon: <FaTachometerAlt />, text: 'Dashboard', value: 'dashboard' },
    { icon: <FaUsers />, text: 'Tailor Management', value: 'tailors' },
    { icon: <FaClipboardList />, text: 'Customization Requests', value: 'requests' }
  ];

  const handleMenuClick = (menuValue) => {
    setActiveMenu(menuValue);
    switch(menuValue) {
      case 'tailors':
        navigate('/tailor-admin/management');
        break;
      case 'requests':
        navigate('/tailor-admin/requests');
        break;
      default:
        navigate('/admin/dashboard');
    }
  };

  return (
    <Container fluid>
      <Row>
        {/* Sidebar */}
        <Col md={2} className="sidebar" style={{
          background: '#4F032A',
          minHeight: '100vh',
          padding: '20px 0',
          color: 'white'
        }}>
          <div className="sidebar-header" style={{ padding: '0 20px', marginBottom: '30px' }}>
            <h3>Punarvasthra</h3>
          </div>
          
          <div className="sidebar-menu">
            {sidebarItems.map((item) => (
              <div
                key={item.value}
                className={`sidebar-item ${activeMenu === item.value ? 'active' : ''}`}
                onClick={() => handleMenuClick(item.value)}
                style={{
                  padding: '15px 20px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  backgroundColor: activeMenu === item.value ? 'rgba(255,255,255,0.1)' : 'transparent',
                  borderLeft: activeMenu === item.value ? '4px solid #FF1493' : 'none'
                }}
              >
                {item.icon}
                <span>{item.text}</span>
              </div>
            ))}
          </div>

          <div
            className="logout-button"
            onClick={handleLogout}
            style={{
              position: 'absolute',
              bottom: '20px',
              left: '0',
              width: '100%',
              padding: '15px 20px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            <FaSignOutAlt />
            <span>Logout</span>
          </div>
        </Col>

        {/* Main Content */}
        <Col md={10} className="main-content" style={{ backgroundColor: '#f5f5f5', padding: '20px' }}>
          <div className="dashboard-container">
            <div className="dashboard-header">
              <div>
                <h2>Dashboard Overview</h2>
                <p>Welcome back, Admin!</p>
              </div>
              <div className="revenue-cards">
                {/* Revenue cards section */}
                <div className="revenue-card daily">
                  <FaMoneyBillWave className="revenue-icon" />
                  <div className="revenue-info">
                    <p>Daily Revenue</p>
                    <h3>Rs. {formatCurrency(stats.dailyRevenue)}</h3>
                  </div>
                </div>
                <div className="revenue-card weekly">
                  <FaMoneyBillWave className="revenue-icon" />
                  <div className="revenue-info">
                    <p>Weekly Revenue</p>
                    <h3>Rs. {formatCurrency(stats.weeklyRevenue)}</h3>
                  </div>
                </div>
                <div className="revenue-card monthly">
                  <FaMoneyBillWave className="revenue-icon" />
                  <div className="revenue-info">
                    <p>Monthly Revenue</p>
                    <h3>Rs. {formatCurrency(stats.monthlyRevenue)}</h3>
                  </div>
                </div>
              </div>
            </div>

            <div className="stats-grid">
              {/* Stats cards section */}
              <div className="stat-card">
                <div className="stat-icon purple">
                  <FaShoppingBag />
                </div>
                <div className="stat-content">
                  <h3>{stats.ordersToday || 0}</h3>
                  <p>Today's Orders</p>
                  <div className="stat-progress">
                    <div className="progress-bar" style={{width: '75%'}}></div>
                  </div>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon purple">
                  <FaChartLine />
                </div>
                <div className="stat-content">
                  <h3>{stats.totalOrders || 0}</h3>
                  <p>Total Orders</p>
                  <div className="stat-progress">
                    <div className="progress-bar" style={{width: '85%'}}></div>
                  </div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon purple">
                  <FaCheckCircle />
                </div>
                <div className="stat-content">
                  <h3>{stats.completedOrders || 0}</h3>
                  <p>Completed</p>
                  <div className="stat-progress">
                    <div className="progress-bar" style={{width: '65%'}}></div>
                  </div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon purple">
                  <FaClock />
                </div>
                <div className="stat-content">
                  <h3>{stats.pendingOrders || 0}</h3>
                  <p>Pending</p>
                  <div className="stat-progress">
                    <div className="progress-bar" style={{width: '45%'}}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default DashboardOverview;
