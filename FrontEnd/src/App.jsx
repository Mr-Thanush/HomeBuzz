import './App.css'
import './Styles/theme.css'

import AuthLayout from './layouts/AuthLayout'
import MainLayout from './layouts/MainLayout'

import Cart from './pages/Cart/cart'
import CreateStore from './pages/CreateStore/create'
import Dashboard from './pages/Home/dashboard'
import Product from './pages/Item/product'
import Orders from './pages/Orders/order'
import Otp from './pages/Otp/otp'
import Profile from './pages/Profile/profile'
import SignIn from './pages/Registration/SignIn'
import SignUp from './pages/Registration/SignUp'
import SearchBar from './pages/SearchProducts/search'
import WishList from './pages/WishList/wishlist'
import Store from './pages/store/store'
import AddItemPage from './pages/store/addItemPage'
import PublicRoute from './Components/navbars/publicRoute'

import { Routes, Route } from 'react-router-dom'
import BuyItems from './pages/Buy/buy'
import Address from './pages/addressSection/address'
import ItemsManagement from './pages/store/ItemManagement'


function App() {
  return (
    <Routes>

      {/* WITH NAVBAR */}
      <Route element={<MainLayout />}>
        <Route path='/' element={<Dashboard />} />
        <Route path='/wishlist' element={<WishList />} />
        <Route path='/cart' element={<Cart />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/search' element={<SearchBar />} />
        <Route path='/product/:id' element={<Product />} />
        <Route path='/orders' element={<Orders />} />
        <Route path='/createstore' element={<CreateStore />} />
        <Route path='/store' element={<Store />} />
        <Route path='/buy' element={<BuyItems />} />
        <Route path='/address' element={<Address />} />
        <Route path="/add-item" element={<AddItemPage />} />
        <Route path="/add-item/:id" element={<AddItemPage />} />
        <Route path="/items-management" element={<ItemsManagement />} />
      </Route>

      {/* WITHOUT NAVBAR */}
      <Route element={<AuthLayout />}>
        <Route path='/signup' element={<PublicRoute>
          <SignUp />
        </PublicRoute>} />
        <Route path='/signin' element={<PublicRoute>
          <SignIn />
        </PublicRoute>} />
        <Route path='/verification' element={<Otp />} />
      </Route>

    </Routes>
  )
}

export default App