import { useState, useEffect, useMemo } from "react";
import { Search } from "lucide-react";
// import "bootstrap/dist/css/bootstrap.min.css";
import { useBootstrap } from "@/hooks/useBootstrap";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import apiClient from "@/api/apiClient";
import { Eye, Heart, Share2 } from "lucide-react";

export default function BlogScreen() {
    useBootstrap();
    const [search, setSearch] = useState("");
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const articlesPerPage = 6;
    const navigate = useNavigate();

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const response = await apiClient.get("/blogposts/allblogs");
                setArticles(response.data);
            } catch (error) {
                setError(`Error: ${error}. Failed to fetch articles. Please try again later.`);
            } finally {
                setLoading(false);
            }
        };
        fetchArticles();
    }, []);

    const handleLike = async (articleId) => {
        try {
            const response = await apiClient.post(`/blogposts/${articleId}/like`);
            setArticles((prevArticles) =>
                prevArticles.map((article) =>
                    article._id === articleId ? { ...article, likes: response.data.likes } : article
                )
            );
        } catch (error) {
            console.error("Error liking the article:", error);
        }
    };

    const filteredArticles = useMemo(() => {
        if (articles.length === 0) return [];
        return articles.filter((article) => article.title.toLowerCase().includes(search.toLowerCase()));
    }, [articles, search]);

    const indexOfLastArticle = currentPage * articlesPerPage;
    const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
    const currentArticles = filteredArticles.slice(indexOfFirstArticle, indexOfLastArticle);

    const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);

    const handleCardClick = (article) => {
        navigate(`/blogdetail/${article._id}`, { state: { article } });
    };

    return (
        <div className="min-vh-100 d-flex flex-column">
            <div className="container max-w-4xl mx-auto px-4 py-6 flex-grow">
                <div className="w-full h-64 mb-8 rounded-lg overflow-hidden">
                    <img
                        src="https://camtu.camthuy.thanhhoa.gov.vn/file/thumb/500/637252394.jpg"
                        alt="Header"
                        className="w-full h-full object-fill"
                    />
                </div>

                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2 className="fw-bold fs-4">Bài viết nổi bật</h2>
                    <div className="position-relative" style={{ maxWidth: "300px" }}>
                        <Search
                            className="position-absolute top-50 start-0 translate-middle-y ms-3 text-secondary"
                            style={{ width: "16px", height: "16px" }}
                        />
                        <Input
                            placeholder="Search"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="form-control ps-5"
                        />
                    </div>
                </div>

                {error && <p className="text-danger">{error}</p>}
                <div className="row g-4 mb-4">
                    {/* Display loading message while data is being fetched */}
                    {loading ? (
                        <p>Đang tải....</p>
                    ) : (
                        /* Loop through currentArticles array and display each article */
                        currentArticles.map((article, index) => (
                            <div className="col-md-4" key={index}>
                                <Card
                                    className="overflow-hidden cursor-pointer flex flex-col p-3 shadow-sm border rounded-xl bg-gray-100 max-w-[90%]"
                                    onClick={() => handleCardClick(article)}>
                                    {/* Article image section */}
                                    <div className="relative flex justify-center items-center">
                                        <Avatar className="w-[40vh] h-[25vh] rounded-md">
                                            <AvatarImage src={article.image} />
                                            <AvatarFallback>{article.title}</AvatarFallback>
                                        </Avatar>
                                    </div>

                                    {/* Article content section */}
                                    <CardContent className="p-3 flex flex-col justify-between">
                                        {/* Article title */}
                                        <h3
                                            className="font-bold mb-2 text-lg truncate cursor-pointer"
                                            title={article.title}
                                            onClick={() => handleCardClick(article)}>
                                            {article.title}
                                        </h3>

                                        {/* Article description, truncated if too long */}
                                        <p className="text-gray-600 text-sm mb-2 truncate" title={article.content}>
                                            {article.content.length > 100
                                                ? `${article.content.substring(0, 100)}...`
                                                : article.content}
                                        </p>

                                        {/* Display article stats: views, likes, and shares */}
                                        <div className="flex justify-between text-gray-500 text-sm">
                                            <span className="flex items-center gap-2">
                                                <Eye className="w-4 h-4" /> {article.views}
                                            </span>
                                            <span
                                                className="flex items-center gap-1"
                                                onClick={() => handleLike(article._id)}>
                                                <Heart className="w-4 h-4" /> {article.likes}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Share2 className="w-4 h-4" /> {article.shares}
                                            </span>
                                        </div>

                                        {/* Display article creation date */}
                                        <p className="text-gray-500 text-xs mt-2">
                                            {new Date(article.createdAt).toLocaleDateString()}
                                        </p>
                                    </CardContent>
                                </Card>
                            </div>
                        ))
                    )}
                </div>

                {totalPages > 1 && (
                    <div className="d-flex justify-content-center gap-2">
                        <button
                            className="btn btn-secondary"
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(currentPage - 1)}>
                            Trước
                        </button>
                        <span className="align-self-center">
                            Trang {currentPage} / {totalPages}
                        </span>
                        <button
                            className="btn btn-secondary"
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(currentPage + 1)}>
                            Tiếp
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
