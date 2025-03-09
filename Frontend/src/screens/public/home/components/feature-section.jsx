import { Card, CardContent } from "@/components/ui/card";
import { BookHeart, Video, BookCheck, ShieldCheck, BotMessageSquare } from "lucide-react";

const FeaturesList = () => {
    const features = [
        {
            icon: <BookHeart className="w-5 h-5" />,
            text: "Nền tảng tư vấn tâm lý trực tuyến giúp giới trẻ quản lý stress và trầm cảm.",
        },
        {
            icon: <Video className="w-5 h-5" />,
            text: "Kết nối trực tiếp với chuyên gia qua video call, nhắn tin hoặc trò chuyện riêng tư.",
        },
        {
            icon: <BookCheck className="w-5 h-5" />,
            text: "Đánh giá mức độ stress, trầm cảm với các bài kiểm tra khoa học.",
        },
        {
            icon: <BotMessageSquare className="w-5 h-5" />,
            text: "Blog chuyên sâu và AI hỗ trợ nhanh về sức khỏe tinh thần.",
        },
        {
            icon: <ShieldCheck className="w-5 h-5" />,
            text: "Không gian riêng tư, tiện lợi, đồng hành cùng bạn mọi lúc, mọi nơi.",
        },
    ];

    return (
        <Card className="max-w-6xl mx-auto bg-blue-50/50 border-none">
            <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-blue-600 mb-4">
                    Tâm Giao - &quot;Lắng nghe để hiểu - Chia sẻ để chữa lành&quot;
                </h3>

                <ul className="space-y-4">
                    {features.map((feature, index) => (
                        <li key={index} className="flex items-center justify-start gap-3">
                            <div className="mt-1 p-1.5 bg-blue-100 rounded-full text-blue-600">{feature.icon}</div>
                            <span className="text-gray-700 leading-relaxed">{feature.text}</span>
                        </li>
                    ))}
                </ul>
            </CardContent>
        </Card>
    );
};

export default FeaturesList;
