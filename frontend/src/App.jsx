import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";

import { AuthProvider, useAuth } from './context/AuthContext.jsx';

import Home from './components/Home.jsx';
import Contact from './components/Contact.jsx';
import About from './components/About.jsx';
import PublicLayout from './components/PublicLayout.jsx';
import DashboardLayout from './components/DashboardLayout.jsx';

import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import DonorDashBoard from './pages/DonorDashBoard.jsx';
import HospitalDashBoard from './pages/HospitalDashBoard.jsx';


//  Private Route Component
const PrivateRoute = ({ allowedRoles }) => {
    const { user } = useAuth();

    if (!user) return <Navigate to="/login" replace />;        // Not logged in
    if (!allowedRoles.includes(user.role)) return <Navigate to="/" replace />; // Not allowed

    return <Outlet />;  // Continue rendering
};


function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>

                    {/* Public Routes */}
                    <Route element={<PublicLayout />}>
                        <Route path="/" element={<Home />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/contactus" element={<Contact />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                    </Route>


                    {/* Protected Routes */}
                    <Route element={<PrivateRoute allowedRoles={['DONOR', 'HOSPITAL']} />}>
                        <Route element={<DashboardLayout />}>

                            {/* Donor */}
                            <Route path="/donor/dashboard" element={<DonorDashBoard />} />
                            <Route path="/donor/profile" element={<DonorDashBoard />} />

                            {/* Hospital */}
                            <Route path="/hospital/dashboard" element={<HospitalDashBoard />} />
                        </Route>
                    </Route>

                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
