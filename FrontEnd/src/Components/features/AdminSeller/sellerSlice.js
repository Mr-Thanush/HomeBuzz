import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// FETCH ADMIN PRODUCT
export const fetchSellerProducts = createAsyncThunk(
  "seller/fetchAdminProducts",
  async (_, { rejectWithValue}) => {
    try {
       const { data } = await axios.get("/api/v1/seller/products", { withCredentials: true });
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data ||
          "Faild To Fetch All Products"
      );
    }
  }
);

//create Product
export const createProduct = createAsyncThunk(
  "seller/createProduct",
  async (productData, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        "/api/v1/seller/product/create",
        productData,
        {withCredentials:true}
      );
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed To Create Product"
      );
    }
  }
);

  
//update Product
export const updateProduct = createAsyncThunk(
  "seller/updateProduct",
  async ({id,formData}, { rejectWithValue }) => {
    try {
      const { data } = await axios.put( 
        `/api/v1/seller/product/${id}`,
        formData,
        {withCredentials:true}
      );
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed To Update Product"
      );
    }
  }
);

//delete Product
export const deleteProduct = createAsyncThunk(
  "seller/deleteProduct",
  async (productId, { rejectWithValue }) => {
    try {
      const { data } = await axios.delete( 
        `/api/v1/seller/product/${productId}`,
        { withCredentials: true }
      );
      return {productId};
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed To Deletion Product"
      );
    }
  }
);

//Fetch All Orders
export const fetchAllOrders = createAsyncThunk(
  "seller/fetchAllOrders",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get( 
        `/api/v1/seller/orders`,
        { withCredentials: true }
      );
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed To Fetch All Orders"
      );
    }
  }
);

//Delete Order
export const deleteOrder = createAsyncThunk(
  "seller/deleteOrder",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axios.delete( 
        `/api/v1/order/${id}`,
        { withCredentials: true }
      );
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed To Delete Order"
      );
    }
  }
);

//Update Order
export const updateOrder = createAsyncThunk(
  "seller/updateOrder",
  async ({orderId,status,trackingId}, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json"
        },
        withCredentials: true
      };
      const { data } = await axios.put(
        `/api/v1/order/${orderId}`,
        { status, trackingId },
        config
      );
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed To Update Order"
      );
    }
  }
);


//Fetch Product Reviews
export const fetchProductReviews = createAsyncThunk(
  "seller/fetchProductReviews",
  async (productId, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(
        `/api/v1/seller/reviews?id=${productId}`,
       { withCredentials: true},
      );
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed To Fetch Product Reviews"
      );
    }
  }
);

//Delete Product Reviews
export const deleteProductReview = createAsyncThunk(
  "seller/deleteProductReview",
  async ({productId,reviewId}, { rejectWithValue }) => {
    try {
      const { data } = await axios.delete(
        `/api/v1/seller/reviews?productId=${productId}&id=${reviewId}`,
       { withCredentials: true},
      );
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed To Delete Product Review"
      );
    }
  }
);



