import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    currentUser: null,
    error: null,
    loading: false,
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        signInStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        signInSuccess: (state, action) => {
            state.currentUser = action.payload;
            // Each reducer function receives the current state and an action object as parameters. The state parameter represents the current state of the slice, and action contains additional data (payload) needed to update the state.
            state.loading = false;
            state.error = null;
        },
        signInFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
    }
})


export const { signInStart, signInSuccess, signInFailure } = userSlice.actions;

export default userSlice.reducer;