import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext.jsx";

// You can change this to hospital.user?.hospitalName if you want dynamic
const hospitalName = "City Hospital";

const ViewAvailableDonors = () => {
    const { user } = useAuth();
    const hospitalId = user?.hospitalId || localStorage.getItem("hospitalId");

    const [search, setSearch] = useState("");
    const [donors, setDonors] = useState([]);
    const [loading, setLoading] = useState(true);

    // ---------------------------
    // Fetch donors from backend
    // ---------------------------
    useEffect(() => {
        const fetchDonors = async () => {
            try {
                setLoading(true);
                const res = await axios.get("http://localhost:8080/api/donors/all");
                setDonors(res.data);
            } catch (err) {
                console.error("Error fetching donors:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchDonors();
    }, []);

    // ---------------------------
    // Search Filter
    // ---------------------------
    const filteredDonors = donors.filter((d) => {
        const query = search.toLowerCase();
        return (
            d.fullName?.toLowerCase().includes(query) ||
            d.bloodGroup?.toLowerCase().includes(query) ||
            d.city?.toLowerCase().includes(query)
        );
    });

    // ---------------------------
    // Call donor
    // ---------------------------
    const handleCall = (phone) => {
        if (phone) window.location.href = `tel:${phone}`;
    };

    // ---------------------------
    // WhatsApp message
    // ---------------------------
    const handleWhatsApp = (donor) => {
        const message = encodeURIComponent(
            `Hello ${donor.fullName},\n\nThis is ${hospitalName}. We urgently require blood of group ${donor.bloodGroup}. Please let us know if you are available to donate.\n\nThank you for being a lifesaver! ❤️`
        );

        window.open(`https://wa.me/${donor.phoneNumber}?text=${message}`, "_blank");
    };

    // ---------------------------
    // Loading state
    // ---------------------------
    if (loading)
        return <div className="text-center text-gray-700 py-6">Loading donors...</div>;

    return (
        <div className="w-full bg-white p-6 rounded-xl shadow-md">
            {/* Header + Search */}
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-red-600">Available Donors</h2>

                <input
                    type="search"
                    placeholder="Search by name, city or blood group..."
                    className="px-3 w-56 py-2 border rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {/* Donor Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full text-sm text-left border">
                    <thead className="bg-red-50">
                    <tr>
                        <th className="px-4 py-2 border text-black">#</th>
                        <th className="px-4 py-2 border text-black">Name</th>
                        <th className="px-4 py-2 border text-black">Blood Group</th>
                        <th className="px-4 py-2 border text-black">City</th>
                        <th className="px-4 py-2 border text-black">Last Donation</th>
                        <th className="px-4 py-2 border text-black">Contact</th>
                        <th className="px-4 py-2 border text-center text-black">
                            Action
                        </th>
                    </tr>
                    </thead>

                    <tbody>
                    {filteredDonors.length > 0 ? (
                        filteredDonors.map((donor, index) => (
                            <tr
                                key={donor.donorId || index}
                                className="border-b hover:bg-gray-50"
                            >
                                <td className="px-4 py-2 border text-black">
                                    {index + 1}
                                </td>
                                <td className="px-4 py-2 border text-black">
                                    {donor.fullName}
                                </td>
                                <td className="px-4 py-2 border text-black font-semibold">
                                    {donor.bloodGroup}
                                </td>
                                <td className="px-4 py-2 border text-black">
                                    {donor.city}
                                </td>
                                <td className="px-4 py-2 border text-black">
                                    {donor.lastDonationDate || "N/A"}
                                </td>
                                <td className="px-4 py-2 border text-black">
                                    {donor.phoneNumber || "-"}
                                </td>

                                <td className="px-4 py-2 border text-center">
                                    <button
                                        onClick={() => handleCall(donor.phoneNumber)}
                                        className="px-3 py-1 text-white bg-blue-600 rounded-md hover:bg-blue-700 text-xs mr-2"
                                    >
                                        Call
                                    </button>

                                    <button
                                        onClick={() => handleWhatsApp(donor)}
                                        className="px-3 py-1 text-white bg-green-600 rounded-md hover:bg-green-700 text-xs"
                                    >
                                        WhatsApp
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td
                                colSpan="7"
                                className="text-center py-4 text-gray-600 italic"
                            >
                                No donors found
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ViewAvailableDonors;


//
// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useAuth } from "../../context/AuthContext.jsx";
//
// const hospitalName = "City Hospital";
//
// const ViewAvailableDonors = () => {
//     const { user } = useAuth();
//     const hospitalId = user?.hospitalId || localStorage.getItem("hospitalId");
//
//     const [search, setSearch] = useState("");
//     const [donors, setDonors] = useState([]);
//     const [loading, setLoading] = useState(true);
//
//     //  Fetch donors from backend
//     useEffect(() => {
//         fetchDonors();
//     }, []);
//
//     const fetchDonors = async () => {
//         try {
//             setLoading(true);
//             const res = await axios.get("http://localhost:8080/api/donors/all");
//             setDonors(res.data);
//         } catch (err) {
//             console.error("Error fetching donors:", err);
//         } finally {
//             setLoading(false);
//         }
//     };
//
//     // Filtering donors by name / blood group / city
//     const filteredDonors = donors.filter(
//         (d) =>
//             d.fullName?.toLowerCase().includes(search.toLowerCase()) ||
//             d.bloodGroup?.toLowerCase().includes(search.toLowerCase()) ||
//             d.city?.toLowerCase().includes(search.toLowerCase())
//     );
//
//     //  Call donor
//     const handleCall = (phone) => {
//         if (phone) window.location.href = `tel:${phone}`;
//     };
//
//     //  Send WhatsApp message
//     const handleWhatsApp = (donor) => {
//         const message = encodeURIComponent(
//             `Hello ${donor.fullName},\n\nThis is ${hospitalName}. We urgently require blood of group ${donor.bloodGroup}. Please let us know if you are available to donate.\n\nThank you for being a lifesaver!`
//         );
//         window.open(`https://wa.me/${donor.contactNumber}?text=${message}`, "_blank");
//     };
//
//     if (loading) return <div className="text-black text-center">Loading donors...</div>;
//
//
// import React, { useState } from "react";
// const hospitalName = "City Hospital";
// const ViewAvailableDonors = () => {
//     const [search, setSearch] = useState("");
//     const [donors] = useState([
//         {
//             id: 1,
//             name: "Arjun Patel",
//             bloodGroup: "B+",
//             city: "Bangalore",
//             lastDonation: "15 Sep 2025",
//             contact: "9876543210",
//         },
//         {
//             id: 2,
//             name: "Sneha Reddy",
//             bloodGroup: "O+",
//             city: "Mysore",
//             lastDonation: "20 Aug 2025",
//             contact: "9123456789",
//         },
//     ]);
//
//     const filteredDonors = donors.filter(
//         (d) =>
//             d.name.toLowerCase().includes(search.toLowerCase()) ||
//             d.bloodGroup.toLowerCase().includes(search.toLowerCase()) ||
//             d.city.toLowerCase().includes(search.toLowerCase())
//     );
//     const handleCall = (phone) => {
//         window.location.href = `tel:${phone}`;
//     };
//
//     const handleWhatsApp = (phone) => {
//         const message = encodeURIComponent(`Hello ${donors.name},\n\nThis is ${hospitalName}. We urgently requirem blood of group ${donors.bloodGroup}. Please let us know if you are available to donate, kindly reply or contact us as soon as possible.\n\nThank you!for being a lifesaver`);
//         window.open(`https://wa.me/${phone}?text=${message}`, "_blank");
//     }
//
//
//     return (
//         <div className="w-full bg-white p-6 rounded-xl shadow-md">
//             <div className="flex justify-between items-center mb-4">
//                 <h2 className="text-xl font-bold text-red-600"> Available Donors</h2>
//
//                 <input
//                     type="search"
//                     placeholder="Search by name, city or blood group.."
//
//                     className="px-3 w-56 py-2 border rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2"
//
//                     class="px-3 w-56 py-2  border rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2"
//                     value={search}
//                     onChange={(e) => setSearch(e.target.value)}
//                 />
//             </div>
//
//             <div className="overflow-x-auto">
//                 <table className="min-w-full text-sm text-left border">
//                     <thead className="bg-red-50">
//
//                     <tr>
//                         <th className="px-4 py-2 text-black border">#</th>
//                         <th className="px-4 py-2 text-black border">Name</th>
//                         <th className="px-4 py-2 text-black border">Blood Group</th>
//                         <th className="px-4 py-2 text-black border">City</th>
//                         <th className="px-4 py-2 text-black border">Last Donation</th>
//                         <th className="px-4 py-2 text-black border">Contact</th>
//                         <th className="px-4 py-2 text-black border text-center">Action</th>
//                     </tr>
//                     </thead>
//                     <tbody>
//                     {filteredDonors.length > 0 ? (
//                         filteredDonors.map((donor, index) => (
//                             <tr key={donor.donorId || index} className="border-b hover:bg-gray-50">
//                                 <td className="px-4 py-2 text-black border">{index + 1}</td>
//                                 <td className="px-4 py-2 text-black border">{donor.fullName}</td>
//                                 <td className="px-4 py-2 text-black border font-bold">{donor.bloodGroup}</td>
//                                 <td className="px-4 py-2 text-black border">{donor.city}</td>
//                                 <td className="px-4 py-2 text-black border">
//                                     {donor.lastDonationDate || "N/A"}
//                                 </td>
//                                 <td className="px-4 py-2 text-black border">{donor.phoneNumber}</td>
//                                 <td className="px-4 py-2 text-black border text-center">
//                                     <button
//                                         onClick={() => handleCall(donor.phoneNumber)}
//                                         className="px-3 text-black py-1 bg-blue-600 mr-4 rounded-md hover:bg-blue-700 text-xs"
//                                     >
//                                         Contact
//                                     </button>
//
//                                     <button
//                                         onClick={() => handleWhatsApp(donor)}
//                                         className="px-3 text-black py-1 bg-green-600 mr-4 rounded-md hover:bg-green-700 text-xs"
//                                     >
//                                         WhatsApp
//                                     </button>
//                                 </td>
//                             </tr>
//                         ))
//                     ) : (
//                         <tr>
//                             <td colSpan="7" className="text-center py-4 text-gray-500 italic">
//                                 No donors found
//                             </td>
//                         </tr>
//                     )}
//
//                         <tr>
//                             <th className="px-4 py-2 text-black border">#</th>
//                             <th className="px-4 py-2 text-black border">Name</th>
//                             <th className="px-4 py-2 text-black border">Blood Group</th>
//                             <th className="px-4 py-2 text-black border">City</th>
//                             <th className="px-4 py-2 text-black border">Last Donation</th>
//                             <th className="px-4 py-2 text-black border">Contact</th>
//                             <th className="px-4 py-2 text-black border text-center">Action</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {filteredDonors.length > 0 ? (
//                             filteredDonors.map((donor) => (
//                                 <tr key={donor.id} className="border-b hover:bg-gray-50">
//                                     <td className="px-4 py-2 text-black border">{donor.id}</td>
//                                     <td className="px-4 py-2 text-black border">{donor.name}</td>
//                                     <td className="px-4 py-2 text-black border font-bold">{donor.bloodGroup}</td>
//                                     <td className="px-4 py-2 text-black border">{donor.city}</td>
//                                     <td className="px-4 py-2 text-black border">{donor.lastDonation}</td>
//                                     <td className="px-4 py-2 text-black border">{donor.contact}</td>
//                                     <td className="px-4 py-2 text-black border text-center">
//                                         <button onClick={() => handleCall(donor.contact)}
//                                             className="px-3  text-black py-1 bg-blue-600 mr-4 rounded-md hover:bg-blue-700 text-xs">
//                                             Contact
//                                         </button>
//
//                                         <button onClick={() => handleWhatsApp(donor.contact)}
//                                             className="px-3 text-black py-1 bg-green-600  mr-4 rounded-md hover:bg-green-700 text-xs">
//                                             Whatsapp
//                                         </button>
//                                     </td>
//                                 </tr>
//                             ))
//                         ) : (
//                             <tr>
//                                 <td
//                                     colSpan="7"
//                                     className="text-center py-4 text-gray-500 italic"
//                                 >
//                                     No donors found
//                                 </td>
//                             </tr>
//                         )}
//                     </tbody>
//                 </table>
//             </div>
//         </div>
//     );
// };
//
//
// export default ViewAvailableDonors;
//
// export default ViewAvailableDonors;
