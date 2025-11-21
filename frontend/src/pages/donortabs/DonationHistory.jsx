import React, { useEffect, useState } from "react";
import axios from "axios";
import { differenceInDays, addDays, parseISO } from "date-fns";
import { useAuth } from "../../context/AuthContext.jsx";
import { getAllHospitals } from "../../services/hospitalService.js";

export default function DonationHistory() {
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [hospitals, setHospitals] = useState([]);
    const [selectedHospital, setSelectedHospital] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ date: "", time: "" });

    const { user } = useAuth();
    const donorId = user?.donorId || localStorage.getItem("donorId");

    // ----------------------
    // Fetch hospitals
    // ----------------------
    useEffect(() => {
        (async () => {
            try {
                const data = await getAllHospitals();
                setHospitals(data);
            } catch (err) {
                console.error("Hospital fetch error:", err);
            }
        })();
    }, []);


    // Fetch donation history

    useEffect(() => {
        if (!donorId) {
            setError("Donor ID not found. Please log in again.");
            setLoading(false);
            return;
        }

        axios
            .get(`http://localhost:8080/api/donations/donor/${donorId}`)
            .then((res) => {
                setDonations(res.data || []);
                setError("");
            })
            .catch((err) => {
                console.error("Error fetching donation history:", err);
                setError("Failed to fetch donation history.");
            })
            .finally(() => setLoading(false));
    }, [donorId]);


    // Extract date properly

    const getDateString = (dateField) => {
        if (!dateField) return null;
        if (typeof dateField === "string") return dateField;
        if (typeof dateField === "object" && dateField.date) return dateField.date;
        return null;
    };

    // Find last completed donation
    const lastDonation = donations
        .filter((d) => d.status?.toLowerCase() === "completed")
        .sort(
            (a, b) =>
                new Date(getDateString(b.donationDate)) -
                new Date(getDateString(a.donationDate))
        )[0];

    const lastDonationDate = getDateString(lastDonation?.donationDate);
    const eligibilityDays = 90;

    const nextEligibleDate = lastDonationDate
        ? addDays(parseISO(lastDonationDate), eligibilityDays)
        : null;

    const remainingDays =
        nextEligibleDate ? differenceInDays(nextEligibleDate, new Date()) : null;

    // Booking form handlers

    const handleChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedHospital) {
            alert("Please select a hospital");
            return;
        }

        const payload = {
            donorId: Number(donorId),
            hospitalId: Number(selectedHospital),
            donationDate: formData.date,
            donationTime: formData.time,
        };

        try {
            await axios.post("http://localhost:8080/api/donations/book", payload);
            alert("Donation appointment booked successfully!");

            setIsModalOpen(false);
            setFormData({ date: "", time: "" });
            setSelectedHospital("");

            // Refresh history
            const res = await axios.get(
                `http://localhost:8080/api/donations/donor/${donorId}`
            );
            setDonations(res.data || []);
        } catch (err) {
            console.error("Booking error:", err);
            alert("Failed to book donation.");
        }
    };


    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold text-purple-600 mb-4">Donation History</h2>

            {loading && (
                <div className="flex items-center justify-center py-10">
                    <div className="animate-spin h-10 w-10 border-b-2 border-purple-600 rounded-full"></div>
                    <p className="ml-3 text-gray-700 font-medium">
                        Loading donation history...
                    </p>
                </div>
            )}

            {error && !loading && (
                <div className="bg-red-100 text-red-700 p-3 rounded-md">{error}</div>
            )}

            {!loading && !error && (
                <>
                    {/* Eligibility Section */}
                    <div className="mb-6 p-4 bg-blue-50 border rounded-lg flex justify-between items-center flex-wrap">
                        {lastDonation ? (
                            remainingDays > 0 ? (
                                <p className="text-blue-700 font-medium">
                                    Last donation:{" "}
                                    <span className="font-semibold">
                                        {lastDonationDate}
                                    </span>
                                    . Eligible again in{" "}
                                    <span className="font-bold">{remainingDays} days</span>.
                                </p>
                            ) : (
                                <p className="text-green-700 font-medium">
                                    You are eligible to donate now! 🎉
                                </p>
                            )
                        ) : (
                            <p className="text-gray-700 font-medium">
                                You haven't donated yet. You're eligible right now!
                            </p>
                        )}

                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                        >
                            Book Donation
                        </button>
                    </div>

                    {/* Modal */}
                    {isModalOpen && (
                        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
                            <div className="bg-white p-6 rounded-xl w-full max-w-md relative">
                                <button
                                    className="absolute text-black right-3 top-2 text-xl"
                                    onClick={() => setIsModalOpen(false)}
                                >
                                    ×
                                </button>

                                <h3 className="text-xl font-semibold mb-4">
                                    Book Donation Appointment
                                </h3>

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    {/* Hospital */}
                                    <div>
                                        <label className="block mb-1">Select Hospital</label>
                                        <select
                                            required
                                            value={selectedHospital}
                                            onChange={(e) => setSelectedHospital(e.target.value)}
                                            className="w-full border text-black rounded-lg px-3 py-2"
                                        >
                                            <option value="">-- Choose Hospital --</option>
                                            {hospitals.map((h) => (
                                                <option key={h.hospitalId} value={h.hospitalId}>
                                                    {h.hospitalName} – {h.hospitalAddress}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Date */}
                                    <div>
                                        <label className="block mb-1">Date</label>
                                        <input
                                            required
                                            type="date"
                                            name="date"
                                            value={formData.date}
                                            onChange={handleChange}
                                            className="w-full border text-black rounded-lg px-3 py-2"
                                        />
                                    </div>

                                    {/* Time */}
                                    <div>
                                        <label className="block mb-1">Time</label>
                                        <input
                                            required
                                            type="time"
                                            name="time"
                                            value={formData.time}
                                            onChange={handleChange}
                                            className="w-full border text-black rounded-lg px-3 py-2"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-semibold"
                                    >
                                        Confirm Booking
                                    </button>
                                </form>
                            </div>
                        </div>
                    )}

                    {/* Donation Table */}
                    <div className="mt-6 shadow rounded-lg overflow-x-auto">
                        <table className="min-w-full bg-white">
                            <thead className="bg-purple-600 text-white">
                            <tr>
                                <th className="py-2 px-3">#</th>
                                <th className="py-2 px-3">Date</th>
                                <th className="py-2 px-3">Hospital</th>
                                <th className="py-2 px-3">Blood Group</th>
                                <th className="py-2 px-3">Status</th>
                            </tr>
                            </thead>
                            <tbody>
                            {donations.map((d, i) => (
                                <tr key={d.id || i} className="border-b hover:bg-gray-50">
                                    <td className="py-2 px-3 text-center">{i + 1}</td>
                                    <td className="py-2 px-3 text-center">
                                        {getDateString(d.donationDate) || "—"}
                                    </td>
                                    <td className="py-2 px-3 text-center">
                                        {d.hospital?.hospitalName || "—"}
                                    </td>
                                    <td className="py-2 px-3 text-center">
                                        {d.bloodGroup || "—"}
                                    </td>
                                    <td
                                        className={`py-2 px-3 text-center ${
                                            d.status?.toLowerCase() === "completed"
                                                ? "text-green-600"
                                                : "text-yellow-600"
                                        }`}
                                    >
                                        {d.status || "Pending"}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>

                    {donations.length === 0 && (
                        <p className="text-center text-gray-500 mt-4">
                            No donations found.
                        </p>
                    )}
                </>
            )}
        </div>
    );
}



// import React, { useEffect, useState } from "react";
// import { differenceInDays, addDays, parseISO } from "date-fns";
//
// import axios from "axios";
// import { useAuth } from "../../context/AuthContext.jsx";
// import { getAllHospitals } from "../../services/hospitalService.js";
//
// import {getAllHospitals} from "../../services/hospitalService.js";
// import axios from "axios";
//
// export default function DonationHistory() {
//     const [donations, setDonations] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState("");
//     const [isModalOpen, setIsModalOpen] = useState(false);
//
//     const [hospitals, setHospitals] = useState([]);
//     const [selectedHospital, setSelectedHospital] = useState(null);
//     const [formData, setFormData] = useState({ hospital: "", date: "", time: "" });
//
//     const { user } = useAuth();
//     const donorId = user?.donorId || localStorage.getItem("donorId");
//
//     // 🏥 Fetch all hospitals once
//     useEffect(() => {
//         const fetchHospitals = async () => {
//             try {
//                 const data = await getAllHospitals();
//                 setHospitals(data);
//             } catch (err) {
//                 console.error("Error fetching hospitals:", err);
//             }
//         };
//         fetchHospitals();
//     }, []);
//
//     // 🩸 Fetch donor's donation history
//     useEffect(() => {
//         if (!donorId) {
//             setError("Donor ID not found. Please log in again.");
//
//     const [hospitals,setHospitals] = useState([]);
//     const [selectedHospital,setSelectedHospitals] = useState('');
//     const [formData, setFormData] = useState({
//         hospital: "",
//         date: "",
//         time: "",
//     });
//
//     useEffect(()=>{
//         fetchHospitals();
//     },[]);
//
//     const fetchHospitals = async ()=>{
//         try{
//             const data = await getAllHospitals();
//              setHospitals(data);
//
//         }
//         catch (err){
//             console.error("Error fetching hospitals:",err);
//         }
//     };
//     const handleConfirm =()=>{
//         if(!selectedHospital) return alert("Please select a hospital");
//         onConfirm(selectedHospital);
//     }
//     useEffect(() => {
//         const donorId = localStorage.getItem("userId");
//
//         if (!donorId) {
//             console.error(" Donor ID not found in localStorage!");
//             setError("Donor information not found. Please log in again.");
//             setLoading(false);
//             return;
//         }
//
//         axios
//
//             .get(`http://localhost:8080/api/donations/donor/${donorId}`)
//             .then((res) => {
//                 setDonations(res.data || []);
//
//             .get(`http://localhost:8080/api/donations/donors/${donorId}`)
//             .then((res) => {
//                 console.log("Donations fetched:", res.data);
//                 setDonations(res.data);
//                 setError("");
//             })
//             .catch((err) => {
//                 console.error("Error fetching donations:", err);
//
//                 setError("Failed to fetch donation history.");
//             })
//             .finally(() => setLoading(false));
//     }, [donorId]);
//
//     // 🧠 Helper to safely extract date string (handles string/object/null)
//     const getDateString = (dateField) => {
//         if (!dateField) return null;
//         if (typeof dateField === "string") return dateField;
//         if (typeof dateField === "object" && dateField.date) return dateField.date;
//         return null;
//     };
//
//     // 🩸 Find last completed donation
//     const lastDonation = donations
//         .filter((d) => d.status?.toLowerCase() === "completed" && d.date)
//         .sort((a, b) => new Date(getDateString(b.date)) - new Date(getDateString(a.date)))[0];
//
//     const eligibilityDays = 90;
//     const lastDonationDateStr = getDateString(lastDonation?.date);
//
//     const nextEligibleDate =
//         lastDonationDateStr ? addDays(parseISO(lastDonationDateStr), eligibilityDays) : null;
//
//     const remainingDays =
//         nextEligibleDate && !isNaN(nextEligibleDate)
//             ? differenceInDays(nextEligibleDate, new Date())
//             : null;
//
//     // 🖋 Form handling
//     const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
//
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//
//         if (!selectedHospital) {
//             alert("Please select a hospital");
//             return;
//         }
//
//         const payload = {
//             donorId: Number(donorId),
//             hospitalId: Number(selectedHospital),
//             donationDate: formData.date,
//             donationTime: formData.time,
//         };
//
//         try {
//             console.log("Sending booking request:", payload);
//             await axios.post("http://localhost:8080/api/donations/book", payload);
//             alert("Donation appointment booked successfully!");
//
//             setIsModalOpen(false);
//             setFormData({ hospital: "", date: "", time: "" });
//             setSelectedHospital("");
//
//             // Refresh donations
//             const res = await axios.get(`http://localhost:8080/api/donations/donor/${donorId}`);
//             setDonations(res.data || []);
//         } catch (err) {
//             console.error("Booking error:", err);
//             alert("Failed to book donation.");
//         }
//
//                 setError("Failed to fetch donation history. Please try again later.");
//             })
//             .finally(() => setLoading(false));
//     }, []);
//
//     // Calculate next eligible donation date
//     const lastDonation = donations
//         .filter((d) => d.status?.toLowerCase() === "completed")
//         .sort((a, b) => new Date(b.date) - new Date(a.date))[0];
//
//     const eligibilityDays = 90;
//     const nextEligibleDate = lastDonation
//         ? addDays(parseISO(lastDonation.date), eligibilityDays)
//         : null;
//     const remainingDays = nextEligibleDate
//         ? differenceInDays(nextEligibleDate, new Date())
//         : null;
//
//
//
//     const handleChange = (e) => {
//         setFormData({ ...formData, [e.target.name]: e.target.value });
//     };
//
//     const handleSubmit = (e) => {
//         e.preventDefault();
//         console.log(" Appointment booked:", formData);
//         alert(
//             `Appointment booked at ${formData.hospital} on ${formData.date} at ${formData.time}`
//         );
//         setIsModalOpen(false);
//         setFormData({ hospital: "", date: "", time: "" });
//     };
//
//     return (
//         <div className="p-6">
//
//             <h2 className="text-2xl text-purple-600 font-bold mb-4">Donation History</h2>
//
//             {/* ⏳ Loading Spinner */}
//
//             <h2 className="text-2xl text-purple-600 font-bold mb-4">
//                  Donation History
//             </h2>
//
//             {/* Loading Spinner */}
//             {loading && (
//                 <div className="flex items-center justify-center py-10">
//                     <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600"></div>
//                     <p className="ml-3 text-gray-700 font-medium">Loading your donations...</p>
//                 </div>
//             )}
//
//
//             {/* ❌ Error Message */}
//             {!loading && error && (
//                 <div className="bg-red-100 border border-red-300 text-red-700 p-3 rounded-md mb-4">
//                     {error}
//                 </div>
//             )}
//
//             {/* ✅ Main Content */}
//             {!loading && !error && (
//                 <>
//                     {/* 🩸 Eligibility Info */}
//
//             {/* Error Message */}
//             {!loading && error && (
//                 <div className="bg-red-100 border border-red-300 text-red-700 p-3 rounded-md mb-4">
//                      {error}
//                 </div>
//             )}
//
//             {/* Main content (only if no error and not loading) */}
//             {!loading && !error && (
//                 <>
//                     {/* Eligibility Section */}
//                     <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between flex-wrap">
//                         {lastDonation ? (
//                             remainingDays > 0 ? (
//                                 <p className="text-blue-700 font-medium">
//                                     Last donation:{" "}
//
//                                     <span className="font-semibold">
//                                         {getDateString(lastDonation.date)}
//                                     </span>
//                                     . You’ll be eligible in{" "}
//                                     <span className="font-bold text-blue-800">
//                                         {remainingDays} days
//                                     </span>
//                                     .
//                                 </p>
//                             ) : (
//                                 <p className="text-green-700 font-medium">
//                                     You're eligible to donate now!
//
//                                     <span className="font-semibold">{lastDonation.date}</span>.
//                                     You’ll be eligible again in{" "}
//                                     <span className="text-blue-800 font-bold">{remainingDays} days</span>.
//                                 </p>
//                             ) : (
//                                 <p className="text-green-700 font-medium">
//                                      You’re eligible to donate now! Last donation was on{" "}
//                                     <span className="font-semibold">{lastDonation.date}</span>.
//                                 </p>
//                             )
//                         ) : (
//                             <p className="text-gray-600 font-medium">
//
//                                 You have not donated yet.
//                             </p>
//                         )}
//
//                         <button
//                             onClick={() => setIsModalOpen(true)}
//                             className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition mt-3 sm:mt-0"
//                         >
//                             Book Next Donation
//                         </button>
//                     </div>
//
//                     {/* 📅 Booking Modal */}
//
//                                 You haven’t donated yet. Once you donate, your eligibility countdown will appear here.
//                             </p>
//                         )}
//
//                         <div className="flex justify-end mt-3 sm:mt-0">
//                             <button
//                                 onClick={() => setIsModalOpen(true)}
//                                 className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition"
//                             >
//                                  Book Next Donation
//                             </button>
//                         </div>
//                     </div>
//
//                     {/* Booking Modal */}
//                     {isModalOpen && (
//                         <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
//                             <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md relative">
//                                 <h3 className="text-xl font-semibold mb-4">
//                                     Book Donation Appointment
//                                 </h3>
//                                 <button
//                                     onClick={() => setIsModalOpen(false)}
//                                     className="absolute top-2 right-3 text-gray-500 hover:text-gray-700 text-xl"
//                                 >
//                                     ×
//                                 </button>
//
//                                 <form onSubmit={handleSubmit} className="space-y-4">
//                                     <div>
//                                         <label className="block text-sm font-medium mb-1">
//                                             Select Hospital
//                                         </label>
//                                         <select
//
//                                             value={selectedHospital ?? ""}
//                                             onChange={(e) => setSelectedHospital(Number(e.target.value))}
//                                             className="text-black w-full border rounded-lg px-3 py-2 focus:ring-2"
//
//                                             name="hospital"
//                                             value={selectedHospital}
//
//                                             onChange={(e)=> setSelectedHospitals(e.target.value)}
//                                             className="text-black w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                                             required
//                                         >
//                                             <option value="">-- Choose Hospital --</option>
//                                             {hospitals.map((h) => (
//
//                                                 <option key={h.hospitalId} value={h.hospitalId}>
//                                                     {h.hospitalName} - {h.hospitalAddress}
//
//                                                 <option key={h.id} value={h.id}>
//                                                     {h.hospitalName}-{h.address}
//                                                 </option>
//                                             ))}
//                                         </select>
//                                     </div>
//
//                                     <div>
//                                         <label className="block text-sm font-medium mb-1">
//                                             Select Date
//                                         </label>
//                                         <input
//                                             type="date"
//                                             name="date"
//                                             value={formData.date}
//                                             onChange={handleChange}
//
//                                             className="text-black w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
//
//                                             className="text-black w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                                             required
//                                         />
//                                     </div>
//
//                                     <div>
//                                         <label className="block text-sm font-medium mb-1">
//                                             Select Time
//                                         </label>
//                                         <input
//                                             type="time"
//                                             name="time"
//                                             value={formData.time}
//                                             onChange={handleChange}
//
//                                             className="text-black w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
//
//                                             className="text-black w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                                             required
//                                         />
//                                     </div>
//
//                                     <button
//                                         type="submit"
//                                         className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition"
//                                     >
//                                         Confirm Booking
//                                     </button>
//                                 </form>
//                             </div>
//                         </div>
//                     )}
//
//
//                     {/* Donation Table */}
//                     <div className="overflow-x-auto rounded-lg shadow mt-6">
//                         <table className="min-w-full bg-white">
//                             <thead className="bg-blue-600 text-white">
//                             <tr>
//                                 <th className="py-2 px-4 text-center">#</th>
//                                 <th className="py-2 px-4 text-center">Date</th>
//                                 <th className="py-2 px-4 text-center">Hospital</th>
//                                 <th className="py-2 px-4 text-center">Blood Group</th>
//                                 <th className="py-2 px-4 text-center">Status</th>
//                             </tr>
//                             </thead>
//                             <tbody>
//                             {donations.map((donation, index) => (
//                                 <tr
//                                     key={donation.id || index}
//                                     className="border-b hover:bg-gray-50 transition"
//                                 >
//
//                                     <td className="py-2 px-4 text-black text-center">
//                                         {index + 1}
//                                     </td>
//                                     <td className="py-2 px-4 text-black text-center">
//                                         {getDateString(donation.donationDate) || "—"}
//                                     </td>
//                                     <td className="py-2 px-4 text-black text-center">
//                                         {donation.hospital?.hospitalName || "—"}
//                                     </td>
//                                     <td className="py-2 px-4 text-black text-center font-semibold">
//                                         {donation.bloodGroup || "—"}
//                                     </td>
//                                     <td
//                                         className={`py-2 px-4 text-center font-medium ${
//
//                                     <td className="py-2 text-black px-4 text-center">
//                                         {donation.id || index + 1}
//                                     </td>
//                                     <td className="py-2 text-black px-4 text-center">
//                                         {donation.date}
//                                     </td>
//                                     <td className="py-2 text-black px-4 text-center">
//                                         {donation.hospital?.name || "—"}
//                                     </td>
//                                     <td className="py-2 text-black px-4 text-center font-semibold">
//                                         {donation.bloodGroup || "—"}
//                                     </td>
//                                     <td
//                                         className={`py-2 text-black px-4 text-center font-medium ${
//                                             donation.status?.toLowerCase() === "completed"
//                                                 ? "text-green-600"
//                                                 : "text-yellow-600"
//                                         }`}
//                                     >
//                                         {donation.status || "Pending"}
//                                     </td>
//                                 </tr>
//                             ))}
//                             </tbody>
//                         </table>
//                     </div>
//
//                     {donations.length === 0 && (
//                         <p className="mt-4 text-gray-500 text-center">
//                             No donation records found.
//                         </p>
//                     )}
//                 </>
//             )}
//         </div>
//     );
// }
