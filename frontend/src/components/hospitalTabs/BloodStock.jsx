import React, { useEffect, useState } from "react";
import {
    getBloodStock,
    updateBloodStock,
    addBloodStock,
} from "../../services/bloodStockApi.js";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

import { useAuth } from "../../context/AuthContext.jsx";

export default function BloodStock() {
    const [stock, setStock] = useState([]);
    const [loading, setLoading] = useState(true);

    const [editing, setEditing] = useState(null); // which blood group is editing
    const [updatedUnits, setUpdatedUnits] = useState("");

    const [adding, setAdding] = useState(false);
    const [formData, setFormData] = useState({
        bloodGroup: "",
        unitsAvailable: "",
    });

    const { user } = useAuth();
    const hospitalId = user?.hospitalId || localStorage.getItem("hospitalId");

    // -------------------------------------------------------------
    // Fetch stock once hospitalId is present
    // -------------------------------------------------------------
    useEffect(() => {
        if (hospitalId) fetchStock();
    }, [hospitalId]);

    const fetchStock = async () => {
        try {
            setLoading(true);
            const data = await getBloodStock(hospitalId);
            setStock(data);
        } catch (err) {
            console.error("Error fetching stock:", err);
        } finally {
            setLoading(false);
        }
    };

    // -------------------------------------------------------------
    // Update existing blood group stock
    // -------------------------------------------------------------
    const handleUpdate = async (bloodGroup) => {
        if (!updatedUnits) {
            alert("Please enter units before saving.");
            return;
        }

        try {
            await updateBloodStock(
                hospitalId,
                bloodGroup,
                parseInt(updatedUnits)
            );

            alert("Stock updated successfully!");
            setEditing(null);
            setUpdatedUnits("");
            fetchStock();
        } catch (err) {
            console.error("Error updating stock:", err);
        }
    };

    // -------------------------------------------------------------
    // Add new blood group to stock
    // -------------------------------------------------------------
    const handleAdd = async () => {
        if (!formData.bloodGroup || !formData.unitsAvailable) {
            alert("Please fill all fields.");
            return;
        }

        try {
            await addBloodStock(
                hospitalId,
                formData.bloodGroup,
                parseInt(formData.unitsAvailable)
            );

            alert("Blood group added successfully!");
            setAdding(false);
            setFormData({ bloodGroup: "", unitsAvailable: "" });
            fetchStock();
        } catch (err) {
            console.error("Error adding stock:", err);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="p-6 bg-white shadow-md rounded-xl">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-red-600">
                    Blood Stock Management
                </h2>

                <button
                    onClick={() => setAdding(!adding)}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                    {adding ? "Close" : "➕ Add Stock"}
                </button>
            </div>

            {/* Add New Blood Group Form */}
            {adding && (
                <div className="mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-semibold mb-3 text-gray-700">
                        Add New Blood Group
                    </h3>

                    <div className="flex flex-wrap gap-4">
                        <input
                            type="text"
                            placeholder="Blood Group (e.g. A+)"
                            value={formData.bloodGroup}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    bloodGroup: e.target.value,
                                })
                            }
                            className="border text-black p-2 rounded w-40"
                        />

                        <input
                            type="number"
                            placeholder="Units"
                            value={formData.unitsAvailable}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    unitsAvailable: e.target.value,
                                })
                            }
                            className="border text-black p-2 rounded w-32"
                        />

                        <button
                            onClick={handleAdd}
                            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                        >
                            Add
                        </button>
                    </div>
                </div>
            )}

            {/* Stock Table */}
            <div className="overflow-x-auto mb-8">
                <table className="min-w-full text-sm text-left border">
                    <thead className="bg-red-100">
                    <tr>
                        <th className="px-4 py-2 border text-purple-700">
                            Blood Group
                        </th>
                        <th className="px-4 py-2 border text-purple-700">
                            Units Available
                        </th>
                        <th className="px-4 py-2 border text-purple-700">
                            Last Updated
                        </th>
                        <th className="px-4 py-2 border text-purple-700 text-center">
                            Action
                        </th>
                    </tr>
                    </thead>

                    <tbody>
                    {stock.length > 0 ? (
                        stock.map((item) => (
                            <tr
                                key={item.id}
                                className="border-b hover:bg-gray-50"
                            >
                                <td className="px-4 py-2 text-black border font-semibold">
                                    {item.bloodGroup}
                                </td>

                                <td
                                    className={`px-4 py-2 text-black border font-bold ${
                                        item.unitsAvailable < 5
                                            ? "text-red-600"
                                            : "text-green-600"
                                    }`}
                                >
                                    {item.unitsAvailable}
                                </td>

                                <td className="px-4 py-2 text-black border">
                                    {item.lastUpdated
                                        ? new Date(
                                            item.lastUpdated
                                        ).toLocaleString()
                                        : "–"}
                                </td>

                                <td className="px-4 py-2 text-center border">
                                    {editing === item.bloodGroup ? (
                                        <div className="flex gap-2 items-center justify-center">
                                            <input
                                                type="number"
                                                value={updatedUnits}
                                                onChange={(e) =>
                                                    setUpdatedUnits(
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Units"
                                                className="border px-2 py-1 rounded w-20"
                                            />

                                            <button
                                                onClick={() =>
                                                    handleUpdate(
                                                        item.bloodGroup
                                                    )
                                                }
                                                className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-xs"
                                            >
                                                Save
                                            </button>

                                            <button
                                                onClick={() =>
                                                    setEditing(null)
                                                }
                                                className="bg-gray-200 px-3 py-1 rounded text-xs"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() =>
                                                setEditing(item.bloodGroup)
                                            }
                                            className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-xs"
                                        >
                                            Update
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td
                                colSpan="4"
                                className="px-4 py-2 text-center border text-gray-500"
                            >
                                No stock data available.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>

            {/* Chart */}
            <div className="bg-white border rounded-lg p-4 shadow-md">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">
                    Blood Group Distribution
                </h3>

                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={stock}>
                        <XAxis dataKey="bloodGroup" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="unitsAvailable" fill="#ff4d4d" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

// import React, { useEffect, useState } from "react";
// import { getBloodStock, updateBloodStock, addBloodStock } from "../../services/bloodStockApi.js";
// import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
//
// import {useAuth} from "../../context/AuthContext.jsx";
//
//
// export default function BloodStock() {
//     const [stock, setStock] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [editing, setEditing] = useState(null);
//     const [adding, setAdding] = useState(false);
//     const [formData, setFormData] = useState({ bloodGroup: "", unitsAvailable: "" });
//     const [updatedUnits, setUpdatedUnits] = useState("");
//
//
//     const { user } = useAuth();
//     const hospitalId = user?.hospitalId || localStorage.getItem("hospitalId");
//
//     const TEMP_HOSPITAL_ID = 1; // replace with actual hospitalId from context/auth later
//
//     useEffect(() => {
//         fetchStock();
//     }, []);
//
//     const fetchStock = async () => {
//         try {
//
//             const data = await getBloodStock(hospitalId);
//
//             const data = await getBloodStock(TEMP_HOSPITAL_ID);
//             setStock(data);
//         } catch (err) {
//             console.error("Error fetching stock:", err);
//         } finally {
//             setLoading(false);
//         }
//     };
//
//     const handleUpdate = async (bloodGroup) => {
//         if (!updatedUnits) {
//             alert("Please enter units before saving.");
//             return;
//         }
//         try {
//
//             await updateBloodStock(hospitalId, bloodGroup, parseInt(updatedUnits));
//
//             await updateBloodStock(TEMP_HOSPITAL_ID, bloodGroup, parseInt(updatedUnits));
//             alert("Stock updated successfully!");
//             setEditing(null);
//             setUpdatedUnits("");
//             fetchStock();
//         } catch (err) {
//             console.error("Error updating stock:", err);
//         }
//     };
//
//     const handleAdd = async () => {
//         if (!formData.bloodGroup || !formData.unitsAvailable) {
//             alert("Please fill all fields.");
//             return;
//         }
//         try {
//
//             await addBloodStock(hospitalId, formData.bloodGroup, parseInt(formData.unitsAvailable));
//
//             await addBloodStock(TEMP_HOSPITAL_ID, formData.bloodGroup, parseInt(formData.unitsAvailable));
//             alert("Blood group added successfully!");
//             setAdding(false);
//             setFormData({ bloodGroup: "", unitsAvailable: "" });
//             fetchStock();
//         } catch (err) {
//             console.error("Error adding stock:", err);
//         }
//     };
//
//     if (loading) return <div>Loading...</div>;
//
//     return (
//         <div className="p-6 bg-white shadow-md rounded-xl">
//             {/* Header */}
//             <div className="flex justify-between items-center mb-6">
//                 <h2 className="text-2xl font-bold text-red-600">Blood Stock Management</h2>
//                 <button
//                     onClick={() => setAdding(!adding)}
//                     className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
//                 >
//
//                     {adding ? "Close" : " Add Stock"}
//
//                     {adding ? "Close" : "➕ Add Stock"}
//                 </button>
//             </div>
//
//             {/* Add Stock Form */}
//             {adding && (
//                 <div className="mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
//                     <h3 className="text-lg font-semibold mb-3 text-gray-700">Add New Blood Group</h3>
//                     <div className="flex flex-wrap gap-4">
//                         <input
//                             type="text"
//                             placeholder="Blood Group (e.g. A+)"
//                             value={formData.bloodGroup}
//                             onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
//
//                             className="border text-black p-2 rounded w-40"
//
//                             className="border p-2 rounded w-40"
//                         />
//                         <input
//                             type="number"
//                             placeholder="Units"
//                             value={formData.unitsAvailable}
//                             onChange={(e) => setFormData({ ...formData, unitsAvailable: e.target.value })}
//
//                             className="border p-2 text-black rounded w-32"
//
//                             className="border p-2 rounded w-32"
//                         />
//                         <button
//                             onClick={handleAdd}
//                             className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
//                         >
//                             Add
//                         </button>
//                     </div>
//                 </div>
//             )}
//
//             {/* Stock Table */}
//             <div className="overflow-x-auto mb-8">
//                 <table className="min-w-full text-sm text-left border">
//                     <thead className="bg-red-100">
//                     <tr>
//                         <th className="px-4 py-2 border text-purple-700">Blood Group</th>
//                         <th className="px-4 py-2 border text-purple-700">Units Available</th>
//                         <th className="px-4 py-2 border text-purple-700">Last Updated</th>
//                         <th className="px-4 py-2 border text-purple-700 text-center">Action</th>
//                     </tr>
//                     </thead>
//                     <tbody>
//                     {stock.length > 0 ? (
//                         stock.map((item) => (
//                             <tr key={item.id} className="border-b hover:bg-gray-50">
//                                 <td className="px-4 py-2 text-black border font-semibold">
//                                     {item.bloodGroup}
//                                 </td>
//                                 <td
//                                     className={`px-4 py-2 text-black border font-bold ${
//                                         item.unitsAvailable < 5 ? "text-red-600" : "text-green-600"
//                                     }`}
//                                 >
//                                     {item.unitsAvailable}
//                                 </td>
//                                 <td className="px-4 py-2 text-black border">
//                                     {item.lastUpdated
//                                         ? new Date(item.lastUpdated).toLocaleString()
//                                         : "—"}
//                                 </td>
//                                 <td className="px-4 py-2 text-center border">
//                                     {editing === item.bloodGroup ? (
//                                         <div className="flex gap-2 items-center justify-center">
//                                             <input
//                                                 type="number"
//                                                 value={updatedUnits}
//                                                 onChange={(e) => setUpdatedUnits(e.target.value)}
//                                                 placeholder="Units"
//                                                 className="border px-2 py-1 rounded w-20"
//                                             />
//                                             <button
//                                                 onClick={() => handleUpdate(item.bloodGroup)}
//                                                 className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-xs"
//                                             >
//                                                 Save
//                                             </button>
//                                             <button
//                                                 onClick={() => setEditing(null)}
//                                                 className="bg-gray-200 px-3 py-1 rounded text-xs"
//                                             >
//                                                 Cancel
//                                             </button>
//                                         </div>
//                                     ) : (
//                                         <button
//                                             onClick={() => setEditing(item.bloodGroup)}
//                                             className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-xs"
//                                         >
//                                             Update
//                                         </button>
//                                     )}
//                                 </td>
//                             </tr>
//                         ))
//                     ) : (
//                         <tr>
//                             <td className="px-4 py-2 text-center border" colSpan="4">
//                                 No stock data available.
//                             </td>
//                         </tr>
//                     )}
//                     </tbody>
//                 </table>
//             </div>
//
//             {/* Chart */}
//             <div className="bg-white border rounded-lg p-4 shadow-md">
//                 <h3 className="text-lg font-semibold mb-4 text-gray-800">Blood Group Distribution</h3>
//                 <ResponsiveContainer width="100%" height={300}>
//                     <BarChart data={stock}>
//                         <XAxis dataKey="bloodGroup" />
//                         <YAxis />
//                         <Tooltip />
//                         <Bar dataKey="unitsAvailable" fill="#ff4d4d" />
//                     </BarChart>
//                 </ResponsiveContainer>
//             </div>
//         </div>
//     );
// }
