import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { MessageCircle } from "lucide-react";
import GuidedChat from "./components/guided-chat";
import FreedomChat from "./components/freedom-chat";

const ChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isGuided, setIsGuided] = useState(true);

    const closeChat = () => setIsOpen(false);
    const openGuidedChat = () => {
        setIsGuided(true);
        setIsOpen(true);
    };
    const openFreedomChat = () => {
        setIsGuided(false);
        setIsOpen(true);
    };

    return (
        <div className="fixed bottom-4 right-4 z-50">
            {!isOpen && (
                <Card className="w-72 cursor-pointer hover:shadow-lg transition-shadow" onClick={openGuidedChat}>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-gray-800">
                                Xin chào 👋 Bạn có muốn trò chuyện với chúng tôi không?
                            </p>
                            <MessageCircle className="w-12 h-12 text-blue-500" />
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Only render this when isOpen is true */}
            {isOpen && (
                <div className="relative w-80 h-[443px] overflow-hidden border rounded-lg shadow-lg bg-white">
                    {/* Guided Chat */}
                    <div
                        className={`absolute inset-0 transition-transform duration-0 ${
                            isGuided ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0 pointer-events-none"
                        }`}>
                        <GuidedChat closeChat={closeChat} switchToFreedom={openFreedomChat} />
                    </div>

                    {/* Freedom Chat */}
                    <div
                        className={`absolute inset-0 transition-transform duration-0 ${
                            isGuided ? "translate-x-full opacity-0 pointer-events-none" : "translate-x-0 opacity-100"
                        }`}>
                        <FreedomChat closeChat={closeChat} switchToGuided={openGuidedChat} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatWidget;
