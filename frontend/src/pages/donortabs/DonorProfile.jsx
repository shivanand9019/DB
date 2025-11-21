import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext.jsx"; // ✅ Import AuthContext

export default function DonorProfile() {

    //  Access logged-in user

    const { user } = useAuth(); // ✅ Access logged-in user
    const [editing, setEditing] = useState(false);
    const [donor, setDonor] = useState(null);
    const [phone, setPhone] = useState("");
    const [city, setCity] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [loading, setLoading] = useState(false);

    //  Get userId from context or localStorage
    const userId = user?.userId || localStorage.getItem("userId");

    //  Fetch Donor Profile
    useEffect(() => {
        if (userId) {
            axios
                .get(`http://localhost:8080/api/donors/profile/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${user?.token}`,
                    },
                })
                .then((response) => {
                    const donorData = response.data;
                    if (donorData.profilePic) {
                        donorData.profilePic = `data:image/jpeg;base64,${donorData.profilePic}`;
                    }
                    setDonor(donorData);
                    setPhone(donorData.phoneNumber || "");
                    setCity(donorData.city || "");
                })
                .catch((error) => {
                    console.error("Error fetching donor data:", error);
                });
        }
    }, [userId, user?.token]);

    // Update donor info
    const handleSave = () => {
        if (!donor) return;
        const updatedDonor = { ...donor, phoneNumber: phone, city };

        axios
            .put(
                `http://localhost:8080/api/donors/update/${donor.donorId}`,
                updatedDonor,
                {
                    headers: {
                        Authorization: `Bearer ${user?.token}`,
                    },
                }
            )
            .then((response) => {
                setDonor(response.data);
                setEditing(false);
                alert("Profile updated successfully!");
            })
            .catch((error) => {
                console.error("Error updating donor:", error);
                alert("Failed to update donor profile!");
            });
    };

    //  Upload profile photo
    const handlePhotoUpload = async () => {
        if (!selectedFile) {
            alert("Please choose a photo first!");
            return;
            return;
        }

        const formData = new FormData();
        formData.append("file", selectedFile);

        setLoading(true);
        try {
            const response = await axios.post(
                `http://localhost:8080/api/donors/upload-photo/${donor.donorId}`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${user?.token}`,
                    },
                }
            );

            const updatedDonor = response.data;
            if (updatedDonor.profilePic)
                updatedDonor.profilePic = `data:image/jpeg;base64,${updatedDonor.profilePic}`;
            setDonor(updatedDonor);
            alert("Profile photo updated successfully!");
        } catch (error) {
            console.error("Error uploading photo:", error);
            alert("Failed to upload photo!");
        } finally {
            setLoading(false);
            setSelectedFile(null);
        }
    };

    //  Toggle availability
    const handleToggleAvailability = async () => {
        try {
            const response = await axios.patch(
                `http://localhost:8080/api/donors/${donor.donorId}/toggle-availability`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${user?.token}`,
                    },
                }
            );
            setDonor(response.data);
        } catch (error) {
            console.error("Error toggling availability:", error);
        }
    };

    if (!donor) {
        return (
            <div className="flex justify-center items-center h-full">
                <p className="text-gray-600 text-lg">Loading donor profile...</p>
            </div>
        );
    }

    //  Donation eligibility calculation
    const lastDonation = donor.lastDonationDate || "N/A";
    const lastDate = donor.lastDonationDate ? new Date(donor.lastDonationDate) : null;
    let diffDays = 0;
    if (lastDate) {
        const nextEligible = new Date(lastDate);
        nextEligible.setDate(nextEligible.getDate() + 90);
        diffDays = Math.ceil(
            (nextEligible - new Date()) / (1000 * 60 * 60 * 24)
        );
    }

    return (
        <div className="flex flex-col justify-center text-center items-center w-full h-full bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6 text-black">👤 Donor Profile</h2>

            <div className="p-6 flex flex-col md:flex-row gap-6 w-full">
                {/* Profile Picture */}
                <div className="flex flex-col items-center w-full md:w-1/3">
                    <div className="w-32 h-32 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center mb-3">
                        {donor.profilePic ? (
                            <img
                                src={donor.profilePic}
                                alt="Profile"
                                className="object-cover w-full h-full"
                            />
                        ) : (
                            <span className="text-gray-500">No Image</span>
                        )}
                    </div>

                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setSelectedFile(e.target.files[0])}
                        className="hidden"
                        id="upload-photo"
                    />
                    <label
                        htmlFor="upload-photo"
                        className="text-sm text-blue-600 hover:underline cursor-pointer"
                    >
                        Choose Photo
                    </label>

                    <button
                        onClick={handlePhotoUpload}
                        disabled={loading}
                        className="bg-blue-600 text-white px-3 py-1 mt-2 rounded hover:bg-blue-700 text-sm"
                    >
                        {loading ? "Uploading..." : "Upload Photo"}
                    </button>

                    <button
                        onClick={handleToggleAvailability}
                        className={`mt-4 px-4 py-2 rounded text-white ${
                            donor.available ? "bg-green-600" : "bg-red-500"
                        }`}
                    >
                        {donor.available ? "Available" : "Unavailable"}
                    </button>
                </div>

                {/* Profile Details */}
                <div className="w-full md:w-2/3 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-600">
                                Full Name
                            </label>
                            <p className="text-black mt-1 font-semibold">
                                {donor.fullName || "-"}
                            </p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600">
                                Blood Group
                            </label>
                            <p className="text-black mt-1 font-semibold">
                                {donor.bloodGroup || "-"}
                            </p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600">
                                Age
                            </label>
                            <p className="text-black mt-1 font-semibold">
                                {donor.age || "-"}
                            </p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600">
                                Email
                            </label>
                            <p className="text-black mt-1 font-semibold">
                                {donor.user?.email || donor.email || "-"}
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-600">
                                Phone
                            </label>
                            {editing ? (
                                <input
                                    type="text"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="text-black mt-1 w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            ) : (
                                <p className="text-black mt-1 font-semibold">
                                    {donor.phoneNumber || "-"}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-600">
                                City
                            </label>
                            {editing ? (
                                <input
                                    type="text"
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                    className="text-black mt-1 w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            ) : (
                                <p className="text-black mt-1 font-semibold">
                                    {donor.city || "-"}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p className="text-sm text-black">
                            🩸 Last Donation Date:{" "}
                            <span className="font-semibold">{lastDonation}</span>
                        </p>
                        {lastDate && (
                            <p className="text-sm text-black">
                                {diffDays > 0 ? (
                                    <>
                                        ⏳ You can donate again in{" "}
                                        <span className="font-bold">{diffDays}</span> days
                                    </>
                                ) : (
                                    <span className="text-green-600 font-semibold">
                                        ✅ You are eligible to donate now!
                                    </span>
                                )}
                            </p>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-4">
                        {editing ? (
                            <div className="flex gap-2">
                                <button
                                    onClick={handleSave}
                                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                                >
                                    Save
                                </button>
                                <button
                                    onClick={() => setEditing(false)}
                                    className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
                                >
                                    Cancel
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => setEditing(true)}
                                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
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
