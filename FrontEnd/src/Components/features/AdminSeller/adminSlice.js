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
      return rejectWithValue(
        error.response?.data ||
        "Faild To Fetch All Products"
      );
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
      return rejectWithValue(
        error.response?.data ||
        "Faild To Fetch All Users"
      );
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
      return rejectWithValue(
        error.response?.data ||
        "Faild To Get Single User"
      );
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
      return rejectWithValue(
        error.response?.data ||
        "Faild To Update Single User"
      );
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
      return rejectWithValue(
        error.response?.data ||
        "Faild To Delete User"
      );
    }
  }
);

// Fetch all seller requests
export const fetchSellerRequests = createAsyncThunk(
  "admin/fetchSellerRequests",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.get(
        "/admin/seller/requests"
      );
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch seller requests"
      );
    }
  }
);

// Approve seller
export const approveSeller = createAsyncThunk(
  "admin/approveSeller",
  async (sellerId, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.put(
        `/admin/seller/approve/${sellerId}`,
        {}
      );
      return { data, sellerId };
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to approve seller"
      );
    }
  }
);

// Reject seller
export const rejectSeller = createAsyncThunk(
  "admin/rejectSeller",
  async (sellerId, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.delete(
        `/admin/seller/reject/${sellerId}`
      );
      return { data, sellerId };
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to reject seller"
      );
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
    sellers:[]
  },
  reducers: {
    removeErrors: (state) => {
      state.error = null;
    },
    removeSuccess: (state) => {
      state.success = false;
    },
    removeMessage: (state) => {
      state.message = null;
    }
  },
  extraReducers: (builder) => {
    //fetch Products
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
        state.error = action.payload || "Faild To Fetch All Products";
      });

    //fetch Users
    builder
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
        state.error = action.payload || "Faild To Fetch All Users";
      });

    //get User
    builder
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
        state.error = action.payload || "Faild To Get Single User";
      });

    //Get Single User
    builder
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
        state.error = action.payload || "Faild To Get Single User";
      });

    //Delete Single User
    builder
      .addCase(deleteSingleUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteSingleUser.fulfilled, (state, action) => {
        const deleteUserId = action.meta.arg;
        state.loading = false;
        state.message = action.payload.message;
        state.users = state.users.filter(user => user._id !== deleteUserId);
      })
      .addCase(deleteSingleUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Faild To Delete User";
      });

    // Fetch seller requests
    builder
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
      });

    // Approve seller
    builder
      .addCase(approveSeller.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(approveSeller.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.data.message;
        state.sellerRequests = state.sellerRequests.filter(
          seller => seller._id !== action.payload.sellerId
        );
      })
      .addCase(approveSeller.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Reject seller
    builder
      .addCase(rejectSeller.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(rejectSeller.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.data.message;
        state.sellerRequests = state.sellerRequests.filter(
          seller => seller._id !== action.payload.sellerId
        );
      })
      .addCase(rejectSeller.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
})

export const { removeErrors, removeSuccess, removeMessage } = adminSlice.actions;
export default adminSlice.reducer;