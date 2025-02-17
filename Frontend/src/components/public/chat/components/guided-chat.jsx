import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import PropTypes from "prop-types";
import { Send, Bot } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import * as API from "@/api";

const questions = {
    start: {
        text: "Hello! 😊 What would you like to know about?",
        options: [
            { text: "🌿 Our mental health services", next: "services" },
            { text: "🏥 How to book a consultation", next: "booking" },
            { text: "📢 News & updates", next: "news" },
            { text: "📨 Subscribe to our newsletter", next: "subscribe" },
        ],
    },
    services: {
        text: "We offer professional mental health counseling, therapy sessions, and fitness programs. Would you like to see more details?",
        options: [
            { text: "Yes, show me more!", next: "more_services" },
            { text: "Go back", next: "start" },
        ],
    },
    more_services: {
        text: "Here’s a link to our Services page: [Visit Services](#).",
        options: [{ text: "Back to menu", next: "start" }],
    },
    booking: {
        text: "To book a consultation, visit our Booking page: [Book Now](#).",
        options: [{ text: "Back to menu", next: "start" }],
    },
    news: {
        text: "Check out our latest mental health articles and updates: [Latest News](#).",
        options: [{ text: "Back to menu", next: "start" }],
    },
    subscribe: {
        text: "Please enter your email to receive our newsletter:",
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
            await API.sendEmail({
                email: userInput,
                subject: "Subscribed to newsletter",
                content: "Thank you for subscribing to our newsletter!",
            });

            setChatHistory((prev) => [
                ...prev,
                { from: "user", text: userInput },
                { from: "bot", text: "Thank you! You are now subscribed." },
            ]);

            setIsEmailInputEnabled(false);
            setUserInput("");
        } catch (error) {
            console.error("Failed to send email:", error);
            setChatHistory((prev) => [
                ...prev,
                { from: "bot", text: "Oops! Something went wrong. Please try again later." },
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
                    <p className="font-medium">Customer Support</p>
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
                        placeholder={!isEmailInputEnabled ? "Guided mode, cannot chat" : "Enter your email..."}
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
