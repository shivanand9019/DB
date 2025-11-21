import React from "react";

const Footer = () => {
    return (
        <footer className="flex justify-between items-center fixed bottom-0 right-0 bg-gray-800 text-white  px-6 py-4 shadow-md w-full z-50">
            <div className="container mx-auto flex flex-col md:flex-row justify-between text-center items-center px-4">
              
                <p className="text-sm text-center md:text-left">
                    © {new Date().getFullYear()} Blood Donation System. All rights reserved.
                </p>

               
                <div className="mt-2 md:mt-0  ">
                    <a
                        href="mailto:help@bloodsystem.com"
                        className="hover:underline px-5"
                    >
                        Email Us
                    </a>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
