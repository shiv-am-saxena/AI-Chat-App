import { useLocation } from "react-router-dom"

export default function Footer() {
    const location = useLocation();
    return (
        <footer className={`w-full p-4 h-full z-[2] bg-gray-700 text-center text-gray-300 ${location.pathname == '/' ? 'block': 'hidden'}`}>
            <p>&copy; {new Date().getFullYear()} Adhyay-AI Chat App. All rights reserved.</p>
        </footer>
    )
}
