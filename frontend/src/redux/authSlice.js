// Stores the currently logged-in user's details and global loading state to control access across the app

import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: "auth",
    initialState: {
        loading: false,
        user: null
    },
    reducers: {
        // Track global loading state to show spinners during auth requests
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        // Store user profile data so any component can check if someone is logged in
        setUser: (state, action) => {
            state.user = action.payload;
        }
    }
});

export const { setLoading, setUser } = authSlice.actions;
export default authSlice.reducer;