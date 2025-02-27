import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import request from "../../service/request";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function BlogScreen() {
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
        const response = await request.get("/blogs/allblog");
        setArticles(response.data);
      } catch (error) {
        console.error("Error fetching blog data:", error);
        setError("Failed to fetch articles. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  const filteredArticles = articles.filter((article) =>
    article.title.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination Logic
  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = filteredArticles.slice(
    indexOfFirstArticle,
    indexOfLastArticle
  );

  const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);

  const handleCardClick = (article) => {
    navigate(`/blogdetail/${article._id}`, { state: { article } });
  };

  return (
    <div className="min-vh-100 d-flex flex-column">
      <div className="container max-w-4xl mx-auto px-4 py-6 flex-grow">
        <div className="w-full h-64 mb-8 rounded-lg overflow-hidden">
          <img
            src="https://media.vneconomy.vn/w800/images/upload/2024/05/11/kham-chua-benh.png"
            alt="Header"
            className="w-full h-full object-fill"
          />
        </div>

        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold fs-4">Featured Articles</h2>
          <div className="position-relative" style={{ maxWidth: "300px" }}>
            <Search className="position-absolute top-50 start-0 translate-middle-y ms-3 text-secondary" style={{ width: "16px", height: "16px" }} />
            <Input placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)} className="form-control ps-5" />
          </div>
        </div>

        {error && <p className="text-danger">{error}</p>}
        <div className="row g-4 mb-4" >
  {loading ? (
    <p>Loading....</p>
  ) : (
    currentArticles.map((article, index) => (
      <div className="col-md-4" key={index}>
        <Card className="overflow-hidden cursor-pointer d-flex flex-column p-3 shadow-sm border rounded" style={{ maxWidth: "90%", backgroundColor: "#F4F4F4" }} onClick={() => handleCardClick(article)}>
          <div className="relative flex justify-center items-center">
          <Avatar className="w-[40vh] h-[25vh] rounded-md">
              <AvatarImage src={article.image} />
              <AvatarFallback>{article.title}</AvatarFallback>
            </Avatar>
          </div>
          <CardContent className="p-3 d-flex flex-column justify-content-between">
            <h3 className="fw-bold mb-2 fs-6 text-truncate" title={article.title}>{article.title}</h3>
            <p className="text-muted small mb-2 text-truncate" title={article.content}>
              {article.content.length > 100 ? `${article.content.substring(0, 100)}...` : article.content}
            </p>
            <p className="text-muted small mb-0">{new Date(article.createdAt).toLocaleDateString()}</p>
          </CardContent>
        </Card>
      </div>
    ))
  )}
</div>



        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="d-flex justify-content-center gap-2">
            <button
              className="btn btn-secondary"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Previous
            </button>
            <span className="align-self-center">Page {currentPage} of {totalPages}</span>
            <button
              className="btn btn-secondary"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
