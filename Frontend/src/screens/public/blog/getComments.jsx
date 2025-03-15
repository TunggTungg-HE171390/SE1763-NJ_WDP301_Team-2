import { useState, useEffect, useCallback } from "react";
import apiClient from "@/api/apiClient";

const formatDate = (dateString) => {
  if (!dateString || typeof dateString !== "string") return "Không xác định";

  const dateParts = dateString.match(/^(\d{2}):(\d{2}):(\d{2}) (\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (!dateParts) return "Ngày không hợp lệ";

  const [, hours, minutes, seconds, day, month, year] = dateParts.map(Number);
  const date = new Date(year, month - 1, day, hours, minutes, seconds);

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

const useFetchComments = (postId) => {
  const [comments, setComments] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchComments = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiClient.get(`/blogposts/blog/${postId}/comments`);
      setComments(
        Array.isArray(res.data.comments)
          ? res.data.comments.map(comment => ({
              content: comment.content,
              username: comment.fullName || "Anonymous",
              avatar: comment.profileImg || "https://via.placeholder.com/40",
              createdAt: formatDate(comment.createdAt),
            }))
          : []
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

  return { comments, error, loading, fetchComments };
};

export default useFetchComments;
