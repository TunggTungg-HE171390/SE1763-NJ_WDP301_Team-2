import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";

const BlogDetail = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticle = async () => {
      if (!id) {
        setError("Invalid blog post ID");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`http://localhost:3000/api/blogs/blogdetail/${id}`);
        console.log("Blog data:", response.data);
        setArticle(response.data);
      } catch (error) {
        console.error("Error fetching blog data:", error);
        setError("Failed to fetch article. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!article) return <p>No article found.</p>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Hero Image Section */}
      <div className="w-full h-[500px] rounded-lg overflow-hidden mb-6">
        <img
          src={article.image || "https://via.placeholder.com/800x400"}
          alt={article.title || "Blog Image"}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Title Section */}
      <h1 className="text-2xl font-bold text-center mb-8">{article.title}</h1>

      {/* Content Section */}
      <Card className="bg-white shadow-sm">
        <CardContent className="p-6">
          <div
            className="text-gray-600"
            dangerouslySetInnerHTML={{ __html: article.content || "<p>No content available</p>" }}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default BlogDetail;
