import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import style cho Quill
import { Button, Form, Container, Row, Col, Card, Stack } from "react-bootstrap";
import { createBlogPost } from "../../api/blogPosts.api";
import { useBootstrap } from "@/hooks/useBootstrap";
import { useNavigate } from "react-router-dom";

const CreateNewPost = () => {
    useBootstrap();
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [status, setStatus] = useState("Draft");
    const [image, setImage] = useState("");
    const [preview, setPreview] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        const postData = { title, content, status, image };

        try {
            const result = await createBlogPost(postData); // ✅ Gọi API từ file riêng
            alert("✅ Post created successfully!");
            console.log("Post created:", result);
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

    return (
        <Container style={{ maxWidth: "800px", marginTop: "200px" }} className="my-5">
            <Button variant="secondary" onClick={() => navigate("/manage-posts")}>
                Back to Manage Posts
            </Button>
            <Card className="p-4 shadow-sm mt-3" style={{ borderRadius: "10px", backgroundColor: "#ffffff" }}>
                <h2 className="text-center mb-4">Create New Post</h2>
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
                        <ReactQuill
                            className="mb-3"
                            value={content}
                            onChange={setContent}
                            modules={{
                                toolbar: [
                                    [{ header: "1" }, { header: "2" }, { font: [] }],
                                    [{ list: "ordered" }, { list: "bullet" }],
                                    [{ align: [] }],
                                    ["bold", "italic", "underline"],
                                    ["link", "image"],
                                    [{ script: "sub" }, { script: "super" }],
                                    ["blockquote", "code-block"],
                                    ["clean"],
                                ],
                            }}
                            placeholder="Write your post content here..."
                            required
                        />
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
                            Create Post
                        </Button>
                    </Stack>
                </Form>
            </Card>
        </Container>
    );
};

export default CreateNewPost;
