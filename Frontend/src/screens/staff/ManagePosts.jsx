import React, { useEffect, useState } from "react";
import { Button, Container, Row, Col, Card, Table, Pagination } from "react-bootstrap";
import { getAllPosts, updateBlogPost } from "../../api/blogPosts.api"; // Đảm bảo import đúng
import { useBootstrap } from "@/hooks/useBootstrap";
import { useNavigate } from "react-router-dom";

const ManagePosts = () => {
  useBootstrap();

  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Thêm trạng thái loading
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(10);
  const navigate = useNavigate();

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
  const toggleVisibility = async (postId) => {
    const post = posts.find((post) => post._id === postId);
    const updatedStatus = post.status === "Published" ? "Draft" : "Published";

    try {
      await updateBlogPost(postId, { status: updatedStatus });
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId ? { ...post, status: updatedStatus } : post
        )
      );
    } catch (error) {
      console.error("Error updating post status:", error);
    }
  };

  // Xử lý cập nhật bài viết (chỉ cần hiển thị alert tạm thời)
  const handleUpdate = (postId) => {
    navigate(`/update-post/${postId}`);
  };

  // Get current posts
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <Container className="mt-5">
      <h2 className="text-center mb-4">Manage Blog Posts</h2>
      <Button
        variant="info"
        className="me-2 mb-2 justify-end"
        onClick={() => navigate("/create-post")}
      >
        Create new post
      </Button>
      <Card className="p-4 shadow-sm">
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <>
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
                {currentPosts.length > 0 ? (
                  currentPosts.map((post) => (
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
            <Pagination className="justify-content-center">
              {Array.from({ length: Math.ceil(posts.length / postsPerPage) }, (_, index) => (
                <Pagination.Item key={index + 1} active={index + 1 === currentPage} onClick={() => paginate(index + 1)}>
                  {index + 1}
                </Pagination.Item>
              ))}
            </Pagination>
          </>
        )}
      </Card>
    </Container>
  );
};

export default ManagePosts;
