/* eslint-disable react/prop-types */
import { useState } from "react";
import { IoSend } from "react-icons/io5";

const ChatWindow = ({ project }) => {
    const [messages, setMessages] = useState([
        { id: 1, sender: "John Doe", text: `Welcome to ${project.projectName} chat!` },
    ]);
    const [newMessage, setNewMessage] = useState("");

    const sendMessage = () => {
        if (newMessage.trim()) {
            setMessages([...messages, { id: Date.now(), sender: "Me", text: newMessage }]);
            setNewMessage("");
        }
    };

    return (
        <div className="flex flex-col h-full">

            {/* Messages */}
            <div className="flex-1 flex-grow overflow-y-auto p-4 space-y-4 bg-white">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`flex ${msg.sender === "Me" ? "justify-end" : "justify-start"}`}
                    >
                        <div
                            className={`p-3 rounded-lg max-w-60 sm:max-w-[60%] ${msg.sender === "Me"
                                ? "bg-blue-500 text-white"
                                : "bg-gray-200 text-black"
                                }`}
                        >
                            <p className="text-xs opacity-60">{msg.sender}</p>
                            <p className="text-sm">{msg.text}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Input Field */}
            <div className="p-4 relative bg-gray-200 shadow-lg">
                <div className="sticky bottom-0 flex gap-2 items-center">
                    <input
                        type="text"
                        placeholder="Type your message..."
                        className="flex-1 p-2 rounded-lg border text-black border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                    />
                    <button
                        className="px-2 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                        onClick={sendMessage}
                    >
                        <IoSend/>
                    </button>
                </div>
            </div>

        </div>
    );
};

export default ChatWindow;
