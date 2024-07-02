import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./features/auth/authSlice";

const store = configureStore({
  reducer: {
    auth: authSlice,
  },
  devTools: true,
});

export default store;
