import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { MessageCircle, Video, FileText, Users, Heart, Shield, Headphones, Car } from "lucide-react";

const TamGiaoLandingPage = () => {
    return (
        <>
            <Helmet>
                <title>Về chúng tôi</title>
            </Helmet>
            <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
                {/* Hero Section */}
                <section className="bg-blue-700 text-white py-16">
                    <div className="container mx-auto px-4 text-center">
                        <h1 className="text-4xl md:text-5xl font-bold mb-6">
                            Tâm Giao - &quot;Lắng nghe để hiểu - Chia sẻ để chữa lành&quot;
                        </h1>
                        <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
                            Nền tảng tư vấn tâm lý trực tuyến chuyên nghiệp dành cho giới trẻ, giúp quản lý stress và
                            trầm cảm hiệu quả
                        </p>
                        <div className="flex flex-col md:flex-row justify-center gap-4">
                            <Link to="/login">
                                <Button className="bg-white text-blue-700 hover:bg-blue-100 text-lg px-8 py-6">
                                    Bắt đầu ngay
                                </Button>
                            </Link>
                            <Link to="https://www.facebook.com/profile.php?id=61572436850296">
                                <Button className="bg-white text-blue-700 hover:bg-blue-100 text-lg px-8 py-6">
                                    Tìm hiểu thêm
                                </Button>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section id="features" className="py-16 bg-white">
                    <div className="container mx-auto px-4">
                        <h2 className="text-3xl font-bold text-center mb-12 text-blue-700">Các tính năng chính</h2>
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                            <Card className="border-blue-100 hover:shadow-lg transition-shadow">
                                <CardHeader className="pb-2 flex flex-col items-center">
                                    <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mb-4 flex-shrink-0">
                                        <Video className="h-6 w-6 text-blue-700" />
                                    </div>
                                    <CardTitle className="text-xl text-blue-700 text-center">
                                        Tư vấn 1:1 với chuyên gia
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="text-center">
                                    <p className="text-gray-600">
                                        Kết nối trực tiếp với bác sĩ tâm lý thông qua video call, nhắn tin hoặc trò
                                        chuyện riêng tư để nhận được sự hỗ trợ kịp thời.
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="border-blue-100 hover:shadow-lg transition-shadow">
                                <CardHeader className="pb-2 flex flex-col items-center">
                                    <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mb-4 flex-shrink-0">
                                        <FileText className="h-6 w-6 text-blue-700" />
                                    </div>
                                    <CardTitle className="text-xl text-blue-700">Bài test tâm lý</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-600">
                                        Hệ thống cung cấp các bài kiểm tra khoa học giúp đánh giá mức độ stress, trầm
                                        cảm và tình trạng sức khỏe tinh thần của bạn.
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="border-blue-100 hover:shadow-lg transition-shadow">
                                <CardHeader className="pb-2 flex flex-col items-center">
                                    <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mb-4 flex-shrink-0">
                                        <Users className="h-6 w-6 text-blue-700" />
                                    </div>
                                    <CardTitle className="text-xl text-blue-700">Blog chia sẻ kiến thức</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-600">
                                        Kho bài viết chuyên sâu về stress, trầm cảm và các phương pháp chăm sóc sức khỏe
                                        tinh thần, giúp hiểu rõ hơn về vấn đề của bạn.
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="border-blue-100 hover:shadow-lg transition-shadow">
                                <CardHeader className="pb-2 flex flex-col items-center">
                                    <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mb-4 flex-shrink-0">
                                        <MessageCircle className="h-6 w-6 text-blue-700" />
                                    </div>
                                    <CardTitle className="text-xl text-blue-700">Chatbot hỗ trợ</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-600">
                                        Hệ thống tin nhắn tự động với AI giúp tư vấn nhanh, gợi ý giải pháp và hướng dẫn
                                        bạn đến các dịch vụ phù hợp.
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>

                {/* Values Section */}
                <section id="values" className="py-16 bg-blue-50">
                    <div className="container mx-auto px-4">
                        <h2 className="text-3xl font-bold text-center mb-12 text-blue-700">Giá trị cốt lõi</h2>
                        <div className="grid md:grid-cols-2 gap-8">
                            <Card className="border-none bg-white hover:shadow-md transition-shadow">
                                <CardHeader className="pb-2 flex flex-col items-center">
                                    <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                                        <Headphones className="h-6 w-6 text-blue-700" />
                                    </div>
                                    <CardTitle className="text-xl text-blue-700">Lắng nghe & Thấu hiểu</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-600">
                                        Mỗi cảm xúc đều xứng đáng được trân trọng. Tại Tâm Giao bạn luôn được lắng nghe
                                        với sự đồng cảm sâu sắc, mang đến cảm giác an tâm và thấu hiểu.
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="border-none bg-white hover:shadow-md transition-shadow">
                                <CardHeader className="pb-2 flex flex-col items-center">
                                    <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                                        <Heart className="h-6 w-6 text-blue-700" />
                                    </div>
                                    <CardTitle className="text-xl text-blue-700">Đồng hành & Hỗ trợ</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-600">
                                        Không chỉ là một nền tảng tư vấn, mà Tâm Giao còn là người bạn đồng hành trên
                                        hành trình giúp bạn vượt qua stress và trầm cảm.
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="border-none bg-white hover:shadow-md transition-shadow">
                                <CardHeader className="pb-2 flex flex-col items-center">
                                    <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                                        <Car className="h-6 w-6 text-blue-700" />
                                    </div>
                                    <CardTitle className="text-xl text-blue-700">Chữa lành & Cân bằng</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-600">
                                        Giúp tâm hồn bạn tìm lại sự bình yên, khơi dậy năng lượng tích cực và cân bằng
                                        cuộc sống.
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="border-none bg-white hover:shadow-md transition-shadow">
                                <CardHeader className="pb-2 flex flex-col items-center">
                                    <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                                        <Shield className="h-6 w-6 text-blue-700" />
                                    </div>
                                    <CardTitle className="text-xl text-blue-700">Tiện lợi & Bảo mật</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-600">
                                        Một không gian an toàn, nơi mọi chia sẻ của bạn đều được tôn trọng, với dịch vụ
                                        trực tuyến dễ dàng tiếp cận mọi lúc, mọi nơi.
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>

                {/* About Section */}
                <section id="about" className="py-16 bg-white">
                    <div className="container mx-auto px-4">
                        <div className="md:flex gap-12 items-center">
                            <div className="md:w-1/2">
                                <h2 className="text-3xl font-bold mb-6 text-blue-700">Tầm nhìn</h2>
                                <p className="text-gray-600 mb-8">
                                    <strong className="text-blue-700">Tâm Giao</strong> hướng đến việc trở thành nền
                                    tảng tư vấn tâm lý trực tuyến hàng đầu dành cho giới trẻ, nơi mọi người có thể tìm
                                    thấy sự lắng nghe, đồng hành và chữa lành. Chúng tôi mong muốn xây dựng một cộng
                                    đồng kết nối, nơi sức khỏe tinh thần được quan tâm đúng mức và ai cũng có thể dễ
                                    dàng tiếp cận sự hỗ trợ cần thiết để vượt qua stress, trầm cảm và tìm lại sự cân
                                    bằng trong cuộc sống.
                                </p>
                                <h2 className="text-3xl font-bold mb-6 text-blue-700">Sứ mệnh</h2>
                                <p className="text-gray-600">
                                    Tâm Giao ra đời với sứ mệnh mang đến một nền tảng tư vấn tâm lý trực tuyến an toàn,
                                    nơi giới trẻ có thể dễ dàng tiếp cận sự hỗ trợ chuyên nghiệp về stress và trầm cảm.
                                    Chúng tôi không chỉ lắng nghe và thấu hiểu mà còn đồng hành cùng người trẻ trên hành
                                    trình tìm lại sự cân bằng trong cuộc sống. Tâm Giao mong muốn lan tỏa giá trị của
                                    một tinh thần khỏe mạnh, giúp mỗi cá nhân vượt qua rào cản tâm lý và sống một cuộc
                                    đời tích cực hơn.
                                </p>
                            </div>
                            <div className="md:w-1/2 mt-8 md:mt-0">
                                <div className="bg-blue-100 p-8 rounded-lg">
                                    <h3 className="text-2xl font-bold text-blue-700 mb-4 text-center">Tâm Giao</h3>
                                    <p className="text-blue-700 text-lg font-medium text-center italic">
                                        &quot;Nơi mỗi tâm tư đều được lắng nghe, mỗi nỗi niềm đều được vỗ về, và mỗi con
                                        người đều tìm thấy ánh sáng của riêng mình.&quot; 🌿💙
                                    </p>
                                </div>
                                <div className="mt-6 flex justify-center">
                                    <Link to="/doctor">
                                        <Button className="bg-blue-600 hover:bg-blue-700 text-lg px-6 py-5">
                                            Đặt lịch tư vấn ngay
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-16 bg-blue-600 text-white">
                    <div className="container mx-auto px-4 text-center">
                        <h2 className="text-3xl font-bold mb-6">Bắt đầu hành trình chữa lành cùng Tâm Giao</h2>
                        <p className="text-xl mb-8 max-w-2xl mx-auto">
                            Hãy để chúng tôi đồng hành cùng bạn trên con đường tìm lại sự cân bằng và bình yên trong tâm
                            hồn.
                        </p>
                        <div className="flex flex-col md:flex-row justify-center gap-4">
                            <Link to="/signup">
                                <Button className="bg-white text-blue-700 hover:bg-blue-100 text-lg px-6 py-5">
                                    Đăng ký tài khoản
                                </Button>
                            </Link>
                            <Link to="https://www.facebook.com/profile.php?id=61572436850296">
                                <Button className="bg-white text-blue-700 hover:bg-blue-100 text-lg px-6 py-5">
                                    Tìm hiểu dịch vụ
                                </Button>
                            </Link>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
};

export default TamGiaoLandingPage;
