import { createSlice } from "@reduxjs/toolkit";

export const imgDataSlice = createSlice({
  name: "imgData",
  initialState: { width: 0, height: 0, data: [] },
  reducers: {
    setData: (state, action) => {
      console.log(action.payload)
      return { ...action.payload }
    }
  },
});

export const { setData } = imgDataSlice.actions;

export default imgDataSlice.reducer;
