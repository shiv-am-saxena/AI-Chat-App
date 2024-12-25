import { createSlice } from "@reduxjs/toolkit";

export const userStateSlice = createSlice({
    initialState: {
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null
    },
    name: 'userState',
    reducers: {
        setLoading: (state) => {
            state.isLoading = true;
            state.error = null;
        },
        setUser: (state, action) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.isAuthenticated = true;
            state.isLoading = false;
            state.error = null;
        },
        removeUser: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            state.isLoading = false;
            state.error = null;
        },
        setError: (state, action) => {
            state.error = action.payload;
            state.isLoading = false;
        }
    }
});

export const { setUser, removeUser, setLoading, setError } = userStateSlice.actions;
export default userStateSlice.reducer;