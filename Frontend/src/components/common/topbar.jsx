import { Link } from "react-router-dom";

const TopBar = () => {
    return (
        <div className="w-full absolute bg-gray-300 text-gray-500 text-sm top-0 left-0 z-50 flex items-center px-6 py-[3px]">
            <div className="flex space-x-4">
                <span className="font-semibold">Hotline:</span> +84 (036) 961-6575
                <Link to="/blog" className="text-gray-500 hover:text-blue-400 transition">
                    Tin tức
                </Link>
                <Link
                    to="https://www.facebook.com/profile.php?id=61572436850296"
                    className="text-gray-500 hover:text-blue-400 transition">
                    Hỗ trợ
                </Link>
                <Link to="/about-us" className="text-gray-500 hover:text-blue-400 transition">
                    Về chúng tôi
                </Link>
            </div>
        </div>
    );
};

export default TopBar;
