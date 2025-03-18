import React, { useEffect, useState } from "react";
import { Button, Container, Row, Col, Card, Table, Pagination } from "react-bootstrap";
import { getAllPosts, updateBlogPost } from "../../api/blogPosts.api"; // Đảm bảo import đúng
import { useBootstrap } from "@/hooks/useBootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ManagePosts = () => {
  useBootstrap();

  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Thêm trạng thái loading
  const [error, setError] = useState(null); // Add error state
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(10);
  const navigate = useNavigate();

  // Add a direct test request to verify API is working
  const testDirectApiAccess = async () => {
    try {
      console.log("Testing direct API access...");
      const response = await axios.get("http://localhost:3000/api/blogposts");
      console.log("Direct API test successful:", response.data);
      return true;
    } catch (err) {
      console.error("Direct API test failed:", err);
      return false;
    }
  };

  // Lấy tất cả bài viết từ API
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        console.log("Fetching posts from API...");
        console.log("API URL from env:", import.meta.env.VITE_API_URL);
        
        // Test direct API access first
        const directAccessWorking = await testDirectApiAccess();
        
        if (!directAccessWorking) {
          console.warn("Direct API access failed, but still trying through apiClient...");
        }
        
        const data = await getAllPosts(); // Gọi API từ file riêng
        console.log("Posts fetched successfully:", data);
        
        if (Array.isArray(data)) {
          setPosts(data);
        } else if (data && typeof data === 'object') {
          // Handle case where API might return an object with data property
          const postsArray = Array.isArray(data.posts) ? data.posts : 
                            Array.isArray(data.data) ? data.data : [];
          console.log("Extracted posts array:", postsArray);
          setPosts(postsArray);
        } else {
          setPosts([]);
          setError("Received invalid data format from API");
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
        let errorMessage = "Failed to load blog posts. Please try again later.";
        
        if (error.response) {
          errorMessage += ` (Status: ${error.response.status})`;
          console.error("Response details:", error.response.data);
        } else if (error.request) {
          errorMessage = "Unable to reach the server. Please check your connection.";
        }
        
        setError(errorMessage);
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
        ) : error ? (
          <div className="alert alert-danger">{error}</div>
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
