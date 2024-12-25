import { useNavigate, Link } from "react-router-dom";
import axios from "../config/axios.js";
import { useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { setUser, setError, setLoading } from '../context/slices/userState';

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();
    const { isLoading, error } = useSelector((state) => state.user);

    const handleLogin = async (e) => {
        e.preventDefault();
        dispatch(setLoading()); // Set loading state
        try {
            const response = await axios.post('/auth/signin', { email, password });
            const res = await response.data;
            localStorage.setItem('token', res.data.token);
            dispatch(setUser({ user: res.data.user, token: res.data.token })); // Set user data
            
            navigate('/');
        } catch (err) {
            dispatch(setError(err.response?.data?.message || "Something went wrong"));
            console.clear();
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[79vh] max-h-screen p-5 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
            <div className="w-full max-w-md p-8 bg-gray-700 rounded-lg shadow-lg">
                <h2 className="mb-6 text-3xl font-extrabold text-center text-white">Welcome Back</h2>
                {error && (
                    <div className="mb-4 w-full bg-red-700/20 py-3 rounded-lg border border-red-500 text-sm text-center text-red-500">
                        {error}
                    </div>
                )}
                <form onSubmit={handleLogin}>
                    <div className="relative mb-4">
                        <input
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                            type="email"
                            placeholder="Enter your email"
                            className="w-full px-4 py-3 text-white placeholder-gray-400 bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div className="relative mb-4">
                        <input
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                            type="password"
                            placeholder="Enter your password"
                            className="w-full px-4 py-3 text-white placeholder-gray-400 bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                        {isLoading ? "Processing..." : "Sign In"}
                    </button>
                </form>
                <p className="mt-4 text-sm text-center text-gray-300">
                    Don&apos;t have an account?{' '}
                    <Link to="/register" className="text-blue-400 hover:underline">
                        Create one
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
