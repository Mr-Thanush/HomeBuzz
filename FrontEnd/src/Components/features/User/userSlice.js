import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../../utils/apiClient";

export const register = createAsyncThunk(
  "user/register",
  async (userData, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.post("/register", userData, {
        headers: { "Content-Type": "application/json" }
      });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Registration Failed, Please Try Again Later");
    }
  }
);

export const login = createAsyncThunk(
  "user/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.post("/login", { email, password }, {
        headers: { "Content-Type": "application/json" }
      });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Login Failed, Please Try Again Later");
    }
  }
);

export const loadUser = createAsyncThunk('user/loadUser', async (_, { rejectWithValue }) => {
  try {
    const { data } = await apiClient.get("/profile");
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed To Load User");
  }
});

export const logout = createAsyncThunk('user/logout', async (_, { rejectWithValue }) => {
  try {
    const { data } = await apiClient.post("/logout", {});
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Signout Failed");
  }
});

export const updateProfile = createAsyncThunk('user/updateProfile', async (userData, { rejectWithValue }) => {
  try {
    const { data } = await apiClient.put("/profile/update", userData, {
      headers: { "Content-Type": "application/json" }
    });
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Update Failed, Please Try Again Later");
  }
});

export const createStore = createAsyncThunk(
  "user/createStore",
  async (storeData, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.put("/seller/create", storeData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed To Create Store");
    }
  }
);

export const updatePassword = createAsyncThunk('user/updatePassword', async (passwordData, { rejectWithValue }) => {
  try {
    const { data } = await apiClient.put("/password/update", passwordData, {
      headers: { "Content-Type": "application/json" }
    });
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Password Update Failed, Please Try Again Later");
  }
});

export const forgotPassword = createAsyncThunk('user/forgotPassword', async ({ email }, { rejectWithValue }) => {
  try {
    const { data } = await apiClient.post("/password/forgot", { email }, {
      headers: { "Content-Type": "application/json" }
    });
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Email sent Failed, Please Try Again Later");
  }
});

export const resetPassword = createAsyncThunk('user/resetPassword', async ({ token, password, confirmPassword }, { rejectWithValue }) => {
  try {
    const { data } = await apiClient.post(`/reset/${token}`, { password, confirmPassword }, {
      headers: { "Content-Type": "application/json" }
    });
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Password Reset Failed, Please Try Again Later");
  }
});

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    loading: false,
    error: null,
    success: false,
    isAuthenticated: false,
    message: null,
  },
  reducers: {
    removeErrors: (state) => { state.error = null; },
    removeSuccess: (state) => {
      state.success = false;
      state.message = null;
    },
  },
  extraReducers: (builder) => {
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
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.user = null;
        state.isAuthenticated = false;
      })

      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.success = action.payload.success;
        state.user = action.payload.user || null;
        state.isAuthenticated = Boolean(action.payload.user);
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.user = null;
        state.isAuthenticated = false;
      })

      .addCase(createStore.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createStore.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.success = action.payload.success;
        state.message = action.payload.message || null;
        state.user = action.payload.user || state.user;
        state.isAuthenticated = Boolean(state.user);
      })
      .addCase(createStore.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed To Create Store";
      })

      .addCase(loadUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadUser.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.user = action.payload.user || null;
        state.isAuthenticated = Boolean(action.payload.user);
      })
      .addCase(loadUser.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = action.payload;
      })

      .addCase(logout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Signout Failed";
      })

      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.user = action.payload.user;
        state.success = action.payload?.success || null;
        state.message = action.payload?.message || null;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Update Failed, Please Try Again Later";
      })

      .addCase(updatePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePassword.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.success = action.payload?.success || null;
      })
      .addCase(updatePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Password Update Failed, Please Try Again Later";
      })

      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.success = action.payload?.success || null;
        state.message = action.payload?.message || null;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Email Sent Failed, Please Try Again Later";
      })

      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.success = action.payload?.success || null;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Password Reset Failed, Please Try Again Later";
      });
  },
});

export const { removeErrors, removeSuccess } = userSlice.actions;
export default userSlice.reducer;