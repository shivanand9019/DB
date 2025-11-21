import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
    return (
        <div className="flex flex-col items-center justify-center text-center min-h-[80vh] p-5">
            <h1 className="text-4xl font-bold text-black mb-2 font-sans">
                Welcome to Blood Donation System
            </h1>
            <p className="text-lg text-gray-800 mt-2 mb-6 max-w-xl">
                Donate blood, save lives. Connect hospitals with donors and help build a stronger healthcare system.
            </p>

            <div className="flex justify-center gap-4">
                <Link
                    to="/register"
                    className="font-semibold mt-5 px-5 py-3 rounded-lg text-white shadow-md bg-orange-600 hover:bg-indigo-900 transition"
                >
                    Get Started
                </Link>

            </div>
        </div>
    );
};

export default Home;
