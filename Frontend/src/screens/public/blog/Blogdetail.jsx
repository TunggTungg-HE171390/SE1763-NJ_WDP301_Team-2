import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useAuth } from "@/hooks/useAuth";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { BookmarkIcon, HeartIcon, MessageSquareIcon, EyeIcon, ClockIcon } from "lucide-react";
import * as API from "@/api";

const BlogPostDetail = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [post, setPost] = useState(null);
    const [relatedPosts, setRelatedPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [emailInput, setEmailInput] = useState("");
    const [status, setStatus] = useState(null);

    const [liked, setLiked] = useState(false);
    const [bookmarked, setBookmarked] = useState(false);
    const [likeCount, setLikeCount] = useState(42);
    const [viewCount, setViewCount] = useState(0);
    const [commentContent, setCommentContent] = useState("");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchBlogData = async () => {
            if (!id) return;

            try {
                setLoading(true);

                // Fetch the main blog post
                const response = await API.getBlogPostDetailById(id);
                setPost(response.data);
                setViewCount(response.data.views || 0);

                // Fetch all blog posts for related content
                const allPosts = await API.getAllBlogPosts();

                // Filter related posts based on category and tags
                // Exclude the current post and limit to 3 posts
                const related = allPosts.data
                    .filter(
                        (p) =>
                            p._id !== id &&
                            (p.category === response.data.category ||
                                p.tags?.some((tag) => response.data.tags?.includes(tag)))
                    )
                    .slice(0, 3);

                setRelatedPosts(related);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching blog data:", err);
                setError("Failed to load blog content");
                setLoading(false);
            }
        };

        fetchBlogData();
    }, [id]);

    const handleCardSubmit = async () => {
        if (emailInput.trim() === "") return;

        try {
            await API.subscribeEmail({ email: emailInput });
            setEmailInput("");
            setStatus("success");
        } catch (error) {
            console.error(error);
            setStatus("error");
        }
    };

    const handleLike = () => {
        if (liked) {
            setLikeCount(likeCount - 1);
        } else {
            setLikeCount(likeCount + 1);
        }
        setLiked(!liked);
    };

    const handleBookmark = () => {
        setBookmarked(!bookmarked);
    };

    const navigateToBlog = (blogId) => {
        navigate(`/blogdetail/${blogId}`);
    };

    const handleSubmitComment = async () => {
        if (!commentContent.trim() || !user) return;

        try {
            setSubmitting(true);
            await API.addBlogComment(id, {
                userId: user._id,
                content: commentContent.trim(),
            });

            setCommentContent("");

            const refreshed = await API.addBlogComment(id);
            setPost(refreshed.data);
        } catch (err) {
            console.error("Comment submission failed:", err);
            // Optionally set an error message
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="flex justify-center items-center h-screen">Đang tải...</div>;
    if (error) return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
    if (!post) return <div className="flex justify-center items-center h-screen">Không tìm thấy bài viết</div>;

    const commentCount = post.comments ? post.comments.length : 0;

    // Calculate reading time (rough estimation: 200 words per minute)
    const wordCount = post.content ? post.content.split(/\s+/).length : 0;
    const readingTime = Math.max(1, Math.ceil(wordCount / 200));

    // Format date for display
    const publishDate = new Date(post.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    return (
        <>
            <Helmet>
                <title>{post.title}</title>
            </Helmet>
            <div className="max-w-6xl mx-auto px-8 py-8 bg-gray-100">
                {/* Breadcrumb Navigation */}
                <div className="mb-4 flex flex-row justify-start">
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/">Trang chủ</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/blog">Bài viết</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>{post.title}</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Main Content Column */}
                    <div className="lg:w-2/3">
                        {/* Blog Header */}
                        <div className="mb-2 rounded-lg">
                            <h1 className="text-4xl font-bold mb-4 text-start">{post.title}</h1>
                            <div className="flex flex-wrap items-center justify-between">
                                <div className="flex items-center gap-2 mb-2">
                                    {post.tags &&
                                        post.tags.map((tag, index) => (
                                            <Badge key={index} variant="outline" className="mr-1">
                                                {tag}
                                            </Badge>
                                        ))}
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <span>{publishDate}</span>
                                    <span>•</span>
                                    <span className="flex items-center gap-1">
                                        <ClockIcon className="h-4 w-4" />
                                        {readingTime} thời gian đọc
                                    </span>
                                    <span>•</span>
                                    <span className="flex items-center gap-1">
                                        <EyeIcon className="h-4 w-4" />
                                        {viewCount} lượt xem
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Featured Image
                        {post.image && (
                            <div className="mb-2 rounded-lg overflow-hidden">
                                <img src={post.image} alt={post.title} className="w-full h-auto object-cover" />
                            </div>
                        )} */}

                        {/* Blog Content - White Background Card */}
                        <Card className="p-4 mb-2">
                            <div className="prose max-w-none text-lg px-6 text-left [line-height:2]">
                                {/* If content is already HTML, use dangerouslySetInnerHTML */}
                                {/* If content is plain text, display as paragraphs */}
                                {post.content.includes("<") ? (
                                    <div
                                        className="[&>ul]:list-disc [&>ul]:px-12"
                                        dangerouslySetInnerHTML={{ __html: post.content }}
                                    />
                                ) : (
                                    <p>{post.content}</p>
                                )}
                            </div>
                        </Card>

                        {/* Interaction Bar */}
                        <div className="flex items-center justify-between mb-8 p-4 bg-white rounded-lg">
                            <div className="flex items-center gap-4">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className={`flex items-center gap-1 ${
                                        liked ? "text-red-500 hover:text-red-500" : ""
                                    }`}
                                    onClick={handleLike}>
                                    <HeartIcon className="h-5 w-5" fill={liked ? "currentColor" : "none"} />
                                    <span>{likeCount}</span>
                                </Button>

                                <Button variant="ghost" size="sm" className="flex items-center gap-1">
                                    <MessageSquareIcon className="h-5 w-5" />
                                    <span>{commentCount}</span>
                                </Button>

                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className={`flex items-center gap-1 ${
                                        bookmarked ? "text-blue-500 hover:text-blue-500" : ""
                                    }`}
                                    onClick={handleBookmark}>
                                    <BookmarkIcon className="h-5 w-5" fill={bookmarked ? "currentColor" : "none"} />
                                    <span>Lưu</span>
                                </Button>
                            </div>
                        </div>

                        {/* Comments Section */}
                        <div className="mb-4 p-6 bg-white rounded-lg">
                            <h3 className="text-xl text-start font-bold mb-4">Bình luận ({commentCount})</h3>

                            <div className="flex gap-4 mb-6">
                                <Avatar className="h-10 w-10">
                                    <AvatarImage src="/api/placeholder/20/40" alt="Your avatar" />
                                    <AvatarFallback>YA</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <textarea
                                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                        placeholder="Viết một comment..."
                                        rows={3}
                                        value={commentContent}
                                        onChange={(e) => setCommentContent(e.target.value)}
                                    />
                                    <div className="flex justify-end">
                                        <Button
                                            className="bg-blue-600"
                                            onClick={handleSubmitComment}
                                            disabled={submitting}>
                                            {submitting ? "Đang gửi..." : "Đăng bình luận"}
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            {/* Display actual comments from API */}
                            {post.comments && post.comments.length > 0 ? (
                                post.comments.map((comment, index) => (
                                    <Card key={index} className="p-4 mb-4">
                                        <div className="flex gap-4">
                                            <Avatar className="h-10 w-10">
                                                <AvatarImage src="/api/placeholder/40/40" alt="User" />
                                                <AvatarFallback>U{index}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <p className="font-medium">{comment.userId.fullName}</p>
                                                    <span className="text-sm text-gray-500">
                                                        {new Date(comment.createAt).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <p className="text-gray-700 text-start">{comment.content}</p>
                                                <div className="flex items-center gap-4 mt-2">
                                                    <Button variant="ghost" size="sm" className="h-6 text-xs">
                                                        Trả lời
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-6 text-xs flex items-center gap-1">
                                                        <HeartIcon className="h-3 w-3" /> 0
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                ))
                            ) : (
                                <p className="text-gray-500 text-center py-4">Chưa có bình luận</p>
                            )}

                            {post.comments && post.comments.length > 3 && (
                                <Button variant="outline" className="w-full bg-white">
                                    Tải thêm bình luận
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Sidebar Column */}
                    <div className="lg:w-1/3">
                        {/* Advertisement Space - Top */}
                        <Card className="p-4 mb-6 bg-yellow-50 border-yellow-200">
                            <div className="w-full aspect-[1/2] overflow-hidden rounded-md bg-gray-200">
                                <img
                                    src="https://i.imgur.com/6K15bgv.png"
                                    alt="Advertisement"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <p className="text-xs text-gray-500 text-center mt-2">Quảng cáo được trả phí</p>
                        </Card>

                        {/* Call to Action */}
                        <Card className="p-6 bg-blue-50 border-blue-200 mb-6">
                            <h3 className="text-lg font-bold mb-2">Cập nhật thông tin mới nhất</h3>
                            <p className="mb-4">Đăng ký để nhận những tin tức mới nhất</p>
                            <div className="flex flex-col gap-2">
                                <input
                                    type="email"
                                    placeholder="Email của bạn"
                                    className="w-full p-2 border rounded-md"
                                    value={emailInput}
                                    onChange={(e) => setEmailInput(e.target.value)}
                                />
                                <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={handleCardSubmit}>
                                    Đăng ký
                                </Button>

                                {status === "success" && <p className="text-green-600 text-sm">Đăng ký thành công!</p>}
                                {status === "error" && (
                                    <p className="text-red-600 text-sm">Đăng ký thất bại. Vui lòng thử lại.</p>
                                )}
                            </div>
                        </Card>

                        {/* Related Posts - Now from API */}
                        <Card className="p-6 bg-green-50 mb-6">
                            <h3 className="text-lg font-bold mb-4">Bài viết liên quan</h3>
                            <div className="flex flex-col gap-4">
                                {relatedPosts.length > 0 ? (
                                    relatedPosts.map((relatedPost) => (
                                        <Card key={relatedPost._id} className="p-3 bg-white">
                                            <h4 className="font-bold mb-1">{relatedPost.title}</h4>
                                            <Button
                                                variant="link"
                                                className="p-0"
                                                onClick={() => navigateToBlog(relatedPost._id)}>
                                                Đọc thêm
                                            </Button>
                                        </Card>
                                    ))
                                ) : (
                                    // Fallback if no related posts are found
                                    <>
                                        <Card className="p-3 bg-white">
                                            <h4 className="font-bold mb-1">
                                                Tìm hiểu thêm {post.category || "về chủ đề này"}
                                            </h4>
                                            <Button variant="link" className="p-0">
                                                Tìm chủ đề
                                            </Button>
                                        </Card>
                                        <Card className="p-3 bg-white">
                                            <Badge className="mb-1">Nổi bật</Badge>
                                            <h4 className="font-bold mb-1">Bài viết nổi bật</h4>
                                            <Button variant="link" className="p-0">
                                                Xem nổi bật
                                            </Button>
                                        </Card>
                                    </>
                                )}
                            </div>
                        </Card>
                    </div>
                </div>

                {/* SEO Metadata (for illustration) */}
                <div className="hidden">
                    <meta name="description" content={post.content?.substring(0, 160)} />
                    <meta name="keywords" content={post.tags?.join(", ")} />
                    <meta property="og:title" content={post.title} />
                    <meta property="og:description" content={post.content?.substring(0, 160)} />
                    <meta property="og:image" content={post.image} />
                </div>
            </div>
        </>
    );
};

export default BlogPostDetail;
