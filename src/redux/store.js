import { configureStore } from '@reduxjs/toolkit';
import idReducer from './idReducer';

const store = configureStore({
  reducer: {
    idReducer
  },
});

export default store;