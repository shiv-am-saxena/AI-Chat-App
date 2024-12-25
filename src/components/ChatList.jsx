import { Link, useNavigate } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import {
    Modal,
    ModalBody,
    ModalContent,
    ModalTrigger,
} from "./AnimatedModal";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from '../config/axios.js';
import { MdDelete } from "react-icons/md";
const ChatList = () => {
    const [chats, setChat] = useState([])
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.user);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [name, setName] = useState('');
    const [uid, setUid] = useState(user._id);
    const token = localStorage.getItem('token');
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await axios.post('/project/create', { name, userId: uid }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const res = await response.data;
            navigate(`/project/${res.data._id}`);
        } catch (err) {
            setError(err.response?.data?.message || "Something went wrong");
        } finally {
            setIsLoading(false);
        }
    }
    const handleDelete = async (id) => {
        try {
            await axios.delete(`/project/delete/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            location.reload();
        } catch (err) {
            setError(err.response?.data?.message || "Something went wrong");
        }
    }
    useEffect(() => {
        const fetchProjects = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get('/project/all', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const res = await response.data;
                if (res.data.length === 0) {
                    const obj = [{
                        _id: '#',
                        projectName: `You don't have any project to list.`
                    }]
                    setChat(obj);
                } else {
                    setChat(res.data)
                }
            } catch (err) {
                setError(err.response?.data?.message || "Something went wrong");
            } finally {
                setIsLoading(false);
            }
        }
        fetchProjects();
    }, [token]);
    return (
        <div className="p-4 h-full flex flex-col">
            {/* Back Button */}
            <Link
                to={'/'}
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

            {/* Chats List */}
            <h2 className="text-xl font-semibold mb-4 hidden sm:block">Projects</h2>
            {isLoading ? (<div className="flex h-[calc(100vh-136px)] w-full items-center justify-center"><h1>Loading...</h1></div>) :
                (<ul className="flex-1 overflow-y-auto">
                    {chats.map((chat, index) => (
                        <li
                            key={index}
                        >
                            <p className="p-4 mb-2 rounded-lg bg-gray-700 flex items-center justify-between hover:bg-gray-600 cursor-pointer "><Link to={'#'}
                                className="font-bold w-full">{chat.projectName}</Link> <button className="bg-gray-800 p-2 rounded-full z-50" onClick={() => { handleDelete(chat._id) }}><MdDelete /></button></p>
                        </li>
                    ))}
                    <div className="p-4 mb-2 rounded-lg flex items-center justify-center">
                        <Modal>
                            <ModalTrigger
                                className="bg-gray-700 text-white flex justify-center hover:bg-gray-600 cursor-pointer group/modal-btn">
                                <span
                                    className="group-hover/modal-btn:translate-x-40 text-center transition duration-500">
                                    New Chat
                                </span>
                                <div
                                    className="-translate-x-40 group-hover/modal-btn:translate-x-0 flex items-center justify-center absolute inset-0 transition duration-500 text-white z-20">
                                    <div className="bg-gray-700 p-2 rounded-full text-white">
                                        <FaPlus color="#d1d5db" />
                                    </div>
                                </div>
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
                                            <form onSubmit={handleSubmit}>
                                                <div className="relative mb-4">
                                                    <input
                                                        onChange={(e) => setName(e.target.value)}
                                                        value={name}
                                                        type="text"
                                                        placeholder="Enter your project name"
                                                        className="w-full px-4 py-3 text-white placeholder-gray-400 bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        required
                                                    />
                                                </div>
                                                <div className="relative mb-4 opacity-80">
                                                    <input
                                                        onChange={(e) => setUid(e.target.value)}
                                                        value={uid}
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
                                                        }`}>
                                                    {isLoading ? "Processing..." : "Start Chat"}
                                                </button>
                                            </form>
                                        </div>
                                    </div>
                                </ModalContent>
                            </ModalBody>
                        </Modal>
                    </div>
                </ul>)}
        </div>
    );
};

export default ChatList;
