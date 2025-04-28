import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Customer interfaces
import CustomerPage from './sareehome';
import Cart from './cart';
import FlashSale from './FlashSale';
import AboutUs from './AboutUs';
import OrderForm from './OrderForm';

// Admin interfaces
import Admin from './Admin';
import AdminDashboard from './AdminDashboard';
import AddSaree from './add_saree';
import AdminEdit from './admin_edit';

// Tailor interfaces
import TailorHome from './Tailor/TailorHome';
import CustomizationPage from './Tailor/CustomizationPage';
import SareeOptions from './Tailor/SareeOptions';
import CustomizationFormm from './Tailor/Customizationformm';
import OurTailors from './Tailor/OurTailors';
import CustomizationRequests from './Tailor/CustomizationRequests';
import CustomizationForm from './Tailor/CustomizationForm';
import TailorAdmin from './Tailor/TailorAdmin';

// Auth components
import Login from './components/Login';
import Signup from './components/Signup';

function App() {
  return (
    <Router>
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Customer Routes */}
        <Route path="/sareehome" element={<CustomerPage />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/flash-sale" element={<FlashSale />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/order" element={<OrderForm />} />

        {/* Tailor Flow Routes */}
        <Route path="/tailor-home" element={<TailorHome />} />
        <Route path="/customization" element={<CustomizationPage />} />
        <Route path="/saree-options/:type" element={<SareeOptions />} />
        <Route path="/customize/:type" element={<CustomizationFormm />} />
        <Route path="/our-tailors" element={<OurTailors />} />

        {/* Tailor Routes */}
        <Route path="/customization-requests" element={<CustomizationRequests />} />

        {/* Tailor Admin Routes */}
        <Route path="/tailor-admin/*" element={<TailorAdmin />} />
        <Route path="/tailor-admin/management" element={<TailorAdmin />} />
        <Route path="/tailor-admin/requests" element={<TailorAdmin />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/add" element={<AddSaree />} />
        <Route path="/admin/edit" element={<AdminEdit />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />

        {/* Default Route */}
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;