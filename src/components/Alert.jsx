/* eslint-disable react/prop-types */
import { useEffect } from "react";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const Alert = ({ message, type = "success", onClose, duration = 5000 }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    return (
        <div
            className={`fixed top-4 right-4 z-50 flex items-center max-w-sm px-4 py-3 rounded-lg shadow-lg ${type === "success"
                    ? "bg-green-500 text-white"
                    : "bg-red-500 text-white"
                }`}
        >
            {type === "success" ? (
                <FaCheckCircle className="mr-3 text-lg" />
            ) : (
                <FaTimesCircle className="mr-3 text-lg" />
            )}
            <span className="flex-1 text-sm font-medium">{message}</span>
            <button
                className="text-white hover:text-gray-300"
                onClick={onClose}
                aria-label="Close alert"
            >
                &times;
            </button>
        </div>
    );
};

export default Alert;
