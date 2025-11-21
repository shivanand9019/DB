import React, { useState } from "react";
import api from "../services/api.js";
import { useNavigate } from "react-router-dom";

export default function Register() {
    const [role, setRole] = useState("donor");
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullName: "",
        age: "",
        gender:"",
        bloodGroup: "",
        lastDonationDate:"",
        email: "",
        phoneNumber: "",
        city: "",
        password: "",
        hospitalName: "",
        address: "",
        hospitalContactNumber: "",
    });

    const [loading, setLoading] = useState(false);
    // const[selectedDate,setSelectedDate]=useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Step 1: Register User (common)
            const userRes = await api.post("/users/register", {
                email: formData.email,
                password: formData.password,
                role: role.toUpperCase(),
            });


            const userId = userRes.data.userId;

            // Step 2: Register Donor or Hospital
            if (role === "donor") {
                await api.post("/donors/register", {
                    userId,
                    fullName: formData.fullName,
                    age: parseInt(formData.age),
                    gender:formData.gender,
                    bloodGroup: formData.bloodGroup,
                    lastDonationDate:formData.lastDonationDate,
                    email:formData.email,
                    phoneNumber: formData.phoneNumber,
                    city: formData.city,
                });
            } else {
                await api.post("/hospitals/register", {
                    userId,
                    hospitalName: formData.hospitalName,
                    hospitalAddress: formData.address,
                    hospitalContactNumber: formData.contactNumber,
                    email: formData.email,
                });
            }

            alert(`${role} registered successfully!`);
            navigate("/login");
        } catch (error) {
            console.error(error);
            alert(
                "Registration failed: " +
                (error.response?.data?.message || "Please try again.")
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <img
                        className="mx-auto h-12 w-auto"
                        //src="" // Add your logo here
                        alt="Your Company"
                    />
                    <h2 className="mt-6 text-3xl font-bold text-gray-900">Register</h2>
                </div>



                <div>
                    <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                        Select Role
                    </label>
                    <select
                        id="role"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                        <option value="donor">Donor</option>
                        <option value="hospital">Hospital</option>
                    </select>
                </div>



                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                    {role === "donor" ? (
                        <>

                            <input
                                name="fullName"
                                type="text"
                                placeholder="Full Name"
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                            <input
                                name="age"
                                type="number"
                                placeholder="Age"
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                            <select
                                name = "gender"
                                required
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                <option value="">Select Gender</option>
                                <option value="Male">M</option>
                                <option value="Female">F</option>
                                <option value="Other">Other</option>
                            </select>
                            <label className="block text-sm font-medium text-gray-700">
                                Last Donation Date
                            </label>
                            <input
                                name="lastDonationDate"
                                type="date"
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                            <select
                                name ="bloodGroup"
                                required
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                <option value="">Select Blood Group</option>
                                <option value="A+">A+</option>
                                <option value="A-">A-</option>
                                <option value="B+">B+</option>
                                <option value="B-">B-</option>
                                <option value="O+">O+</option>
                                <option value="O-">O-</option>
                                <option value="AB+">AB+</option>
                                <option value="AB-">AB-</option>
                            </select>
                            <input
                                name ="email"
                                type="email"
                                placeholder="Email"
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />

                            <input
                                name="phoneNumber"
                                type="tel"
                                onChange={handleChange}
                                placeholder="Phone Number"
                                required
                                className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                            <input
                                name="city"
                                type="text"
                                placeholder="City"
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                            <input
                                name="password"
                                type="password"
                                placeholder="Password"
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                            <input
                                type="password"
                                placeholder="Confirm Password"
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </>
                    ) : (
                        <>

                            <input
                                name = "hospitalName"
                                type="text"
                                onChange={handleChange}
                                placeholder="Hospital Name"
                                required
                                className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                            <input
                                name ="address"
                                onChange={handleChange}
                                type="text"
                                placeholder="Address"
                                required
                                className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                            <input
                                name = "hospitalContactNumber"
                                onChange={handleChange}
                                type="tel"
                                placeholder="Contact Number"
                                required
                                className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                            <input
                                name="email"
                                onChange={handleChange}
                                type="email"
                                placeholder="Email"
                                required
                                className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                            <input
                                name="password"
                                onChange={handleChange}
                                type="password"
                                placeholder="Password"
                                required
                                className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                            <input
                                name="password"
                                onChange={handleChange}
                                type="password"
                                placeholder="Confirm Password"
                                required
                                className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </>
                    )}

                    <button
                        type="submit" disabled={loading}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                        {loading ? "Registering...":"Register"}

                    </button>

                    <p className="mt-6 text-center text-sm text-gray-600">
                        Already have an account?{" "}
                        <a href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                            Login Here
                        </a>
                    </p>

                </form>
                <div>

                </div>


            </div>
        </div>
    );
}