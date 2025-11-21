import React from "react";

const About = () => {
    return (
        <div className="max-w-4xl mx-auto text-center px-5 py-12">
            <h1 className="text-4xl font-bold text-black mb-4">About Us</h1>
            <p className="text-lg text-black mb-8">
                Our Blood Donation System is designed to connect hospitals with willing
                donors in the fastest and most efficient way possible.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
                <div className="bg-white p-6 rounded-xl shadow-md text-left">
                    <h2 className="text-orange-600 text-xl font-semibold mb-2">🎯 Our Mission</h2>
                    <p className="text-gray-800 text-base">
                        To save lives by bridging the gap between blood donors and hospitals
                        through a simple and reliable platform.
                    </p>
                </div>

                
                <div className="bg-white p-6 rounded-xl shadow-md text-left">
                    <h2 className="text-orange-600 text-xl font-semibold mb-2">💡 Why This Project?</h2>
                    <p className="text-gray-800 text-base">
                        During emergencies, finding blood quickly is a huge challenge. Our
                        system ensures hospitals can raise requests and find matching donors
                        instantly.
                    </p>
                </div>

             
                <div className="bg-white p-6 rounded-xl shadow-md text-left">
                    <h2 className="text-orange-600 text-xl font-semibold mb-2">👩‍💻 Our Team</h2>
                    <p className="text-gray-800 text-base">
                        Built by passionate students with the vision to use technology for
                        solving real-world healthcare problems.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default About;
