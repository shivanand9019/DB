import React, { useState, useEffect } from "react";
import api from "../../services/api.js";
import { useAuth } from "../../context/AuthContext.jsx";

export default function DonorSettings() {
    const { user } = useAuth();
    const userId = user?.userId || localStorage.getItem("userId");

    const [formData, setFormData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
        emailNotifications: false,
        smsNotifications: false,
    });

    // ----------------------------------------------------------
    // Fetch user preferences on mount
    // ----------------------------------------------------------
    useEffect(() => {
        async function fetchPreferences() {
            try {
                const res = await api.get(`/users/${userId}/preferences`);
                setFormData((prev) => ({
                    ...prev,
                    emailNotifications: res.data.emailNotifications,
                    smsNotifications: res.data.smsNotifications,
                }));
            } catch (err) {
                console.error("Error loading preferences:", err);
            }
        }

        if (userId) fetchPreferences();
    }, [userId]);

    // ----------------------------------------------------------
    // Handle input change
    // ----------------------------------------------------------
    const handleChange = (e) => {
        const { name, type, checked, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    // ----------------------------------------------------------
    // Submit changes
    // ----------------------------------------------------------
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Password check
        if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
            alert("New passwords do not match.");
            return;
        }

        try {
            // Update password only when provided
            if (formData.newPassword.trim() !== "") {
                await api.put(`/users/password`, {
                    userId,
                    currentPassword: formData.currentPassword.trim(),
                    newPassword: formData.newPassword.trim(),
                });
            }

            // Update preferences
            await api.put(`/users/${userId}/preferences`, {
                emailNotifications: formData.emailNotifications,
                smsNotifications: formData.smsNotifications,
            });

            alert("Settings updated successfully!");

            // Reset password fields after update
            setFormData((prev) => ({
                ...prev,
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
            }));
        } catch (err) {
            console.error("Error updating settings:", err);
            alert(
                "Failed to update settings: " +
                (err.response?.data?.message || err.message)
            );
        }
    };

    return (
        <div className="w-full p-6 bg-white rounded-xl shadow-md">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                Account Settings
            </h2>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Password Section */}
                <div>
                    <h3 className="text-lg font-semibold mb-3">Change Password</h3>

                    <div className="space-y-4">
                        {/* Current Password */}
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Current Password
                            </label>
                            <input
                                type="password"
                                name="currentPassword"
                                value={formData.currentPassword}
                                onChange={handleChange}
                                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* New Password */}
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                New Password
                            </label>
                            <input
                                type="password"
                                name="newPassword"
                                value={formData.newPassword}
                                onChange={handleChange}
                                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Confirm New Password
                            </label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                </div>

                {/* Notification Preferences */}
                <div>
                    <h3 className="text-lg font-semibold mb-3">
                        Notification Preferences
                    </h3>

                    <div className="space-y-2">
                        <label className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                name="emailNotifications"
                                checked={formData.emailNotifications}
                                onChange={handleChange}
                                className="w-5 h-5"
                            />
                            <span>Email Notifications</span>
                        </label>

                        <label className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                name="smsNotifications"
                                checked={formData.smsNotifications}
                                onChange={handleChange}
                                className="w-5 h-5"
                            />
                            <span>SMS Notifications</span>
                        </label>
                    </div>
                </div>

                {/* Save Button */}
                <div className="pt-4">
                    <button
                        type="submit"
                        className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-lg transition"
                    >
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    );
}



