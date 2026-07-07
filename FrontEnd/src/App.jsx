import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ProtectedRoute from "./routes/ProtectedRoute.jsx"; 
import { loadUser } from "./Components/features/User/userSlice.js";

// --- General & Customer Pages ---
import Home from "./Pages/home.jsx";
import SignIn from "./Pages/signIn.jsx";
import SignUp from "./Pages/signUp.jsx";
import Profile from "./Pages/profile.jsx";
import Like from "./Pages/like.jsx";
import Search from "./Pages/search.jsx";
import ProductDetails from "./Pages/productDetails.jsx";
import UpdateProfile from "./Pages/updateProfile.jsx";
import UpdatePassword from "./Pages/updatePassword.jsx";
import ForgotPassword from "./Pages/forgotPassword.jsx";
import ResetPassword from "./Pages/resetPassword.jsx";
import Shipping from "./Pages/shipping.jsx";
import OrderConfirm from "./Pages/orderConfirm.jsx";
import Payment from "./Pages/payment.jsx";
import MyOrders from "./Pages/myOrders.jsx";
import OrderDetails from "./Pages/orderDetails.jsx";
import CreateStore from "./Pages/createStore.jsx";

// --- Admin Module Pages ---
import AdminDashboard from "./Pages/Admin/adminDashboard.jsx";
import Dashboard from "./Pages/Admin/adminPages/dashBoard.jsx";
import AdminProducts from "./Pages/Admin/adminPages/products.jsx";
import Users from "./Pages/Admin/adminPages/users.jsx";
import UpdateUserRole from "./Pages/Admin/adminPages/updateUserRole.jsx";
import SellerRequests from "./Pages/Admin/adminPages/sellerRequest.jsx";

// --- Seller Module Pages ---
import SellerDashboard from './Pages/Seller/sellerDashboard.jsx';
import SellerOverview from "./Pages/Seller/sellerOverview.jsx"; 
import CreateProduct from "./Pages/Seller/sellerPages/createProducts.jsx";
import AllBuyers from "./Pages/Seller/sellerPages/allBuyers.jsx";
import AllOrders from "./Pages/Seller/sellerPages/allOrders.jsx";
import OrderUpdate from "./Pages/Seller/sellerPages/updateOrder.jsx";
import SellerAllProducts from "./Pages/Seller/sellerPages/allProducts.jsx";
import AllReviews from "./Pages/Seller/sellerPages/allReviews.jsx";
import UpdateProduct from "./Pages/Seller/sellerPages/updateProduct.jsx";

import "./App.css";

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, user, loading } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  const isAdmin = isAuthenticated && user?.role === "admin";
  const isSellerOrAdmin = isAuthenticated && (user?.role === "seller" || user?.role === "admin");

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
        <Route path="/password/forgot" element={<ForgotPassword />} />
        <Route path="/reset/:token" element={<ResetPassword />} />
        
        
        <Route path="/profile" element={<ProtectedRoute isAllowed={isAuthenticated} loading={loading}><Profile user={user} /></ProtectedRoute>} />
        <Route path="/profile/update" element={<ProtectedRoute isAllowed={isAuthenticated} loading={loading}><UpdateProfile /></ProtectedRoute>} />
        <Route path="/password/update" element={<ProtectedRoute isAllowed={isAuthenticated} loading={loading}><UpdatePassword /></ProtectedRoute>} />
        <Route path="/shipping" element={<ProtectedRoute isAllowed={isAuthenticated} loading={loading}><Shipping /></ProtectedRoute>} />
        <Route path="/order/confirm" element={<ProtectedRoute isAllowed={isAuthenticated} loading={loading}><OrderConfirm /></ProtectedRoute>} />
        <Route path="/process/payment" element={<ProtectedRoute isAllowed={isAuthenticated} loading={loading}><Payment /></ProtectedRoute>} />
        <Route path="/user/orders" element={<ProtectedRoute isAllowed={isAuthenticated} loading={loading}><MyOrders /></ProtectedRoute>} />
        <Route path="/order/:orderId" element={<ProtectedRoute isAllowed={isAuthenticated} loading={loading}><OrderDetails /></ProtectedRoute>} />
        <Route path="/createstore" element={<ProtectedRoute isAllowed={isAuthenticated} loading={loading}><CreateStore /></ProtectedRoute>} />

        
        <Route path="/admin" element={<ProtectedRoute isAllowed={isAdmin} loading={loading}><AdminDashboard /></ProtectedRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="users" element={<Users />} />
          <Route path="user/:userId" element={<UpdateUserRole />} />
          <Route path="sellers/request" element={<SellerRequests />} />
        </Route>

        
        <Route path="/seller" element={<ProtectedRoute isAllowed={isSellerOrAdmin} loading={loading}><SellerDashboard /></ProtectedRoute>}>
         
          <Route index element={<Navigate to="products" replace />} /> 
          <Route path="products" element={<SellerAllProducts />} />
          <Route path="product/create" element={<CreateProduct />} />
          <Route path="product/:updateId" element={<UpdateProduct />} />
          <Route path="buyers" element={<AllBuyers />} />
          <Route path="orders" element={<AllOrders />} />
          <Route path="order/:orderId" element={<OrderUpdate />} />
          <Route path="reviews" element={<AllReviews />} />
        </Route>

        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;