import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import apiClient from "@/api/apiClient";

const BlogDetail = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [editingComment, setEditingComment] = useState(null);
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
        const res = await apiClient.get(`blogposts/blogdetail/${id}`);
        setArticle(res.data);
        setComments(res.data.comments || []);
      } catch (error) {
        setError("Failed to fetch article. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  const handleCommentSubmit = async () => {
    if (!newComment.trim()) return;

    const commentData = {
      id: Date.now(),
      username: "Guest",
      comment: newComment,
      createdAt: new Date().toISOString(),
      avatar: "https://via.placeholder.com/40",
    };

    setComments((prevComments) => [...prevComments, commentData]);
    setNewComment("");
  };

  const handleCommentDelete = (commentId) => {
    setComments((prevComments) => prevComments.filter((comment) => comment.id !== commentId));
  };

  const handleCommentEdit = (commentId, updatedComment) => {
    setComments((prevComments) =>
      prevComments.map((comment) =>
        comment.id === commentId ? { ...comment, comment: updatedComment } : comment
      )
    );
    setEditingComment(null);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!article) return <p>No article found.</p>;

  return (
      <div className="max-w-4xl mx-auto p-4">
          <h1 className="text-2xl font-bold text-center mb-8">{article.title}</h1>
          <Card className="bg-white shadow-sm">
              <CardContent className="p-6">
                  <img src={article.image} />
                  <div
                      className="text-gray-600"
                      dangerouslySetInnerHTML={{ __html: article.content || "<p>No content available</p>" }}
                  />
              </CardContent>
          </Card>
          <div className="mt-8">
              <h2 className="text-xl font-bold mb-4">Bình luận</h2>
              {comments.length === 0 ? (
                  <p>Chưa có bình luận.</p>
              ) : (
                  <div className="space-y-4">
                      {comments.map((comment) => (
                          <Card key={comment.id} className="bg-white shadow-sm p-4 flex items-start space-x-4">
                              <Avatar>
                                  <AvatarImage src={comment.avatar} />
                                  <AvatarFallback>A</AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                  <p className="font-semibold text-gray-800">{comment.username}</p>
                                  {editingComment === comment.id ? (
                                      <Textarea
                                          value={comment.comment}
                                          onChange={(e) =>
                                              setComments((prevComments) =>
                                                  prevComments.map((c) =>
                                                      c.id === comment.id ? { ...c, comment: e.target.value } : c
                                                  )
                                              )
                                          }
                                          className="w-full"
                                      />
                                  ) : (
                                      <p className="text-gray-600">{comment.comment}</p>
                                  )}
                                  <p className="text-gray-400 text-sm mt-1">
                                      {new Date(comment.createdAt).toLocaleDateString()}
                                  </p>
                              </div>
                              <div className="flex space-x-2">
                                  {editingComment === comment.id ? (
                                      <Button size="sm" onClick={() => setEditingComment(null)}>
                                          Lưu
                                      </Button>
                                  ) : (
                                      <Button size="sm" onClick={() => setEditingComment(comment.id)}>
                                          Sửa
                                      </Button>
                                  )}
                                  <Button
                                      size="sm"
                                      variant="destructive"
                                      onClick={() => handleCommentDelete(comment.id)}>
                                      Xoá
                                  </Button>
                              </div>
                          </Card>
                      ))}
                  </div>
              )}
          </div>
          <div className="mt-6">
              <h2 className="text-lg font-bold mb-2">Thêm bình luận</h2>
              <Input
                  type="text"
                  placeholder="Write your comment here..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="w-full mb-2"
              />
              <Button onClick={handleCommentSubmit} className="w-full">
                  Gửi
              </Button>
          </div>
      </div>
  );
};

export default BlogDetail;
