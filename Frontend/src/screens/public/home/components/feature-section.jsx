import { Card, CardContent } from "@/components/ui/card";
import { Clock, Video, MessageCircle, Phone, Package } from "lucide-react";

const FeaturesList = () => {
    const features = [
        {
            icon: <Clock className="w-5 h-5" />,
            text: "Đặt lịch khám ưu tiên tại các cơ sở y tế trên toàn quốc, nói không với xếp hàng lấy số",
        },
        {
            icon: <Video className="w-5 h-5" />,
            text: "Tư vấn trực tuyến 1:1 với bác sĩ thông qua video call mọi lúc mọi nơi",
        },
        {
            icon: <MessageCircle className="w-5 h-5" />,
            text: "Miễn phí chat riêng bác sĩ, đảm bảo sự riêng tư, hỗ trợ kịp thời, chuyên môn cao",
        },
        {
            icon: <Phone className="w-5 h-5" />,
            text: "Gọi bác sĩ khẩn cấp SOS hoạt động 24/7",
        },
        {
            icon: <Package className="w-5 h-5" />,
            text: "Ngoài ra còn nhiều tính năng hữu ích như: Mua thuốc online giao ngay tại nhà, Quản lý Hồ sơ sức khỏe, Cộng đồng hỏi đáp sức khỏe, Nghe tiếng ho, Đếm bước chân...",
        },
    ];

    return (
        <Card className="max-w-6xl mx-auto bg-emerald-50/50 border-none">
            <CardContent className="p-6">
                <h3 className="text-lg font-medium text-emerald-800 mb-4">
                    IVIE – Bác sĩ ơi là ứng dụng chăm sóc sức khỏe trực tuyến 24/7, với nhiều tính năng nổi bật
                </h3>

                <ul className="space-y-4">
                    {features.map((feature, index) => (
                        <li key={index} className="flex items-start justify-start gap-3">
                            <div className="mt-1 p-1.5 bg-emerald-100 rounded-full text-emerald-600">
                                {feature.icon}
                            </div>
                            <span className="text-gray-700 leading-relaxed">{feature.text}</span>
                        </li>
                    ))}
                </ul>
            </CardContent>
        </Card>
    );
};

export default FeaturesList;
