/* eslint-disable react-hooks/exhaustive-deps */
import { Link } from "react-router-dom";
import { RiMore2Fill } from "react-icons/ri";
import { CiUser } from "react-icons/ci";
import { IoMdClose } from "react-icons/io";
import { ModalBody, ModalContent, ModalTrigger } from "./AnimatedModal";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "../config/axios.js";
import { useModal } from "./AnimatedModal";
import Alert from './Alert.jsx';
import ChatWindow from "./ChatWindow.jsx";
import { FaUserCircle } from "react-icons/fa";
import { HiMiniUserGroup } from "react-icons/hi2";
import { disconnectSocket, initializeSocket } from "../config/socket.js";
import { setChats, setLoading } from "../context/slices/chats/index.js";

const ChatList = () => {
    // state management
    const [chats, setChat] = useState([]); // List of chats (projects)
    const [isLoading, setIsLoading] = useState(false); // Loading state
    const [error, setError] = useState(null); // Error state
    const [newProjectName, setNewProjectName] = useState(""); // Input for new project name
    const [isOpen, setIsOpen] = useState(false); // Modal open state
    const [pid, setPid] = useState(""); // Selected project ID for actions
    const [alert, setAlert] = useState(null); // Alert message
    const [selectedUsers, setSelectedUsers] = useState([]); // Selected users for adding to a project
    const [allUsers, setAllUsers] = useState([]); // List of all users for adding collaborators
    const [isOverlayOpen, setIsOverlayOpen] = useState(false); // Overlay toggle state
    const [selectedChat, setSelectedChat] = useState(null); // Currently selected chat/project
    const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Toggle for profile dropdown

    // redux or hooks
    const { setOpen } = useModal();
    const { user } = useSelector((state) => state.user); // User information from Redux store
    const dispatch = useDispatch(); // Redux dispatch function
    // localStorage
    const token = localStorage.getItem("token"); // Token from localStorage
    // Function to show alerts
    const showAlert = (message, type) => {
        setAlert({ message, type });
    };

    // Toggle dropdown visibility
    const handleDropdownToggle = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    // Toggle overlay visibility
    const handleOverlayToggle = () => {
        setIsOverlayOpen(!isOverlayOpen);
    };

    // Close chat window and disconnect socket
    const handleCloseChat = () => {
        setSelectedChat(null); // Deselect chat
        handleOverlayToggle();
        disconnectSocket();
    };

    // Close modal and reset state
    const handleClose = () => {
        setIsOpen(false);
        setSelectedUsers([]);
        setPid("");
    };

    // Add selected users to a project
    const handleUserSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await axios.put(
                "/project/addUser",
                { id: selectedUsers, pid },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            const res = await response.data;
            showAlert(res.message, 'success');
            handleClose();
        } catch (err) {
            setError(err.response?.data?.data?.message || "Something went wrong");
            showAlert(error, "error");
        } finally {
            setIsLoading(false);
            setTimeout(() => {
                setError(null);
            }, 5000);
        }
    };

    // Select or deselect a user for collaboration
    const selectUsers = (id) => {
        setSelectedUsers((prevSelectedUsers) => {
            const updatedUsers = new Set(prevSelectedUsers);
            if (updatedUsers.has(id)) {
                updatedUsers.delete(id);
            } else {
                updatedUsers.add(id);
            }
            return Array.from(updatedUsers);
        });
    };

    // Create a new project
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
            setChat((prev) => [...prev, response.data.data]);
            setOpen(false);
            setNewProjectName("");
            showAlert(res.message, "success");
        } catch (err) {
            setError(err.response?.data?.message || "Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    // Delete a project
    const handleDelete = async (id) => {
        setError(null);
        try {
            const response = await axios.delete(`/project/delete/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const res = await response.data;
            showAlert(res.message, 'success');
            setChat((prev) => prev.filter((chat) => chat._id !== id));
            setSelectedChat(null);
        } catch (err) {
            setError(err.response?.data?.message || "Something went wrong");
        }
    };

    // Fetch all projects
    const fetchProjects = async () => {
        setError(null);
        setIsLoading(true);
        try {
            const response = await axios.get("/project/all", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setChat(response.data.data || []);
        } catch (err) {
            setError(err.response?.data?.message || "Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch all users
    const fetchUsers = async () => {
        setError(null);
        setIsLoading(true);
        try {
            const response = await axios.get("/auth/all", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setAllUsers(response.data.data || []);
        } catch (err) {
            setError(err.response?.data?.message || "Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch chat details for a specific project
    const fetchChat = async (id) => {
        dispatch(setLoading({ isLoading: true })); // Set loading state
        try {
            const response = await axios.get(`/chat/get/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const res = await response.data;
            dispatch(setChats(res.data));
        } catch (err) {
            showAlert(err.response?.data?.message || "Something went wrong", 'error');
        }

    };

    // Fetch projects and users when the component mounts
    useEffect(() => {
        if (token) {
            fetchProjects();
            fetchUsers();
        }
    }, [token]);

    return (
        <div className="h-full w-full flex flex-col sm:flex-row">
            {/* Sidebar: Project List */}
            <div className={`${selectedChat ? "hidden sm:flex" : "flex"} flex-col md:w-1/4 sm:w-1/3 w-full bg-gray-800 p-4 h-full`}>
                {/* Back Link */}
                <Link to="/" className="mb-4 w-fit flex items-center text-gray-300 hover:text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9.707 4.293a1 1 0 010 1.414L5.414 10l4.293 4.293a1 1 0 01-1.414 1.414l-5-5a1 1 0 010-1.414l5-5a1 1 0 011.414 0z" clipRule="evenodd" />
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
                            <li key={chat._id} className="p-4 mb-2 rounded-lg bg-gray-700 flex items-center justify-between cursor-pointer" onClick={() => {
                                setSelectedChat(chat);
                                isOverlayOpen ? handleOverlayToggle() : '';
                                initializeSocket(chat._id);
                                fetchChat(chat._id);
                            }}>
                                <Link to="#" className="w-full">
                                    <p className="font-bold text-lg text-white">{chat.projectName}</p>
                                    <p className="flex items-center gap-2 text-sm text-gray-400">
                                        <CiUser /> Collaborators: {chat.users.length}
                                    </p>
                                </Link>
                            </li>
                        ))}
                    </ul>
                )}
                <ModalTrigger className="bg-gray-700 text-white flex justify-center hover:bg-gray-600 cursor-pointer mt-4">
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
                                        <input onChange={(e) => setNewProjectName(e.target.value)} value={newProjectName} type="text" placeholder="Enter your project name" className="w-full px-4 py-3 text-white placeholder-gray-400 bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                                    </div>
                                    <div className="relative mb-4 opacity-80">
                                        <input value={user._id} type="text" disabled className="w-full cursor-not-allowed px-4 py-3 text-white placeholder-gray-400 bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                                    </div>
                                    <button type="submit" disabled={isLoading} className={`w-full px-4 py-3 font-semibold text-white rounded-lg focus:outline-none focus:ring-4 ${isLoading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"}`}>
                                        {isLoading ? "Processing..." : "Start Chat"}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </ModalContent>
                </ModalBody>
                {alert && (
                    <Alert message={alert.message} type={alert.type} onClose={() => setAlert(null)} />
                )}
            </div>

            {/* Main Content: Chat Window */}
            <div className={`${selectedChat ? "flex" : "hidden sm:flex"} flex-1 flex-col bg-gray-200 h-full`}>
                {selectedChat ? (
                    <div className="flex flex-col h-full">
                        {/* Sticky Header */}
                        <div className="flex items-center bg-blue-500 text-white px-4 sticky z-[3] top-20 w-full">
                            <button className="mr-4" onClick={handleCloseChat}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M9.707 4.293a1 1 0 010 1.414L5.414 10l4.293 4.293a1 1 0 01-1.414 1.414l-5-5a1 1 0 010-1.414l5-5a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                            </button>
                            <h2 className="text-lg w-full p-4 h-full font-semibold" onClick={handleOverlayToggle}>{selectedChat.projectName}</h2>
                            <div className="relative ml-auto">
                                <button onClick={handleDropdownToggle} className="focus:outline-none bg-blue-500 p-2 rounded-full">
                                    <RiMore2Fill scale={2} />
                                </button>
                                {isDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-lg shadow-lg overflow-hidden">
                                        <button className="block px-4 py-2 w-full text-left hover:bg-blue-200 hover:text-blue-500 font-semibold" onClick={() => {
                                            setIsOpen(true);
                                            setPid(selectedChat._id);
                                        }}>Add Collaborator</button>
                                        <button className="block px-4 py-2 w-full text-left hover:bg-red-200 hover:text-red-500 font-semibold" onClick={() => handleDelete(selectedChat._id)}>Delete Project</button>
                                    </div>
                                )}
                            </div>

                            {isOpen && (
                                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" role="dialog" aria-modal="true" aria-labelledby="modal-title">
                                    <div className="bg-gray-700 rounded-lg shadow-lg w-full max-w-md p-6">
                                        <div className="flex justify-between items-center mb-4">
                                            <h2 id="modal-title" className="text-xl font-semibold">Add Collaborators</h2>
                                            <button onClick={handleClose} aria-label="Close modal" className="text-white hover:text-gray-400">
                                                <IoMdClose />
                                            </button>
                                        </div>
                                        <form onSubmit={handleUserSubmit}>
                                            <div className="relative mb-4 max-h-96 overflow-y-auto">
                                                {allUsers.map((user, index) => (
                                                    <div key={index} className={`w-full mb-2 px-4 py-3 text-white placeholder-gray-400 bg-gray-800 ${selectedUsers.indexOf(user._id) != -1 ? 'bg-gray-600' : ''} hover:bg-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`} onClick={() => selectUsers(user._id)}>
                                                        <p className="w-full flex items-center gap-2"><FaUserCircle className="text-4xl text-gray-300 mr-2" />{user.fullName}</p>
                                                    </div>
                                                ))}
                                            </div>
                                            <button type="submit" disabled={isLoading} className={`w-full px-4 py-3 font-semibold text-white rounded-lg focus:outline-none focus:ring-4 ${isLoading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"}`}>
                                                {isLoading ? "Processing..." : "Add"}
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="flex-grow relative w-full">
                            <div className={`h-full w-full p-5 bg-gray-700 absolute flex items-center justify-center transition-all z-[1] duration-500 ${isOverlayOpen ? 'translate-y-0' : '-translate-y-full '}`}>
                                <div className="max-w-md w-full flex flex-nowrap flex-col items-center justify-around p-3 h-full ">
                                    <div className="flex items-center justify-center w-full flex-col gap-5 flex-nowrap max-h-40 h-fit">
                                        <div className=" rounded-full flex items-center justify-center overflow-hidden p-3 bg-gray-500">
                                            <HiMiniUserGroup className="h-10 w-10" />
                                        </div>
                                        <h2 className="flex items-center justify-center w-full text-center mb-2 text-4xl">
                                            {selectedChat.projectName}
                                        </h2>
                                    </div>
                                    <div className="relative max-w-xs w-full rounded-xl p-5 shadow-neumorph">
                                        <h2 className="w-full text-center mb-2 text-2xl">Collaborators</h2>
                                        <div className="flex flex-nowrap max-h-96 gap-3 flex-col overflow-y-auto">
                                            {selectedChat.users.map((user, index) => (
                                                <div key={index} className={`w-full  px-4 py-3 text-white bg-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}>
                                                    <p className="w-full flex items-center gap-2"><FaUserCircle className="text-4xl text-gray-300 mr-2" />{user.fullName}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="h-full"> <ChatWindow project={selectedChat} /></div>
                        </div>
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
