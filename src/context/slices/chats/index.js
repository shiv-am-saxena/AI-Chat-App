import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    chats: [],
    isLoading: false,
    error: null
};

const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        setChats(state, action) {
            state.chats = action.payload;
            state.isLoading = false;
            state.error = null;
        },
        addChat(state, action) {
            state.chats.push(action.payload);
        },
        removeChats: (state) => {
            state.chats = [];
            state.isLoading = false;
            state.error = null;
        },
        chatLoading: (state) => {
            state.isLoading = true;
            state.error = null;
        },
        chatError: (state, action) => {
            state.error = action.payload;
            state.isLoading = false;
        }
    },
});

export const { setChats, addChat, chatLoading, chatError, removeChats } = chatSlice.actions;

export const selectChats = (state) => state.chat.chats;

export default chatSlice.reducer;
