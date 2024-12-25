import { useState } from "react";

const ChatWindow = () => {
    const [messages, setMessages] = useState([
        { id: 1, sender: "John Doe", text: "Hello!" },
        { id: 2, sender: "Me", text: "Hi! How are you?" },
    ]);
    const [newMessage, setNewMessage] = useState("");

    const sendMessage = () => {
        if (newMessage.trim()) {
            setMessages([...messages, { id: Date.now(), sender: "Me", text: newMessage }]);
            setNewMessage("");
        }
    };

    const handleBack = () => {
        console.log("Back button clicked");
    };

    return (
        <div className="flex flex-col h-full">
            {/* Header with Back Button (Visible on Mobile Only) */}
            <div className="p-4 bg-blue-500 text-white flex items-center">
                <button onClick={handleBack} className="flex items-center mr-4">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                        <path
                            fillRule="evenodd"
                            d="M9.707 4.293a1 1 0 010 1.414L5.414 10l4.293 4.293a1 1 0 01-1.414 1.414l-5-5a1 1 0 010-1.414l5-5a1 1 0 011.414 0z"
                            clipRule="evenodd"
                        />
                    </svg>
                </button>
                <h2 className="text-lg font-semibold">Chat</h2>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`flex ${msg.sender === "Me" ? "justify-end" : "justify-start"
                            }`}
                    >
                        <div
                            className={`p-3 rounded-lg max-w-xs ${msg.sender === "Me"
                                    ? "bg-blue-500 text-white"
                                    : "bg-gray-200 text-black"
                                }`}
                        >
                            <p className="text-sm">{msg.text}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Input Field */}
            <div className="p-4 bg-gray-200">
                <div className="flex items-center">
                    <input
                        type="text"
                        placeholder="Type your message..."
                        className="flex-1 p-2 rounded-lg border text-black border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                    />
                    <button
                        className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                        onClick={sendMessage}
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatWindow;
