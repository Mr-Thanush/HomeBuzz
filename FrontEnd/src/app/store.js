import { configureStore } from "@reduxjs/toolkit";
import productReducer from "../Components/features/Products/productSlice.js";
import userReducer from "../Components/features/User/userSlice.js";
import likeReducer from "../Components/features/Like/likeSlice.js";
import orderReducer from "../Components/features/Orders/orderSlice.jsx";
import adminReducer from "../Components/features/AdminSeller/adminSlice.js";
import sellerReducer from "../Components/features/AdminSeller/sellerSlice.js";

export const store = configureStore({
  reducer: {
    product: productReducer,
    user: userReducer,
    like: likeReducer,
    order: orderReducer,
    admin: adminReducer,
    seller: sellerReducer
  }
});