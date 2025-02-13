import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function BlogScreen() {
  const [search, setSearch] = useState("");
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const tags = [
    "WorkLifeBalance",
    "WorkProductivity",
    "WorkLife",
    "WorkLifeBalance",
    "WorkProductivity",
    "WorkLifeBalance",
    "WorkLifeBalance"
  ];

  return (
    <div className="min-vh-100 d-flex flex-column">
      <div className="container max-w-6xl mx-auto px-4 py-6 flex-grow">
        <div className="w-full h-48 mb-8 rounded-lg overflow-hidden">
          <img
            src="https://storage.googleapis.com/gweb-uniblog-publish-prod/images/mental_health_awareness_month.width-1200.format-webp.webp"
            alt="Header"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
        <div className="d-flex flex-column align-items-start align-items-md-center mb-4 gap-2">
  <h2 className="fw-bold fs-4">Featured Articles</h2>

  {/* Ô tìm kiếm nằm dưới */}
  <div className="position-relative w-100" style={{ maxWidth: "300px" }}>
    <Search className="position-absolute top-50 start-0 translate-middle-y ms-3 text-secondary" style={{ width: "16px", height: "16px" }} />
    <Input
      placeholder="Search"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="form-control ps-5"
    />
  </div>
</div>

        </div>

        {error && <p className="text-danger">{error}</p>}

        <div className="row g-4 mb-4">
          {loading ? (
            <p>Loading...</p>
          ) : (
            filteredArticles.map((article, index) => (
              <div className="col-md-6" key={index}>
                <Card className="overflow-hidden">
                  <div className="d-flex">
                    <div className="w-50">
                      <img
                        src={article.image}
                        alt={article.title}
                        className="w-100 h-100 object-cover"
                      />
                    </div>
                    <CardContent className="w-50 p-3">
                      <h3 className="font-bold mb-2">{article.title}</h3>
                      <p className="text-sm text-gray-500 mb-2">{article.date}</p>
                      <p className="text-sm text-gray-600 text-truncate">
                        {article.description}
                      </p>
                    </CardContent>
                  </div>
                </Card>
              </div>
            ))
          )}
        </div>

        <div className="d-flex flex-wrap justify-content-center gap-2 mb-4">
          {tags.map((tag, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="rounded-pill cursor-pointer bg-light"
            >
              #{tag}
            </Badge>
          ))}
        </div>

        <div className="d-flex justify-content-center">
          <Button className="px-8">See more</Button>
        </div>
      </div>
    </div>
  );
}
