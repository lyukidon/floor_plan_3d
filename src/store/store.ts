import React from 'react';
import { configureStore } from '@reduxjs/toolkit';
import imgDataReducer from './imgData'

export default configureStore({
  reducer: {
    imgData: imgDataReducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({serializableCheck: false})
})
