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
import CustomizationPage from './Tailor/CustomizationPage';
import SareeOptions from './Tailor/SareeOptions';
import CustomizationFormm from './Tailor/Customizationformm';
import OurTailors from './Tailor/OurTailors';
import CustomizationRequests from './Tailor/CustomizationRequests';
import TailorAdmin from './Tailor/TailorAdmin';
import TailorDashboard from './Tailor/TailorDashboard';
import DashboardOverview from './Tailor/DashboardOverview';
import TailorManagement from './Tailor/TailorManagement';

function AppWrapper() {
    return (
        <Router>
            <Routes>
                {/* Existing routes */}
                <Route path="/" element={<CustomerPage />} />
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
            </Routes>
        </Router>
    );
}

export default AppWrapper;