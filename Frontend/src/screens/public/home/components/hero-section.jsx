import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import Banner from "@/assets/banner.jpg";

const HeroSection = () => {
    return (
        <div className="relative w-full min-h-[65vh] overflow-hidden mb-8">
            {/* Background Image */}
            <img src={Banner} alt="Mobile App" className="absolute inset-0 w-full h-full object-cover" />

            {/* Overlay for better contrast */}
            <div className="absolute inset-0 "></div>

            {/* Content */}
            <div className="relative z-10 max-w-6xl mx-auto flex items-center h-full py-12">
                <div className="w-[50%] h-[80%]">
                    <div>
                        <h1 className="text-7xl font-bold text-blue-600 mb-2">Tâm Giao</h1>
                        <p className="text-blue-600 text-xl font-bold mb-6">
                            &quot;Lắng nghe để hiểu - Chia sẻ để chữa lành&quot;
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mr-2 sm:mr-4">
                            <Link to="/doctor">
                                <Card className="h-full p-4 sm:p-4 text-center rounded-[15px] hover:shadow-lg transition-shadow hover:border-2 hover:border-blue-500 flex flex-col">
                                    <CardContent className="h-full flex flex-col items-center justify-between p-2">
                                        <Avatar className="w-[40px] h-[40px] sm:w-[50px] sm:h-[50px] md:w-[60px] md:h-[60px]">
                                            <AvatarImage src="https://cdn-icons-png.freepik.com/512/6210/6210017.png" />
                                        </Avatar>
                                        <div className="text-lg sm:text-xl md:text-2xl font-semibold">Tư vấn từ xa</div>
                                        <div className="text-xs sm:text-sm text-center">
                                            Khám từ xa với chuyên viên online
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>

                            <Link to="/CategoryTestSelected">
                                <Card className="h-full p-4 sm:p-4 text-center rounded-[15px] hover:shadow-lg transition-shadow hover:border-2 hover:border-blue-500 flex flex-col">
                                    <CardContent className="h-full flex flex-col items-center justify-between p-2">
                                        <Avatar className="w-[40px] h-[40px] sm:w-[50px] sm:h-[50px] md:w-[60px] md:h-[60px]">
                                            <AvatarImage src="https://icons.veryicon.com/png/o/business/convention-center/introduction-to-the-meeting.png" />
                                        </Avatar>
                                        <div className="text-lg sm:text-xl md:text-2xl font-semibold">
                                            Trắc nghiệm tâm lý
                                        </div>
                                        <div className="text-xs sm:text-sm text-center">Làm bài trắc nghiệm tâm lý</div>
                                    </CardContent>
                                </Card>
                            </Link>

                            <Link to="/blog">
                                <Card className="h-full p-4 sm:p-4 text-center rounded-[15px] hover:shadow-lg transition-shadow hover:border-2 hover:border-blue-500 flex flex-col">
                                    <CardContent className="h-full flex flex-col items-center justify-between p-2">
                                        <Avatar className="w-[40px] h-[40px] sm:w-[50px] sm:h-[50px] md:w-[60px] md:h-[60px]">
                                            <AvatarImage src="https://thumbs.dreamstime.com/b/blog-icon-vector-sign-symbol-isolated-white-background-logo-concept-your-web-mobile-app-design-134548410.jpg" />
                                        </Avatar>
                                        <div className="text-lg sm:text-xl md:text-2xl font-semibold">
                                            Bài viết tâm lý
                                        </div>
                                        <div className="text-xs sm:text-sm text-center">Đọc bài viết về tâm lý</div>
                                    </CardContent>
                                </Card>
                            </Link>

                            <Link to="/about-us">
                                <Card className="h-full p-4 sm:p-4 text-center rounded-[15px] hover:shadow-lg transition-shadow hover:border-2 hover:border-blue-500 flex flex-col">
                                    <CardContent className="h-full flex flex-col items-center justify-between p-2">
                                        <Avatar className="w-[40px] h-[40px] sm:w-[50px] sm:h-[50px] md:w-[60px] md:h-[60px]">
                                            <AvatarImage src="https://cdn-icons-png.freepik.com/256/12099/12099654.png?semt=ais_hybrid" />
                                        </Avatar>
                                        <div className="text-lg sm:text-xl md:text-2xl font-semibold">Về chúng tôi</div>
                                        <div className="text-xs sm:text-sm text-center">
                                            Những gì chúng tôi cung cấp
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HeroSection;
