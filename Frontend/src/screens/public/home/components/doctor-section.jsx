import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom"; // Ensure you are using React Router for navigation
import { GraduationCap, Building2, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import apiClient from "@/api/apiClient"; // Ensure you have an API client set up

const doctors = [
    { name: "NGUYỄN HOÀNG GIANG", specialty: "Male Doctor", hospital: "General Clinic", location: "Hanoi" },
    { name: "CHU THỊ MINH", specialty: "Liver and Digestive Specialist", hospital: "Tâm Anh General Hospital", location: "Ho Chi Minh City" },
    { name: "LÊ VĂN VINH", specialty: "Cardiology", hospital: "MEDPLUS Medical Hospital", location: "Da Nang" },
];

const HomeSection = () => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const response = await apiClient.get('/blogposts/allblogs');
                setArticles(response.data);
            } catch (error) {
                setError("Failed to fetch articles. Please try again later.");
            } finally {
                setLoading(false);
            }
        };
        fetchArticles();
    }, []);

    return (
        <div className="w-full mx-auto p-8 bg-[#e6f5f2] flex justify-center">
            <div className="max-w-6xl w-full grid grid-cols-5 gap-8">
                {/* Left: Top Viewed Blogs (3/5) */}
                <div className="col-span-3">
                    <h2 className="text-2xl font-semibold mb-6 text-[#104a93]">Most Viewed Articles</h2>
                    {loading ? (
                        <p>Loading...</p>
                    ) : error ? (
                        <p className="text-red-500">{error}</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {articles.map((article, index) => (
                                <div key={index}>
                                    <Card className="hover:shadow-lg transition-shadow mb-[-10px]">
                                        <CardContent className="p-0">
                                            {/* Featured Image */}
                                            <img
                                                src={article.image} // Ensure articles have imageUrl property
                                                alt={article.title}
                                                className="w-full h-48 object-cover rounded-t-lg"
                                            />
                                        </CardContent>
                                    </Card>
                                    {/* Blog Title */}
                                    <div className="p-4">
                                        <h3 className="font-semibold text-lg text-center">{article.title}</h3>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Button to All Blogs */}
                    <div className="mt-4 flex justify-center">
                        <Link to="/blog">
                            <Button className="text-[#104a93] hover:underline flex items-center gap-1">
                                View All Articles →
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Right: Featured Doctors (2/5) */}
                <div className="col-span-2">
                    <h2 className="text-2xl font-semibold mb-6 text-[#104a93]">Featured Doctors</h2>
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
                                                <span className="text-sm">{doctor.specialty}</span>
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

                    {/* Button to All Doctors */}
                    <div className="mt-4 flex justify-center">
                        <Link to="/doctors">
                            <Button className="text-[#104a93] hover:underline flex items-center gap-1">
                                View All Doctors →
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomeSection;