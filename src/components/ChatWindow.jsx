/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useEffect, useState, useLayoutEffect, useRef } from "react";
import { IoSend } from "react-icons/io5";
import { receiveMessage, sendMessages } from "../config/socket";
import { useDispatch, useSelector } from "react-redux";
import { setError, addChat } from "../context/slices/chats";
import Alert from "./Alert";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github.css"; // Optional for syntax highlighting
const ChatWindow = ({ project }) => {
    const user = useSelector(state => state.user.user);
    const { isLoading, error, chats } = useSelector(state => state.chats);
    const dispatch = useDispatch();
    const [newMessage, setNewMessage] = useState("");
    const [alert, setAlert] = useState(null);
    const token = localStorage.getItem('token');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // Scroll to bottom when chats are updated
    useLayoutEffect(() => {
        if (!isLoading) {
            scrollToBottom();
        }
    }, [chats, isLoading]);  // Ensures it scrolls whenever the 'chats' state changes

    const showAlert = (message, type) => {
        setAlert({ message, type });
    };

    const send = (e) => {
        e.preventDefault();
        if (newMessage.trim()) {
            sendMessages('project-message', {
                message: newMessage,
                sender: user._id
            })
            dispatch(addChat({
                message: newMessage,
                sender: user._id,
                email: user.email
            }))
        }
        setNewMessage('');
    };

    const formatResponse = (response) => {
        const markdownTag = '```';
        const isMarkdown = response.includes(markdownTag);

        if (isMarkdown) {
            const parts = response.split(markdownTag).map((part, index) => {
                if (index % 2 === 1) {
                    return <ReactMarkdown className="prose prose-invert max-w-none bg-gray-900 text-gray-200 py-2 px-3 rounded-lg" key={index} remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>{part}</ReactMarkdown>;
                } else {
                    return <p key={index} className="text-sm">{part}</p>;
                }
            });
            return parts;
        } else {
            return <p className="text-sm">{response.trim()}</p>;
        }
    };


    useEffect(() => {
        if (token) {
            receiveMessage('project-message', (data) => {
                dispatch(addChat(data));
            });
        }
        if (error) {
            showAlert(error, 'error');
            setTimeout(() => {
                dispatch(setError(null));
            }, 5000);
        }
    }, [dispatch, token, error]);

    return (
        isLoading ? (
            <div className="flex items-center justify-center h-full">
                <h1>Loading...</h1>
            </div>
        ) : (
            <div className="relative h-full w-full z-[0]">

                {/* Messages */}
                <div className="h-[75vh] md:h-[76vh] relative overflow-y-auto p-4 space-y-4 bg-white">
                    {chats.map((msg, index) => (
                        <div
                            key={index}
                            className={`flex ${msg.sender === user._id ? "justify-end" : "justify-start"}`}
                        >
                            <div
                                className={`p-3 message-response rounded-lg max-w-60 sm:max-w-[60%] ${msg.sender === user._id
                                    ? "bg-blue-500 text-white"
                                    : "bg-gray-200 text-black"
                                    }`}
                            >
                                <p className="text-xs opacity-60">{msg.email}</p>
                                {formatResponse(msg.message)}
                            </div>
                        </div>
                    ))}

                    <div ref={messagesEndRef} />
                </div>

                {/* Input Field */}
                <div className="h-20 p-4 bg-gray-200">
                    <div className="flex gap-2 items-center h-full">
                        <input
                            type="text"
                            placeholder="Type your message..."
                            className="flex-1 p-2 rounded-lg border text-black border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                        />
                        <button
                            className="px-2 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                            onClick={send}
                        >
                            <IoSend />
                        </button>
                    </div>
                </div>

                {alert && (
                    <Alert
                        message={alert.message}
                        type={alert.type}
                        onClose={() => setAlert(null)}
                    />
                )}
            </div>
        )
    );
};

export default ChatWindow;
