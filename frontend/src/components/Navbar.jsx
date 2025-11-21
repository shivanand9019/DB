
import React from "react";
import { NavLink } from "react-router-dom";

export default function Navbar() {
    return (
        <nav className="flex justify-between items-center fixed top-0 left-0 bg-orange-600 px-6 py-4 shadow-md w-full z-50">

            <div className="text-white text-lg font-bold">
                <a href="/">Blood Donation</a>
            </div>


            <ul className="flex items-center gap-12 m-0 p-0 list-none">
                <li className="flex gap-8">
                    <NavLink
                        to="/"
                        className={({ isActive }) =>
                            isActive
                                ? "text-white border-b-2 border-white font-semibold pb-1"
                                : "text-white hover:opacity-80"
                        }
                    >
                        Home
                    </NavLink>
                    <NavLink
                        to="/about"
                        className={({ isActive }) =>
                            isActive
                                ? "text-white border-b-2 border-white font-semibold pb-1"
                                : "text-white hover:opacity-80"
                        }
                    >
                        About
                    </NavLink>
                    <NavLink
                        to="/contactus"
                        className={({ isActive }) =>
                            isActive
                                ? "text-white border-b-2 border-white font-semibold pb-1"
                                : "text-white hover:opacity-80"
                        }
                    >
                        Contact
                    </NavLink>
                    <NavLink
                        to="/login"
                        className={({ isActive }) =>
                            isActive
                                ? "text-white border-b-2 border-white font-semibold pb-1"
                                : "text-white hover:opacity-80"
                        }
                    >
                        Login
                    </NavLink>
                    <NavLink
                        to="/register"
                        className={({ isActive }) =>
                            isActive
                                ? "text-white border-b-2 border-white font-semibold pb-1"
                                : "text-white hover:opacity-80"
                        }
                    >
                        Register
                    </NavLink>

                </li>
            </ul>
        </nav>
    );
}
