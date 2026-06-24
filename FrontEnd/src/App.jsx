import { Routes, Route } from "react-router-dom";
import './App.css'
import { BrowserRouter as Router } from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";
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
        
        <Route path="/profile" element={<ProtectedRoute isAllowed={isAuthenticated}><Profile user={user} /></ProtectedRoute>} />
        <Route path="/profile/update" element={<ProtectedRoute isAllowed={isAuthenticated}><UpdateProfile /></ProtectedRoute>} />
        <Route path="/password/update" element={<ProtectedRoute isAllowed={isAuthenticated}><UpdatePassword /></ProtectedRoute>} />
        <Route path="/password/forgot" element={<ForgotPassword />} />
        <Route path="/reset/:token" element={<ResetPassword />} />
        <Route path="/shipping" element={<ProtectedRoute isAllowed={isAuthenticated}><Shipping /></ProtectedRoute>} />
        <Route path="/order/confirm" element={<ProtectedRoute isAllowed={isAuthenticated}><OrderConfirm /></ProtectedRoute>} />
        <Route path="/process/payment" element={<ProtectedRoute isAllowed={isAuthenticated}><Payment /></ProtectedRoute>} />
        <Route path="/user/orders" element={<ProtectedRoute isAllowed={isAuthenticated}><MyOrders /></ProtectedRoute>} />
        <Route path="/order/:orderId" element={<ProtectedRoute isAllowed={isAuthenticated}><OrderDetails /></ProtectedRoute>} />
        {/* Admin */}
        <Route path="/admin" element={<ProtectedRoute isAllowed={isAuthenticated && user?.role === "admin"}><AdminDashboard /></ProtectedRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="users" element={<Users />} />
          <Route path="user/:userId" element={<UpdateUserRole />} />
          <Route path="sellers/request" element={<SellerRequests />} />
        </Route>
        {/* Seller */}
        <Route path="/createstore" element={<ProtectedRoute isAllowed={isAuthenticated}><CreateStore /></ProtectedRoute>} />
        <Route path="/seller" element={<ProtectedRoute isAllowed={isAuthenticated && (user?.role === "seller" || user?.role === "admin")}><SellerDashboard /></ProtectedRoute>} />
        <Route path="/seller/product/create" element={<ProtectedRoute isAllowed={isAuthenticated && (user?.role === "seller" || user?.role === "admin")}><CreateProduct /></ProtectedRoute>} />
        <Route path="/seller/buyers" element={<ProtectedRoute isAllowed={isAuthenticated && (user?.role === "seller" || user?.role === "admin")}><AllBuyers /></ProtectedRoute>} />
        <Route path="/seller/orders" element={<ProtectedRoute isAllowed={isAuthenticated && (user?.role === "seller" || user?.role === "admin")}><AllOrders /></ProtectedRoute>} />
        <Route path="/seller/order/:orderId" element={<ProtectedRoute isAllowed={isAuthenticated && (user?.role === "seller" || user?.role === "admin")}><OrderUpdate /></ProtectedRoute>} />
        <Route path="/seller/products" element={<ProtectedRoute isAllowed={isAuthenticated && (user?.role === "seller" || user?.role === "admin")}><SellerAllProducts /></ProtectedRoute>} />
        <Route path="/seller/Reviews" element={<ProtectedRoute isAllowed={isAuthenticated && (user?.role === "seller" || user?.role === "admin")}><AllReviews /></ProtectedRoute>} />
        <Route path="/seller/product/:updateId" element={<ProtectedRoute isAllowed={isAuthenticated && (user?.role === "seller" || user?.role === "admin")}><UpdateProduct /></ProtectedRoute>} />



      </Routes>
    </Router>
  )
}

export default App;