const sellerSlice=createSlice({
    name:"seller",
    initialState:{
        products:[],
        loading:false,
        success:false,
        error:null,
        product:{},
        message:null,
        deleting:{},
        orders:[],
        totalAmount:0,
        order:{},
        reviews:[]
    },
    reducers:{
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
            .addCase(fetchSellerProducts.pending, (state) => {
              state.loading = true;
              state.error = null;
            })
            .addCase(fetchSellerProducts.fulfilled, (state, action) => {
              state.loading=false;
              state.products=action.payload.products;
            })
            .addCase(fetchSellerProducts.rejected, (state, action) => {
              state.loading = false;
              state.error = action.payload||"Faild To Fetch All Products";
            });
         
            //create Products
             builder 
            .addCase(createProduct.pending, (state) => {
              state.loading = true;
              state.error = null;
            })
            .addCase(createProduct.fulfilled, (state, action) => {
              state.loading=false;
              state.success=action.payload.success;
              state.products.push(action.payload.product);
            })
            .addCase(createProduct.rejected, (state, action) => {
              state.loading = false;
              state.error = action.payload||"Faild To Create Product";
            });

             //update Products
             builder
            .addCase(updateProduct.pending, (state) => {
              state.loading = true;
              state.error = null;
            })
            .addCase(updateProduct.fulfilled, (state, action) => {
              state.loading=false;
              state.success=action.payload.success;
              state.product=action.payload.product;
            })
            .addCase(updateProduct.rejected, (state, action) => {
              state.loading = false;
              state.error = action.payload||"Failed To Update Product";
            });

            //delete Products
             builder
            .addCase(deleteProduct.pending, (state,action) => {
              const productId=action.meta.arg;
              state.deleting[productId]=true;
            })
            .addCase(deleteProduct.fulfilled, (state, action) => {
              const productId=action.payload.productId;
              state.deleting[productId]=false;
              state.products=state.products.filter(product=>product._id!==productId);
            })
            .addCase(deleteProduct.rejected, (state, action) => {
              const productId=action.meta.arg;
              state.deleting[productId]=false;
              state.error = action.payload||"Failed To Deletion Product";
            });

             //fetch All Orders
             builder
            .addCase(fetchAllOrders.pending, (state,action) => {
              state.loading = true;
              state.error = null;
              state.orders=[];
            })
            .addCase(fetchAllOrders.fulfilled, (state, action) => {
              state.loading=false;
              state.orders=action.payload.orders;
              state.totalAmount=action.payload.totalAmount;
            })
            .addCase(fetchAllOrders.rejected, (state, action) => {
              state.loading = false;
              state.error = action.payload||"Failed To Fetch All Orders";
            });

            //Delete Order
             builder
            .addCase(deleteOrder.pending, (state,action) => {
              state.loading = true;
              state.error = null;
            })
            .addCase(deleteOrder.fulfilled, (state, action) => {
              state.loading=false;
              const orderId=action.meta.arg;
              state.orders=state.orders.filter(order=>order._id!==orderId);
              state.success=action.payload.success;
              state.message=action.payload.message;
            })
            .addCase(deleteOrder.rejected, (state, action) => {
              state.loading = false;
              state.error = action.payload||"Failed To Delete Order";
            });


             //Update Order
             builder
            .addCase(updateOrder.pending, (state,action) => {
              state.loading = true;
              state.error = null;
            })
            .addCase(updateOrder.fulfilled, (state, action) => {
              state.loading=false;
              state.order=action.payload.order
              state.success=action.payload.success;
            })
            .addCase(updateOrder.rejected, (state, action) => {
              state.loading = false;
              state.error = action.payload||"Failed To Update Order";
            });

             //fetch Product reviews
             builder
            .addCase(fetchProductReviews.pending, (state,action) => {
              state.loading = true;
              state.error = null;
            })
            .addCase(fetchProductReviews.fulfilled, (state, action) => {
              state.loading=false;
              state.reviews=action.payload.reviews;
            })
            .addCase(fetchProductReviews.rejected, (state, action) => {
              state.loading = false;
              state.error = action.payload||"Failed To Fetch Product Reviews";
            });

            //fetch Product reviews
             builder
            .addCase(deleteProductReview.pending, (state,action) => {
              state.loading = true;
              state.error = null;
            })
            .addCase(deleteProductReview.fulfilled, (state, action) => {
              state.loading=false;
              state.success=action.payload.success;
              state.message=action.payload.message;

            })
            .addCase(deleteProductReview.rejected, (state, action) => {
              state.loading = false;
              state.error = action.payload||"Failed To Fetch Product Reviews";
            });
        }
})

export const {removeErrors,removeSuccess,removeMessage}=sellerSlice.actions  ;
export default sellerSlice.reducer;