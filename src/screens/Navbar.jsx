import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { removeUser, setLoading, setError } from "../context/slices/userState";
import { FaUserCircle } from "react-icons/fa";
import { FiChevronDown, FiLogOut, FiSettings, FiUser } from "react-icons/fi";
import axios from "../config/axios";
export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false); // Toggle for the mobile menu
    const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Toggle for profile dropdown
    const dispatch = useDispatch();
    const { isAuthenticated, user, isLoading } = useSelector((state) => state.user);
    const navLinks = [
        { name: "Sign In", slug: "/signin" },
        { name: "Sign Up", slug: "/signup" },
    ];
    const location = useLocation();

    const handleMenuToggle = () => {
        setIsOpen(!isOpen);
    };

    const handleDropdownToggle = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleLogout = async () => {
        dispatch(setLoading());
        const token = localStorage.getItem('token');
        try {
            const response = await axios.get('/auth/logout', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const res = await response.data;
            console.log(res);
            if (res.success) {
                dispatch(removeUser());
                localStorage.removeItem("token");
            }
        } catch (error) {
            dispatch(setError(error.response?.data?.message || "Something went wrong"));

        }
    };

    return (
        <nav className="h-18 w-full sticky top-0 shadow-md z-10 bg-gray-700">
            <div className="flex justify-between items-center px-5 lg:px-20 py-4">
                {/* Logo */}
                <h1 className="text-2xl font-[montserrat] tracking-tighter text-white md:text-4xl">
                    AI Chat App
                </h1>

                {/* Hamburger Menu */}
                <motion.div
                    onClick={handleMenuToggle}
                    className="cursor-pointer md:hidden"
                    initial={{ rotate: 0 }}
                    animate={{ rotate: isOpen ? 90 : 0 }}
                    transition={{ duration: 0.3 }}
                    style={{ width: "50px", height: "50px" }}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                        stroke="currentColor"
                        className="w-full h-full text-white"
                    >
                        {isOpen ? (
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                        )}
                    </svg>
                </motion.div>

                {/* Desktop Links */}
                <div className="hidden md:flex md:gap-5 lg:gap-10 text-white md:text-md lg:text-xl">
                    <Link to='/' className="relative group px-1">
                        <span>Home</span>
                        <span
                            className={`absolute inset-x-0 bottom-0 h-[1px] bg-white transition-all duration-300 group-hover:opacity-100 ${location.pathname === '/' ? "opacity-100" : "opacity-0"
                                }`}
                        ></span>
                    </Link>
                    {isAuthenticated ? (
                        <>
                            <span className="relative group px-1">Welcome, {user?.fullName || "User"}</span>
                            <div className="relative">
                                <div
                                    className="flex items-center cursor-pointer text-white"
                                    onClick={handleDropdownToggle}
                                >
                                    <FaUserCircle className="text-4xl text-gray-300 mr-2" />
                                    <FiChevronDown
                                        className={`ml-2 text-white transition-transform duration-300 ${isDropdownOpen ? "rotate-180" : "rotate-0"
                                            }`}
                                    />
                                </div>
                                {isDropdownOpen && (
                                    <ul className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                                        <li
                                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                                            onClick={() => alert("View Profile")}
                                        >
                                            <FiUser className="mr-2" />
                                            View Profile
                                        </li>
                                        <li
                                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                                            onClick={() => alert("Settings")}
                                        >
                                            <FiSettings className="mr-2" />
                                            Settings
                                        </li>
                                        <li
                                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                                            onClick={handleLogout}
                                        > <FiLogOut className="mr-2" />
                                            {isLoading ? ("Processing") : (`Logout`)}
                                        </li>
                                    </ul>
                                )}
                            </div>
                        </>
                    ) : (
                        navLinks.map(({ name, slug }, index) => (
                            <Link to={slug} key={index} className="relative group px-1">
                                <span>{name}</span>
                                <span
                                    className={`absolute inset-x-0 bottom-0 h-[1px] bg-white transition-all duration-300 group-hover:opacity-100 ${location.pathname === slug ? "opacity-100" : "opacity-0"
                                        }`}
                                ></span>
                            </Link>
                        ))
                    )}
                </div>
            </div>

            {/* Mobile Menu */}
            <div
                className={`-mt-2 flex flex-col items-center bg-[#121212b9] backdrop-blur-lg text-white transition-all duration-300 overflow-hidden ${isOpen ? "max-h-[500px] py-5" : "max-h-0"
                    } md:hidden`}
            >
                {isAuthenticated ? (
                    <>
                        <div
                            className="flex items-center cursor-pointer text-white"
                            onClick={handleDropdownToggle}
                        >
                            <FaUserCircle className="text-4xl text-gray-300 mr-2" />
                            <span>{user?.fullName || "User"}</span>
                            <FiChevronDown
                                className={`ml-2 text-white transition-transform duration-300 ${isDropdownOpen ? "rotate-180" : "rotate-0"
                                    }`}
                            />
                        </div>
                        {isDropdownOpen && (
                            <ul className="mt-2 w-full bg-white text-gray-800">
                                <li
                                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                    onClick={() => alert("View Profile")}
                                >
                                    View Profile
                                </li>
                                <li
                                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                    onClick={() => alert("Settings")}
                                >
                                    Settings
                                </li>
                                <li
                                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                    onClick={handleLogout}
                                >
                                    Logout
                                </li>
                            </ul>
                        )}
                    </>
                ) : (
                    navLinks.map(({ name, slug }, index) => (
                        <Link
                            to={slug}
                            key={index}
                            className={`w-full text-center py-2 ${location.pathname === slug ? "text-white" : "text-gray-400"
                                }`}
                            onClick={() => setIsOpen(false)}
                        >
                            {name}
                        </Link>
                    ))
                )}
            </div>
        </nav>
    );
}
