import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import PropTypes from "prop-types";
import { Send, MessageCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import * as API from "@/api";

const predefine =
    "You are a healthcare chatbot specializing in mental health. If a question is unrelated, kindly inform the user and request a different topic. Now, answer this:";

const FreedomChat = ({ closeChat, switchToGuided }) => {
    const [chatHistory, setChatHistory] = useState([{ from: "bot", text: "Hello! 😊 Feel free to ask me anything!" }]);
    const [userInput, setUserInput] = useState("");
    const [loading, setLoading] = useState(false);

    const handleUserInput = async () => {
        if (userInput.trim() === "") return;

        const userMessage = { from: "user", text: userInput };
        setChatHistory((prev) => [...prev, userMessage]);
        setUserInput("");
        setLoading(true);

        try {
            const response = await API.botResponse({ userMessage: predefine + userInput });
            console.log("API Response:", response); // Debugging log
            const botMessage = { from: "bot", text: response.data.aiMessage };

            setChatHistory((prev) => [...prev, botMessage]);
        } catch (error) {
            console.error("Error fetching bot response:", error);
            setChatHistory((prev) => [
                ...prev,
                { from: "bot", text: "Oops! Something went wrong. Please try again. 🤖" },
            ]);
        } finally {
            setLoading(false);
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
                    <p className="font-medium">Assistant Chat Bot</p>
                </div>
                <Button variant="ghost" className="bg-inherit text-white rounded-full p-2 h-8 w-8" onClick={closeChat}>
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
                        </div>
                    ))}
                </div>

                <div className="mt-4 flex items-center space-x-2">
                    <Button variant="ghost" size="icon" className="text-gray-500 bg-[#3b82f6]" onClick={switchToGuided}>
                        <MessageCircle className="h-5 w-5 text-white hover:text-[#3b82f6]" />
                    </Button>
                    <Input
                        placeholder="Type a message..."
                        className="flex-1"
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        disabled={loading}
                    />
                    <Button className="bg-blue-500 hover:bg-blue-600" onClick={handleUserInput} disabled={loading}>
                        {loading ? "..." : <Send className="h-4 w-4 text-white" />}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

FreedomChat.propTypes = {
    closeChat: PropTypes.func.isRequired,
    switchToGuided: PropTypes.func.isRequired,
};

export default FreedomChat;
