import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import CustomerPage from './sareehome';
import AddSaree from './add_saree';
import AdminEdit from './admin_edit';
import AboutUs from './AboutUs';
import Admin from './Admin';
import FlashSale from './FlashSale';

import TailorHome from './Tailor/TailorHome';

// Wrap App with Router
function AppWrapper() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<CustomerPage />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/admin/add" element={<AddSaree />} />
                <Route path="/admin/edit" element={<AdminEdit />} />
                <Route path="/about" element={<AboutUs />} />
                <Route path="/flash-sale" element={<FlashSale />} />

                <Route path="/customization" element={<TailorHome />} />
            </Routes>
        </Router>
    );
}

export default AppWrapper;