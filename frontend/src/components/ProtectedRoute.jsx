import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const ProtectedRoute = ({ children, role }) => {
    const { user, token } = useAuth();

    if (!token || !user) {
        // ⛔ Not logged in → redirect
        return <Navigate to="/login" replace />;
    }

    if (role && user.role !== role) {
        // 🚫 Role mismatch → redirect to home or dashboard
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;