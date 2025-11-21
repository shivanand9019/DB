import React from "react";

const Contact = () => {
    return (
        <div className="max-w-xl mx-auto flex flex-col p-5 mt-12">
            <h1 className="text-3xl font-bold text-black mb-2">Contact Us</h1>
            <p className="text-base text-black mb-6">
                Reach out to us for any queries or support
            </p>

            <div className="text-left flex flex-col bg-gray-100 p-5 rounded-lg shadow-md">
                <p className="text-lg text-gray-800 mb-2">
                    <strong>Address:</strong> Bengaluru, India
                </p>
                <p className="text-lg text-gray-800 mb-2">
                    <strong>Email:</strong> support@blooddonation.com
                </p>
                <p className="text-lg text-gray-800 mb-2">
                    <strong>Phone No:</strong> +91 8813793018
                </p>
                <p className="text-lg text-gray-800 mb-2">
                    <strong>Working Hours:</strong> Mon - Sat, 9:00 AM - 6:00 PM
                </p>
            </div>
        </div>
    );
};

export default Contact;
