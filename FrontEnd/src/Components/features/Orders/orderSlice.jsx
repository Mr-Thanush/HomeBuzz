import {createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

//CREATE ORDERS
export const createOrder = createAsyncThunk(
  "order/createOrder",
  async (order, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        "/api/v1/new/order",
        order,
        {
          headers: {
            "Content-Type": "application/json"
          },
          withCredentials: true,
        }
      );
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data ||
          "Order Creating Failed"
      );
    }
  }
);

//GET ALL ORDERS
export const getAllMyOrders = createAsyncThunk(
  "order/getAllMyOrders",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get("/api/v1/user/orders", { withCredentials: true });
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data ||
          "Failed to Fetch Orders"
      );
    }
  }
);

//GET ORDER DETAILS
export const getOrderDetails = createAsyncThunk(
  "order/getOrderDetails",
  async (orderId, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`/api/v1/order/${orderId}`, { withCredentials: true });
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data ||
          "Failed to Fetch Orders Details"
      );
    }
  }
);



const orderSlice=createSlice({
    name:"order",
    initialState:{
        success:false,
        loading:false,
        error:null,
        orders:[],
        order:{}
    },
    reducers: {
    removeErrors: (state) => {
      state.error = null;
    },
    removeSuccess: (state) => {
      state.success = false;
    },
  },
   extraReducers: (builder) => {
        //Create Order
      builder
        .addCase(createOrder.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(createOrder.fulfilled, (state, action) => {
          state.loading=false;
          state.order=action.payload.order;
          state.success=action.payload.success;
        })
        .addCase(createOrder.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload?.message||"Order Creating Failed";
        });

        //get all my Orders
      builder
        .addCase(getAllMyOrders.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(getAllMyOrders.fulfilled, (state, action) => {
          state.loading=false;
          state.orders=action.payload.orders;
          state.success=action.payload.success;
        })
        .addCase(getAllMyOrders.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload?.message||"Failed to Fetch Orders";
        });

         //get Order Details
      builder
        .addCase(getOrderDetails.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(getOrderDetails.fulfilled, (state, action) => {
          state.loading=false;
          state.order=action.payload.order;
          state.success=action.payload.success;
        })
        .addCase(getOrderDetails.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload?.message||"Failed to Fetch Orders Details";
        });
    }
})

export const {removeErrors,removeSuccess} = orderSlice.actions;
export default orderSlice.reducer