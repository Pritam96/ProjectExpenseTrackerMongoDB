import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./features/auth/authSlice";
import expenseSlice from "./features/expense/expenseSlice";
import categorySlice from "./features/category/categorySlice";
import reportSlice from "./features/reports/reportSlice";
import checkoutSlice from "./features/checkout/checkoutSlice";

const store = configureStore({
  reducer: {
    auth: authSlice,
    expenses: expenseSlice,
    categories: categorySlice,
    reports: reportSlice,
    checkout: checkoutSlice,
  },
  devTools: true,
});

export default store;
