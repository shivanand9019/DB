import React, { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { useAuth } from "../../context/AuthContext.jsx";

export default function BloodRequests() {
    const { user } = useAuth();
    const hospitalId = user?.hospitalId || localStorage.getItem("hospitalId");

    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("");

    // -------------------------------------------------------
    // Fetch donation requests for the logged-in hospital
    // -------------------------------------------------------
    useEffect(() => {
        if (hospitalId) fetchDonations();
    }, [hospitalId]);

    const fetchDonations = async () => {
        try {
            setLoading(true);
            const res = await axios.get(
                `http://localhost:8080/api/donations/byHospital/${hospitalId}`
            );
            setDonations(res.data || []);
            console.log("Updated donations:", res.data);  // <--- ADD THIS
            setDonations(res.data || []);
        } catch (err) {
            console.error("Error fetching donations:", err);
        } finally {
            setLoading(false);
        }
    };

    // -------------------------------------------------------
    // Update status (APPROVED / REJECTED / COMPLETED)
    // -------------------------------------------------------
    const handleStatusUpdate = async (donationId, status) => {
        try {
            await axios.put(
                `http://localhost:8080/api/donations/${donationId}/status?status=${status}`
            );

            alert(`Donation marked as ${status}`);
            fetchDonations();
        } catch (err) {
            console.error("Error updating status:", err);
            alert("Failed to update status");
        }
    };

    // -------------------------------------------------------
    // Filter
    // -------------------------------------------------------
    const filteredDonations = donations.filter((d) =>
        (d.status || "").toLowerCase().includes(filter.toLowerCase())
    );

    // -------------------------------------------------------
    // PDF Download
    // -------------------------------------------------------
    const downloadPDF = () => {
        const doc = new jsPDF();

        doc.setFontSize(16);
        doc.text("Hospital Donation Report", 14, 20);
        doc.setFontSize(11);
        doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 28);

        const tableData = filteredDonations.map((d, index) => [
            index + 1,
            d.donorName,
            d.bloodGroup,
            d.donationDate,
            d.donationTime,
            d.status,
        ]);

        doc.autoTable({
            startY: 35,
            head: [["#", "Donor", "Blood Group", "Date", "Time", "Status"]],
            body: tableData,
            theme: "striped",
            headStyles: { fillColor: [255, 0, 0] },
            styles: { halign: "center" },
        });

        doc.save("Donation_Report.pdf");
    };

    // -------------------------------------------------------
    // Loading state
    // -------------------------------------------------------
    if (loading)
        return <div className="text-black text-center py-6">Loading...</div>;

    return (
        <div className="w-full bg-white p-6 rounded-xl shadow-md">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-red-600"> Donation Requests</h2>

                <button
                    onClick={downloadPDF}
                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                >
                    Download Report (PDF)
                </button>
            </div>

            {/* Filter */}
            <div className="mb-4 flex gap-3 text-black items-center">
                <input
                    type="text"
                    placeholder="Filter by status..."
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="border p-2 rounded-md w-1/3"
                />

                <button
                    onClick={fetchDonations}
                    className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                >
                    Refresh
                </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full text-sm text-left border">
                    <thead className="bg-red-100">
                    <tr>
                        <th className="px-4 py-2 border text-black">#</th>
                        <th className="px-4 py-2 border text-black">Donor Name</th>
                        <th className="px-4 py-2 border text-black">Blood Group</th>
                        <th className="px-4 py-2 border text-black">Date & Time</th>
                        <th className="px-4 py-2 border text-black">Status</th>
                        <th className="px-4 py-2 border text-center text-black">
                            Action
                        </th>
                    </tr>
                    </thead>

                    <tbody>
                    {filteredDonations.length > 0 ? (
                        filteredDonations.map((don, index) => (
                            <tr
                                key={don.donationId}
                                className="border-b hover:bg-gray-50"
                            >
                                <td className="px-4 py-2 border text-black">
                                    {index + 1}
                                </td>

                                <td className="px-4 py-2 border text-black">
                                    {don.donorName}
                                </td>

                                <td className="px-4 py-2 border text-black font-bold">
                                    {don.bloodGroup}
                                </td>

                                <td className="px-4 py-2 border text-black">
                                    {don.donationDate}
                                    <br />
                                    <span className="text-xs text-gray-600">
                                            {don.donationTime}
                                        </span>
                                </td>

                                {/* Status */}
                                <td
                                    className={`px-4 py-2 border font-semibold ${
                                        don.status === "COMPLETED"
                                            ? "text-green-600"
                                            : don.status === "REJECTED"
                                                ? "text-red-600"
                                                : don.status === "APPROVED"
                                                    ? "text-blue-600"
                                                    : "text-yellow-600"
                                    }`}
                                >
                                    {don.status}
                                </td>

                                {/* Actions */}
                                <td className="px-4 py-2 border text-center space-x-2">
                                    {don.status === "PENDING" && (
                                        <>
                                            <button
                                                onClick={() =>
                                                    handleStatusUpdate(
                                                        don.donationId,
                                                        "APPROVED"
                                                    )
                                                }
                                                className="px-3 py-1 bg-green-600 text-white rounded-md text-xs hover:bg-green-700"
                                            >
                                                Approve
                                            </button>

                                            <button
                                                onClick={() =>
                                                    handleStatusUpdate(
                                                        don.donationId,
                                                        "REJECTED"
                                                    )
                                                }
                                                className="px-3 py-1 bg-red-600 text-white rounded-md text-xs hover:bg-red-700"
                                            >
                                                Reject
                                            </button>
                                        </>
                                    )}

                                    {don.status === "APPROVED" && (
                                        <button
                                            onClick={() =>
                                                handleStatusUpdate(
                                                    don.donationId,
                                                    "COMPLETED"
                                                )
                                            }
                                            className="px-3 py-1 bg-blue-600 text-white rounded-md text-xs hover:bg-blue-700"
                                        >
                                            Mark Completed
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td
                                colSpan="6"
                                className="text-center py-4 text-gray-600 italic"
                            >
                                No donation requests found.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}



// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useAuth } from "../../context/AuthContext.jsx";
//
// export default function BloodRequests() {
//     const { user } = useAuth();
//     const hospitalId = user?.hospitalId || localStorage.getItem("hospitalId");
//
//
// //
// // import React, { useState, useEffect } from "react";
// // import { useAuth } from "../../context/AuthContext.jsx";
// // import {
// //     getHospitalRequests,
// //     updateStatus,
// //     createBloodRequest,
// // } from "../../services/bloodRequestApi.js";
// //
// // const BloodRequests = () => {
// // const { user } = useAuth(); // Get hospitalId from context
// // const hospitalId = user?.hospitalId;
// //     const [requests, setRequests] = useState([]);
// //     const [loading, setLoading] = useState(true);
// //     const [filter, setFilter] = useState("");
// //     const [showModal, setShowModal] = useState(false);
// //     const [newRequest, setNewRequest] = useState({
// //         patientName: "",
// //         bloodGroup: "",
// //         units: "",
// //         contact: "",
// //     });
// //  useEffect(()=>{
// //  if(hospitalId) fetchRequests();
// //  else setLoading(false);
// //   },[hospitalId]);
// //     const fetchRequests = async () => {
// //         try {
// //             setLoading(true);
// //             const data = await getHospitalRequests(hospitalId);
// //             setRequests(data);
// //         } catch (err) {
// //             console.error("Error fetching requests:", err);
// //         } finally {
// //             setLoading(false);
// //         }
// //     };
// //
// //     const handleStatusUpdate = async (requestId, status) => {
// //         try {
// //             await updateStatus(requestId, status);
// //             alert(`Request ${status.toLowerCase()} successfully.`);
// //             fetchRequests();
// //         } catch (err) {
// //             console.error("Error updating status:", err);
// //         }
// //     };
// //
// //     const handleInputChange = (e) => {
// //         setNewRequest({ ...newRequest, [e.target.name]: e.target.value });
// //     };
// //
// //     const handleCreateRequest = async (e) => {
// //         e.preventDefault();
// //         if (!hospitalId) return alert("Hospital ID not found in localStorage!");
// //
// //         try {
// //             await createBloodRequest({ ...newRequest, hospitalId });
// //             alert("Blood request created successfully!");
// //             setShowModal(false);
// //             setNewRequest({ patientName: "", bloodGroup: "", units: "", contact: "" });
// //             fetchRequests();
// //         } catch (err) {
// //             console.error("Error creating blood request:", err);
// //         }
// //     };
// //
// //     const filteredRequests = Array.isArray(requests)
// //         ? requests.filter((r) => (r.status || "").toLowerCase().includes(filter.toLowerCase()))
// //         : [];
// //
// //     if (loading) return <div className ="text-black">Loading...</div>;
// //
// //     return (
// //         <div className="w-full bg-white p-6 rounded-xl shadow-md">
// //             <div className="flex justify-between items-center mb-4">
// //                 <h2 className="text-xl font-bold text-red-600">🩸 Blood Requests</h2>
// //                 <button
// //                     onClick={() => setShowModal(true)}
// //                     className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
// //                 >
// //                     + New Request
// //                 </button>
// //             </div>
// //
// //             <div className="mb-4 flex gap-3">
// //                 <input
// //                     type="text"
// //                     placeholder="Filter by Status..."
// //                     value={filter}
// //                     onChange={(e) => setFilter(e.target.value)}
// //                     className="border p-2 rounded-md w-1/3"
// //                 />
// //                 <button
// //                     onClick={fetchRequests}
// //                     className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
// //                 >
// //                     Refresh
// //                 </button>
// //             </div>
// //
// //             <div className="overflow-x-auto">
// //                 <table className="min-w-full text-sm text-left border">
// //                     <thead className="bg-red-100">
// //                     <tr>
// //                         <th className="px-4 py-2 border">#</th>
// //                         <th className="px-4 py-2 border">Patient Name</th>
// //                         <th className="px-4 py-2 border">Blood Group</th>
// //                         <th className="px-4 py-2 border">Units</th>
// //                         <th className="px-4 py-2 border">Contact</th>
// //                         <th className="px-4 py-2 border">Date</th>
// //                         <th className="px-4 py-2 border">Status</th>
// //                         <th className="px-4 py-2 border text-center">Action</th>
// //                     </tr>
// //                     </thead>
// //                     <tbody>
// //                     {filteredRequests.length > 0 ? (
// //                         filteredRequests.map((req, index) => (
// //                             <tr key={req.id} className="border-b hover:bg-gray-50">
// //                                 <td className="px-4 py-2 border">{index + 1}</td>
// //                                 <td className="px-4 py-2 border">{req.patientName}</td>
// //                                 <td className="px-4 py-2 border font-bold">{req.bloodGroup}</td>
// //                                 <td className="px-4 py-2 border">{req.units}</td>
// //                                 <td className="px-4 py-2 border">{req.contact}</td>
// //                                 <td className="px-4 py-2 border">{req.date}</td>
// //                                 <td className={`px-4 py-2 border font-semibold ${
// //                                     req.status === "Accepted"
// //                                         ? "text-green-600"
// //                                         : req.status === "Rejected"
// //                                             ? "text-red-600"
// //                                             : "text-yellow-600"
// //                                 }`}>
// //                                     {req.status}
// //                                 </td>
// //                                 <td className="px-4 py-2 border text-center space-x-2">
// //                                     {req.status === "Pending" && (
// //                                         <>
// //                                             <button
// //                                                 onClick={() => handleStatusUpdate(req.id, "Accepted")}
// //                                                 className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 text-xs"
// //                                             >
// //                                                 Accept
// //                                             </button>
// //                                             <button
// //                                                 onClick={() => handleStatusUpdate(req.id, "Rejected")}
// //                                                 className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 text-xs"
// //                                             >
// //                                                 Reject
// //                                             </button>
// //                                         </>
// //                                     )}
// //                                 </td>
// //                             </tr>
// //                         ))
// //                     ) : (
// //                         <tr>
// //                             <td className="p-2 border text-center" colSpan="8">
// //                                 No blood requests found.
// //                             </td>
// //                         </tr>
// //                     )}
// //                     </tbody>
// //                 </table>
// //             </div>
// //         </div>
// //     );
// // };
// //
// // export default BloodRequests;
//
//
// import React, { useEffect, useState } from "react";
// import { getDonationHistory } from "../../services/hospitalService.js";
// import jsPDF from "jspdf";
// import "jspdf-autotable";
//
// const BloodRequests = () => {
//     const [donations, setDonations] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [filter, setFilter] = useState("");
//
//
//     useEffect(() => {
//         if (hospitalId) fetchDonations();
//     }, [hospitalId]);
//
//     //  Fetch all donation requests for this hospital
//     const fetchDonations = async () => {
//         try {
//             setLoading(true);
//
//             const res = await axios.get(
//                 `http://localhost:8080/api/donations/byHospital/${hospitalId}`
//             );
//
//             setDonations(res.data);
//             console.log(res.data);
//         } catch (err) {
//             console.error("Error fetching donations:", err);
//         } finally {
//
//     const HOSPITAL_ID = 1; // Temporary hospital ID for testing
//
//     useEffect(() => {
//         fetchHistory();
//     }, []);
//
//     const fetchHistory = async () => {
//         try {
//             const data = await getDonationHistory(HOSPITAL_ID);
//             setDonations(data);
//             setLoading(false);
//         } catch (err) {
//             console.error("Error fetching donation history:", err);
//             setLoading(false);
//         }
//     };
//
//
//     //  Update status: APPROVED / REJECTED / COMPLETED
//     const handleStatusUpdate = async (donationId, status) => {
//         try {
//             await axios.put(
//                 `http://localhost:8080/api/donations/${donationId}/status?status=${status}`
//             );
//
//             alert(`Donation marked as ${status}`);
//             fetchDonations();
//         } catch (err) {
//             console.error("Error updating status:", err);
//             alert("Failed to update status");
//         }
//     };
//
//     //  Simple filter
//
//     const filteredDonations = donations.filter((d) =>
//         d.status.toLowerCase().includes(filter.toLowerCase())
//     );
//
//
//     if (loading) return <div className="text-black">Loading...</div>;
//
//     return (
//         <div className="w-full bg-white p-6 rounded-xl shadow-md">
//
//             {/*  Header */}
//             <div className="flex justify-between items-center mb-4">
//                 <h2 className="text-xl font-bold text-red-600"> Donation Requests</h2>
//             </div>
//
//             {/*  Filter */}
//             <div className="mb-4 flex gap-3">
//
//     const downloadPDF = () => {
//         const doc = new jsPDF();
//         doc.setFontSize(16);
//         doc.text("Hospital Donation Report", 14, 20);
//         doc.setFontSize(11);
//         doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 28);
//
//         const tableData = filteredDonations.map((d, index) => [
//             index + 1,
//             d.donorName,
//             d.bloodGroup,
//             d.units,
//             d.donationDate,
//             d.status,
//         ]);
//
//         doc.autoTable({
//             startY: 35,
//             head: [["#", "Donor Name", "Blood Group", "Units", "Date", "Status"]],
//             body: tableData,
//             theme: "striped",
//             headStyles: { fillColor: [255, 0, 0] },
//             styles: { halign: "center" },
//         });
//
//         doc.save("Donation_Report.pdf");
//     };
//
//     if (loading) return <div>Loading donation history...</div>;
//
//     return (
//         <div className="w-full bg-white p-6 rounded-xl shadow-md">
//             <h2 className="text-xl font-bold mb-4 text-red-600">Donation History</h2>
//
//             <div className="mb-4 flex gap-3 items-center">
//                 <input
//                     type="text"
//                     placeholder="Filter by Status..."
//                     value={filter}
//                     onChange={(e) => setFilter(e.target.value)}
//
//                     className="border p-2 rounded-md w-1/3"
//                 />
//                 <button
//                     onClick={fetchDonations}
//                     className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
//                 >
//                     Refresh
//                 </button>
//             </div>
//
//             {/*  Table */}
//
//                     className="border p-2 rounded-md"
//                 />
//                 <button
//                     onClick={fetchHistory}
//                     className="bg-red-500 text-white px-4 py-2 rounded-md"
//                 >
//                     Refresh
//                 </button>
//                 <button
//                     onClick={downloadPDF}
//                     className="bg-green-600 text-white px-4 py-2 rounded-md"
//                 >
//                     Download Report (PDF)
//                 </button>
//             </div>
//
//             <div className="overflow-x-auto">
//                 <table className="min-w-full text-sm text-left border">
//                     <thead className="bg-red-100">
//                     <tr>
//
//                         <th className="px-4 py-2 text-black border">#</th>
//                         <th className="px-4 py-2 text-black border">Donor Name</th>
//                         <th className="px-4 py-2 text-black border">Blood Group</th>
//                         <th className="px-4 py-2 text-black border">Date & Time</th>
//                         <th className="px-4 py-2 text-black border">Status</th>
//                         <th className="px-4 py-2 text-black border text-center">Action</th>
//                     </tr>
//                     </thead>
//
//                     <tbody>
//                     {filteredDonations.length > 0 ? (
//                         filteredDonations.map((don, index) => (
//                             <tr key={don.donationId} className="border-b hover:bg-gray-50">
//                                 <td className="px-4 text-black py-2 border">{index + 1}</td>
//
//                                 <td className="px-4 text-black py-2 border">
//                                     {don.donorName}
//                                 </td>
//
//                                 <td className="px-4 py-2 text-black border font-bold">
//                                     {don.bloodGroup}
//                                 </td>
//
//                                 {/*  Updated to use the separated donationDate + donationTime */}
//                                 <td className="px-4 py-2 border">
//                                     {don.donationDate}
//                                     <br />
//                                     <span className="text-gray-600 text-xs">
//                                             {don.donationTime}
//                                         </span>
//                                 </td>
//
//                                 <td
//                                     className={`px-4 py-2 border font-semibold ${
//                                         don.status === "COMPLETED"
//                                             ? "text-green-600"
//                                             : don.status === "REJECTED"
//                                                 ? "text-red-600"
//                                                 : don.status === "APPROVED"
//                                                     ? "text-blue-600"
//                                                     : "text-yellow-600"
//                                     }`}
//                                 >
//                                     {don.status}
//                                 </td>
//
//                                 {/*  Status actions */}
//                                 <td className="px-4 py-2 border text-center space-x-2">
//                                     {don.status === "PENDING" && (
//                                         <>
//                                             <button
//                                                 onClick={() =>
//                                                     handleStatusUpdate(don.donationId, "APPROVED")
//                                                 }
//                                                 className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 text-xs"
//                                             >
//                                                 Approve
//                                             </button>
//
//                                             <button
//                                                 onClick={() =>
//                                                     handleStatusUpdate(don.donationId, "REJECTED")
//                                                 }
//                                                 className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 text-xs"
//                                             >
//                                                 Reject
//                                             </button>
//                                         </>
//                                     )}
//
//                                     {don.status === "APPROVED" && (
//                                         <button
//                                             onClick={() =>
//                                                 handleStatusUpdate(don.donationId, "COMPLETED")
//                                             }
//                                             className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-xs"
//                                         >
//                                             Mark Completed
//                                         </button>
//                                     )}
//
//                         <th className="px-4 py-2 border text-purple-700">#</th>
//                         <th className="px-4 py-2 border text-purple-700">Donor Name</th>
//                         <th className="px-4 py-2 border text-purple-700">Blood Group</th>
//                         <th className="px-4 py-2 border text-purple-700">Units</th>
//                         <th className="px-4 py-2 border text-purple-700">Donation Date</th>
//                         <th className="px-4 py-2 border text-purple-700">Status</th>
//                     </tr>
//                     </thead>
//                     <tbody>
//                     {filteredDonations.length > 0 ? (
//                         filteredDonations.map((donation, index) => (
//                             <tr key={donation.id} className="border-b hover:bg-gray-50">
//                                 <td className="px-4 py-2 border text-black">{index + 1}</td>
//                                 <td className="px-4 py-2 border text-black">{donation.donorName}</td>
//                                 <td className="px-4 py-2 border text-black font-bold">
//                                     {donation.bloodGroup}
//                                 </td>
//                                 <td className="px-4 py-2 border text-black">{donation.units}</td>
//                                 <td className="px-4 py-2 border text-black">{donation.donationDate}</td>
//                                 <td
//                                     className={`px-4 py-2 border font-semibold ${
//                                         donation.status === "Completed"
//                                             ? "text-green-600"
//                                             : donation.status === "Rejected"
//                                                 ? "text-red-600"
//                                                 : "text-yellow-600"
//                                     }`}
//                                 >
//                                     {donation.status}
//                                 </td>
//                             </tr>
//                         ))
//                     ) : (
//                         <tr>
//
//                             <td className="p-2 border text-black text-center" colSpan="6">
//                                 No donation requests found.
//
//                             <td className="p-2 border text-center" colSpan="6">
//                                 No donation history found.
//                             </td>
//                         </tr>
//                     )}
//                     </tbody>
//                 </table>
//             </div>
//         </div>
//     );
//
// }
//
// };
//
// export default BloodRequests;
