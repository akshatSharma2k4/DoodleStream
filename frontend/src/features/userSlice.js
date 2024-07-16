import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    id: null,
    room: null,
    name: null,
};

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        addRoom: (state, action) => {
            state.room = action.payload;
        },
        addName: (state, action) => {
            state.name = action.payload;
        },
        addId: (state, action) => {
            state.id = action.payload;
        },
    },
});

export const { addRoom, addName, addId } = userSlice.actions;
export default userSlice.reducer;
