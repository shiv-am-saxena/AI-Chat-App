import socket from 'socket.io-client';

let socketInstance = null;

const initializeSocket = (projectId) => {
    socketInstance = socket(import.meta.env.VITE_API_URL, {
        auth: {
            token: localStorage.getItem('token')
        },
        query: {
            projectId
        }
    });
}

const recieveMessage = (eventName, cb) => {
    socketInstance.on(eventName, cb);
}

const sendMessages = (eventName, data) => {
    socketInstance.emit(eventName, data);
}

const disconnectSocket = () => {
    if (socketInstance) {
        socketInstance.disconnect();
        socketInstance = null;
    }
};

export { initializeSocket, recieveMessage, sendMessages, disconnectSocket };