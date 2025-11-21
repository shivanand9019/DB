
import React from "react";
import { Outlet } from "react-router-dom";

const DashboardLayout = () => {
    return (
        <div className="dashboard-container">
            
            <Outlet /> 
        </div>
    );
};

export default DashboardLayout;