// import React, { useState, useEffect } from "react";
//
// import api from "../../services/api";
// import { useAuth } from "../../context/AuthContext.jsx";
//
// export default function DonorSettings() {
//     const { user } = useAuth();
//     const userId = user?.userId || localStorage.getItem("userId");
//
//
// import axios from "axios";
//
// export default function DonorSettings() {
//     const [formData, setFormData] = useState({
//         currentPassword: "",
//         newPassword: "",
//         confirmPassword: "",
//         emailNotifications: true,
//         smsNotifications: false,
//     });
//
//
//     // ✅ Fetch existing preferences
//     useEffect(() => {
//         const fetchPreferences = async () => {
//             try {
//                 const response = await api.get(`/users/${userId}/preferences`);
//
//     // Optional: Load existing notification preferences on mount
//     useEffect(() => {
//         async function fetchPreferences() {
//             try {
//                 const response = await axios.get(
//                     "http://localhost:8080/api/users/preferences",
//                     { withCredentials: true }
//                 );
//                 setFormData((prev) => ({
//                     ...prev,
//                     emailNotifications: response.data.emailNotifications,
//                     smsNotifications: response.data.smsNotifications,
//                 }));
//
//             } catch (err) {
//                 console.error("Error fetching preferences:", err);
//             }
//         };
//         if (userId) fetchPreferences();
//     }, [userId]);
//
//     const handleChange = (e) => {
//         const { name, type, checked, value } = e.target;
//         setFormData((prev) => ({
//             ...prev,
//             [name]: type === "checkbox" ? checked : value,
//         }));
//
//             } catch (error) {
//                 console.error("Error fetching preferences:", error);
//             }
//         }
//         fetchPreferences();
//     }, []);
//
//     const handleChange = (e) => {
//         const { name, type, checked, value } = e.target;
//         setFormData({
//             ...formData,
//             [name]: type === "checkbox" ? checked : value,
//         });
//     };
//
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//
//
//
//         // Check password match
//         if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
//             alert("New passwords do not match.");
//             return;
//         }
//
//         try {
//
//             // ✅ Update password only if provided
//             if (formData.newPassword) {
//                 await api.put(`/users/password`, {
//                     userId: userId, // ✅ Include userId in body
//                     currentPassword: formData.currentPassword.trim(),
//                     newPassword: formData.newPassword.trim(),
//                 });
//             }
//
//             // ✅ Update preferences
//             await api.put(`/users/${userId}/preferences`, {
//                 emailNotifications: formData.emailNotifications,
//                 smsNotifications: formData.smsNotifications,
//             });
//
//             // Update password if provided
//             if (formData.newPassword) {
//                 await axios.put(
//                     "http://localhost:8080/api/users/password", // no userId in URL
//                     {
//                         currentPassword: formData.currentPassword.trim(),
//                         newPassword: formData.newPassword.trim(),
//                     },
//                     {
//                         headers: { "Content-Type": "application/json" },
//                         withCredentials: true,
//                     }
//                 );
//             }
//
//             // Update notification preferences
//             await axios.put(
//                 "http://localhost:8080/api/users/preferences", // no userId
//                 {
//                     emailNotifications: formData.emailNotifications,
//                     smsNotifications: formData.smsNotifications,
//                 },
//                 {
//                     headers: { "Content-Type": "application/json" },
//                     withCredentials: true,
//                 }
//             );
//
//             alert("Settings updated successfully!");
//             setFormData((prev) => ({
//                 ...prev,
//                 currentPassword: "",
//                 newPassword: "",
//                 confirmPassword: "",
//             }));
//         } catch (error) {
//
//             console.error("Error updating settings:", error);
//
//             console.error(error);
//             alert(
//                 "Error updating settings: " +
//                 (error.response?.data || error.message)
//             );
//         }
//     };
//
//     return (
//         <div className="w-full p-6 bg-white rounded-xl shadow-md">
//
//             <h2 className="text-2xl font-semibold text-gray-800 mb-6">Account Settings</h2>
//
//             <h2 className="text-2xl font-semibold text-gray-800 mb-6">
//                 Account Settings
//             </h2>
//
//             <form onSubmit={handleSubmit} className="space-y-8">
//                 {/* Password Section */}
//                 <div>
//
//                     <h3 className="text-lg font-semibold mb-3">Change Password</h3>
//                     <div className="space-y-4">
//                         <div>
//                             <label className="block text-sm font-medium mb-1">Current Password</label>
//
//                     <h3 className="text-lg font-semibold mb-3">
//                         Change Password
//                     </h3>
//                     <div className="space-y-4">
//                         <div>
//                             <label className="block text-sm font-medium mb-1">
//                                 Current Password
//                             </label>
//                             <input
//                                 type="password"
//                                 name="currentPassword"
//                                 value={formData.currentPassword}
//                                 onChange={handleChange}
//                                 className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                             />
//                         </div>
//                         <div>
//
//                             <label className="block text-sm font-medium mb-1">New Password</label>
//
//                             <label className="block text-sm font-medium mb-1">
//                                 New Password
//                             </label>
//                             <input
//                                 type="password"
//                                 name="newPassword"
//                                 value={formData.newPassword}
//                                 onChange={handleChange}
//                                 className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                             />
//                         </div>
//                         <div>
//
//                             <label className="block text-sm font-medium mb-1">Confirm New Password</label>
//
//                             <label className="block text-sm font-medium mb-1">
//                                 Confirm New Password
//                             </label>
//                             <input
//                                 type="password"
//                                 name="confirmPassword"
//                                 value={formData.confirmPassword}
//                                 onChange={handleChange}
//                                 className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                             />
//                         </div>
//                     </div>
//                 </div>
//
//                 {/* Notifications Section */}
//                 <div>
//
//                     <h3 className="text-lg font-semibold mb-3">Notification Preferences</h3>
//
//                     <h3 className="text-lg font-semibold mb-3">
//                         Notification Preferences
//                     </h3>
//                     <div className="space-y-2">
//                         <label className="flex items-center space-x-2">
//                             <input
//                                 type="checkbox"
//                                 name="emailNotifications"
//                                 checked={formData.emailNotifications}
//                                 onChange={handleChange}
//                                 className="w-5 h-5 text-blue-600 rounded focus:ring-0"
//                             />
//                             <span>Email Notifications</span>
//                         </label>
//                         <label className="flex items-center space-x-2">
//                             <input
//                                 type="checkbox"
//                                 name="smsNotifications"
//                                 checked={formData.smsNotifications}
//                                 onChange={handleChange}
//                                 className="w-5 h-5 text-blue-600 rounded focus:ring-0"
//                             />
//                             <span>SMS Notifications</span>
//                         </label>
//                     </div>
//                 </div>
//
//                 <div className="pt-4">
//                     <button
//                         type="submit"
//                         className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-lg transition"
//                     >
//                         Save Changes
//                     </button>
//                 </div>
//             </form>
//         </div>
//     );
// }
