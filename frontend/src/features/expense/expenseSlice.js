import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import expenseService from "./expenseService";

const initialState = {
  expenses: [],
  pagination: {
    totalPages: null,
    currentPage: 1,
    next: null,
    prev: null,
    limit: 4,
  },
  count: 0,
  editData: null,
  history: {},
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

const addExpenseToList = (expenses, newExpense, limit) => {
  const newArray = [newExpense, ...expenses];
  if (newArray.length > limit) {
    newArray.pop();
  }
  return newArray;
};

export const createExpense = createAsyncThunk(
  "expense/create",
  async (expenseData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user?.token;
      if (!token) {
        return thunkAPI.rejectWithValue("No user token found.");
      }
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
      const token = thunkAPI.getState().auth.user?.token;
      if (!token) {
        return thunkAPI.rejectWithValue("No user token found.");
      }
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

export const editExpense = createAsyncThunk(
  "expense/edit",
  async ({ expenseId, expenseData }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user?.token;
      if (!token) {
        return thunkAPI.rejectWithValue("No user token found.");
      }
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
      const token = thunkAPI.getState().auth.user?.token;
      if (!token) {
        return thunkAPI.rejectWithValue("No user token found.");
      }
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

export const exportExpenses = createAsyncThunk(
  "expense/export",
  async (dateRange, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user?.token;
      if (!token) {
        return thunkAPI.rejectWithValue("No user token found.");
      }
      const csvData = await expenseService.exportExpenses(dateRange, token);

      // Create a URL for the binary data
      const url = window.URL.createObjectURL(
        new Blob([csvData], { type: "text/csv" })
      );
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `expenses_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      // Clean up the DOM by removing the link
      link.remove();
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

const expenseSlice = createSlice({
  name: "expense",
  initialState,
  reducers: {
    resetToInitialState: (state) => {
      state.isError = false;
      state.isSuccess = false;
      state.isLoading = false;
      state.message = "";
    },
    resetForExport: () => {
      return initialState;
    },
    cancelEdit: (state) => {
      state.editData = null;
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
        state.message = "Expense added successfully";

        state.expenses = addExpenseToList(
          state.expenses,
          action.payload.expense,
          state.pagination.limit
        );

        state.pagination.totalPages = Math.ceil(
          (state.count + 1) / state.pagination.limit
        );

        state.count += 1;
        state.history = action.payload.history || {};
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
        state.message = "Expenses fetched successfully";

        state.expenses = action.payload.expenses;
        state.pagination = action.payload.pagination;
        state.count = action.payload.count;
        state.history = action.payload.history || {};
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
        state.message = "Expense updated successfully";

        state.editData = null;

        state.expenses = state.expenses.map((expense) =>
          expense._id === action.payload.expense._id
            ? { ...expense, ...action.payload.expense }
            : expense
        );

        state.history = action.payload.history || {};
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
        state.message = "Expense deleted successfully";

        state.expenses = state.expenses.filter(
          (expense) => expense._id !== action.payload.deleted_id
        );
        state.count = Math.max(0, state.count - 1);
        state.history = action.payload.history || {};
      })
      .addCase(deleteExpense.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      .addCase(loadExpense.fulfilled, (state, action) => {
        state.editData = { ...action.payload };
      })

      .addCase(exportExpenses.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(exportExpenses.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = "Expense data exported successfully";
      })
      .addCase(exportExpenses.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { resetToInitialState, resetForExport, cancelEdit } =
  expenseSlice.actions;
export default expenseSlice.reducer;
