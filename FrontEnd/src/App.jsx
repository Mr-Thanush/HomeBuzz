import { Routes, Route } from "react-router-dom";
import './App.css'
import { BrowserRouter as Router } from "react-router-dom";
import SignIn from "./Pages/signIn.jsx";
import SignUp from "./Pages/signUp.jsx";
import Home from "./Pages/home.jsx";
import Profile from "./Pages/profile.jsx";
import Like from './Pages/like.jsx';
import Search from "./Pages/search.jsx";
import ProductDetails from "./Pages/productDetails.jsx";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { loadUser } from "./Components/features/User/userSlice.js";
import AdminDashboard from "./Pages/Admin/adminDashboard.jsx";
import UpdateProfile from "./Pages/updateProfile.jsx";
import UpdatePassword from "./Pages/updatePassword.jsx";
import ForgotPassword from "./Pages/forgotPassword.jsx";
import ResetPassword from "./Pages/resetPassword.jsx";
import Shipping from "./Pages/shipping.jsx";
import OrderConfirm from "./Pages/orderConfirm.jsx";
import Payment from "./Pages/payment.jsx";
import MyOrders from "./Pages/myOrders.jsx";
import OrderDetails from "./Pages/orderDetails.jsx";
import Dashboard from "./Pages/Admin/adminPages/dashBoard.jsx";
import AdminProducts from "./Pages/Admin/adminPages/products.jsx";
import Users from "./Pages/Admin/adminPages/users.jsx";
import SellerRequests from "./Pages/Admin/adminPages/sellerRequest.jsx";
import SellerDashboard from "./Pages/Seller/sellerDashboard.jsx";
import CreateProduct from "./Pages/Seller/sellerPages/createProducts.jsx";
import AllBuyers from "./Pages/Seller/sellerPages/allBuyers.jsx";
import AllOrders from "./Pages/Seller/sellerPages/allOrders.jsx";
import SellerAllProducts from "./Pages/Seller/sellerPages/allProducts.jsx";
import AllReviews from "./Pages/Seller/sellerPages/allReviews.jsx";
import UpdateProduct from "./Pages/Seller/sellerPages/updateProduct.jsx";
import UpdateUserRole from "./Pages/Admin/adminPages/updateUserRole.jsx";
import OrderUpdate from "./Pages/Seller/sellerPages/updateOrder.jsx";
import CreateStore from "./Pages/createStore.jsx";


function App() {
  const { isAuthenticated, user } = useSelector(state => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch])


  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/like" element={<Like />} />
        <Route path="/search" element={<Search />} />
        <Route path="/search/:keyword" element={<Search />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        
        <Route path="/profile" element={isAuthenticated ? <Profile user={user} /> : <SignIn />} />
        <Route path="/profile/update" element={<UpdateProfile />} />
        <Route path="/password/update" element={<UpdatePassword />} />
        <Route path="/password/forgot" element={<ForgotPassword />} />
        <Route path="/reset/:token" element={<ResetPassword />} />
        <Route path="/shipping" element={<Shipping />} />
        <Route path="/order/confirm" element={<OrderConfirm />} />
        <Route path="/process/payment" element={<Payment />} />
        <Route path="/user/orders" element={<MyOrders />} />
        <Route path="/order/:orderId" element={<OrderDetails />} />
        {/* Admin */}
        <Route path="/admin" element={<AdminDashboard />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="users" element={<Users />} />
          <Route path="user/:userId" element={<UpdateUserRole />} />
          <Route path="sellers/request" element={<SellerRequests />} />
        </Route>
        {/* Seller */}
        <Route path="/createstore" element={<CreateStore />} />
        <Route path="/seller" element={<SellerDashboard />} />
        <Route path="/seller/product/create" element={<CreateProduct />} />
        <Route path="/seller/buyers" element={<AllBuyers />} />
        <Route path="/seller/orders" element={<AllOrders />} />
        <Route path="/seller/order/:orderId" element={<OrderUpdate />} />
        <Route path="/seller/products" element={<SellerAllProducts />} />
        <Route path="/seller/Reviews" element={<AllReviews />} />
        <Route path="/seller/product/:updateId" element={<UpdateProduct />} />



      </Routes>
    </Router>
  )
}

export default App;