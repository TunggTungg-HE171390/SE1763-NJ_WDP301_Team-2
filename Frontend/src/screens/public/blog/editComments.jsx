import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import apiClient from "@/api/apiClient";

const EditComment = ({ comment, postId, onClose, fetchComments }) => {
  const [editedContent, setEditedContent] = useState(comment.content);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);

  // Lấy userId từ localStorage khi component mount
  useEffect(() => {
    const userData = localStorage.getItem("user"); // Lấy user từ localStorage
    if (userData) {
      try {
        const user = JSON.parse(userData); // Chuyển từ string JSON về object
        if (user?._id) {
          setUserId(user._id); // Gán userId từ _id
        } else {
          setError("Không tìm thấy userId, vui lòng đăng nhập lại.");
        }
      } catch (error) {
        console.error("Lỗi khi parse dữ liệu từ localStorage:", error);
        setError("Lỗi dữ liệu, vui lòng đăng nhập lại.");
      }
    } else {
      setError("Không tìm thấy thông tin người dùng.");
    }
  }, []);

  const handleUpdate = async () => {
    if (!editedContent.trim()) {
      setError("Nội dung bình luận không được để trống.");
      return;
    }

    if (!userId) {
      setError("Không xác định được người dùng.");
      return;
    }

    try {
      console.log("📌 Gửi yêu cầu cập nhật:", {
        postId,
        commentId: userId, // Sử dụng userId thay vì comment._id
        content: editedContent,
      });

      const res = await apiClient.put(
        `/blogposts/posts/${postId}/comments/${userId}`, // Sử dụng userId thay vì comment._id
        { content: editedContent }
      );

      if (res.data?.success) {
        fetchComments();
        onClose();
      } else {
        setError("Không thể cập nhật bình luận. Vui lòng thử lại.");
      }
    } catch (error) {
      console.error("❌ Lỗi khi cập nhật:", error);
      setError("Lỗi máy chủ, vui lòng thử lại sau.");
    }
  };

  return (
    <div className="mt-4 p-4 bg-gray-100 rounded-lg">
      <h2 className="text-lg font-bold mb-2">Chỉnh sửa bình luận</h2>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <Textarea
        value={editedContent}
        onChange={(e) => setEditedContent(e.target.value)}
        className="w-full mb-2"
      />
      <div className="flex space-x-2">
        <Button onClick={handleUpdate} className="bg-blue-500 text-white">
          Cập nhật
        </Button>
        <Button onClick={onClose} className="bg-gray-500 text-white">
          Hủy
        </Button>
      </div>
    </div>
  );
};

export default EditComment;