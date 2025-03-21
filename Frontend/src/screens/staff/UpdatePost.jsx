import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import style cho Quill
import "./quill-custom.css"; // Add custom styles import
import { Button, Form, Container, Row, Col, Card, Stack } from "react-bootstrap";
import { getBlogPostById, updateBlogPost } from "../../api/blogPosts.api";
import { useBootstrap } from "@/hooks/useBootstrap";
import { useNavigate, useParams } from "react-router-dom";

const UpdatePost = () => {
    useBootstrap();
    const navigate = useNavigate();
    const { postId } = useParams();

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [status, setStatus] = useState("Draft");
    const [image, setImage] = useState("");
    const [preview, setPreview] = useState("");

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const post = await getBlogPostById(postId);
                setTitle(post.title);
                setContent(post.content);
                setStatus(post.status);
                setImage(post.image);
                setPreview(post.image);
            } catch (error) {
                console.error("Error fetching post:", error);
            }
        };
        fetchPost();
    }, [postId]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const postData = { title, content, status, image };

        try {
            const result = await updateBlogPost(postId, postData); // ✅ Gọi API từ file riêng
            alert("✅ Post updated successfully!");
            console.log("Post updated:", result);
            navigate("/manage-posts");
        } catch (error) {
            alert(`❌ Error: ${error.message}`);
        }
    };

    const handleReset = () => {
        setTitle("");
        setContent("");
        setStatus("Draft");
        setImage("");
        setPreview("");
    };

    const handleImageChange = (e) => {
        const url = e.target.value;
        setImage(url);
        setPreview(url);
    };

    // Customize ReactQuill modules with better toolbar configuration
    const quillModules = {
        toolbar: {
            container: [
                [{ header: [1, 2, false] }],
                [{ list: "ordered" }, { list: "bullet" }],
                [{ align: [] }],
                ["bold", "italic", "underline"],
                ["link", "image"],
                [{ script: "sub" }, { script: "super" }],
                ["blockquote", "code-block"],
                ["clean"],
            ],
        },
    };

    const quillFormats = [
        "header",
        "list", "bullet", 
        "align",
        "bold", "italic", "underline",
        "link", "image", 
        "script",
        "blockquote", "code-block"
    ];

    return (
        <Container style={{ maxWidth: "800px", marginTop: "200px" }} className="my-5">
            <Button variant="secondary" onClick={() => navigate("/manage-posts")}>
                Back to Manage Posts
            </Button>
            <Card className="p-4 shadow-sm mt-3" style={{ borderRadius: "10px", backgroundColor: "#ffffff" }}>
                <h2 className="text-center mb-4">Update Post</h2>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="title">
                        <Form.Label className="text-start d-block mb-2">Title</Form.Label>
                        <Form.Control
                            className="form-control-lg mb-3"
                            type="text"
                            placeholder="Enter post title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Form.Group controlId="content">
                        <Form.Label className="text-start d-block mb-2">Content</Form.Label>
                        <div className="quill-editor-container">
                            <ReactQuill
                                className="mb-3"
                                value={content}
                                onChange={setContent}
                                modules={quillModules}
                                formats={quillFormats}
                                placeholder="Write your post content here..."
                                required
                            />
                        </div>
                    </Form.Group>

                    <Row className="mb-3">
                        <Col md={12}>
                            <Form.Group controlId="status">
                                <Form.Label className="text-start d-block mb-2">Status</Form.Label>
                                <Form.Control
                                    className="form-control-lg mb-3"
                                    as="select"
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}>
                                    <option value="Draft">Draft</option>
                                    <option value="Published">Published</option>
                                </Form.Control>
                            </Form.Group>
                        </Col>

                        <Col md={12}>
                            <Form.Group controlId="image">
                                <Form.Label className="text-start d-block mb-2">Image URL</Form.Label>
                                <Form.Control
                                    className="form-control-lg mb-3"
                                    type="text"
                                    placeholder="Enter image URL"
                                    value={image}
                                    onChange={handleImageChange}
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    {preview && (
                        <div className="text-center mb-3">
                            <img
                                src={preview}
                                alt="Preview"
                                style={{
                                    maxWidth: "100%",
                                    height: "auto",
                                    borderRadius: "5px",
                                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                                    objectFit: "cover",
                                }}
                            />
                        </div>
                    )}

                    <Stack direction="horizontal" gap={3} className="d-flex justify-content-center mt-3">
                        <Button
                            variant="secondary"
                            onClick={handleReset}
                            style={{
                                fontSize: "18px",
                                padding: "10px",
                                borderRadius: "5px",
                                width: "150px",
                            }}>
                            Reset
                        </Button>

                        <Button
                            variant="primary"
                            type="submit"
                            style={{
                                fontSize: "18px",
                                padding: "10px",
                                borderRadius: "5px",
                                width: "150px",
                            }}>
                            Update Post
                        </Button>
                    </Stack>
                </Form>
            </Card>
        </Container>
    );
};

export default UpdatePost;
