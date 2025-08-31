import React, { useState } from "react";
import { Label } from "./ui/Label";
import { Input } from "./ui/Input";
import { cn } from "../lib/utils.js";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setError, setLoading, setUser } from "../context/slices/userState/index.js";
import axiosInstance from "../config/axios.js";
export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();
    const { isLoading, error } = useSelector((state) => state.user);
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        dispatch(setLoading()); // Set loading state
        try {
            const response = await axiosInstance.post('/auth/signin', { email, password });
            const res = await response.data;
            localStorage.setItem('token', res.data.token);
            dispatch(setUser({ user: res.data.user, token: res.data.token })); // Set user data
            navigate('/dashboard');
        } catch (err) {
            dispatch(setError(err.response?.data?.message || "Something went wrong"));
            console.clear();
        }
    };
    return (
        <div
            className="shadow-input mx-auto w-full max-w-sm rounded-xl border border-zinc-400 p-4 md:rounded-2xl md:p-8 bg-[#111] z-10">
            <h2 className="text-xl font-bold text-center text-neutral-800 dark:text-neutral-200">
                Welcome to Adhyay AI
            </h2>
            {error && (
                <p className="mt-2 max-w-sm bg-red-700/20 py-3 rounded-lg text-sm text-center text-red-500 border border-red-500">
                    {error}
                </p>
            )}
            <form className="my-8" onSubmit={handleSubmit}>
                <LabelInputContainer className="mb-4">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" placeholder="projectmayhem@fc.com" type="email" onChange={(e) => setEmail(e.target.value)} value={email} required/>
                </LabelInputContainer>
                <LabelInputContainer className="mb-4">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" placeholder="••••••••" type="password" onChange={(e) => setPassword(e.target.value)} value={password} required/>
                </LabelInputContainer>

                <button
                    className="group/btn relative block h-10 w-full rounded-md bg-gradient-to-br from-black to-neutral-600 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset]"
                    type="submit"
                    disabled={isLoading}>
                    Log in &rarr;
                    <BottomGradient />
                </button>
            </form>
            <p className="mt-4 text-sm text-center text-gray-300">
                Don&apos;t have an account?{' '}
                <Link to="/auth/sign-up" className="text-blue-400 hover:underline">
                    Create one
                </Link>
            </p>
        </div>
    );
}

const BottomGradient = () => {
    return (
        <>
            <span
                className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
            <span
                className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
        </>
    );
};

const LabelInputContainer = ({
    children,
    className
}) => {
    return (
        <div className={cn("flex w-full flex-col space-y-2", className)}>
            {children}
        </div>
    );
};
