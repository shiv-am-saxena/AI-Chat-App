/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useEffect, useState, useLayoutEffect, useRef } from "react";
import { IoSend } from "react-icons/io5";
import { receiveMessage, sendMessages } from "../config/socket";
import { useDispatch, useSelector } from "react-redux";
import { setError, addChat } from "../context/slices/chats";
import Alert from "./Alert";
import Markdown from "markdown-to-jsx";
import hljs from 'highlight.js/lib/core';
import 'highlight.js/styles/night-owl.css';

import javascript from 'highlight.js/lib/languages/javascript';
import typescript from 'highlight.js/lib/languages/typescript';
import python from 'highlight.js/lib/languages/python';
import java from 'highlight.js/lib/languages/java';
import cpp from 'highlight.js/lib/languages/cpp';
import csharp from 'highlight.js/lib/languages/csharp';
import ruby from 'highlight.js/lib/languages/ruby';
import php from 'highlight.js/lib/languages/php';
import swift from 'highlight.js/lib/languages/swift';
import kotlin from 'highlight.js/lib/languages/kotlin';
import go from 'highlight.js/lib/languages/go';
import rust from 'highlight.js/lib/languages/rust';
import dart from 'highlight.js/lib/languages/dart';
import shell from 'highlight.js/lib/languages/shell';
import html from 'highlight.js/lib/languages/xml'; // 'xml' covers HTML, XML
import css from 'highlight.js/lib/languages/css';
import json from 'highlight.js/lib/languages/json';
import yaml from 'highlight.js/lib/languages/yaml';
import markdown from 'highlight.js/lib/languages/markdown';
import sql from 'highlight.js/lib/languages/sql';
import graphql from 'highlight.js/lib/languages/graphql';
import bash from 'highlight.js/lib/languages/bash';

// Registering all languages
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('python', python);
hljs.registerLanguage('java', java);
hljs.registerLanguage('cpp', cpp);
hljs.registerLanguage('csharp', csharp);
hljs.registerLanguage('ruby', ruby);
hljs.registerLanguage('php', php);
hljs.registerLanguage('swift', swift);
hljs.registerLanguage('kotlin', kotlin);
hljs.registerLanguage('go', go);
hljs.registerLanguage('rust', rust);
hljs.registerLanguage('dart', dart);
hljs.registerLanguage('shell', shell);
hljs.registerLanguage('html', html);
hljs.registerLanguage('css', css);
hljs.registerLanguage('json', json);
hljs.registerLanguage('yaml', yaml);
hljs.registerLanguage('markdown', markdown);
hljs.registerLanguage('sql', sql);
hljs.registerLanguage('graphql', graphql);
hljs.registerLanguage('bash', bash);
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
        document.querySelectorAll('pre code').forEach((block) => {
            hljs.highlightElement(block);
        });
        if (!isLoading) {
            scrollToBottom();
        }
    }, [chats, isLoading]);  // Ensures it scrolls whenever the 'chats' state changes

    const showAlert = (message, type) => {
        setAlert({ message, type });
    };

    const send = (e) => {
        e.preventDefault();
        if (newMessage) {
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
                    return <pre className="prose prose-invert w-full my-2 rounded-lg max-w-full overflow-x-auto" key={index} ><code className={` w-full max-w-full`}>{part}</code></pre>;
                } else {
                    return <Markdown key={index} className="text-sm">{part}</Markdown>;
                }
            });
            return parts;
        } else {
            return <Markdown className="text-sm">{response}</Markdown>;
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
                <div className="h-[75vh] md:h-[76vh] relative overflow-y-auto p-4 w-full space-y-4 bg-white">
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
                                <p className="text-xs opacity-80 pb-2">{msg.email}</p>
                                <div className="text-sm">
                                    {formatResponse(msg.message)}
                                </div>
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
