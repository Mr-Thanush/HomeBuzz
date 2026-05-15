import { configureStore} from "@reduxjs/toolkit";
import productReducer from "../Components/features/Products/productSlice";
import userReducer from "../Components/features/User/userSlice"
import likeReducer from "../Components/features/Like/likeSlice"
import orderReducer from '../Components/features/Orders/orderSlice'
import adminReducer from '../Components/features/AdminSeller/adminSlice'
import sellerReducer from '../Components/features/AdminSeller/sellerSlice'


export const store = configureStore({
    reducer: {
        product: productReducer,
        user: userReducer,
        like: likeReducer,
        order: orderReducer,
        admin: adminReducer,
        seller: sellerReducer
    }

})