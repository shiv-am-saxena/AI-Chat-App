/* eslint-disable react-hooks/exhaustive-deps */
import { Link } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import { CiUser } from "react-icons/ci";
import { IoMdClose } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import { ModalBody, ModalContent, ModalTrigger } from "./AnimatedModal";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "../config/axios.js";
import { useModal } from "./AnimatedModal";
import Alert from './Alert.jsx';
import ChatWindow from "./ChatWindow.jsx";
const ChatList = () => {
    const { setOpen } = useModal();
    const [chats, setChats] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [newProjectName, setNewProjectName] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [email, setEmail] = useState("");
    const [pid, setPid] = useState("");
    const { user } = useSelector((state) => state.user);
    const token = localStorage.getItem("token");
    const [alert, setAlert] = useState(null);
    const [selectedChat, setSelectedChat] = useState(null); // To manage selected chat
    const showAlert = (message, type) => {
        setAlert({ message, type });
    };

    const handleCloseChat = () => {
        setSelectedChat(null); // Deselect chat
    };

    const handleClose = () => {
        setIsOpen(false);
        setEmail("");
        setPid("");
    };

    const handleUserSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await axios.put(
                "/project/addUser",
                { email, pid },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            const res = await response.data;
            showAlert(res.message, 'success');
            handleClose();
        } catch (err) {
            setError(err.response?.data?.message || "Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateProject = async (e) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);
        try {
            const response = await axios.post(
                "/project/create",
                { name: newProjectName, userId: user._id },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            const res = await response.data;
            setChats((prev) => [...prev, response.data.data]);
            setOpen(false);
            setNewProjectName("");
            showAlert(res.message, "success");
        } catch (err) {
            setError(err.response?.data?.message || "Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id) => {
        setError(null);
        try {
            const response = await axios.delete(`/project/delete/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const res = await response.data;
            showAlert(res.message, 'success');
            setChats((prev) => prev.filter((chat) => chat._id !== id));
        } catch (err) {
            setError(err.response?.data?.message || "Something went wrong");
        }
    };

    const fetchProjects = async () => {
        setError(null);
        setIsLoading(true);
        try {
            const response = await axios.get("/project/all", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setChats(response.data.data || []);
        } catch (err) {
            setError(err.response?.data?.message || "Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (token) fetchProjects();
    }, [token]);

    return (
        <div className="h-full w-full flex">
            {/* Sidebar: Project List */}
            <div
                className={`${selectedChat ? "hidden sm:flex" : "flex"
                    } flex-col xl:w-1/4 lg:w-1/3 sm:w-1/2 w-full bg-gray-800 p-4`}
            >
                <Link
                    to="/"
                    className="mb-4 w-fit flex items-center text-gray-300 hover:text-white"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                        <path
                            fillRule="evenodd"
                            d="M9.707 4.293a1 1 0 010 1.414L5.414 10l4.293 4.293a1 1 0 01-1.414 1.414l-5-5a1 1 0 010-1.414l5-5a1 1 0 011.414 0z"
                            clipRule="evenodd"
                        />
                    </svg>
                    Back
                </Link>

                <h2 className="text-xl font-semibold mb-4 block">Projects</h2>
                {isLoading ? (
                    <div className="flex items-center justify-center h-full">
                        <h1>Loading...</h1>
                    </div>
                ) : (
                    <ul className="flex-1 w-full overflow-y-auto">
                        {chats.map((chat) => (
                            <li
                                key={chat._id}
                                className="p-4 mb-2 rounded-lg bg-gray-700 flex items-center justify-between cursor-pointer"
                                onClick={() => setSelectedChat(chat)} // Set the selected chat
                            >
                                <Link to="#" className="w-full">
                                    <p className="font-bold text-lg text-white">{chat.projectName}</p>
                                    <p className="flex items-center gap-2 text-sm text-gray-400">
                                        <CiUser /> Collaborators: {chat.users.length}
                                    </p>
                                </Link>
                                <div className="flex items-center mt-2 sm:mt-0">
                                    <button
                                        className="bg-gray-800 p-2 mr-1 rounded-full"
                                        onClick={() => {
                                            setIsOpen(true);
                                            setPid(chat._id);
                                        }}
                                    >
                                        <FaPlus />
                                    </button>
                                    <button
                                        className="bg-gray-800 p-2 ml-1 rounded-full"
                                        onClick={() => handleDelete(chat._id)}
                                    >
                                        <MdDelete />
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
                {isOpen && (
                    <div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="modal-title"
                    >
                        <div className="bg-gray-700 rounded-lg shadow-lg w-full max-w-md p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 id="modal-title" className="text-xl font-semibold">
                                    Add User
                                </h2>
                                <button
                                    onClick={handleClose}
                                    aria-label="Close modal"
                                    className="text-white hover:text-gray-400"
                                >
                                    <IoMdClose />
                                </button>
                            </div>
                            {error && (
                                <div className="mb-4 w-full bg-red-700/20 py-3 rounded-lg border border-red-500 text-sm text-center text-red-500">
                                    {error}
                                </div>
                            )}
                            <form onSubmit={handleUserSubmit}>
                                <div className="relative mb-4">
                                    <input
                                        onChange={(e) => setEmail(e.target.value)}
                                        value={email}
                                        type="email"
                                        placeholder="Enter your e-mail"
                                        className="w-full px-4 py-3 text-white placeholder-gray-400 bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                                <div className="relative mb-4 opacity-80">
                                    <input
                                        value={pid}
                                        type="text"
                                        disabled
                                        className="w-full cursor-not-allowed px-4 py-3 text-white placeholder-gray-400 bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className={`w-full px-4 py-3 font-semibold text-white rounded-lg focus:outline-none focus:ring-4 ${isLoading
                                        ? "bg-blue-400 cursor-not-allowed"
                                        : "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
                                        }`}
                                >
                                    {isLoading ? "Processing..." : "Add"}
                                </button>
                            </form>
                        </div>
                    </div>
                )}
                {/* New Project Modal Trigger */}
                <ModalTrigger className="bg-gray-700 text-white flex justify-center hover:bg-gray-600 cursor-pointer">
                    <span>New Project</span>
                </ModalTrigger>
                <ModalBody>
                    <ModalContent>
                        <div className="flex justify-center items-center">
                            <div className="w-full m-auto max-w-md p-8 bg-gray-700 rounded-lg shadow-lg">
                                <h2 className="mb-6 text-3xl font-extrabold text-center text-white">Create New Project</h2>
                                {error && (
                                    <div className="mb-4 w-full bg-red-700/20 py-3 rounded-lg border border-red-500 text-sm text-center text-red-500">
                                        {error}
                                    </div>
                                )}
                                <form onSubmit={handleCreateProject}>
                                    <div className="relative mb-4">
                                        <input
                                            onChange={(e) => setNewProjectName(e.target.value)}
                                            value={newProjectName}
                                            type="text"
                                            placeholder="Enter your project name"
                                            className="w-full px-4 py-3 text-white placeholder-gray-400 bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                    <div className="relative mb-4 opacity-80">
                                        <input
                                            value={user._id}
                                            type="text"
                                            disabled
                                            className="w-full cursor-not-allowed px-4 py-3 text-white placeholder-gray-400 bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className={`w-full px-4 py-3 font-semibold text-white rounded-lg focus:outline-none focus:ring-4 ${isLoading
                                            ? "bg-blue-400 cursor-not-allowed"
                                            : "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
                                            }`}
                                    >
                                        {isLoading ? "Processing..." : "Start Chat"}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </ModalContent>
                </ModalBody>
                {alert && (
                    <Alert
                        message={alert.message}
                        type={alert.type}
                        onClose={() => setAlert(null)}
                    />
                )}
            </div>

            {/* Main Content: Chat Window */}
            <div
                className={`${selectedChat ? "flex" : "hidden sm:flex"
                    } flex-1 flex-col bg-gray-100`}
            >
                {selectedChat ? (
                    <div className="flex flex-col h-full">
                        {/* Sticky Header */}
                        <div className="flex items-center bg-blue-500 text-white p-4 sticky top-20 z-10">
                            <button
                                className="mr-4"
                                onClick={handleCloseChat}
                            >
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
                            <h2 className="text-lg font-semibold">{selectedChat.projectName}</h2>
                        </div>
                        <ChatWindow project={selectedChat} />
                    </div>
                ) : (
                    <div className="h-full flex items-center justify-center">
                        <h2 className="text-xl text-gray-500 px-10 text-center">
                            Select a project to start chatting
                        </h2>
                    </div>
                )}
            </div>

        </div>
    );
};

export default ChatList;
