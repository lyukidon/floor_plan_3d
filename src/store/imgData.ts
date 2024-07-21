import { createSlice } from '@reduxjs/toolkit';

export const imgDataSlice = createSlice({
    name: "imgData",
    initialState: { width: 0, height: 0, data: []},
    reducers: {
        getData: (state, action) => {
            state.data = action.payload
        },
        getAllData: (state, action) => {
            state = action.payload
        },
        getWidth: (state, action) => {
            state.width = action.payload
        }
    },
});

export default imgDataSlice.reducer;