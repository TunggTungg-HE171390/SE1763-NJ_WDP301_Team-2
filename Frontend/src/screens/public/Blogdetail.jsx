import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import request from "../../service/request";

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
       const res = await request.get(`blogs/blogdetail/${id}`)
        console.log("Blog data:", res.data);
        setArticle(res.data);
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
      <div className="w-full h-[400px] rounded-lg overflow-hidden flex justify-center items-center bg-gray-100">
  <img
    src={article.image || "https://via.placeholder.com/800x400"}
    alt={article.title || "Blog Image"}
    className="w-full h-full object-fill"
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
