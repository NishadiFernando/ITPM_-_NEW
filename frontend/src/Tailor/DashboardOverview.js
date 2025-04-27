import React, { useState, useEffect } from 'react';
import { 
  FaShoppingBag, 
  FaChartLine, 
  FaCheckCircle, 
  FaClock,
  FaMoneyBillWave
} from 'react-icons/fa';
import axios from 'axios';
import './DashboardOverview.css';

const defaultStats = {
  ordersToday: 0,
  totalOrders: 0,
  completedOrders: 0,
  pendingOrders: 0,
  totalRevenue: 0,
  monthlyGrowth: 0,
  recentOrders: [],
  popularProducts: [],
  totalCustomers: 0,
  totalProducts: 0,
  dailyRevenue: 0,
  weeklyRevenue: 0,
  monthlyRevenue: 0
};

const DashboardOverview = () => {
  const [stats, setStats] = useState(defaultStats);
  const [isLoading, setIsLoading] = useState(false);

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

  const formatCurrency = (amount) => {
    return Number(amount || 0).toLocaleString();
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <h2>Dashboard Overview</h2>
          <p>Welcome back, Admin!</p>
        </div>
        <div className="revenue-cards">
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

      <div className="dashboard-grid">
        <div className="recent-orders">
          <h3>Recent Orders</h3>
          <div className="order-list">
            {stats?.recentOrders?.map((order) => (
              <div key={order?.id || Math.random()} className="order-item">
                <div className="order-info">
                  <h4>{order?.customerName || 'No Name'}</h4>
                  <p>{order?.orderNumber || 'No Order Number'}</p>
                </div>
                <div className="order-status">{order?.status || 'Unknown'}</div>
                <div className="order-amount">
                  Rs. {formatCurrency(order?.amount)}
                </div>
              </div>
            )) || (
              <div className="no-data">No recent orders available</div>
            )}
          </div>
        </div>

        <div className="popular-products">
          <h3>Popular Products</h3>
          <div className="product-list">
            {stats?.popularProducts?.map((product) => (
              <div key={product?.id || Math.random()} className="product-item">
                <img 
                  src={product?.image || 'default-product.png'} 
                  alt={product?.name || 'Product'} 
                />
                <div className="product-info">
                  <h4>{product?.name || 'Unnamed Product'}</h4>
                  <p>{product?.orders || 0} orders</p>
                </div>
                <div className="product-price">
                  Rs. {formatCurrency(product?.price)}
                </div>
              </div>
            )) || (
              <div className="no-data">No popular products available</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
