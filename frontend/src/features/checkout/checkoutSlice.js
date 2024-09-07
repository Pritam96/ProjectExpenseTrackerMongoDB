import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import checkoutService from "./checkoutService";

const initialState = {
  orderDetails: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

export const createOrder = createAsyncThunk(
  "checkout/create",
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await checkoutService.create(token);
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

export const verifySignature = createAsyncThunk(
  "checkout/verify",
  async (data, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await checkoutService.verify(data, token);
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

const checkoutSlice = createSlice({
  name: "checkout",
  initialState,
  reducers: {
    reset: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.orderDetails = { ...action.payload };
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(verifySignature.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(verifySignature.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.orderDetails = {
          ...state.orderDetails,
          ...action.payload,
        };
      })
      .addCase(verifySignature.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = checkoutSlice.actions;
export default checkoutSlice.reducer;
