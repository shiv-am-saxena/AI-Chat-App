/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { IoSend } from "react-icons/io5";
import { recieveMessage, sendMessages } from "../config/socket";
import { useDispatch, useSelector } from "react-redux";
import { setError, addChat } from "../context/slices/chats";
import Alert from "./Alert";

const ChatWindow = ({ project }) => {
    const user = useSelector(state => state.user.user);
    const { isLoading, error, chats } = useSelector(state => state.chats);
    const dispatch = useDispatch();
    const [newMessage, setNewMessage] = useState("");
    const [alert, setAlert] = useState(null);
    const token = localStorage.getItem('token');

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
    useEffect(() => {
        if (token) {
            recieveMessage('project-message', (data) => {
                dispatch(addChat(data));
            })
        }
        if(error){
            showAlert(error, 'error');
            setTimeout(() => {
                dispatch(setError(null));
            }, 5000);
        }
    },[])
    return (
        isLoading ? (
            <div className="flex items-center justify-center h-full" >
                <h1>Loading...</h1>
            </div >
        ) : (
            <div className="flex flex-col h-full relative">

                {/* Messages */}
                <div className="max-h-[100%] h-full relative overflow-y-auto p-4 space-y-4 bg-white">
                    {chats.map((msg) => (
                        <div
                            key={msg.id}
                            className={`flex ${msg.sender === user._id ? "justify-end" : "justify-start"}`}
                        >
                            <div
                                className={`p-3 rounded-lg max-w-60 sm:max-w-[60%] ${msg.sender === user._id
                                    ? "bg-blue-500 text-white"
                                    : "bg-gray-200 text-black"
                                    }`}
                            >
                                <p className="text-xs opacity-60">{msg.email}</p>
                                <p className="text-sm">{msg.message}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Input Field */}
                <div className="p-4 relative bg-gray-200 shadow-lg">
                    <form onSubmit={send} className="sticky bottom-0 flex gap-2 items-center">
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
                    </form>
                </div>
                {alert && (
                    <Alert
                        message={alert.message}
                        type={alert.type}
                        onClose={() => setAlert(null)}
                    />
                )}
            </div>)
    );
};

export default ChatWindow;
