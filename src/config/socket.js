import socket from 'socket.io-client';

let socketInstance = null;

const initializeSocket = (projectId) => {
    if (!import.meta.env.VITE_API_URL) {
        console.error('SOCKET environment variable is not defined.');
        return;
    }

    socketInstance = socket(import.meta.env.VITE_API_URL, {
        transports: ['websocket'],
        auth: {
            token: localStorage.getItem('token'),
        },
        query: {
            projectId,
        },
    });

    // Connection Events
    socketInstance.on('connect', () => {
        console.log('Socket connected:', socketInstance.id);
    });

    socketInstance.on('disconnect', (reason) => {
        console.warn(`Socket disconnected: ${reason}`);
        if (reason === 'io server disconnect') {
            socketInstance.connect(); // Reconnect manually
        }
    });

    socketInstance.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
    });

    socketInstance.on('reconnect', (attemptNumber) => {
        console.info(`Socket reconnected after ${attemptNumber} attempts.`);
    });

    socketInstance.on('reconnect_attempt', (attemptNumber) => {
        console.info(`Reconnection attempt: ${attemptNumber}`);
    });
};

const receiveMessage = (eventName, cb) => {
    if (socketInstance) {
        socketInstance.on(eventName, cb);
    } else {
        console.error('Socket is not initialized.');
    }
};

const receiveMessageWithTimeout = (eventName, cb, timeout = 5000) => {
    if (socketInstance) {
        const timeoutId = setTimeout(() => {
            console.warn(`No response for event: ${eventName} within ${timeout}ms`);
        }, timeout);

        socketInstance.on(eventName, (data) => {
            clearTimeout(timeoutId);
            cb(data);
        });
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

export { initializeSocket, receiveMessage, receiveMessageWithTimeout, sendMessages, disconnectSocket };
