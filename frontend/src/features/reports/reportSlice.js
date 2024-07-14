import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import reportService from "./reportService";

const initialState = {
  data: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

export const getLeaderboard = createAsyncThunk(
  "report/getLeaderboard",
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await reportService.getLeaderboard(token);
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

const reportSlice = createSlice({
  name: "report",
  initialState,
  reducers: {
    reset: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getLeaderboard.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(getLeaderboard.fulfilled, (state, action) => {
        state.data = action.payload.data;
        state.isSuccess = true;
        state.isLoading = false;
      })
      .addCase(getLeaderboard.rejected, (state, action) => {
        state.message = action.payload;
        state.isError = true;
        state.isLoading = false;
      });
  },
});

export const { reset } = reportSlice.actions;
export default reportSlice.reducer;
