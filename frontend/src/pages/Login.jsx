import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api.js";
import { useAuth } from "../context/AuthContext";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("DONOR");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Send login request with role
            const res = await api.post("/users/login", { email, password, role });
            // localStorage.setItem("token",res.data.token);
            // localStorage.setItem("role",res.data.role);

            const data = res.data || {};

            // Normalize backend response to prevent undefined issues
            const userObj = {
                role: data.role ?? data.roleName ?? data.role?.name ?? role,
                userId:
                    data.userId ??
                    data.user?.id ??
                    data.user?.userId ??
                    null,

                donorId:
                    data.donorId ??
                    data.donor?.donorId ??
                    null,

                hospitalId:
                    data.hospitalId ??
                    data.hospital?.hospitalId ??
                    null,

                donor: data.donor || null,
                hospital: data.hospital || null,
            };

            // Save to AuthContext
            login(userObj);

            alert("Login successful!");

            // Redirect user based on role
            if (userObj.role === "DONOR") navigate("/donor/dashboard");
            else if (userObj.role === "HOSPITAL") navigate("/hospital/dashboard");
            else navigate("/");

        } catch (error) {
            console.error("Login error:", error);
            alert("Invalid credentials. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <h2 className="mt-6 text-3xl font-bold text-gray-900">Login</h2>
                </div>

                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Select Role</label>
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            <option value="DONOR">Donor</option>
                            <option value="HOSPITAL">Hospital</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email Address
                        </label>
                        <input
                            id="email"
                            type="email"
                            required
                            placeholder="john@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            required
                            placeholder="Your Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center py-2 px-4 rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-gray-600">
                    Don’t have an account?{" "}
                    <a href="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
                        Register Here
                    </a>
                </p>
            </div>
        </div>
    );
};

export default Login;

//export default Login;


// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import api from "../services/api.js";
// import { useAuth } from "../context/AuthContext";
//
// const Login = () => {
//     const [email, setEmail] = useState("");
//     const [password, setPassword] = useState("");
//     const [role, setRole] = useState("DONOR");
//     const [loading, setLoading] = useState(false);
//     const navigate = useNavigate();
//     const { login } = useAuth();
//
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setLoading(true);
//
//         try {
//             const res = await api.post("/users/login", { email, password });
//             const { role, userId, hospital,donor } = res.data;
//
//             // Save user in context
//             login({
//                 userId,
//                 role,
//                 hospitalId: hospital?.hospitalId || null,
//                 donorId: donor?.donorId || null,
//             });
//
//
//
//             alert("Login successful!");
//
//             if (role === "DONOR") navigate("/donor/dashboard");
//             else if (role === "HOSPITAL") navigate("/hospital/dashboard");
//         } catch (error) {
//             console.error("Login error:", error);
//             alert("Invalid credentials. Please try again.");
//         } finally {
//             setLoading(false);
//         }
//     };
//
//     return (
//         <div className="min-h-screen bg-white flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
//             <div className="w-full max-w-md space-y-8">
//                 <div className="text-center">
//                     <h2 className="mt-6 text-3xl font-bold text-gray-900">Login</h2>
//                 </div>
//
//                 <form onSubmit={handleSubmit} className="mt-8 space-y-6">
//                     <div>
//                         <label htmlFor="role" className="block text-sm font-medium text-gray-700">
//                             Select Role
//                         </label>
//                         <select
//                             id="role"
//                             value={role}
//                             onChange={(e) => setRole(e.target.value)}
//                             className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//                         >
//                             <option value="DONOR">Donor</option>
//                             <option value="HOSPITAL">Hospital</option>
//                         </select>
//                     </div>
//
//                     <div>
//                         <label htmlFor="email" className="block text-sm font-medium text-gray-700">
//                             Email address
//                         </label>
//                         <input
//                             id="email"
//                             type="email"
//                             required
//                             placeholder="john@ss.com"
//                             value={email}
//                             onChange={(e) => setEmail(e.target.value)}
//                             className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//                         />
//                     </div>
//
//                     <div>
//                         <label htmlFor="password" className="block text-sm font-medium text-gray-700">
//                             Password
//                         </label>
//                         <input
//                             id="password"
//                             type="password"
//                             required
//                             placeholder="Your Password"
//                             value={password}
//                             onChange={(e) => setPassword(e.target.value)}
//                             className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//                         />
//                     </div>
//
//                     <div>
//                         <button
//                             type="submit"
//                             disabled={loading}
//                             className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                         >
//                             {loading ? "Logging in..." : "Login"}
//                         </button>
//                     </div>
//                 </form>
//
//                 <p className="mt-6 text-center text-sm text-gray-600">
//                     Don’t have an account?{" "}
//                     <a href="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
//                         Register Here
//                     </a>
//                 </p>
//             </div>
//         </div>
//     );
// };
//
// export default Login;

