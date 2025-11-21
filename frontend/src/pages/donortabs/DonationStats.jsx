import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis
} from "recharts";
import { useAuth } from "../../context/AuthContext.jsx";

export default function DonationStats() {
    const { user } = useAuth();
    const donorId = user?.donorId || localStorage.getItem("donorId");

    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

    useEffect(() => {
        if (!donorId) {
            setError("Donor ID not found. Please log in again.");
            setLoading(false);
            return;
        }

        axios
            .get(`http://localhost:8080/api/donations/stats/donors/${donorId}`)
            .then((res) => {
                console.log("Stats fetched:", res.data);
                setStats(res.data);
            })
            .catch((err) => {
                console.error("Error fetching stats:", err);
                setError("Failed to load donation statistics.");
            })
            .finally(() => setLoading(false));
    }, [donorId]);

    if (loading)
        return (
            <div className="flex items-center justify-center py-10">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600"></div>
                <p className="ml-3 text-gray-700 font-medium">Loading statistics...</p>
            </div>
        );

    if (error)
        return (
            <div className="bg-red-100 text-red-700 p-3 rounded-md text-center">
                {error}
            </div>
        );

    if (!stats)
        return (
            <p className="text-gray-600 text-center">
                No donation statistics available.
            </p>
        );

    // PREPARE DATA
    const bloodTypeData = Object.entries(stats.bloodTypeData || {}).map(
        ([type, count]) => ({ type, count })
    );

    const monthlyData = Object.entries(stats.monthlyData || {}).map(
        ([month, donations]) => ({ month, donations })
    );

    const recentDonations = stats.recentDonations || [];

    return (
        <div className="p-6 space-y-6">
            {/* Total Donations */}
            <div className="bg-white shadow rounded-lg p-4 text-center">
                <h2 className="text-xl font-semibold">Total Donations</h2>
                <p className="text-3xl font-bold text-red-500">
                    {stats.totalDonations || 0}
                </p>
            </div>

            {/* Blood Type Pie Chart */}
            <div className="bg-white shadow rounded-lg p-4">
                <h2 className="text-xl font-semibold mb-4">Blood Type Frequency</h2>

                {bloodTypeData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={260}>
                        <PieChart>
                            <Pie
                                data={bloodTypeData}
                                dataKey="count"
                                nameKey="type"
                                outerRadius={90}
                                label
                            >
                                {bloodTypeData.map((_, i) => (
                                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                ) : (
                    <p className="text-gray-500 text-center">No blood type data available.</p>
                )}
            </div>

            {/* Monthly Donations Bar Chart */}
            <div className="bg-white shadow rounded-lg p-4">
                <h2 className="text-xl font-semibold mb-4">Monthly Donations</h2>

                {monthlyData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={monthlyData}>
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="donations" fill="#FF4B5C" />
                        </BarChart>
                    </ResponsiveContainer>
                ) : (
                    <p className="text-gray-500 text-center">No monthly donation data available.</p>
                )}
            </div>

            {/* Recent Donations */}
            <div className="bg-white shadow rounded-lg p-4 overflow-x-auto">
                <h2 className="text-xl font-semibold mb-4">Recent Donations</h2>

                {recentDonations.length > 0 ? (
                    <table className="min-w-full table-auto border-collapse">
                        <thead>
                        <tr className="bg-gray-100">
                            <th className="border px-4 py-2">Date</th>
                            <th className="border px-4 py-2">Location</th>
                            <th className="border px-4 py-2">Quantity (ml)</th>
                        </tr>
                        </thead>
                        <tbody>
                        {recentDonations.map((d, i) => (
                            <tr key={i}>
                                <td className="border px-4 py-2">{d.date}</td>
                                <td className="border px-4 py-2">{d.location}</td>
                                <td className="border px-4 py-2">{d.quantity}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                ) : (
                    <p className="text-gray-500 text-center">No recent donations found.</p>
                )}
            </div>
        </div>
    );
}

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import {
//     PieChart,
//     Pie,
//     Cell,
//     Tooltip,
//     ResponsiveContainer,
//     BarChart,
//     Bar,
//     XAxis,
//     YAxis
// } from "recharts";
// import {useAuth} from "../../context/AuthContext.jsx";
//
//
//
// export default function DonationStats() {
//     const { user } = useAuth();
//     const [stats, setStats] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState("");
//
//     const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
//     const donorId = user?.donorId || localStorage.getItem("donorId");
//
//     useEffect(() => {
//
//         if (!donorId) {
//             setError("Donor ID not found. Please log in again.");
//             setLoading(false);
//             return;
//         }
//
//         axios
//             .get(`http://localhost:8080/api/donations/stats/donors/${donorId}`)
//             .then((res) => {
//                 setStats(res.data);
//                 setError("");
//             })
//             .catch((err) => {
//                 console.error("Error fetching stats:", err);
//                 setError("Failed to load donation statistics.");
//             })
//             .finally(() => setLoading(false));
//     }, []);
//
//     if (loading)
//         return (
//             <div className="flex items-center justify-center py-10">
//                 <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600"></div>
//                 <p className="ml-3 text-gray-700 font-medium">Loading statistics...</p>
//             </div>
//         );
//
//     if (error)
//         return (
//             <div className="bg-red-100 text-red-700 p-3 rounded-md text-center">
//                 ⚠️ {error}
//             </div>
//         );
//
//     if (!stats)
//         return (
//             <p className="text-gray-600 text-center">No donation statistics available.</p>
//         );
//
//     const bloodTypeData = Object.entries(stats.bloodTypeData || {}).map(
//         ([type, count]) => ({ type, count })
//     );
//
//     const monthlyData = Object.entries(stats.monthlyData || {}).map(
//         ([month, donations]) => ({ month, donations })
//     );
//
//     const recentDonations = stats.recentDonations || [];
//
//     return (
//         <div className="p-6 space-y-6">
//             {/* Total Donations */}
//             <div className="bg-white shadow rounded-lg p-4 text-center">
//                 <h2 className="text-xl font-semibold">Total Donations</h2>
//                 <p className="text-3xl font-bold text-red-500">{stats.totalDonations || 0}</p>
//             </div>
//
//             {/* Blood Type Pie Chart */}
//             <div className="bg-white shadow rounded-lg p-4">
//                 <h2 className="text-xl font-semibold mb-4">Blood Type Frequency</h2>
//                 {bloodTypeData.length > 0 ? (
//                     <ResponsiveContainer width="100%" height={250}>
//                         <PieChart>
//                             <Pie
//                                 data={bloodTypeData}
//                                 dataKey="count"
//                                 nameKey="type"
//                                 outerRadius={80}
//                                 label
//                             >
//                                 {bloodTypeData.map((_, i) => (
//                                     <Cell key={i} fill={COLORS[i % COLORS.length]} />
//                                 ))}
//                             </Pie>
//                             <Tooltip />
//                         </PieChart>
//                     </ResponsiveContainer>
//                 ) : (
//                     <p className="text-gray-500 text-center">No blood type data available.</p>
//                 )}
//             </div>
//
//             {/* Monthly Bar Chart */}
//             <div className="bg-white shadow rounded-lg p-4">
//                 <h2 className="text-xl font-semibold mb-4">Monthly Donations</h2>
//                 {monthlyData.length > 0 ? (
//                     <ResponsiveContainer width="100%" height={250}>
//                         <BarChart data={monthlyData}>
//                             <XAxis dataKey="month" />
//                             <YAxis />
//                             <Tooltip />
//                             <Bar dataKey="donations" fill="#FF4B5C" />
//                         </BarChart>
//                     </ResponsiveContainer>
//                 ) : (
//                     <p className="text-gray-500 text-center">No monthly donation data available.</p>
//                 )}
//             </div>
//
//             {/* Recent Donations Table */}
//             <div className="bg-white shadow rounded-lg p-4 overflow-x-auto">
//                 <h2 className="text-xl font-semibold mb-4">Recent Donations</h2>
//                 {recentDonations.length > 0 ? (
//                     <table className="min-w-full table-auto border-collapse">
//                         <thead>
//                         <tr className="bg-gray-100">
//                             <th className="border px-4 py-2">Date</th>
//                             <th className="border px-4 py-2">Location</th>
//                             <th className="border px-4 py-2">Quantity (ml)</th>
//                         </tr>
//                         </thead>
//                         <tbody>
//                         {recentDonations.map((d, i) => (
//                             <tr key={i}>
//                                 <td className="border px-4 py-2">{d.date}</td>
//                                 <td className="border px-4 py-2">{d.location}</td>
//                                 <td className="border px-4 py-2">{d.quantity}</td>
//                             </tr>
//                         ))}
//                         </tbody>
//                     </table>
//                 ) : (
//                     <p className="text-gray-500 text-center">No recent donations found.</p>
//                 )}
//             </div>
//         </div>
//     );
// }

