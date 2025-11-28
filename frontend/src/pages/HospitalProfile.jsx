import React, { useState, useEffect } from "react";
import api from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function HospitalProfile() {
    const { user } = useAuth();
    const userId = user?.userId;

    const [hospital, setHospital] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);

    const [hospitalAddress, setHospitalAddress] = useState("");
    const [hospitalContactNumber, setHospitalContactNumber] = useState("");

    const [uploading, setUploading] = useState(false);

    // ---------------------------------------------------
    // Load Hospital Profile
    // ---------------------------------------------------
    useEffect(() => {
        if (!userId) {
            console.error("No userId found in AuthContext");
            setLoading(false);
            return;
        }

        api.get(`/hospitals/profile/${userId}`)
            .then((res) => {
                const h = res.data;

                if (h.profilePic) {
                    h.profilePic = `data:image/jpeg;base64,${h.profilePic}`;
                }

                setHospital(h);
                setHospitalAddress(h.hospitalAddress || "");
                setHospitalContactNumber(h.hospitalContactNumber || "");
            })
            .catch((err) => console.error("Error fetching hospital profile:", err))
            .finally(() => setLoading(false));
    }, [userId]);

    // ---------------------------------------------------
    // Upload Picture
    // ---------------------------------------------------
    const handlePicUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);

        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await api.post(
                `/hospitals/upload-photo/${hospital.hospitalId}`,
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );

            setHospital((prev) => ({
                ...prev,
                profilePic: `data:image/jpeg;base64,${res.data}`
            }));

            alert("Profile picture updated!");
        } catch (err) {
            console.error("Error uploading profile picture:", err);
            alert("Upload failed");
        } finally {
            setUploading(false);
        }
    };

    // ---------------------------------------------------
    // Save Profile
    // ---------------------------------------------------
    const handleSave = () => {
        const updatedHospital = {
            ...hospital,
            hospitalAddress,
            hospitalContactNumber,
        };

        api.put(`/hospitals/update/${hospital.hospitalId}`, updatedHospital)
            .then((res) => {
                setHospital(res.data);
                setEditing(false);
                alert("Profile updated successfully!");
            })
            .catch((err) => {
                console.error("Error updating hospital:", err);
                alert("Update failed");
            });
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-full">
                <p className="text-gray-600 text-lg">Loading hospital profile...</p>
            </div>
        );
    }

    if (!hospital) {
        return (
            <div className="flex justify-center items-center h-full">
                <p className="text-red-600 text-lg"> Failed to load hospital profile</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center w-full bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6 text-black">Hospital Profile</h2>

            <div className="p-6 flex flex-col md:flex-row gap-6 w-full">

                {/* Profile Picture */}
                <div className="flex flex-col items-center w-full md:w-1/3">
                    <div className="w-32 h-32 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center mb-3">
                        {hospital.profilePic ? (
                            <img
                                src={hospital.profilePic}
                                alt="Hospital"
                                className="object-cover w-full h-full"
                            />
                        ) : (
                            <span className="text-gray-500">No Image</span>
                        )}
                    </div>

                    <label className="text-sm text-blue-600 hover:underline cursor-pointer">
                        {uploading ? "Uploading..." : "Upload Photo"}
                        <input type="file" className="hidden" onChange={handlePicUpload} />
                    </label>
                </div>

                {/* Info */}
                <div className="w-full md:w-2/3 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-600">
                                Hospital Name
                            </label>
                            <p className="text-black mt-1 font-semibold">
                                {hospital.hospitalName}
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-600">
                                Email
                            </label>
                            <p className="text-black mt-1 font-semibold">
                                {hospital.user?.email}
                            </p>
                        </div>
                    </div>

                    {/* Editable Inputs */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-600">
                                Address
                            </label>
                            {editing ? (
                                <input
                                    type="text"
                                    value={hospitalAddress}
                                    onChange={(e) => setHospitalAddress(e.target.value)}
                                    className="mt-1 w-full border rounded-lg p-2 text-black"
                                />
                            ) : (
                                <p className="text-black mt-1 font-semibold">
                                    {hospital.hospitalAddress}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-600">
                                Contact Number
                            </label>
                            {editing ? (
                                <input
                                    type="text"
                                    value={hospitalContactNumber}
                                    onChange={(e) => setHospitalContactNumber(e.target.value)}
                                    className="mt-1 w-full border rounded-lg p-2 text-black"
                                />
                            ) : (
                                <p className="text-black mt-1 font-semibold">
                                    {hospital.hospitalContactNumber}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="pt-4">
                        {editing ? (
                            <div className="flex gap-3">
                                <button
                                    onClick={handleSave}
                                    className="bg-blue-600 text-white px-4 py-2 rounded"
                                >
                                    Save
                                </button>

                                <button
                                    onClick={() => setEditing(false)}
                                    className="bg-gray-300 text-black px-4 py-2 rounded"
                                >
                                    Cancel
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => setEditing(true)}
                                className="bg-blue-600 text-white px-4 py-2 rounded"
                            >
                                Edit Profile
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}



// import React, { useState, useEffect } from "react";
// import api from "../services/api.js";
// import { useAuth } from "../context/AuthContext.jsx";
//
// export default function HospitalProfile() {
//     const { user } = useAuth();
//
//     const userId = user?.userId;
//     const [hospital, setHospital] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [editing, setEditing] = useState(false);
//
//     // editable fields
//     const [hospitalAddress, setHospitalAddress] = useState("");
//     const [hospitalContactNumber, setHospitalContactNumber] = useState("");
//
//     // --------------------------------------------
//     // Fetch hospital profile once userId exists
//     // --------------------------------------------
//     useEffect(() => {
//         if (!userId) {
//             console.error(" No userId found in AuthContext");
//             setLoading(false);
//             return;
//         }
//
//         api.get(`/hospitals/profile/${userId}`)
//             .then((res) => {
//
//                 const h = res.data;
//                 if (h.profilePic) {
//                     h.profilePic = `data:image/jpeg;base64,${h.profilePic}`;
//                 }
//                 setHospital(h);
//
//                 setHospitalAddress(h.hospitalAddress || "");
//                 setHospitalContactNumber(h.hospitalContactNumber || "");
//             })
//             .catch((err) => {
//                 console.error("Error fetching hospital profile:", err);
//             })
//             .finally(() => setLoading(false));
//     }, [userId]);
//
//     // --------------------------------------------
//     // Save hospital profile updates
//     // --------------------------------------------
//     const handleSave = () => {
//         const updatedHospital = {
//             ...hospital,
//             hospitalAddress,
//             hospitalContactNumber,
//         };
//
//         api.put(`/hospitals/update/${hospital.hospitalId}`, updatedHospital)
//             .then((res) => {
//                 setHospital(res.data);
//                 setEditing(false);
//                 alert("Profile updated successfully!");
//             })
//             .catch((err) => {
//                 console.error("Error updating hospital:", err);
//                 alert("Update failed");
//             });
//     };
//
//
//     // --------------------------------------------
//     // Loading state
//     // --------------------------------------------
//     if (loading) {
//         return (
//             <div className="flex justify-center items-center h-full">
//                 <p className="text-gray-600 text-lg">Loading hospital profile...</p>
//             </div>
//         );
//     }
//
//     // --------------------------------------------
//     // Invalid ID or failed fetch
//     // --------------------------------------------
//     if (!hospital) {
//         return (
//             <div className="flex justify-center items-center h-full">
//                 <p className="text-red-600 text-lg">⚠ Failed to load hospital profile</p>
//             </div>
//         );
//     }
//
//     // --------------------------------------------
//     // Main UI
//     // --------------------------------------------
//     return (
//         <div className="flex flex-col items-center w-full bg-white rounded-lg shadow-md p-6">
//             <h2 className="text-2xl font-bold mb-6 text-black">🏥 Hospital Profile</h2>
//
//             <div className="p-6 flex flex-col md:flex-row gap-6 w-full">
//
//                 {/* Profile Picture Section */}
//                 <div className="flex flex-col items-center w-full md:w-1/3">
//                     <div className="w-32 h-32 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center mb-3">
//                         {hospital.profilePic ? (
//                             <img
//                                 src={hospital.profilePic}
//                                 alt="Hospital"
//                                 className="object-cover w-full h-full"
//                             />
//                         ) : (
//                             <span className="text-gray-500">No Image</span>
//                         )}
//                     </div>
//
//                     <button className="text-sm text-blue-600 hover:underline">
//                         Upload Photo
//                     </button>
//                 </div>
//
//                 {/* Details Section */}
//                 <div className="w-full md:w-2/3 space-y-4">
//                     {/* Non-editable fields */}
//                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                         <div>
//                             <label className="block text-sm font-medium text-gray-600">
//                                 Hospital Name
//                             </label>
//                             <p className="text-black mt-1 font-semibold">
//                                 {hospital.hospitalName || "-"}
//                             </p>
//                         </div>
//
//                         <div>
//                             <label className="block text-sm font-medium text-gray-600">
//                                 Email
//                             </label>
//                             <p className="text-black mt-1 font-semibold">
//                                 {hospital.user?.email || "-"}
//                             </p>
//                         </div>
//                     </div>
//
//                     {/* Editable fields */}
//                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                         {/* Address */}
//                         <div>
//                             <label className="block text-sm font-medium text-gray-600">
//                                 Address
//                             </label>
//                             {editing ? (
//                                 <input
//                                     type="text"
//                                     value={hospitalAddress}
//                                     onChange={(e) => setHospitalAddress(e.target.value)}
//                                     className="mt-1 w-full border rounded-lg p-2 text-sm text-black focus:ring-2 focus:ring-blue-500"
//                                 />
//                             ) : (
//                                 <p className="text-black mt-1 font-semibold">
//                                     {hospital.hospitalAddress || "-"}
//                                 </p>
//                             )}
//                         </div>
//
//                         {/* Contact Number */}
//                         <div>
//                             <label className="block text-sm font-medium text-gray-600">
//                                 Contact Number
//                             </label>
//                             {editing ? (
//                                 <input
//                                     type="text"
//                                     value={hospitalContactNumber}
//                                     onChange={(e) =>
//                                         setHospitalContactNumber(e.target.value)
//                                     }
//                                     className="mt-1 w-full border rounded-lg p-2 text-sm text-black focus:ring-2 focus:ring-blue-500"
//                                 />
//                             ) : (
//                                 <p className="text-black mt-1 font-semibold">
//                                     {hospital.hospitalContactNumber || "-"}
//                                 </p>
//                             )}
//                         </div>
//                     </div>
//
//                     {/* Action buttons */}
//                     <div className="pt-4">
//                         {editing ? (
//                             <div className="flex gap-3">
//                                 <button
//                                     onClick={handleSave}
//                                     className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//                                 >
//                                     Save
//                                 </button>
//                                 <button
//                                     onClick={() => setEditing(false)}
//                                     className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
//                                 >
//                                     Cancel
//                                 </button>
//                             </div>
//                         ) : (
//                             <button
//                                 onClick={() => setEditing(true)}
//                                 className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//                             >
//                                 Edit Profile
//                             </button>
//                         )}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }
//
//
// // import React, { useState, useEffect } from "react";
// //
// // import api from "../services/api.js"; //  Your axios instance
// // import { useAuth } from "../context/AuthContext.jsx"; //  Use AuthContext
// //
// // export default function HospitalProfile() {
// //     const { user } = useAuth();                //  Logged-in user
// //     const hospitalId = user?.hospitalId;       //  Correct ID from AuthContext
// //
// //     const [hospital, setHospital] = useState(null);
// //     const [editing, setEditing] = useState(false);
// //     const [hospitalAddress, setHospitalAddress] = useState("");
// //     const [hospitalContactNumber, setHospitalContactNumber] = useState("");
// //     const [loading, setLoading] = useState(true);
// //
// //     //  Fetch hospital profile
// //     const userId = user?.userId;  //  use userId, not hospitalId
// //
// //     useEffect(() => {
// //         if (!userId) {
// //             console.log("No userId found");
// //             setLoading(false);
// //             return;
// //         }
// //
// //         api.get(`/hospitals/profile/${userId}`)   // matches backend
// //             .then((res) => {
// //                 setHospital(res.data);
// //                 setHospitalAddress(res.data.hospitalAddress || "");
// //                 setHospitalContactNumber(res.data.hospitalContactNumber || "");
// //             })
// //             .catch((err) => {
// //                 console.error("Error fetching hospital profile:", err);
// //             })
// //             .finally(() => setLoading(false));
// //     }, [userId]);
// //
// //     //  Save updated hospital info
// //     const handleSave = () => {
// //         const updatedHospital = {
// //             ...hospital,
// //             hospitalAddress,
// //             hospitalContactNumber,
// //         };
// //
// //         api.put(`/hospitals/update/${hospital.hospitalId}`, updatedHospital)
// //             .then((res) => {
// //                 setHospital(res.data);
// //                 setEditing(false);
// //                 alert(" Profile updated successfully!");
// //             })
// //             .catch((err) => {
// //                 console.error("Error updating hospital:", err);
// //                 alert("Update failed");
// //             });
// //     };
// //
// //     if (loading) {
// //         return (
// //             <div className="flex justify-center items-center h-full">
// //                 <p className="text-gray-600 text-lg">Loading hospital profile...</p>
// //             </div>
// //         );
// //     }
// //
// // import axios from "axios";
// // import api from '../../src/services/api.js'
// // import contact from "../components/Contact.jsx";
// //
// // export default function HospitalProfile() {
// //     const [editing, setEditing] = useState(false);
// //     const[hospital, setHospital] = useState(null);
// //     const [hospitalContactNumber, setHospitalContactNumber] = useState("");
// //     const [hospitalAddress, setHospitalAdrress] = useState("");
// //
// //
// //
// //     const userId = localStorage.getItem("userId");
// //
// //
// //     useEffect(() => {
// //         console.log("🔹 User ID from localStorage:", userId);
// //
// //         if (userId) {
// //             axios
// //
// //                 api.get(`/hospitals/profile/${userId}`)
// //                 .then((response) => {
// //                     setHospital(response.data);
// //                     setHospitalContactNumber(response.data.hospitalContactNumber);
// //                     setHospitalAdrress(response.data.hospitalAddress);
// //                     console.log(response.data);
// //                 })
// //                 .catch((error) => {
// //                     console.error("Error fetching Hospital data:", error);
// //                 });
// //         }
// //     }, [userId]);
// //
// // // For updating donor
// //     const handleSave = () => {
// //         const updatedHospital = { ...hospital, contactNumber: contact, hospitalAddress };
// //         axios
// //
// //             .put(`http://localhost:8080/api/hospitals/update/${hospital.hospitalId}`, updatedHospital)
// //             .then((response) => {
// //                 setHospital(response.data);
// //                 setEditing(false);
// //             })
// //             .catch((error) => {
// //                 console.error("Error updating hospital:", error);
// //             });
// //     };
// //
// //
// //     if (!hospital) {
// //         return (
// //             <div className="flex justify-center items-center h-full">
// //
// //                 <p className="text-red-600 text-lg">
// //                     ⚠ Failed to load hospital profile (invalid ID)
// //                 </p>
// //
// //                 <p className="text-gray-600 text-lg">Loading Hopsital profile...</p>
// //             </div>
// //         );
// //     }
// //
// //
// //     return (
// //         <div className="flex flex-col items-center w-full bg-white rounded-lg shadow-md p-6">
// //             <h2 className="text-2xl font-bold mb-6 text-black">🏥 Hospital Profile</h2>
// //
// //             <div className="p-6 flex flex-col md:flex-row gap-6 w-full">
// //                 {/*  Profile section */}
// //
// //
// //
// //
// //
// //     return (
// //         <div className="flex flex-col justify-center text-center items-center w-full h-full bg-white rounded-lg shadow-md p-6">
// //             <h2 className="text-2xl font-bold mb-6 text-black">👤 Hospital Profile</h2>
// //
// //             <div className="p-6 flex flex-col md:flex-row gap-6 w-full">
// //                 {/* Profile Picture */}
// //                 <div className="flex flex-col items-center w-full md:w-1/3">
// //                     <div className="w-32 h-32 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center mb-3">
// //                         {hospital.profilePic ? (
// //                             <img
// //                                 src={hospital.profilePic}
// //
// //                                 alt="Hospital"
// //
// //                                 alt="Profile"
// //                                 className="object-cover w-full h-full"
// //                             />
// //                         ) : (
// //                             <span className="text-gray-500">No Image</span>
// //                         )}
// //                     </div>
// //
// //
// //                     <button className="text-sm text-blue-600 hover:underline cursor-pointer">
// //
// //                     <button className="text-sm text-blue-600 hover:underline">
// //                         Upload Photo
// //                     </button>
// //                 </div>
// //
// //
// //                 {/*  Details */}
// //                 <div className="w-full md:w-2/3 space-y-4">
// //                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
// //                         <div>
// //                             <label className="block text-sm font-medium text-gray-600">
// //                                 Hospital Name
// //                             </label>
// //                             <p className="text-black mt-1 font-semibold">
// //                                 {hospital.hospitalName || "-"}
// //                             </p>
// //
// //                 {/* Profile Details */}
// //                 <div className="w-full md:w-2/3 space-y-4">
// //
// //                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
// //                         <div>
// //                             <label className="block text-sm font-medium text-gray-600">
// //                                Hospital Name
// //                             </label>
// //                             <p className="text-black mt-1 font-semibold">{hospital.hospitalName|| "-"}</p>
// //                         </div>
// //
// //                         <div>
// //                             <label className="block text-sm font-medium text-gray-600">
// //                                 Email
// //                             </label>
// //                             <p className="text-black mt-1 font-semibold">
// //
// //                                 {hospital.user?.email || "-"}
// //                             </p>
// //                         </div>
// //                     </div>
// //
// //                     {/*  Editable fields */}
// //                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
// //                         {/*  Address */}
// //                         <div>
// //                             <label className="block text-sm font-medium text-gray-600">
// //                                 Address
// //                             </label>
// //                             {editing ? (
// //                                 <input
// //                                     type="text"
// //                                     value={hospitalAddress}
// //                                     onChange={(e) => setHospitalAddress(e.target.value)}
// //                                     className="mt-1 w-full border rounded-lg p-2 text-sm text-black focus:ring-2 focus:ring-blue-500"
// //                                 />
// //                             ) : (
// //                                 <p className="text-black mt-1 font-semibold">
// //                                     {hospital.hospitalAddress || "-"}
// //                                 </p>
// //                             )}
// //                         </div>
// //
// //                         {/*  Contact */}
// //                         <div>
// //                             <label className="block text-sm font-medium text-gray-600">
// //                                 Contact Number
// //                             </label>
// //                             {editing ? (
// //                                 <input
// //                                     type="text"
// //                                     value={hospitalContactNumber}
// //                                     onChange={(e) => setHospitalContactNumber(e.target.value)}
// //                                     className="mt-1 w-full border rounded-lg p-2 text-sm text-black focus:ring-2 focus:ring-blue-500"
// //                                 />
// //                             ) : (
// //                                 <p className="text-black mt-1 font-semibold">
// //                                     {hospital.hospitalContactNumber || "-"}
// //                                 </p>
// //                             )}
// //                         </div>
// //                     </div>
// //
// //                     {/*  Action buttons */}
// //                     <div className="pt-4">
// //                         {editing ? (
// //                             <div className="flex gap-3">
// //
// //                                 {hospital.user?.email||hospital.email ||"-"}
// //                             </p>
// //                         </div>
// //
// //                     </div>
// //
// //
// //
// //                         {/* Editable Fields */}
// //                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
// //                             <div>
// //                                 <label className="block text-sm font-medium text-gray-600">
// //                                   Address
// //                                 </label>
// //                                 {editing ? (
// //                                     <input name="hospitalAddress"
// //                                         type="text"
// //                                         value={hospitalAddress}
// //                                         onChange={(e) =>setHospitalAdrress(e.target.value)}
// //                                         className="text-black mt-1 w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
// //                                     />
// //                                 ) : (
// //                                     <p className="text-black mt-1 font-semibold">
// //                                         {hospital.hospitalAddress||"-"}
// //                                     </p>
// //                                 )}
// //                             </div>
// //
// //
// //                             <div>
// //                                 <label className="block text-sm font-medium text-gray-600">
// //                                     ContactNumber
// //                                 </label>
// //                                 {editing ? (
// //                                     <input name="hospitalContactNumber"
// //                                         type="text"
// //                                         value={hospitalContactNumber}
// //                                         onChange={(e) => setHospitalContactNumber(e.target.value)}
// //                                         className="text-black mt-1 w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
// //                                     />
// //                                 ) : (
// //                                     <p className="text-black mt-1 font-semibold">
// //                                         {hospital.hospitalContactNumber||"-"}
// //                                     </p>
// //                                 )}
// //                             </div>
// //
// //
// //
// //
// //                     </div>
// //
// //
// //                     {/* Action Buttons */}
// //                     <div className="pt-4">
// //                         {editing ? (
// //                             <div className="flex gap-2">
// //                                 <button
// //                                     onClick={handleSave}
// //                                     className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
// //                                 >
// //                                     Save
// //                                 </button>
// //                                 <button
// //                                     onClick={() => setEditing(false)}
// //                                     className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
// //                                 >
// //                                     Cancel
// //                                 </button>
// //                             </div>
// //                         ) : (
// //                             <button
// //                                 onClick={() => setEditing(true)}
// //                                 className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
// //                             >
// //                                 Edit Profile
// //                             </button>
// //                         )}
// //                     </div>
// //                 </div>
// //             </div>
// //         </div>
// //     );
// //
// //                         }
