import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import CustomerPage from './sareehome';
import AddSaree from './add_saree';
import AdminEdit from './admin_edit';
import AboutUs from './AboutUs';
import Admin from './Admin';
import FlashSale from './FlashSale';
import TailorHome from './Tailor/TailorHome';
import CustomizationPage from './Tailor/CustomizationPage';
import SareeOptions from './Tailor/SareeOptions';
import CustomizationFormm from './Tailor/Customizationformm';
import OurTailors from './Tailor/OurTailors';
import CustomizationRequests from './Tailor/CustomizationRequests';
import TailorAdmin from './Tailor/TailorAdmin';
import TailorDashboard from './Tailor/TailorDashboard';
import DashboardOverview from './Tailor/DashboardOverview';
import TailorManagement from './Tailor/TailorManagement';
import Cart from './cart';
import OrderForm from './OrderForm';
import AdminDashboard from './AdminDashboard';
import Login from './components/Login';
import Signup from './components/Signup';

function App() {
  const isAuthenticated = () => {
    return localStorage.getItem('token') !== null || localStorage.getItem('isAdmin') === 'true';
  };

  const isAdmin = () => {
    return localStorage.getItem('isAdmin') === 'true';
  };

  const PrivateRoute = ({ children, adminOnly = false }) => {
    if (!isAuthenticated()) {
      return <Navigate to="/login" />;
    }
    if (adminOnly && !isAdmin()) {
      return <Navigate to="/home" />;
    }
    return children;
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route 
          path="/home" 
          element={
            <PrivateRoute>
              <CustomerPage />
            </PrivateRoute>
          } 
        />
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Existing routes */}
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/add" element={<AddSaree />} />
        <Route path="/admin/edit" element={<AdminEdit />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/flash-sale" element={<FlashSale />} />

        {/* Tailor routes */}
        <Route path="/customization" element={<TailorHome />} />
        <Route path="/customize" element={<CustomizationPage />} />
        <Route path="/website-saree" element={<SareeOptions />} />
        <Route path="/own-saree" element={<SareeOptions />} />
        <Route path="/customize/:type" element={<CustomizationFormm />} />
        <Route path="/our-tailors" element={<OurTailors />} />
        
        {/* Tailor Admin routes */}
        <Route path="/tailor-admin" element={<TailorAdmin />}>
          <Route index element={<DashboardOverview />} />
          <Route path="dashboard" element={<DashboardOverview />} />
          <Route path="management" element={<TailorManagement />} />
          <Route path="requests" element={<CustomizationRequests />} />
        </Route>
        
        {/* Individual Tailor Dashboard */}
        <Route path="/tailor-dashboard" element={<TailorDashboard />} />
        <Route path="/customization-requests" element={<CustomizationRequests />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/order-form" element={<OrderForm />} />

        {/* Admin Dashboard route */}
        <Route path="/admin/orders" element={<AdminDashboard />} />
        <Route 
          path="/admin/dashboard" 
          element={
            <PrivateRoute adminOnly={true}>
              <DashboardOverview />
            </PrivateRoute>
          } 
        />

        {/* Add more routes as needed */}
      </Routes>
    </Router>
  );
}

export default App;