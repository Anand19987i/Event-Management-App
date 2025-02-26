import React from 'react'
import { RiTwitterXFill } from 'react-icons/ri';

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white py-10">
            <div className="container mx-auto px-6 md:px-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

                    {/* Logo & Description */}
                    <div>
                        <h2 className="text-2xl font-bold text-indigo-500">Eventify</h2>
                        <p className="mt-3 text-gray-400">
                            Discover & book amazing events around you. Experience entertainment like never before!
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-semibold text-indigo-400">Quick Links</h3>
                        <ul className="mt-3 space-y-2">
                            <li><a href="/" className="hover:text-indigo-400">Home</a></li>
                            <li><a href="/view/events" className="hover:text-indigo-400">Events</a></li>
                            <li><a href="/about" className="hover:text-indigo-400">About Us</a></li>
                            <li><a href="/contact" className="hover:text-indigo-400">Contact</a></li>
                        </ul>
                    </div>

                    {/* Contact Details */}
                    <div>
                        <h3 className="text-lg font-semibold text-indigo-400">Contact</h3>
                        <p className="mt-3 text-gray-400">Email: anandpandey1765@gmail.com</p>
                        <p className="text-gray-400">Phone: +91 97699 65187</p>
                        <p className="text-gray-400">Address: Mumbai, India</p>
                    </div>

                    {/* Social Media Links */}
                    <div>
                        <h3 className="text-lg font-semibold text-indigo-400">Developed By Anand Pandey</h3>
                        <div className="mt-3 flex space-x-4">
                            <a href="https://x.com/AnandPande57144" target='_blank' className="text-gray-400 hover:text-indigo-400 text-2xl">
                                <RiTwitterXFill className='w-5 h-5 mt-2'/>
                            </a>
                            <a href="https://www.linkedin.com/in/anand-pandey-5b5875253/" target='_blank' className="text-gray-400 hover:text-indigo-400 text-2xl">
                                <i className="fab fa-linkedin"></i>
                            </a>
                            <a href="https://www.facebook.com/profile.php?id=100019793114822" target='_blank' className="text-gray-400 hover:text-indigo-400 text-2xl">
                                <i className="fab fa-facebook"></i>
                            </a>
                        </div>
                    </div>

                </div>

                {/* Bottom Line */}
                <div className="mt-8 border-t border-gray-700 pt-5 text-center text-gray-400">
                    © {new Date().getFullYear()} Eventify. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
