import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { GraduationCap, Building2, Star } from "lucide-react";
import * as API from "@/api";
import apiClient from "@/api/apiClient";

const HomeSection = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [doctors, setDoctors] = useState([]);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const response = await apiClient.get("/blogposts/allblogs");
                const sortedBlogs = response.data.sort((a, b) => b.views - a.views); // Sort by most views
                setBlogs(sortedBlogs.slice(0, 4)); // Get top 4 blogs
            } catch (error) {
                setError("Failed to fetch blog posts. Please try again later.", error);
            } finally {
                setLoading(false);
            }
        };
        fetchBlogs();
    }, []);

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const response = await API.getPsychologistList();
                const topDoctors = response.data.data.slice(0, 3); // Get top 3
                setDoctors(topDoctors);
            } catch (error) {
                console.error("Error fetching doctors:", error);
            }
        };

        fetchDoctors();
    }, []);

    return (
        <div className="w-full mx-auto p-8 bg-blue-50 flex justify-center">
            <div className="max-w-6xl w-full grid grid-cols-5 gap-8">
                {/* Left: Top Viewed Blogs (3/5) */}
                <div className="col-span-3">
                    <h2 className="text-2xl font-semibold mb-6 text-blue-600">Bài viết được xem nhiều</h2>
                    {loading && <p>Đang tải...</p>}
                    {error && <p className="text-red-500">{error}</p>}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {blogs.map((blog) => (
                            <div key={blog._id}>
                                <Link to={`/blogdetail/${blog._id}`}>
                                    <Card className="hover:shadow-lg transition-shadow mb-[-10px]">
                                        <CardContent className="p-0">
                                            {/* Featured Image */}
                                            <img
                                                src={blog.image || "https://source.unsplash.com/400x300?health"} // Default image if none
                                                alt={blog.title}
                                                className="w-full h-44 object-cover rounded-t-lg"
                                            />
                                        </CardContent>
                                    </Card>
                                    {/* Blog Title */}
                                    <div className="p-4">
                                        <h3 className="font-semibold text-lg text-center line-clamp-1">{blog.title}</h3>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>

                    {/* Link to All Blogs */}
                    <div className="mt-4 flex justify-center">
                        <Link to="/blog" className="text-blue-600 hover:underline flex items-center gap-1 justify-end">
                            Xem tất cả bài viết →
                        </Link>
                    </div>
                </div>

                {/* Right: Featured Doctors (2/5) */}
                <div className="col-span-2">
                    <h2 className="text-2xl font-semibold mb-6 text-blue-600">Tư vấn viên nổi bật</h2>
                    <div className="space-y-6">
                        {doctors.map((doctor) => (
                            <Link to={`/doctor/profile/${doctor._id}`} key={doctor._id}>
                                <Card className="hover:shadow-lg flex transition-shadow bg-white cursor-pointer mb-4">
                                    <CardContent className="p-4 w-full">
                                        {" "}
                                        {/* Ensures full width */}
                                        <div className="flex items-start gap-4">
                                            {/* Avatar */}
                                            <Avatar className="w-16 h-16 flex-shrink-0">
                                                <AvatarImage src={doctor.profileImg} />
                                                <AvatarFallback>{doctor.fullName?.charAt(0)}</AvatarFallback>
                                            </Avatar>

                                            {/* Text Content - Ensures Left Alignment */}
                                            <div className="space-y-2 flex-1 text-left">
                                                <h3 className="font-semibold text-lg text-gray-900">
                                                    {doctor.fullName}
                                                </h3>

                                                <div className="flex items-center gap-2 text-gray-600">
                                                    <GraduationCap className="w-4 h-4" />
                                                    <span className="text-sm">
                                                        {doctor.psychologist?.psychologistProfile?.specialization}
                                                    </span>
                                                </div>

                                                <div className="flex items-center gap-2 text-gray-600">
                                                    <Building2 className="w-4 h-4" />
                                                    <span className="text-sm">{doctor.address || "N/A"}</span>
                                                </div>

                                                <div className="flex items-center gap-2 text-gray-600">
                                                    <Star className="w-4 h-4 text-yellow-500" />
                                                    <span className="text-sm">
                                                        {doctor.psychologist?.psychologistProfile?.rating} ⭐ (
                                                        {doctor.psychologist?.psychologistProfile?.numberOfRatings} đánh
                                                        giá)
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>

                    {/* Link to All Doctors */}
                    <div className="mt-4 flex justify-center">
                        <Link
                            to="/doctor"
                            className="text-blue-600 hover:underline flex items-center gap-1 justify-end">
                            Xem tất cả bác sĩ →
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomeSection;
