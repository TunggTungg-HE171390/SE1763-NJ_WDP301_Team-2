import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Footer() {
    return (
        <footer className="mt-auto w-full bg-blue-600 border-t border-white text-white py-8 bottom-0 left-0 flex items-center justify-between">
            <div className="container mx-auto px-6">
                {/* Top Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
                    {/* Column 1: About Us */}
                    <div>
                        <h2 className="text-lg font-semibold">Về chúng tôi</h2>
                        <p className="mt-2 text-white">
                            Là một website hỗ trợ người dùng đặc biệt là giới trẻ giúp họ giải tỏa stress, vượt qua trầm
                            cảm, tìm kiếm sự đồng cảm và hướng dẫn từ chuyên gia.
                        </p>
                    </div>

                    {/* Column 2: Head Office */}
                    <div className="flex justify-center">
                        <div>
                            <h2 className="text-lg font-semibold">Trụ sở chính</h2>
                            <ul className="mt-2 space-y-2 text-white">
                                <li>📍 Địa chỉ: Khu CNC, Thạch Thất, Hà Nội</li>
                                <li>📞 Số điện thoại: +84 (036) 961-6575</li>
                                <li>📧 Email hỗ trợ: tamgiaomentalhealth@gmail.com</li>
                            </ul>
                        </div>
                    </div>

                    {/* Column 3: Quick Links */}
                    <div className="flex justify-center">
                        <div>
                            <h2 className="text-lg font-semibold">Đường dẫn nhanh</h2>
                            <ul className="mt-2 space-y-2">
                                <li>
                                    <Link to="/doctor" className="hover:underline text-white">
                                        Tư vấn trực tuyến
                                    </Link>
                                </li>
                                <li>
                                    <Link to="#" className="hover:underline text-white">
                                        Gói dịch vụ
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/blog" className="hover:underline text-white">
                                        Bài viết
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/CategoryTestSelected" className="hover:underline text-white">
                                        Kiểm tra tâm lý
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="mt-8 border-t border-white pt-4 mx-auto flex flex-col md:flex-row justify-between items-center">
                    {/* Social Media Links (1/3 of space) */}
                    <div className="flex-1 flex justify-start space-x-4 my-4 md:mt-0">
                        <Link
                            href="https://www.facebook.com/profile.php?id=61572436850296"
                            className="text-white hover:text-blue-500">
                            <FaFacebook size={24} />
                        </Link>
                        <Link href="https://twitter.com" className="text-white hover:text-blue-400">
                            <FaTwitter size={24} />
                        </Link>
                        <Link href="https://instagram.com" className="text-white hover:text-pink-500">
                            <FaInstagram size={24} />
                        </Link>
                        <Link href="https://linkedin.com" className="text-white hover:text-blue-600">
                            <FaLinkedin size={24} />
                        </Link>
                    </div>

                    {/* Copyright & Policies (1/3 of space, evenly distributed inside) */}
                    <div className="flex-1 flex justify-center space-x-6">
                        <div className="text-white ">© {new Date().getFullYear()} Tâm Giao</div>
                        <div className="text-white">Điều khoản & Dịch vụ</div>
                        <div className="text-white">Chính sách bảo mật</div>
                    </div>

                    {/* Empty Div to Maintain Structure (1/3 of space, aligns to the end) */}
                    <div className="flex-1 flex justify-end"></div>
                </div>
            </div>
        </footer>
    );
}
