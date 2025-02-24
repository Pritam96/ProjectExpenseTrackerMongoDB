import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import authService from "./authService";

const user = JSON.parse(localStorage.getItem("user"));

const initialState = {
  user: user || null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

// Utility function to extract error message
const getErrorMessage = (error) => {
  return (
    (error.response && error.response.data && error.response.data.message) ||
    error.message ||
    error.toString()
  );
};

// Utility function to reset state
const resetState = (state) => {
  state.isError = false;
  state.isSuccess = false;
  state.isLoading = false;
  state.message = "";
};

// Async thunks
export const register = createAsyncThunk(
  "auth/register",
  async (data, thunkAPI) => {
    try {
      return await authService.register(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  }
);

export const login = createAsyncThunk("auth/login", async (data, thunkAPI) => {
  try {
    return await authService.login(data);
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error));
  }
});

export const logout = createAsyncThunk("auth/logout", async () => {
  await authService.logout();
});

export const forgotPassword = createAsyncThunk(
  "auth/forgot-password",
  async (data, thunkAPI) => {
    try {
      await authService.forgotPassword(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  }
);

export const resetPassword = createAsyncThunk(
  "auth/reset-password",
  async (data, thunkAPI) => {
    try {
      await authService.resetPassword(data.token, data.password);
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  }
);

export const setPremium = createAsyncThunk(
  "auth/set-premium",
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user?.token;
      if (!token) {
        return thunkAPI.rejectWithValue("No user token found.");
      }
      return await authService.setPremiumUser(token);
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  }
);

// Slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    reset: (state) => resetState(state),
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isSuccess = true;
        state.isLoading = false;
      })
      .addCase(register.rejected, (state, action) => {
        state.message = action.payload;
        state.isError = true;
        state.isLoading = false;
        state.user = null;
      })
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isSuccess = true;
        state.isLoading = false;
      })
      .addCase(login.rejected, (state, action) => {
        state.message = action.payload;
        state.isError = true;
        state.isLoading = false;
        state.user = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
      })
      .addCase(forgotPassword.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.isSuccess = true;
        state.isLoading = false;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.message = action.payload;
        state.isError = true;
        state.isLoading = false;
      })
      .addCase(resetPassword.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.isSuccess = true;
        state.isLoading = false;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.message = action.payload;
        state.isError = true;
        state.isLoading = false;
      })
      .addCase(setPremium.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(setPremium.fulfilled, (state, action) => {
        state.isSuccess = true;
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(setPremium.rejected, (state, action) => {
        state.message = action.payload;
        state.isError = true;
        state.isLoading = false;
      });
  },
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;
