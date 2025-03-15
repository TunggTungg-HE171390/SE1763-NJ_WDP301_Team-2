import { useState, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import apiClient from "@/api/apiClient";
import EditComment from "./editComments";

const CommentBlog = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [editingComment, setEditingComment] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Lỗi khi đọc dữ liệu từ localStorage:", error);
      }
    }
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "Không xác định";
    
    const parts = dateString.split(" ");
    if (parts.length === 2) return dateString;

    const date = new Date(dateString);
    return isNaN(date.getTime())
      ? "Không xác định"
      : date.toLocaleString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        });
  };

  // Lấy danh sách bình luận
  const fetchComments = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiClient.get(`/blogposts/blog/${postId}/comments`);
      setComments(
        res.data.comments?.map(comment => ({
          ...comment,
          username: comment.fullName || "Anonymous",
          avatar: comment.profileImg || "https://via.placeholder.com/40",
          createdAt: formatDate(comment.createdAt),
        })) || []
      );
      setError(null);
    } catch (error) {
      setError("Không thể tải bình luận. Vui lòng thử lại sau.");
      setComments([]);
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleCommentSubmit = async () => {
    if (!newComment.trim() || !user?._id) return;

    // Kiểm tra xem người dùng đã bình luận chưa
    const hasCommented = comments.some(comment => comment.userId === user._id);
    if (hasCommented) {
      setError("Bạn chỉ có thể bình luận một lần.");
      return;
    }

    try {
      const res = await apiClient.post(`/blogposts/blog/${postId}/comment`, {
        userId: user._id,
        content: newComment,
        username: user.fullName,
        avatar: "https://via.placeholder.com/40",
      });

      if (res.data?.success) {
        setComments(prev => [...prev, { ...res.data.comment, createdAt: formatDate(res.data.comment.createdAt) }]);
        setNewComment("");
        setError(null);
      } else {
        setError("Không thể thêm bình luận. Vui lòng thử lại.");
      }
    } catch (error) {
      setError("Lỗi máy chủ, vui lòng thử lại sau.");
    }
  };

  const handleDelete = async (userId) => {
    setLoading(true);
    try {
      const res = await apiClient.delete(`/blogposts/posts/${postId}/comments/${userId}`);
      if (res.data?.success) {
        handleDeleteSuccess(userId);
      } else {
        setError("Không thể xóa bình luận. Vui lòng thử lại.");
      }
    } catch (error) {
      setError("Lỗi khi xóa bình luận.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSuccess = (userId) => {
    setComments(prevComments => prevComments.filter(comment => comment.userId !== userId));
  };

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-4">Comments</h2>
      {error && <p className="text-red-500">{error}</p>}
      {loading ? (
        <p>Loading comments...</p>
      ) : comments.length === 0 ? (
        <p className="text-gray-500">Chưa có bình luận nào.</p>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <Card key={comment._id} className="bg-white shadow-sm p-4 flex items-start space-x-4">
              <Avatar>
                <AvatarImage src={comment.avatar} alt="User Avatar" />
                <AvatarFallback>{comment.username.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-semibold text-gray-800">{comment.username}</p>
                <p className="text-gray-600">{comment.content}</p>
                <p className="text-gray-400 text-sm mt-1">{comment.createdAt}</p>
                {user?._id === comment.userId && (
                  <>
                    <Button onClick={() => setEditingComment(comment)} className="mt-2">Edit</Button>
                    <Button onClick={() => handleDelete(comment.userId)} className="mt-2 ml-4 text-orange-50">Delete</Button>
                  </>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
      {editingComment && (
        <EditComment 
          comment={editingComment} 
          postId={postId} 
          onClose={() => setEditingComment(null)} 
          fetchComments={fetchComments} 
        />
      )}
      {user ? (
        <div className="mt-6">
          <h2 className="text-lg font-bold mb-2">Add a Comment</h2>
          <Textarea 
            placeholder="Write your comment here..." 
            value={newComment} 
            onChange={(e) => setNewComment(e.target.value)} 
            className="w-full mb-2" 
          />
          <Button onClick={handleCommentSubmit} className="w-full">Submit</Button>
        </div>
      ) : (
        <p className="mt-6 text-red-500">Bạn cần đăng nhập để bình luận.</p>
      )}
    </div>
  );
};

export default CommentBlog;
