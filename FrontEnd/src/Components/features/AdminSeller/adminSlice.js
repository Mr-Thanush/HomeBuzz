import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiClient from "../../../utils/apiClient";

// FETCH ADMIN PRODUCT
export const fetchAdminProducts = createAsyncThunk(
  "admin/fetchAdminProducts",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.get("/admin/products");
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed To Fetch All Products");
    }
  }
);

// Fetch Users
export const fetchAdminUsers = createAsyncThunk(
  "admin/fetchAdminUsers",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.get("/admin/users");
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed To Fetch All Users");
    }
  }
);

// Get Single User
export const getSingleUser = createAsyncThunk(
  "admin/getSingleUser",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.get(`/admin/user/${id}`);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed To Get Single User");
    }
  }
);

// update single User
export const updateSingleUser = createAsyncThunk(
  "admin/updateSingleUser",
  async ({ userId, role }, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.put(`/admin/user/${userId}`, { role });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed To Update Single User");
    }
  }
);

// Delete Single User
export const deleteSingleUser = createAsyncThunk(
  "admin/deleteSingleUser",
  async (userId, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.delete(`/admin/user/${userId}`);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed To Delete User");
    }
  }
);

// Fetch all seller requests
export const fetchSellerRequests = createAsyncThunk(
  "admin/fetchSellerRequests",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.get("/admin/seller/requests");
      return data; // FIX: Added missing return statement
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch seller requests");
    }
  }
);

// Approve seller
export const approveSeller = createAsyncThunk(
  "admin/approveSeller",
  async (sellerId, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.put(`/admin/seller/approve/${sellerId}`, {});
      return { data, sellerId };
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to approve seller");
    }
  }
);

// Reject seller
export const rejectSeller = createAsyncThunk(
  "admin/rejectSeller",
  async (sellerId, { rejectWithValue }) => {
    try {
      // FIX: Changed .delete to .put to align with database column state modification update route
      const { data } = await apiClient.put(`/admin/seller/reject/${sellerId}`, {});
      return { data, sellerId };
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to reject seller");
    }
  }
);

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    products: [],
    loading: false,
    success: false,
    error: null,
    users: [],
    user: {},
    sellerRequests: [],
    message: null,
    sellers: []
  },
  reducers: {
    removeErrors: (state) => { state.error = null; },
    removeSuccess: (state) => { state.success = false; },
    removeMessage: (state) => { state.message = null; }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
      })
      .addCase(fetchAdminProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed To Fetch All Products";
      })

      .addCase(fetchAdminUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.users;
      })
      .addCase(fetchAdminUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed To Fetch All Users";
      })

      .addCase(getSingleUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSingleUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
      })
      .addCase(getSingleUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed To Get Single User";
      })

      .addCase(updateSingleUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSingleUser.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.success;
      })
      .addCase(updateSingleUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed To Update Single User";
      })

      .addCase(deleteSingleUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteSingleUser.fulfilled, (state, action) => {
        const deleteUserId = action.meta.arg;
        state.loading = false;
        state.message = action.payload.message;
        // FIX: Changed user._id filter targeting parameter to rely on user.id (MySQL PK)
        state.users = state.users.filter(user => user.id !== deleteUserId);
      })
      .addCase(deleteSingleUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed To Delete User";
      })

      .addCase(fetchSellerRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSellerRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.sellerRequests = action.payload.requests;
      })
      .addCase(fetchSellerRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(approveSeller.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(approveSeller.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.data.message;
        // FIX: Changed filter targeting parameter to rely on seller.id (MySQL PK)
        state.sellerRequests = state.sellerRequests.filter(
          seller => seller.id !== action.payload.sellerId
        );
      })
      .addCase(approveSeller.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(rejectSeller.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(rejectSeller.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.data.message;
        // FIX: Changed filter targeting parameter to rely on seller.id (MySQL PK)
        state.sellerRequests = state.sellerRequests.filter(
          seller => seller.id !== action.payload.sellerId
        );
      })
      .addCase(rejectSeller.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { removeErrors, removeSuccess, removeMessage } = adminSlice.actions;
export default adminSlice.reducer;