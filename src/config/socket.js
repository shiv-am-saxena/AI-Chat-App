import socket from 'socket.io-client';

let socketInstance = null;

const initializeSocket = (projectId) => {
    socketInstance = socket(import.meta.env.SOCKET, {
        auth: {
            token: localStorage.getItem('token'),
        },
        query: {
            projectId,
        },
        transports: ["websocket", "polling"], // Ensure fallback support
    });

};

const receiveMessage = (eventName, cb) => {
    if (socketInstance) {
        socketInstance.on(eventName, cb);
    } else {
        console.error('Socket is not initialized.');
    }
};

const sendMessages = (eventName, data) => {
    if (socketInstance) {
        socketInstance.emit(eventName, data);
    } else {
        console.error('Socket is not initialized.');
    }
};

const disconnectSocket = () => {
    if (socketInstance) {
        socketInstance.removeAllListeners(); // Clean up listeners
        socketInstance.disconnect();
        socketInstance = null;
    }
};

export { initializeSocket, receiveMessage, sendMessages, disconnectSocket };
