import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import apiClient from "@/api/apiClient";
import CommentBlog from "./commentBlog"; // 🔹 Import component bình luận

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
        const res = await apiClient.get(`/blogposts/blogdetail/${id}`);
        setArticle(res.data);
      } catch (error) {
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
      <h1 className="text-2xl font-bold text-center mb-8">{article.title}</h1>
      <Card className="bg-white shadow-sm">
        <CardContent className="p-6">
          <img src={article.image} alt={article.title} />
          <div
            className="text-gray-600"
            dangerouslySetInnerHTML={{ __html: article.content || "<p>No content available</p>" }}
          />
        </CardContent>
      </Card>

      {/* 🔹 Thêm phần bình luận vào dưới bài viết */}
      <CommentBlog postId={id} />
    </div>
  );
};

export default BlogDetail;
