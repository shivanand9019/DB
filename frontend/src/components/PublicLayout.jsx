import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

const PublicLayout = () => {
    return (
        <div className="app-container">
            <Navbar />
            <main style={{ minHeight: "80vh" }}>
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default PublicLayout;



