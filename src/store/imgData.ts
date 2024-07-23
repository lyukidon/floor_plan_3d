import { createSlice } from "@reduxjs/toolkit";

export const imgDataSlice = createSlice({
  name: "imgData",
  initialState: { width: 0, height: 0, data: [], colorSpace: "" },
  reducers: {
    setData: (state, action) => {
      return { ...action.payload }
    }
  },
});

export const { setData } = imgDataSlice.actions;

export default imgDataSlice.reducer;
