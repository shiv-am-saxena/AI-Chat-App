import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { GoArrowLeft } from 'react-icons/go'
import { CiMenuKebab } from "react-icons/ci";
import { useDispatch, useSelector } from 'react-redux';
import axios from '../config/axios';
import { addChat, chatError, chatLoading, removeChats, setChats } from '../context/slices/chats';
// eslint-disable-next-line no-unused-vars
import { motion } from 'motion/react';
import { disconnectSocket, receiveMessage, sendMessages } from '../config/socket';
import { IoMdClose } from 'react-icons/io';

export default function ChatSheet({ setIsOpen, chatId, open }) {
    const [message, setMessage] = useState(''); // State to hold the current message input
    const { user, token } = useSelector(state => state.user); // Get user and token from Redux store
    const [openChatOverlay, setOpenChatOverlay] = useState(false); // State to manage overlay visibility
    const dispatch = useDispatch();
    const [chat, setChat] = useState([]); // State to hold chat messages
    // Ref for the input field to handle 'Enter' key press
    const input = useRef(null);
    useLayoutEffect(() => {
        // Logic to fetch chat history based on chatId
        const fetchChatHistory = async () => {
            dispatch(chatLoading());
            try {
                const response = await axios.get(`/chat/get/${chatId._id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const res = await response.data;
                setChat(res.data);
                dispatch(setChats(res.data))
                console.log("Chat history:", res);
            } catch (err) {
                dispatch(chatError("Error fetching chat history:", err));
            }
        }
        if (chatId) {
            fetchChatHistory();
        }
    }, [chatId, token, dispatch, open]); // Re-run when chatId, token or ChatSection visibility changes

    // Function to send a message
    const send = useCallback(() => {
        if (message) {
            sendMessages('project-message', {
                message: message,
                sender: user._id
            })
            dispatch(addChat({
                message: message,
                sender: user._id,
                email: user.email
            }))
            setChat(prevChat => [...prevChat, {
                message: message,
                sender: user._id,
                email: user.email
            }]);
        }
        setMessage('');
    }, [message, user, dispatch]);

    useEffect(() => {
        if (input.current) {
            const node = input.current;
            const handleKeyDown = (e) => {
                if (e.key === 'Enter') {
                    send();
                }
            };
            node.addEventListener('keydown', handleKeyDown);
            return () => {
                node.removeEventListener('keydown', handleKeyDown);
            };
        }
    }, [send]);//re-run when send function is called

    useEffect(() => {
        if (!token || !chatId?._id) return;
        // Connect and join room
        if (window.socket && window.socket.connected) {
            window.socket.emit('join-room', { roomId: chatId._id });
        }
        // Listen for messages
        const handleReceive = (data) => {
            dispatch(addChat(data));
            setChat(prevChat => [...prevChat, data]);
        };
        receiveMessage('project-message', handleReceive);

        // Cleanup listener on unmount or chatId change
        return () => {
            if (window.socket) {
                window.socket.emit('leave-room', { roomId: chatId._id });
                window.socket.off('project-message', handleReceive);
            }
        };
    }, [token, chatId, dispatch]);
    // Function to handle socket disconnection and cleanup
    const socketDisconnect = () => {
        setIsOpen(false);
        disconnectSocket();
        dispatch(removeChats());
    }
    const messagesEndRef = useRef(null);
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };
    // Scroll to bottom when chats are updated
    useLayoutEffect(() => {
        if (!chatId) return;
        if (chat.length) {
            scrollToBottom();
        } else {
            const container = document.querySelector('.chat-screen');
            if (container) {
                container.scrollTop = 0; // Scroll to top if no messages
            }
        }
    }, [chat, chatId]);  // Ensures it scrolls whenever the 'chat' state changes
    return (
        <div className="max-h-[calc(100vh-64px)] w-full flex flex-col relative">
            <div className='min-h-16 max-h-16 z-[1] w-full border-b bg-black border-zinc-800 flex items-center justify-between pr-5'>
                <div className=' md:min-w-1/3 w-full flex items-center justift-start px-5 gap-3'>
                    <GoArrowLeft className='text-white text-xl' onClick={socketDisconnect} />
                    <h3 className='text-xl'>{chatId.projectName}</h3>
                </div>
                <CiMenuKebab className='text-xl text-white' onClick={() => setOpenChatOverlay(!openChatOverlay)} />
            </div>
            <Overlay setOpenChatOverlay={setOpenChatOverlay} openChatOverlay={openChatOverlay} chatId={chatId} />
            <div className="min-h-[calc(100%-128px)] w-full chat-screen overflow-auto">
                {/* Chat messages will go here */}
                <div className="h-full overflow-auto flex flex-col justify-start p-5">
                    {chat.map((msg, index) => (
                        <div key={index} className={`mb-4 flex ${msg.sender === user._id ? 'justify-end' : 'justify-start'}`}>
                            <div className={`p-3 rounded-lg max-w-60 sm:max-w-[60%] ${msg.sender === user._id ? 'bg-blue-500 text-white rounded-br-none' : 'bg-gray-200 text-black rounded-bl-none'}`}>
                                <h6 className={`text-xs ${msg.sender === user._id ? 'hidden' : 'block'}`}>{msg.email}</h6>
                                <p className="text-sm">{msg.message}</p>
                            </div>
                        </div>
                    ))}

                    <div ref={messagesEndRef} />
                </div>
            </div>
            <div className='min-h-16 max-h-16 px-3 w-full border-t bg-black border-zinc-800 flex items-center justify-between'>
                <input
                    type="text"
                    className="flex-1 bg-zinc-800 text-white px-4 py-2 rounded-l outline-none"
                    placeholder="Type a message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    ref={input}
                />
                <button
                    className="bg-blue-600 text-white px-4 py-2 rounded-r hover:bg-blue-700" onClick={() => send()}
                >
                    Send
                </button>
            </div>
        </div>
    )
}

const Overlay = ({ openChatOverlay, chatId }) => {
    const [addBx, setAddBx] = useState(false); // State to manage Add Member box visibility
    const DelProject = async () => {
        try {
            disconnectSocket();

            const response = await axios.delete(`/project/delete/${chatId._id}`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
            const data = await response.data;
            console.log(data);
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || "Something went wrong");
        } finally {
            window.location.reload();
        }
    }
    const LeaveProject = async () => {
        try {
            const response = await axios.put(`/project/leave`, {
                pid: chatId._id
            }, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
            const data = await response.data;
            console.log(data);
        } catch (err) {
            alert(err.response?.data?.message || "Something went wrong");
        }
        finally {
            window.location.reload();
        }
    }
    return (
        <motion.div
            initial={{ y: '-100%' }}
            animate={openChatOverlay ? { y: 0 } : { y: '-100%' }}
            exit={{ y: '-100%' }}
            // transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className={`min-h-full ${openChatOverlay ? 'absolute' : 'hidden'} z-0 min-w-full top-0 left-0 bg-black bg-opacity-50 flex items-center justify-center overflow-hidden`}>
            <div className='min-h-1/4 min-w-1/4 bg-zinc-700 rounded p-5 flex flex-col gap-3'>
                <button className='w-full text-left' onClick={() => { setAddBx(true) }}>Add Members</button>
                <button className='w-full text-left' onClick={LeaveProject}>Leave Project</button>
                <button className='w-full text-left' onClick={DelProject}>Delete Project</button>
            </div>
            <AddMember isOpen={addBx} setIsOpen={setAddBx} id={chatId._id} />
        </motion.div>
    )
}

const AddMember = ({ isOpen, setIsOpen, id }) => {
    const [addErr, setAddErr] = useState(null);// this holds the error message for adding members
    const [email, setEmail] = useState(''); // this holds the email input value
    const [loading, setLoading] = useState(false); // this holds the loading state for the add member request
    // Function to handle adding a member
    const submit = async () => {
        try {
            setLoading(true);
            const response = await axios.put(`/project/addUser`, {
                email,
                pid: id
            }, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
            const data = await response.data;
            console.log(data);
        } catch (err) {
            setAddErr(err.response?.data?.message || "Something went wrong");
        }
        finally {
            setLoading(false);
            setTimeout(() => {
                setAddErr(null);
            }, 5000);
        }
    }
    return (
        <div className={`min-h-1/4 min-w-1/4 ${isOpen ? 'absolute' : 'hidden'} bg-zinc-700 rounded p-5 flex flex-col gap-3`}>
            <div className='w-full flex items-center justify-between mb-5'>
                <h2 className='text-white text-left w-fit font-bold text-xl'>Add Members</h2>
                <button onClick={() => setIsOpen(false)}>
                    <IoMdClose className='text-white text-xl' />
                </button>
            </div>
            {addErr && <p className='text-red-500 text-center'>{addErr}</p>}
            <input type="text" className='bg-zinc-800 text-white px-4 py-2 rounded outline-none' value={email} onChange={(e) => { setEmail(e.target.value) }} placeholder='Enter email address' />
            <button className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700' disabled={loading} onClick={submit}>Add</button>
        </div>
    )
}

// --- IGNORE ---
// {/* <div className="max-h-[calc(100%-128px)] w-full chat-screen overflow-y-scroll flex flex-col justify-end p-5">
//     {/* Chat messages will go here */}
//     {chat.map((msg, index) => (
//         <div key={index} className={`mb-4 flex ${msg.sender === user._id ? 'justify-end' : 'justify-start'}`}>
//             <div className={`p-3 rounded-lg max-w-60 sm:max-w-[60%] ${msg.sender === user._id ? 'bg-blue-500 text-white rounded-br-none' : 'bg-gray-200 text-black rounded-bl-none'}`}>
//                 <h6 className={`text-xs ${msg.sender === user._id ? 'hidden' : 'block'}`}>{msg.email}</h6>
//                 <p className="text-sm">{msg.message}</p>
//             </div>
//         </div>
//     ))}
// </div> */}
// --- IGNORE ---