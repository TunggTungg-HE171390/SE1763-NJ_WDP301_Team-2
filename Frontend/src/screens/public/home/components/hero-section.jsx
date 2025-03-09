import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import Banner from "@/assets/banner.jpg";

const HeroSection = () => {
    return (
        <div className="relative w-full h-[65vh] overflow-hidden mb-8">
            {/* Background Image */}
            <img src={Banner} alt="Mobile App" className="absolute inset-0 w-full h-full object-cover" />

            {/* Overlay for better contrast */}
            <div className="absolute inset-0 "></div>

            {/* Content */}
            <div className="relative z-10 max-w-6xl mx-auto flex items-center h-full">
                <div className="w-[50%]">
                    <h1 className="text-7xl font-bold text-blue-600 mb-2">Tâm Giao</h1>
                    <p className="text-blue-600 text-xl font-bold mb-6">
                        &quot;Lắng nghe để hiểu - Chia sẻ để chữa lành&quot;
                    </p>
                    <div className="grid grid-cols-2 gap-6 mr-4">
                        <Link to="/doctor">
                            <Card className="p-4 text-center rounded-[15px] hover:shadow-lg transition-shadow hover:border-2 hover:border-blue-500">
                                <CardContent className="p-2 flex flex-col items-center justify-center">
                                    <Avatar className="w-[25%] h-[25%]">
                                        <AvatarImage src="https://cdn-icons-png.flaticon.com/512/9411/9411434.png" />
                                    </Avatar>
                                    <div className="text-2xl font-semibold mb-2">Tư vấn từ xa</div>
                                    <div className="text-sm">Khám từ xa với chuyên viên online</div>
                                </CardContent>
                            </Card>
                        </Link>

                        <Link to="/CategoryTestSelected">
                            <Card className="p-4 text-center rounded-[15px] hover:shadow-lg transition-shadow hover:border-2 hover:border-blue-500">
                                <CardContent className="p-2 flex flex-col items-center justify-center">
                                    <Avatar className="w-[25%] h-[25%]">
                                        <AvatarImage src="https://icons.veryicon.com/png/o/miscellaneous/ecological-desktop-icon-library/test-11.png" />
                                    </Avatar>
                                    <div className="text-2xl font-semibold mb-2">Trắc nghiệm tâm lý</div>
                                    <div className="text-sm">Làm bài trắc nghiệm tâm lý</div>
                                </CardContent>
                            </Card>
                        </Link>

                        <Link to="/blog">
                            <Card className="p-4 text-center rounded-[15px] hover:shadow-lg transition-shadow hover:border-2 hover:border-blue-500">
                                <CardContent className="p-2 flex flex-col items-center justify-center">
                                    <Avatar className="w-[25%] h-[25%]">
                                        <AvatarImage src="https://thumbs.dreamstime.com/b/blog-icon-vector-sign-symbol-isolated-white-background-logo-concept-your-web-mobile-app-design-134548410.jpg" />
                                    </Avatar>
                                    <div className="text-2xl font-semibold mb-2">Bài viết tâm lý</div>
                                    <div className="text-sm">Đọc bài viết về tâm lý</div>
                                </CardContent>
                            </Card>
                        </Link>

                        <Link to="/about-us">
                            <Card className="p-4 text-center rounded-[15px] hover:shadow-lg transition-shadow hover:border-2 hover:border-blue-500">
                                <CardContent className="p-2 flex flex-col items-center justify-center">
                                    <Avatar className="w-[25%] h-[25%]">
                                        <AvatarImage src="https://cdn-icons-png.freepik.com/256/12099/12099654.png?semt=ais_hybrid" />
                                    </Avatar>
                                    <div className="text-2xl font-semibold mb-2">Về chúng tôi</div>
                                    <div className="text-sm">Những gì chúng tôi cung cấp</div>
                                </CardContent>
                            </Card>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HeroSection;
