import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./features/auth/authSlice";
import expenseSlice from "./features/expense/expenseSlice";
import categorySlice from "./features/category/categorySlice";

const store = configureStore({
  reducer: {
    auth: authSlice,
    expenses: expenseSlice,
    categories: categorySlice,
  },
  devTools: true,
});

export default store;
