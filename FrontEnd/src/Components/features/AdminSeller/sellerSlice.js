import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiClient from "../../../utils/apiClient.js";

// FETCH SELLER PRODUCTS
export const fetchSellerProducts = createAsyncThunk(
  "seller/fetchSellerProducts", // FIX: Fixed description name mapping clash tracking string
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.get("/seller/products");
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed To Fetch All Products");
    }
  }
);

// create Product
export const createProduct = createAsyncThunk(
  "seller/createProduct",
  async (productData, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.post("/seller/product/create", productData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed To Create Product");
    }
  }
);

// update Product
export const updateProduct = createAsyncThunk(
  "seller/updateProduct",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.put(`/seller/product/${id}`, formData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed To Update Product");
    }
  }
);

// delete Product
export const deleteProduct = createAsyncThunk(
  "seller/deleteProduct",
  async (productId, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/seller/product/${productId}`);
      return { productId };
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed To Deletion Product");
    }
  }
);

// Fetch All Orders
export const fetchAllOrders = createAsyncThunk(
  "seller/fetchAllOrders",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.get(`/seller/orders`);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed To Fetch All Orders");
    }
  }
);

// Delete Order
export const deleteOrder = createAsyncThunk(
  "seller/deleteOrder",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.delete(`/order/${id}`);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed To Delete Order");
    }
  }
);

// Update Order
export const updateOrder = createAsyncThunk(
  "seller/updateOrder",
  async ({ orderId, status, trackingId }, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.put(`/order/${orderId}`, { status, trackingId });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed To Update Order");
    }
  }
);

// Fetch Product Reviews
export const fetchProductReviews = createAsyncThunk(
  "seller/fetchProductReviews",
  async (productId, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.get(`/seller/reviews?id=${productId}`);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed To Fetch Product Reviews");
    }
  }
);

// Delete Product Reviews
export const deleteProductReview = createAsyncThunk(
  "seller/deleteProductReview",
  async ({ productId, reviewId }, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.delete(`/seller/reviews?productId=${productId}&id=${reviewId}`);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed To Delete Product Review");
    }
  }
);

const sellerSlice = createSlice({
  name: "seller",
  initialState: {
    products: [],
    loading: false,
    success: false,
    error: null,
    product: {},
    message: null,
    deleting: {},
    orders: [],
    totalAmount: 0,
    order: {},
    reviews: []
  },
  reducers: {
    removeErrors: (state) => { state.error = null; },
    removeSuccess: (state) => { state.success = false; },
    removeMessage: (state) => { state.message = null; }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSellerProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSellerProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
      })
      .addCase(fetchSellerProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed To Fetch All Products";
      })

      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.success;
        state.products.push(action.payload.product);
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed To Create Product";
      })

      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.success;
        state.product = action.payload.product;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed To Update Product";
      })

      .addCase(deleteProduct.pending, (state, action) => {
        const productId = action.meta.arg;
        state.deleting[productId] = true;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        const productId = action.payload.productId;
        state.deleting[productId] = false;
        state.products = state.products.filter(product => product._id !== productId);
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        const productId = action.meta.arg;
        state.deleting[productId] = false;
        state.error = action.payload || "Failed To Delete Product";
      })

      .addCase(fetchAllOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.orders = [];
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.orders;
        state.totalAmount = action.payload.totalAmount;
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed To Fetch All Orders";
      })

      .addCase(deleteOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.loading = false;
        const orderId = action.meta.arg;
        state.orders = state.orders.filter(order => order._id !== orderId);
        state.success = action.payload.success;
        state.message = action.payload.message;
      })
      .addCase(deleteOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed To Delete Order";
      })

      .addCase(updateOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload.order;
        state.success = action.payload.success;
      })
      .addCase(updateOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed To Update Order";
      })

      .addCase(fetchProductReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = action.payload.reviews;
      })
      .addCase(fetchProductReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed To Fetch Product Reviews";
      })

      .addCase(deleteProductReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProductReview.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.success;
        state.message = action.payload.message;
      })
      .addCase(deleteProductReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed To Delete Product Review";
      });
  }
});

export const { removeErrors, removeSuccess, removeMessage } = sellerSlice.actions;
export default sellerSlice.reducer;