import React, { useState } from "react";
import DonorProfile from "./donortabs/DonorProfile";
import DonotionHistory from "./donortabs/DonationHistory";
import DonorSettings from "./donortabs/DonorSettings";

import DonationStats from "./donortabs/DonationStats";

export default function DonorDashboard() {
    const [activeTab, setActiveTab] = useState("profile");

    return (

        <div className="fixed left-0 bottom-0 z-100 flex h-screen w-full bg-gray-100">

            <aside className="w-64 bg-white border-r shadow-sm flex flex-col">
                <div className="p-4 text-center text-black text-xl font-bold border-b">
                    Donor Dashboard
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    <button
                        onClick={() => setActiveTab("profile")}
                        className={`w-full flex items-center gap-2 px-4 py-2 rounded-md hover:bg-blue-50 ${activeTab === "profile" ? "bg-blue-100 text-blue-700 font-semibold" : "text-gray-700"
                            }`}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 9a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 21a7.5 7.5 0 00-15 0" />
                        </svg>
                        Profile
                    </button>

                    <button
                        onClick={() => setActiveTab("donations")}
                        className={`w-full flex items-center gap-2 px-4 py-2 rounded-md hover:bg-blue-50 ${activeTab === "donations" ? "bg-blue-100 text-blue-700 font-semibold" : "text-gray-700"
                            }`}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 6.75h15M4.5 12h15M4.5 17.25h15" />
                        </svg>
                        Donations
                    </button>

                    <button
                        onClick={() => setActiveTab("stats")}
                        className={`w-full flex items-center gap-2 px-4 py-2 rounded-md hover:bg-blue-50 ${activeTab === "stats" ? "bg-blue-100 text-blue-700 font-semibold" : "text-gray-700"
                            }`}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18V9m6 9V6m6 12v-4.5" />
                        </svg>
                        Stats
                    </button>

                    {/*<button*/}
                    {/*    onClick={() => setActiveTab("settings")}*/}
                    {/*    className={`w-full flex items-center gap-2 px-4 py-2 rounded-md hover:bg-blue-50 ${activeTab === "settings" ? "bg-blue-100 text-blue-700 font-semibold" : "text-gray-700"*/}
                    {/*        }`}*/}
                    {/*>*/}
                    {/*    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">*/}
                    {/*        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15.75a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5z" />*/}
                    {/*        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12a7.5 7.5 0 11-15 0 7.5 7.5 0 0115 0z" />*/}
                    {/*    </svg>*/}
                    {/*    Settings*/}
                    {/*</button>*/}
                </nav>

                <div className="p-4 border-t">
                    <button onClick={() => {
                        localStorage.removeItem("donorToken");
                        window.alert("You have been logged out.")
                        window.location.href = "/login";
                    }}
                        className="w-full flex items-center gap-2 px-4 py-2 rounded-md text-red-600 hover:bg-red-50">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6A2.25 2.25 0 005.25 5.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                        </svg>

                        Logout
                    </button>
                </div>


            </aside>

            <main className="flex-1 p-8 overflow-auto">
                {activeTab === "profile" && (
                    <div className="w-full h-full">
                        <DonorProfile />
                    </div>
                )}
                {activeTab === "donations" && (
                    < div className="w-full h-full">
                        <DonotionHistory />
                    </div>
                )}
                {activeTab === "stats" && (

                    <div className="text-gray-600">
                        <DonationStats />
                    </div>
                )}
                {/*{activeTab === "settings" && (*/}
                {/*    <div className="text-gray-600">*/}
                {/*        <DonorSettings />*/}
                {/*    </div>*/}
                {/*)}*/}
            </main>
        </div>
    );
}
