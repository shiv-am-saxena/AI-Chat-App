import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userState/index.js';
import chatReducer from './slices/chats/index.js';
export const store = configureStore({
    reducer: {
        user: userReducer,
        chats: chatReducer, 
    },
})