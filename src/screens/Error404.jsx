import React from "react";

const Error404 = () => {
    return (
        <div className="flex items-center justify-center h-[calc(100vh-136px)] text-white">
            <div className="text-center">
                <h1 className="text-9xl font-extrabold text-red-500">404</h1>
                <h2 className="mt-4 text-4xl font-bold">Page Not Found</h2>
                <p className="mt-2 text-lg text-gray-400">
                    Oops! The page you’re looking for doesn’t exist.
                </p>
                <button
                    onClick={() => (window.location.href = "/")}
                    className="mt-6 px-6 py-3 text-lg font-medium text-gray-900 bg-red-500 rounded-lg hover:bg-red-600 transition-all"
                >
                    Go to Home
                </button>
            </div>
        </div>
    );
};

export default Error404;
