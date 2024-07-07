import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import expenseService from "./expenseService";

const initialState = {
  expenses: [],
  pagination: {},
  totalExpenses: {
    daily: 0,
    weekly: 0,
    monthly: 0,
    yearly: 0,
  },
  isError: false,
  isSuccess: false,
  isLoading: false,
  isEditMode: false,
  editExpenseData: {},
  message: "",
};

export const createExpense = createAsyncThunk(
  "expense/create",
  async (expenseData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await expenseService.create(expenseData, token);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getExpenses = createAsyncThunk(
  "expense/getAll",
  async (parameters, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await expenseService.getExpenses(parameters, token);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getTotalExpenses = createAsyncThunk(
  "expense/total",
  async (dateInfo, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await expenseService.getTotalExpenses(dateInfo || null, token);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const editExpense = createAsyncThunk(
  "expense/edit",
  async ({ expenseId, expenseData }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await expenseService.editExpense(expenseId, expenseData, token);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const deleteExpense = createAsyncThunk(
  "expense/delete",
  async (expenseId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await expenseService.deleteExpense(expenseId, token);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const loadExpense = createAsyncThunk(
  "expense/load",
  async (expenseData) => {
    return expenseData;
  }
);

const expenseSlice = createSlice({
  name: "expense",
  initialState,
  reducers: {
    reset: (state) => {
      state.isError = false;
      state.isSuccess = false;
      state.isLoading = false;
      state.isEditMode = false;
      state.editExpenseData = {};
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createExpense.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createExpense.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.expenses.unshift(action.payload);
      })
      .addCase(createExpense.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      .addCase(getExpenses.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getExpenses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.expenses = action.payload.expenses;
        state.pagination = action.payload.pagination;
      })
      .addCase(getExpenses.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      .addCase(editExpense.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(editExpense.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.expenses = state.expenses.map((expense) =>
          expense._id === action.payload._id ? action.payload : expense
        );
      })
      .addCase(editExpense.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      .addCase(deleteExpense.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteExpense.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.expenses = state.expenses.filter(
          (expense) => expense._id !== action.payload._id
        );
      })
      .addCase(deleteExpense.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      .addCase(getTotalExpenses.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getTotalExpenses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.totalExpenses = action.payload;
      })
      .addCase(getTotalExpenses.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      .addCase(loadExpense.fulfilled, (state, action) => {
        state.isEditMode = true;
        state.editExpenseData = action.payload;
      });
  },
});

export const { reset } = expenseSlice.actions;
export default expenseSlice.reducer;
