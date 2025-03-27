import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Search, Calendar, Tag, ChevronLeft, ChevronRight, Eye, Info, X, Loader2 } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import * as API from "@/api";

const HealthcareBlogListing = () => {
    // State management
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentCategory, setCurrentCategory] = useState("All");
    const [sortOption, setSortOption] = useState("newest");
    const [currentPage, setCurrentPage] = useState(1);
    const [showLeftAd, setShowLeftAd] = useState(true);
    const postsPerPage = 6;

    // Fetch blog posts from API
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true);
                const response = await API.getAllBlogPosts();
                setPosts(response.data);
                setError(null);
            } catch (err) {
                console.error("Error fetching blog posts:", err);
                setError("Failed to load blog posts. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    // Filter posts based on search term and category
    const filteredPosts = posts.filter((post) => {
        const matchesSearch =
            post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesCategory = currentCategory === "All" || post.category === currentCategory;

        return matchesSearch && matchesCategory;
    });

    // Sort posts based on selected option
    const sortedPosts = [...filteredPosts].sort((a, b) => {
        if (sortOption === "newest") {
            return new Date(b.createdAt) - new Date(a.createdAt);
        } else if (sortOption === "oldest") {
            return new Date(a.createdAt) - new Date(b.createdAt);
        } else if (sortOption === "popular") {
            return b.views - a.views;
        }
        return 0;
    });

    // Get all unique categories
    const uniqueCategories = [...new Set(posts.map((post) => post.category))];
    const categories = ["All", ...uniqueCategories.slice(0, 2)];

    // Pagination
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = sortedPosts.slice(indexOfFirstPost, indexOfLastPost);
    const totalPages = Math.ceil(sortedPosts.length / postsPerPage);

    // Helper function to format date as relative
    const getRelativeDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return "Hôm nay";
        if (diffDays === 1) return "Hôm qua";
        if (diffDays < 7) return `${diffDays} ngày trước`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} tuần trước`;
        return date.toLocaleDateString();
    };

    // Helper function to extract excerpt from content
    // const getExcerpt = (content, maxLength = 150) => {
    //     if (content.length <= maxLength) return content;

    //     // Find the last space within the maxLength to avoid cutting words
    //     const lastSpace = content.substring(0, maxLength).lastIndexOf(" ");
    //     return content.substring(0, lastSpace) + "...";
    // };

    // Advertisement Components
    const LeftSidebarAd = () => (
        <div className={`hidden lg:block w-64 sticky top-4 ${showLeftAd ? "" : "lg:hidden"}`}>
            <div className="bg-white border border-blue-200 rounded-lg overflow-hidden shadow-md">
                <div className="bg-blue-50 p-2 flex justify-between items-center">
                    <div className="text-xs text-blue-500 flex items-center">
                        <Info className="h-3 w-3 mr-1" />
                        Quảng cáo
                    </div>
                    <button onClick={() => setShowLeftAd(false)} className="text-gray-400 hover:text-gray-600">
                        <X className="h-4 w-4" />
                    </button>
                </div>
                <div className="p-1">
                    <Link to="#" onClick={() => window.open("https://www.facebook.com/yogamastertaybac", "_blank")}>
                        <img
                            src="https://i.imgur.com/6K15bgv.png"
                            alt="Advertisement"
                            className="w-full h-full object-cover"
                        />
                    </Link>
                </div>
            </div>
        </div>
    );

    const RightSidebarAd = () => {
        const [userInput, setUserInput] = useState("");
        const [status, setStatus] = useState(null);

        const handleInputSubmit = async () => {
            if (userInput.trim() === "") return;

            try {
                await API.subscribeEmail({ email: userInput });
                setStatus("success");
                setUserInput(""); // Clear input
            } catch (error) {
                console.error(error);
                setStatus("error");
            }
        };

        return (
            <div className="hidden lg:block w-65 sticky">
                <div className="mt-4 bg-white border border-blue-200 rounded-lg overflow-hidden shadow-md">
                    <div className="p-4">
                        <h3 className="font-semibold text-blue-800 mb-2">Đăng ký để nhận tin từ chúng tôi</h3>
                        <p className="text-sm text-gray-600 mb-3">Nhận thông báo khi có bài đăng mới</p>
                        <input
                            type="email"
                            placeholder="Email của bạn"
                            className="w-full p-2 border rounded-md mb-2 border-blue-200"
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                        />
                        <button
                            type="button"
                            className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700"
                            onClick={handleInputSubmit}>
                            Đăng ký
                        </button>
                        {status === "success" && <p className="text-green-600 text-sm mt-1">Đăng ký thành công!</p>}
                        {status === "error" && (
                            <p className="text-red-600 text-sm mt-1">Đăng ký thất bại. Vui lòng thử lại.</p>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <>
            <Helmet>
                <title>Bài viết</title>
            </Helmet>
            <div className="min-h-screen">
                <main className="container mx-auto px-4 py-8">
                    {/* Search and Filter Section */}
                    <div className="flex flex-col mx-auto md:flex-row max-w-5xl gap-4 mb-8 bg-blue-50 p-4 rounded-xl shadow-sm border border-blue-100">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Tìm kiếm..."
                                className="pl-10 border-blue-200 focus:border-blue-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div className="flex flex-col sm:flex-row gap-2">
                            <Select value={sortOption} onValueChange={setSortOption}>
                                <SelectTrigger className="w-full sm:w-40 bg-white border-blue-200">
                                    <SelectValue placeholder="Sort by" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="newest">Mới nhất</SelectItem>
                                    <SelectItem value="oldest">Cũ nhất</SelectItem>
                                    <SelectItem value="popular">Nổi bật nhất</SelectItem>
                                </SelectContent>
                            </Select>

                            {!loading && categories.length > 0 && (
                                <Tabs
                                    defaultValue="All"
                                    value={currentCategory}
                                    onValueChange={setCurrentCategory}
                                    className="w-full sm:w-auto">
                                    <TabsList className="bg-blue-100 h-10">
                                        {categories.slice(0, 4).map((category) => (
                                            <TabsTrigger
                                                key={category}
                                                value={category}
                                                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                                                {category}
                                            </TabsTrigger>
                                        ))}
                                    </TabsList>
                                </Tabs>
                            )}
                        </div>
                    </div>

                    <div className="flex">
                        {/* Left Sidebar for Ads */}
                        <LeftSidebarAd />

                        {/* Main Content */}
                        <div className="flex-1 px-0 lg:px-6">
                            {/* Loading State */}
                            {loading ? (
                                <div className="flex justify-center items-center py-20">
                                    <div className="text-center">
                                        <Loader2 className="h-12 w-12 animate-spin text-blue-500 mx-auto mb-4" />
                                        <p className="text-blue-700">Đang tải...</p>
                                    </div>
                                </div>
                            ) : error ? (
                                <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg text-center">
                                    <p>{error}</p>
                                    <Button
                                        onClick={() => window.location.reload()}
                                        className="mt-2 bg-red-600 hover:bg-red-700">
                                        Thử lại
                                    </Button>
                                </div>
                            ) : (
                                <>
                                    {/* Articles Grid */}
                                    <div className="grid gap-6">
                                        {currentPosts.length > 0 ? (
                                            currentPosts.map((post) => (
                                                <Link to={`/blogdetail/${post._id}`} key={post._id} className="block">
                                                    <Card className="overflow-hidden border-blue-100 hover:shadow-lg transition-shadow cursor-pointer">
                                                        <div className="md:flex">
                                                            {/* <div className="md:w-1/3 h-48 md:h-auto">
                                                                <img
                                                                    src={post.image || "/api/placeholder/800/400"}
                                                                    alt={post.title}
                                                                    className="h-full w-full object-cover"
                                                                    onError={(e) => {
                                                                        e.target.onerror = null;
                                                                        e.target.src = "/api/placeholder/800/400";
                                                                    }}
                                                                />
                                                            </div> */}
                                                            {/* <div className="md:w-2/3 p-6"> */}
                                                            <div className="md:w-full p-6">
                                                                <CardHeader className="p-0 pb-3">
                                                                    <div className="flex items-center justify-between">
                                                                        <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                                                                            {post.category}
                                                                        </Badge>
                                                                        <div className="flex items-center text-gray-500 text-sm">
                                                                            <Calendar className="h-4 w-4 mr-1" />
                                                                            {getRelativeDate(post.createdAt)}
                                                                        </div>
                                                                    </div>
                                                                    <h2 className="text-xl text-start font-bold mt-2 text-blue-900 hover:text-blue-600">
                                                                        {post.title}
                                                                    </h2>
                                                                </CardHeader>

                                                                <CardContent className="p-0 text-start text-gray-600">
                                                                    {/* <p>{getExcerpt(post.content)}</p> */}
                                                                </CardContent>

                                                                <CardFooter className="p-0 pt-4 flex flex-wrap items-center justify-between">
                                                                    <div className="flex flex-wrap gap-2">
                                                                        {post.tags?.map((tag) => (
                                                                            <span
                                                                                key={tag}
                                                                                className="inline-flex items-center text-xs text-blue-700 hover:text-blue-900">
                                                                                <Tag className="h-3 w-3 mr-1" />
                                                                                {tag}
                                                                            </span>
                                                                        ))}
                                                                    </div>
                                                                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                                                                        <Eye className="h-4 w-4 text-gray-500" />
                                                                        <span>{post.views || 0}</span>
                                                                    </div>
                                                                </CardFooter>
                                                            </div>
                                                        </div>
                                                    </Card>
                                                </Link>
                                            ))
                                        ) : (
                                            <div className="text-center py-12 text-gray-500">
                                                <p>Không tìm thấy.</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Pagination */}
                                    {sortedPosts.length > postsPerPage && (
                                        <div className="mt-8 flex justify-center">
                                            <div className="flex items-center space-x-2">
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                                    disabled={currentPage === 1}
                                                    className="border-blue-200 text-blue-700">
                                                    <ChevronLeft className="h-4 w-4" />
                                                </Button>

                                                <div className="text-sm text-gray-700">
                                                    Trang {currentPage} của {totalPages}
                                                </div>

                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    onClick={() =>
                                                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                                                    }
                                                    disabled={currentPage === totalPages}
                                                    className="border-blue-200 text-blue-700">
                                                    <ChevronRight className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>

                        {/* Right Sidebar for Ads */}
                        <RightSidebarAd />
                    </div>
                </main>
            </div>
        </>
    );
};

export default HealthcareBlogListing;
