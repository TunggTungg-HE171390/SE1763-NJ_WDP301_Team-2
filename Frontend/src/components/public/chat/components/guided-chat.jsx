import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { Send, Bot } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import * as API from "@/api";

const questions = {
    start: {
        text: "Xin chào! 😊 Bạn muốn tìm hiểu gì về dịch vụ của chúng tôi?",
        options: [
            { text: "🌿 Về dịch vụ tư vấn của chúng tôi", next: "services" },
            { text: "🏥 Cách đặt lịch tư vấn", next: "booking" },
            { text: "📢 Tin tức", next: "news" },
            { text: "📨 Đăng ký nhận bản tin của chúng tôi", next: "subscribe" },
        ],
    },
    services: {
        text: "Chúng tôi cung cấp dịch vụ tư vấn sức khỏe tâm lý chuyên nghiệp. Bạn có muốn xem thêm chi tiết không?",
        options: [
            { text: "Vâng, hãy cho tôi xem thêm!", next: "more_services" },
            { text: "Quay lại", next: "start" },
        ],
    },
    more_services: {
        text: (
            <>
                Đây là liên kết đến trang Dịch vụ của chúng tôi:{" "}
                <Link to="/about-us" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                    Truy cập Dịch vụ
                </Link>
                .
            </>
        ),
        options: [{ text: "Quay lại menu", next: "start" }],
    },
    booking: {
        text: (
            <>
                Để đặt lịch tư vấn, hãy truy cập trang Đặt lịch của chúng tôi:{" "}
                <Link to="/doctor" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                    Đặt lịch ngay
                </Link>
                .
            </>
        ),
        options: [{ text: "Quay lại menu", next: "start" }],
    },
    news: {
        text: (
            <>
                Xem các bài viết và cập nhật mới nhất về sức khỏe tâm thần của chúng tôi:{" "}
                <Link to="/blog" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                    Tin tức mới nhất
                </Link>
                .
            </>
        ),
        options: [{ text: "Quay lại menu", next: "start" }],
    },
    subscribe: {
        text: "Vui lòng nhập email của bạn để nhận bản tin của chúng tôi:",
        inputField: true,
    },
};

const GuidedChat = ({ closeChat, switchToFreedom }) => {
    const [chatHistory, setChatHistory] = useState([
        { from: "bot", text: questions.start.text, options: questions.start.options },
    ]);
    const [userInput, setUserInput] = useState("");
    const [isEmailInputEnabled, setIsEmailInputEnabled] = useState(false);

    const handleUserResponse = (option) => {
        setChatHistory((prev) => [...prev, { from: "user", text: option.text }]);

        if (option.next) {
            const nextStep = questions[option.next];

            if (nextStep.inputField) {
                setIsEmailInputEnabled(true);
            } else {
                setChatHistory((prev) => [
                    ...prev,
                    { from: "bot", text: nextStep.text, options: nextStep.options || [] },
                ]);
            }
        }
    };

    const handleInputSubmit = async () => {
        if (userInput.trim() === "") return;

        try {
            await API.subscribeEmail({ email: userInput });

            setChatHistory((prev) => [
                ...prev,
                { from: "user", text: userInput },
                { from: "bot", text: "Cảm ơn bạn! Bạn đã đăng ký thành công." },
            ]);

            setIsEmailInputEnabled(false);
            setUserInput("");
        } catch (error) {
            console.error("Failed to send email:", error);
            setChatHistory((prev) => [
                ...prev,
                { from: "bot", text: "Bạn đã đăng ký rồi! Vui lòng sử dụng mail khác." },
            ]);
        }
    };

    return (
        <Card className="w-80 shadow-xl">
            <div className="bg-blue-500 p-2 rounded-t-lg text-white flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <Avatar>
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <p className="font-medium">Hỗ trợ khách hàng</p>
                </div>
                <Button
                    variant="ghost"
                    className="bg-inherit text-white rounded-full p-2 h-8 w-8"
                    onClick={closeChat} // Calls closeChat when clicked
                >
                    ✕
                </Button>
            </div>

            <CardContent className="p-2 h-96 flex flex-col">
                <div
                    className="flex-1 overflow-y-auto space-y-4"
                    style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
                    {chatHistory.map((msg, index) => (
                        <div key={index} className={msg.from === "user" ? "flex justify-end" : ""}>
                            <div
                                className={`p-3 rounded-3xl max-w-[80%] ${
                                    msg.from === "user" ? "bg-blue-500 text-white" : "bg-gray-100"
                                }`}>
                                <p className="text-sm">{msg.text}</p>
                            </div>
                            {msg.options && (
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {msg.options.map((option, idx) => (
                                        <Button
                                            key={idx}
                                            variant="outline"
                                            className="text-blue-500"
                                            onClick={() => handleUserResponse(option)}>
                                            {option.text}
                                        </Button>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="mt-4 flex items-center space-x-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-gray-500 bg-[#3b82f6]"
                        onClick={switchToFreedom}>
                        <Bot className="h-5 w-5 text-white hover:text-[#3b82f6]" />
                    </Button>

                    <Input
                        placeholder={!isEmailInputEnabled ? "Không thể nhắn tin." : "Nhập mail của bạn..."}
                        className="flex-1"
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        disabled={!isEmailInputEnabled}
                    />

                    <Button className="bg-blue-500 hover:bg-blue-600" onClick={handleInputSubmit}>
                        <Send className="h-4 w-4 text-white" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

GuidedChat.propTypes = {
    closeChat: PropTypes.func.isRequired,
    switchToFreedom: PropTypes.func.isRequired,
};

export default GuidedChat;
