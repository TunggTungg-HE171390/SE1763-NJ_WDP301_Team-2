import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

export default function Footer() {
    return (
        <footer className="mt-auto w-full bg-gray-900 text-white py-8 bottom-0 left-0 flex items-center justify-between ">
            <div className="container mx-auto px-6">
                {/* Top Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
                    {/* Column 1: About Us */}
                    <div>
                        <h2 className="text-lg font-semibold">About Us</h2>
                        <p className="mt-2 text-gray-400">
                            We provide expert mental health and wellness consultations to help you live a better life.
                        </p>
                        
                    
                    </div>

                    {/* Column 2: Head Office */}
                    <div className="flex justify-center">
                        <div>
                            <h2 className="text-lg font-semibold">Head Office</h2>
                            <ul className="mt-2 space-y-2 text-gray-400">
                                <li>📍 Address: 123 Wellness Street, City, Country</li>
                                <li>🏢 Business License: #ABC123456</li>
                                <li>📞 Phone: +1 (123) 456-7890</li>
                                <li>📧 Support Email: support@yourcompany.com</li>
                            </ul>
                        </div>
                    </div>

                    {/* Column 3: Quick Links */}
                    <div className="flex justify-center">
                        <div>
                            <h2 className="text-lg font-semibold">Quick Links</h2>
                            <ul className="mt-2 space-y-2">
                                <li>
                                    <a href="/consultation" className="hover:underline text-gray-400">
                                        Online Consultation
                                    </a>
                                </li>
                                <li>
                                    <a href="/services" className="hover:underline text-gray-400">
                                        Service Packages
                                    </a>
                                </li>
                                <li>
                                    <a href="/blogs" className="hover:underline text-gray-400">
                                        Blogs
                                    </a>
                                </li>
                                <li>
                                    <a href="/test" className="hover:underline text-gray-400">
                                        Mental Health Test
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="mt-8 border-t border-gray-700 pt-4 mx-auto flex flex-col md:flex-row justify-between items-center">
                    {/* Social Media Links (1/3 of space) */}
                    <div className="flex-1 flex justify-start space-x-4 my-4 md:mt-0">
                        <a href="https://facebook.com" className="text-gray-400 hover:text-blue-500">
                            <FaFacebook size={24} />
                        </a>
                        <a href="https://twitter.com" className="text-gray-400 hover:text-blue-400">
                            <FaTwitter size={24} />
                        </a>
                        <a href="https://instagram.com" className="text-gray-400 hover:text-pink-500">
                            <FaInstagram size={24} />
                        </a>
                        <a href="https://linkedin.com" className="text-gray-400 hover:text-blue-600">
                            <FaLinkedin size={24} />
                        </a>
                    </div>

                    {/* Copyright & Policies (1/3 of space, evenly distributed inside) */}
                    <div className="flex-1 flex justify-center space-x-6">
                        <div className="text-gray-400 ">© {new Date().getFullYear()} TrustTalk</div>
                        <div className="text-gray-400">Terms & Services</div>
                        <div className="text-gray-400">Privacy Policy</div>
                    </div>

                    {/* Empty Div to Maintain Structure (1/3 of space, aligns to the end) */}
                    <div className="flex-1 flex justify-end"></div>
                </div>
            </div>
        </footer>
    );
}
