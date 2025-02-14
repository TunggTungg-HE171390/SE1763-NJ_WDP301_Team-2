import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

export default function BlogScreen() {
  const [search, setSearch] = useState("");
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibleCount, setVisibleCount] = useState(4);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/blog/allblog");
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
            className="w-full h-full object-cover"
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
        <div className="row g-4 mb-4">
          {loading ? (
            <p>Loading....</p>
          ) : (
            filteredArticles.slice(0, visibleCount).map((article, index) => (
              <div className="col-md-6" key={index}>
                <Card className="overflow-hidden cursor-pointer d-flex flex-row p-3" style={{ maxWidth: "100%", height: "120px" }} onClick={() => handleCardClick(article)}>
                  <div className="w-25 h-100 flex-shrink-0">
                    <img src={article.image} alt={article.title} className="w-full h-full object-cover rounded" />
                  </div>
                  <CardContent className="flex-grow p-3 d-flex flex-column justify-content-center">
                    <h3 className="fw-bold mb-1 fs-6">{article.title}</h3>
                    <p className="text-muted small mb-0">
                      {article.content.length > 100 ? `${article.content.substring(0, 100)}...` : article.content}
                    </p>
                  </CardContent>
                </Card>
              </div>
            ))
          )}
        </div>

        {visibleCount < filteredArticles.length && (
          <div className="d-flex justify-content-center">
            <button className="btn btn-primary px-8" onClick={() => setVisibleCount(visibleCount + 4)}>See more</button>
          </div>
        )}


      </div>
    </div>
  );
}
