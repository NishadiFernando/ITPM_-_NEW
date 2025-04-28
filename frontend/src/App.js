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
    return localStorage.getItem('token') !== null || localStorage.getItem('isAdmin') !== null;
  };

  const PrivateRoute = ({ children, adminType }) => {
    const isAdmin = localStorage.getItem('isAdmin');
    if (!isAuthenticated()) {
      return <Navigate to="/login" />;
    }
    if (adminType && isAdmin !== adminType) {
      return <Navigate to="/login" />;
    }
    return children;
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        {/* Main Admin Route */}
        <Route path="/admin/dashboard" element={
          <PrivateRoute adminType="admin">
            <AdminDashboard />
          </PrivateRoute>
        } />

        {/* Manager Admin Route */}
        <Route path="/admin" element={
          <PrivateRoute adminType="manager">
            <Admin />
          </PrivateRoute>
        } />

        {/* Tailor Admin Route */}
        <Route path="/tailor-admin/*" element={
          <PrivateRoute adminType="tailor">
            <TailorAdmin />
          </PrivateRoute>
        } />

        {/* Customer Route */}
        <Route path="/sareehome" element={
          <PrivateRoute>
            <CustomerPage />
          </PrivateRoute>
        } />

        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;