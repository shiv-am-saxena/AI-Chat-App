import ChatList from "../components/ChatList";
import ChatWindow from "../components/ChatWindow";

const Projects = () => {
    return (
        <div className="flex h-[calc(100vh-136px)]">
            <div className="w-full sm:w-1/3 lg:w-1/4 bg-gray-800 text-white">
                <ChatList />
            </div>

            {/* Main Chat Window */}
            <div className="flex-1 bg-gray-100">
                <ChatWindow />
            </div>
        </div>
    );
};

export default Projects;
