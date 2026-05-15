import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";


// FETCH ADMIN PRODUCT
export const fetchAdminProducts = createAsyncThunk(
  "admin/fetchAdminProducts",
  async (_, { rejectWithValue}) => {
    try {
       const { data } = await axios.get("/api/v1/admin/products", { withCredentials: true });
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
  async (_, { rejectWithValue}) => {
    try {
       const { data } = await axios.get("/api/v1/admin/users", { withCredentials: true });
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
  async (id, { rejectWithValue}) => {
    try {
       const { data } = await axios.get(`/api/v1/admin/user/${id}`, { withCredentials: true });
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
  async ({userId,role}, { rejectWithValue}) => {
    try {
       const { data } = await axios.put(`/api/v1/admin/user/${userId}`,{role},{ withCredentials: true });
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
  async (userId, { rejectWithValue}) => {
    try {
       const { data } = await axios.delete(`/api/v1/admin/user/${userId}`, { withCredentials: true });
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data ||
          "Faild To Delete User"
      );
    }
  }
);


const adminSlice=createSlice({
    name:"admin",
    initialState:{
        products:[],
        loading:false,
        success:false,
        error:null,
        users:[],
        user:{},
        message:null
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
            .addCase(fetchAdminProducts.pending, (state) => {
              state.loading = true;
              state.error = null;
            })
            .addCase(fetchAdminProducts.fulfilled, (state, action) => {
              state.loading=false;
              state.products=action.payload.products;
            })
            .addCase(fetchAdminProducts.rejected, (state, action) => {
              state.loading = false;
              state.error = action.payload||"Faild To Fetch All Products";
            });

            //fetch Users
            builder
            .addCase(fetchAdminUsers.pending, (state) => {
              state.loading = true;
              state.error = null;
            })
            .addCase(fetchAdminUsers.fulfilled, (state, action) => {
              state.loading=false;
              state.users=action.payload.users;
            })
            .addCase(fetchAdminUsers.rejected, (state, action) => {
              state.loading = false;
              state.error = action.payload||"Faild To Fetch All Users";
            });

            //get User
            builder
            .addCase(getSingleUser.pending, (state) => {
              state.loading = true;
              state.error = null;
            })
            .addCase(getSingleUser.fulfilled, (state, action) => {
              state.loading=false;
              state.user=action.payload.user;
            })
            .addCase(getSingleUser.rejected, (state, action) => {
              state.loading = false;
              state.error = action.payload||"Faild To Get Single User";
            });

             //Get Single User
            builder
            .addCase(updateSingleUser.pending, (state) => {
              state.loading = true;
              state.error = null;
            })
            .addCase(updateSingleUser.fulfilled, (state, action) => {
              state.loading=false;
              state.success=action.payload.success;
            })
            .addCase(updateSingleUser.rejected, (state, action) => {
              state.loading = false;
              state.error = action.payload||"Faild To Get Single User";
            });

             //Delete Single User
            builder
            .addCase(deleteSingleUser.pending, (state) => {
              state.loading = true;
              state.error = null;
            })
            .addCase(deleteSingleUser.fulfilled, (state, action) => {
              const deleteUserId=action.meta.arg;
              state.loading=false;
              state.message=action.payload.message;
              state.users=state.users.filter(user=>user._id !== deleteUserId );
            })
            .addCase(deleteSingleUser.rejected, (state, action) => {
              state.loading = false;
              state.error = action.payload||"Faild To Delete User";
            });
        }
})

export const {removeErrors,removeSuccess,removeMessage}=adminSlice.actions  ;
export default adminSlice.reducer;