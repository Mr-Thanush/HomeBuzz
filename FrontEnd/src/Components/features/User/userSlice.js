import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

/* REGISTER USER */
export const register = createAsyncThunk(
  "user/register",
  async (userData, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        "/api/v1/register",
        userData,
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
        error.response?.data?.message ||
          "Registration Failed, Please Try Again Later"
      );
    }
  }
);

/* LOGIN USER */
export const login = createAsyncThunk(
  "user/login",
  async ({email,password}, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        "/api/v1/login",
        {email,password},
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
        error.response?.data?.message ||
          "Login Failed, Please Try Again Later"
      );
    }
  }
);

/* LOAD USER */
export const loadUser=createAsyncThunk('user/loadUser',async(_,{ rejectWithValue })=>{
  try {
    const {data}=await axios.get("/api/v1/profile",{ withCredentials: true });
    return data;
  } catch (error) {
    return rejectWithValue(
        error.response?.data?.message ||
          "Failed To Load User"
      );
  }
})

/* LOGOUT USER */
export const logout=createAsyncThunk('user/logout',async(_,{ rejectWithValue })=>{
  try {
    const {data}=await axios.post("/api/v1/logout",{},{withCredentials:true});
    return data;
  } catch (error) {
    return rejectWithValue(
        error.response?.data?.message ||
          "Signout Failed"
      );
  }
})

/* Update Profile */
export const updateProfile=createAsyncThunk('user/updateProfile',async(userData,{ rejectWithValue })=>{
  try {
    const config={
      headers:{
        "Content-Type":"application/json"
      },
      withCredentials: true,
    }
    const {data}=await axios.put("/api/v1/profile/update",userData,config);
    return data;
  } catch (error) {
    return rejectWithValue(
        error.response?.data?.message ||
         { message: "Update Failed,Please Try Again Later" }
      );
  }
})

/* updatePassword */
export const updatePassword=createAsyncThunk('user/updatePassword',async(passwordData,{ rejectWithValue })=>{
  try {
    const config={
      headers:{
        "Content-Type":"application/json"
      },
      withCredentials: true,
    }
    const {data}=await axios.put("/api/v1/password/update",passwordData,config);
    return data;
  } catch (error) {
    return rejectWithValue(
        error.response?.data?.message ||
         "Password Update Failed,Please Try Again Later" 
      );
  }
})

/* forgotPassword */
export const forgotPassword=createAsyncThunk('user/forgotPassword',async({email},{ rejectWithValue })=>{
  try {
    const config={
      headers:{
        "Content-Type":"application/json"
      },
      withCredentials: true,
    }
    const {data}=await axios.post("/api/v1/password/forgot",{ email },config);
    return data;
  } catch (error) {
    return rejectWithValue(
        error.response?.data?.message ||
         { message:"Email sent Failed,Please Try Again Later"}
      );
  }
})

/* ResetPassword */

export const resetPassword=createAsyncThunk('user/resetPassword',async({token,password,confirmPassword},{ rejectWithValue })=>{
  try {
    const config={
      headers:{
        "Content-Type":"application/json"
      },
      withCredentials: true,
    }
    const {data}=await axios.post(`/api/v1/reset/${token}`,{ password, confirmPassword },config);
    return data;
  } catch (error) {
    return rejectWithValue(
        error.response?.data?.message ||
         "Password Reset Failed,Please Try Again Later" 
      );
  }
})






const userSlice = createSlice({
  name: "user",
  initialState: {
    user:localStorage.getItem("user")?JSON.parse(localStorage.getItem("user")):null,
    loading: false,
    error: null,
    success: false,
    isAuthenticated: localStorage.getItem("isAuthenticated")==="true",
    message:null,
  },
  reducers: {
    removeErrors: (state) => {
      state.error = null;
    },
    removeSuccess: (state) => {
      state.success = false;
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    //register
    builder
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.success;
        state.user = action.payload.user || null;
        state.isAuthenticated = Boolean(action.payload.user);

        //store in local storage
        localStorage.setItem("user",JSON.stringify(state.user));
        localStorage.setItem("isAuthenticated",JSON.stringify(state.isAuthenticated));
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.user = null;
        state.isAuthenticated = false;
      });

      //login
      builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.error=null;
        state.success = action.payload.success;
        state.user = action.payload.user || null;
        state.isAuthenticated = Boolean(action.payload.user);

         //store in local storage
        localStorage.setItem("user",JSON.stringify(state.user));
        localStorage.setItem("isAuthenticated",JSON.stringify(state.isAuthenticated));
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.user = null;
        state.isAuthenticated = false;
      });

      //load
      builder
      .addCase(loadUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadUser.fulfilled, (state, action) => {
        state.loading = false;
        state.error=null;
        state.user = action.payload.user || null;
        state.isAuthenticated = Boolean(action.payload.user);

         //store in local storage
        localStorage.setItem("user",JSON.stringify(state.user));
        localStorage.setItem("isAuthenticated",JSON.stringify(state.isAuthenticated));
      })
      .addCase(loadUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed To Load User";
      
        if(action.payload?.statusCode===401){
          state.user = null;
          state.isAuthenticated = false;
          localStorage.removeItem("user")
          localStorage.removeItem("isAuthenticated")
        }


      });
      //logout
      builder
      .addCase(logout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logout.fulfilled, (state, action) => {
        state.loading = false;
        state.error=null;
        state.user = null;
        state.isAuthenticated =false;
        localStorage.removeItem("user")
        localStorage.removeItem("isAuthenticated")
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Signout Failed";    
      });

       //updateProfile
      builder
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.error=null;
        state.user = action.payload?.user || null;
        state.success = action.payload?.success || null;
        state.message = action.payload?.message || null;

      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload|| "Update Failed,Please Try Again Later";    
      });

      //updatePassword
      builder
      .addCase(updatePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePassword.fulfilled, (state, action) => {
        state.loading = false;
        state.error=null;
        state.success = action.payload?.success || null;
      })
      .addCase(updatePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload|| "Password Update Failed,Please Try Again Later";    
      });

      //forgot Password
      builder
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.error=null;
        state.success = action.payload?.success || null;
        state.message = action.payload?.message || null;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload|| "Email Sent Failed,Please Try Again Later";    
      });

       //reset Password
      builder
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.error=null;
        state.success = action.payload?.success || null;
        state.user=null
        state.isAuthenticated=false
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload|| "Password Reset Failed,Please Try Again Later";    
      });

  },
});

export const { removeErrors, removeSuccess } = userSlice.actions;
export default userSlice.reducer;