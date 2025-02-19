import React, { useEffect, useState } from "react";
import { Button, Container, Row, Col, Card, Table } from "react-bootstrap";
import { getAllPosts } from "../../api/blogPosts.api"; // Đảm bảo import đúng

const ManagePosts = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Thêm trạng thái loading

  // Lấy tất cả bài viết từ API
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await getAllPosts(); // Gọi API từ file riêng
        console.log("Posts fetched:", data);
        setPosts(data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setIsLoading(false); // Xử lý khi đã xong việc gọi API
      }
    };
    fetchPosts();
  }, []);

  // Xử lý ẩn/hiện bài viết
  const toggleVisibility = (postId) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post._id === postId ? { ...post, status: post.status === "Published" ? "Draft" : "Published" } : post
      )
    );
  };

  // Xử lý cập nhật bài viết (chỉ cần hiển thị alert tạm thời)
  const handleUpdate = (postId) => {
    alert(`Updating post with ID: ${postId}`);
    // Cập nhật bài viết (có thể mở form hoặc gọi API để cập nhật)
  };

  return (
    <Container className="mt-5">
      <h2 className="text-center mb-4">Manage Blog Posts</h2>
      <Card className="p-4 shadow-sm">
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Title</th>
                <th>Status</th>
                <th>Author</th>
                <th>Image</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.length > 0 ? (
                posts.map((post) => (
                  <tr key={post._id}>
                    <td>{post.title}</td>
                    <td>{post.status}</td>
                    <td>{post.userId ? post.userId : "Unknown"}</td>
                    <td>
                      {post.image ? (
                        <img
                          src={post.image}
                          alt="Thumbnail"
                          style={{ width: "50px", height: "50px", objectFit: "cover" }}
                        />
                      ) : (
                        <span>No Image</span>
                      )}
                    </td>
                    <td>{new Date(post.createdAt).toLocaleString()}</td> {/* Chuyển đổi thời gian thành dạng đọc được */}
                    <td>
                      {/* Thêm icon Update và Toggle visibility */}
                      <Button
                        variant="info"
                        className="me-2"
                        onClick={() => handleUpdate(post._id)}
                      >
                        Update
                      </Button>
                      <Button
                        variant={post.status === "Published" ? "warning" : "success"}
                        onClick={() => toggleVisibility(post._id)}
                      >
                        {post.status === "Published" ? "Hide" : "Show"}
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6">No posts available</td>
                </tr>
              )}
            </tbody>
          </Table>
        )}
      </Card>
    </Container>
  );
};

export default ManagePosts;
