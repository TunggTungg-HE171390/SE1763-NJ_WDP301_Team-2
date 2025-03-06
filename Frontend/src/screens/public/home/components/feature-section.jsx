import { Card, CardContent } from "@/components/ui/card";
import { Clock, Video, MessageCircle, Phone, Package } from "lucide-react";

const FeaturesList = () => {
    const features = [
        {
            icon: <Clock className="w-5 h-5" />,
            text: "Priority appointment booking at medical facilities nationwide, no more waiting in line for a number",
        },
        {
            icon: <Video className="w-5 h-5" />,
            text: "1:1 online consultation with doctors via video call anytime, anywhere",
        },
        {
            icon: <MessageCircle className="w-5 h-5" />,
            text: "Free private chat with doctors, ensuring privacy, timely support, and high expertise",
        },
        {
            icon: <Phone className="w-5 h-5" />,
            text: "Emergency SOS doctor calls available 24/7",
        },
        {
            icon: <Package className="w-5 h-5" />,
            text: "Additionally, many useful features such as: Online medicine purchase with home delivery, Health record management, Health Q&A community, Cough sound detection, Step counting...",
        },
    ];

    return (
        <Card className="max-w-6xl mx-auto bg-emerald-50/50 border-none">
            <CardContent className="p-6">
                <h3 className="text-lg font-medium text-emerald-800 mb-4">
                    IVIE – Doctor Oi is an online health care application available 24/7, with many outstanding features
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