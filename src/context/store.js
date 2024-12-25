import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userState/index.js';
export const store = configureStore({
    reducer: {
        user: userReducer,
    },
})