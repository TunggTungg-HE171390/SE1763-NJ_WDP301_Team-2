import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createBlogPost } from "../../api/blogPosts.api";
import EditorWrapper from "../../components/editor/EditorWrapper";
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
    Alert,
    Snackbar
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ReplayIcon from "@mui/icons-material/Replay";
import SaveIcon from "@mui/icons-material/Save";

const CreateNewPost = () => {
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [status, setStatus] = useState("Draft");
    const [image, setImage] = useState("");
    const [preview, setPreview] = useState("");
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [alertSeverity, setAlertSeverity] = useState("success");

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
            const result = await createBlogPost(postData);
            setAlertMessage("Post created successfully!");
            setAlertSeverity("success");
            setAlertOpen(true);
            console.log("Post created:", result);
            
            // Optional: Clear form after successful submission
            if (result) {
                setTimeout(() => {
                    handleReset();
                }, 2000);
            }
        } catch (error) {
            setAlertMessage(`Error: ${error.message}`);
            setAlertSeverity("error");
            setAlertOpen(true);
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

    const handleCloseAlert = () => {
        setAlertOpen(false);
    };

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
                        Create New Post
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
                                    autoFocus
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                                    Content
                                </Typography>
                                <EditorWrapper 
                                    data={content}
                                    onChange={setContent}
                                    placeholder="Write your post content here..."
                                    sx={{ minHeight: '300px' }}
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
                                        variant="outlined"
                                        color="secondary"
                                        startIcon={<ReplayIcon />}
                                        onClick={handleReset}
                                        size="large"
                                    >
                                        Reset
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        type="submit"
                                        startIcon={<SaveIcon />}
                                        size="large"
                                    >
                                        Create Post
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

export default CreateNewPost;
