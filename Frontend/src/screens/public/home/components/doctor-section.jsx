import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom"; // Ensure you are using React Router for navigation
import { GraduationCap, Building2, MapPin } from "lucide-react";

const doctors = [
    { name: "NGUYỄN HOÀNG GIANG", specialty: "Bác sĩ Nam", hospital: "Phòng khám Đa khoa" },
    { name: "CHU THỊ MINH", specialty: "Chuyên khoa Gan tiêu hóa", hospital: "BVĐK Tâm Anh" },
    { name: "LÊ VĂN VINH", specialty: "Tim mạch", hospital: "Bệnh viện Y tế MEDPLUS" },
];

const blogs = [
    {
        title: "Cách phòng tránh bệnh tim mạch",
        author: "TS. Lê Văn Vinh",
        views: 1200,
        imageUrl: "https://placekitten.com/400/300",
    },
    {
        title: "Dinh dưỡng cho bệnh gan",
        author: "BS. Chu Thị Minh",
        views: 950,
        imageUrl: "https://placebear.com/400/300",
    },
    {
        title: "Lời khuyên cho sức khỏe nam giới",
        author: "BS. Nguyễn Hoàng Giang",
        views: 800,
        imageUrl: "https://source.unsplash.com/random/400x300",
    },
];

const HomeSection = () => {
    return (
        <div className="w-full mx-auto p-8 bg-[#e6f5f2] flex justify-center">
            <div className="max-w-6xl w-full grid grid-cols-5 gap-8">
                {/* Left: Top Viewed Blogs (3/5) */}
                <div className="col-span-3">
                    <h2 className="text-2xl font-semibold mb-6 text-[#104a93]">Bài viết được xem nhiều</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {blogs.map((blog, index) => (
                            <div key={index}>
                                <Card className="hover:shadow-lg transition-shadow mb-[-10px]">
                                    <CardContent className="p-0">
                                        {/* Featured Image */}
                                        <img
                                            src={blog.imageUrl} // Ensure blogs have imageUrl property
                                            alt={blog.title}
                                            className="w-full h-48 object-cover rounded-t-lg"
                                        />
                                    </CardContent>
                                </Card>
                                {/* Blog Title */}
                                <div className="p-4">
                                    <h3 className="font-semibold text-lg text-center">{blog.title}</h3>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Link to All Blogs */}
                    <div className="mt-4 flex justify-center">
                        <Link
                            to="/blogs"
                            className="text-[#104a93] hover:underline flex items-center gap-1 justify-end">
                            Xem tất cả bài viết →
                        </Link>
                    </div>
                </div>

                {/* Right: Featured Doctors (2/5) */}
                <div className="col-span-2">
                    <h2 className="text-2xl font-semibold mb-6 text-[#104a93]">Bác sĩ nổi bật</h2>
                    <div className="space-y-4">
                        {doctors.map((doctor, index) => (
                            <Card key={index} className="hover:shadow-lg transition-shadow bg-white">
                                <CardContent className="p-6">
                                    <div className="flex items-start gap-4">
                                        <Avatar className="w-16 h-16">
                                            <AvatarImage src={doctor.imageUrl} />
                                            <AvatarFallback>{doctor.name?.charAt(0)}</AvatarFallback>
                                        </Avatar>

                                        <div className="space-y-2">
                                            <h3 className="font-semibold text-lg text-gray-900">{doctor.name}</h3>

                                            <div className="flex items-center gap-2 text-gray-600">
                                                <GraduationCap className="w-4 h-4" />
                                                <span className="text-sm">{doctor.degree}</span>
                                            </div>

                                            <div className="flex items-center gap-2 text-gray-600">
                                                <Building2 className="w-4 h-4" />
                                                <span className="text-sm">{doctor.hospital}</span>
                                            </div>

                                            <div className="flex items-center gap-2 text-gray-600">
                                                <MapPin className="w-4 h-4" />
                                                <span className="text-sm">{doctor.location}</span>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Link to All Doctors */}
                    <div className="mt-4 flex justify-center">
                        <Link
                            to="/doctors"
                            className="text-[#104a93] hover:underline flex items-center gap-1 justify-end">
                            Xem tất cả bác sĩ →
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomeSection;
