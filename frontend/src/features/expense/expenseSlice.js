import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import expenseService from "./expenseService";

const initialState = {
  expenses: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  isEditMode: false,
  expense: {},
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
  async (paginationData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await expenseService.getExpenses(paginationData, token);
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

export const getExpense = createAsyncThunk(
  "expense/getSingle",
  async (expenseId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await expenseService.getExpense(expenseId, token);
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
      state.expense = {};
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
      })
      .addCase(getExpenses.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      .addCase(getExpense.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getExpense.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.expenses.push(action.payload);
      })
      .addCase(getExpense.rejected, (state, action) => {
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
      .addCase(loadExpense.fulfilled, (state, action) => {
        state.isEditMode = true;
        state.expense = action.payload;
      });
  },
});

export const { reset } = expenseSlice.actions;
export default expenseSlice.reducer;
