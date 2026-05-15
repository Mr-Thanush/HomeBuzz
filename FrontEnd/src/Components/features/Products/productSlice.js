import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

/* GET ALL PRODUCTS */
export const getProduct = createAsyncThunk(
  "product/getProduct",
  async ({ keyword = "", page = 1,category = "" }, { rejectWithValue }) => {
    try {
      const params=new URLSearchParams();
      params.set("page",page);

      if (keyword.trim() !== "") {
        params.set("keyword",keyword.trim());
      }
      if(category){
        params.set("category",category);
      }
      const link=`/api/v1/products?${params.toString()}`;


      const { data } = await axios.get(link);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch products"
      );
    }
  }
);

/* GET SINGLE PRODUCT DETAILS */
export const getProductDetails = createAsyncThunk(
  "product/getProductDetails",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`/api/v1/product/${id}`);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch product details"
      );
    }
  }
);

/* CREATE REVIEW */
export const createReview = createAsyncThunk(
  "product/createReview",
  async ({rating,comment,productId}, { rejectWithValue }) => {
    try {
      const { data } = await axios.put(`/api/v1/review`,{rating,comment,productId},
        {
          headers: {
            "Content-Type": "application/json"
          },
        });
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch product details"
      );
    }
  }
);

/* PRODUCT SLICE */
const productSlice = createSlice({
  name: "product",
  initialState: {
    products: [],
    product: null,
    loading: false,
    error: null,
    productCount: 0,
    resultPerPage: 0,
    pages: 0,
    reviewSuccess:false,
    reviewLoading:false
  },

  reducers: {
    removeErrors: (state) => {
      state.error = null;
    },

    clearProducts: (state) => {
      state.products = [];
      state.productCount = 0;
      state.pages = 0;
    },

    removeSuccess: (state) => {
      state.reviewSuccess = false;
    },

  },

  extraReducers: (builder) => {
    builder
      /* GET PRODUCTS  */
      .addCase(getProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(getProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
        state.productCount = action.payload.productCount;
        state.resultPerPage = action.payload.resultPerPage;
        state.pages = action.payload.pages;
      })
      .addCase(getProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })


       builder
      /*  GET PRODUCT DETAILS  */
      .addCase(getProductDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(getProductDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload.product;
      })
      .addCase(getProductDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });


       builder
      /*  GET PRODUCT DETAILS  */
      .addCase(createReview.pending, (state) => {
        state.reviewLoading = true;
      })
      .addCase(createReview.fulfilled, (state, action) => {
        state.reviewLoading = false;
        state.reviewSuccess=true;
      })
      .addCase(createReview.rejected, (state, action) => {
        state.reviewLoading = false;
        state.error = action.payload;
      });
  },
});

export const { removeErrors, clearProducts ,removeSuccess} = productSlice.actions;
export default productSlice.reducer;