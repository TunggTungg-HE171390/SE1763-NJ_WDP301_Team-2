import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getBlogPostById, updateBlogPost } from "../../api/blogPosts.api";
import TinyEditor from "../../components/editor/TinyEditor";
import {
    Container,
    Typography,
    Box,
    TextField,
    Button,
    Card,
    CardContent,
    Grid,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    Stack,
    Paper,
    CircularProgress,
    Alert,
    Snackbar
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SaveIcon from "@mui/icons-material/Save";

const UpdatePost = () => {
    const navigate = useNavigate();
    const { postId } = useParams();
    const [loading, setLoading] = useState(true);

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [status, setStatus] = useState("Draft");
    const [image, setImage] = useState("");
    const [preview, setPreview] = useState("");
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [alertSeverity, setAlertSeverity] = useState("success");

    useEffect(() => {
        const fetchPost = async () => {
            setLoading(true);
            try {
                const post = await getBlogPostById(postId);
                setTitle(post.title || "");
                setContent(post.content || "");
                setStatus(post.status || "Draft");
                setImage(post.image || "");
                setPreview(post.image || "");
            } catch (error) {
                console.error("Error fetching post:", error);
                setAlertMessage("Error loading post: " + error.message);
                setAlertSeverity("error");
                setAlertOpen(true);
            } finally {
                setLoading(false);
            }
        };
        fetchPost();
    }, [postId]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title.trim()) {
            setAlertMessage("Please enter a title for your post");
            setAlertSeverity("warning");
            setAlertOpen(true);
            return;
        }

        if (!content) {
            setAlertMessage("Please add some content to your post");
            setAlertSeverity("warning");
            setAlertOpen(true);
            return;
        }

        const postData = { title, content, status, image };

        try {
            setLoading(true);
            const result = await updateBlogPost(postId, postData);
            setAlertMessage("Post updated successfully!");
            setAlertSeverity("success");
            setAlertOpen(true);
            console.log("Post updated:", result);
            
            // Redirect after successful update
            setTimeout(() => {
                navigate("/manage-posts");
            }, 2000);
        } catch (error) {
            setAlertMessage(`Error: ${error.message}`);
            setAlertSeverity("error");
            setAlertOpen(true);
        } finally {
            setLoading(false);
        }
    };

    const handleImageChange = (e) => {
        const url = e.target.value;
        setImage(url);
        setPreview(url);
    };

    const handleCloseAlert = () => {
        setAlertOpen(false);
    };

    if (loading && !title) {
        return (
            <Container maxWidth="md" sx={{ mt: 12, mb: 4, display: 'flex', justifyContent: 'center' }}>
                <CircularProgress />
            </Container>
        );
    }

    return (
        <Container maxWidth="md" sx={{ mt: 12, mb: 4 }}>
            <Box sx={{ mb: 2 }}>
                <Button
                    variant="outlined"
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate("/manage-posts")}
                >
                    Back to Manage Posts
                </Button>
            </Box>

            <Card elevation={3} sx={{ borderRadius: 2 }}>
                <CardContent sx={{ p: 4 }}>
                    <Typography variant="h4" component="h1" gutterBottom align="center" fontWeight="bold" sx={{ mb: 4 }}>
                        Update Post
                    </Typography>

                    <Box component="form" onSubmit={handleSubmit} noValidate>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    required
                                    id="title"
                                    label="Title"
                                    variant="outlined"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    disabled={loading}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                                    Content
                                </Typography>
                                <TinyEditor 
                                    value={content}
                                    onChange={setContent}
                                    placeholder="Write your post content here..."
                                    height={350}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <InputLabel id="status-label">Status</InputLabel>
                                    <Select
                                        labelId="status-label"
                                        id="status"
                                        value={status}
                                        label="Status"
                                        onChange={(e) => setStatus(e.target.value)}
                                        disabled={loading}
                                    >
                                        <MenuItem value="Draft">Draft</MenuItem>
                                        <MenuItem value="Published">Published</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    id="image"
                                    label="Featured Image URL"
                                    variant="outlined"
                                    value={image}
                                    onChange={handleImageChange}
                                    placeholder="Enter image URL"
                                    disabled={loading}
                                />
                            </Grid>

                            {preview && (
                                <Grid item xs={12}>
                                    <Paper elevation={1} sx={{ p: 2, textAlign: 'center' }}>
                                        <img
                                            src={preview}
                                            alt="Preview"
                                            style={{
                                                maxWidth: "100%",
                                                maxHeight: "300px",
                                                objectFit: "contain",
                                                borderRadius: "4px",
                                            }}
                                        />
                                    </Paper>
                                </Grid>
                            )}

                            <Grid item xs={12}>
                                <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 2 }}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        type="submit"
                                        startIcon={<SaveIcon />}
                                        size="large"
                                        disabled={loading}
                                    >
                                        {loading ? "Updating..." : "Update Post"}
                                    </Button>
                                </Stack>
                            </Grid>
                        </Grid>
                    </Box>
                </CardContent>
            </Card>

            <Snackbar open={alertOpen} autoHideDuration={6000} onClose={handleCloseAlert}>
                <Alert onClose={handleCloseAlert} severity={alertSeverity} sx={{ width: '100%' }}>
                    {alertMessage}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default UpdatePost;
