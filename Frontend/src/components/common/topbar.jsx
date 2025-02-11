import { Link } from "react-router-dom";

const TopBar = () => {
    return (
        <div className="bg-gray-300 text-gray-500 text-sm fixed top-0 left-0 w-full z-50 flex items-center px-6 py-[6px]">
            <div className="flex space-x-4">
                <span className="font-semibold">Hotline:</span> +1 (123) 456-7890
                <Link to="/news" className="text-gray-500 hover:text-blue-400 transition">
                    News
                </Link>
                <Link to="/support" className="text-gray-500 hover:text-blue-400 transition">
                    Support
                </Link>
                <Link to="/terms" className="text-gray-500 hover:text-blue-400 transition">
                    Terms
                </Link>
            </div>
        </div>
    );
};

export default TopBar;
