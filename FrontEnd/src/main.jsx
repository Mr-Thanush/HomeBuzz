import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom"
import { AuthProvider } from './Components/authContext.jsx'
import { CartProvider } from './Components/cartContext.jsx'
import { WishlistProvider } from './Components/wishListContext.jsx'
import './index.css'
import App from './App'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <App />
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  </BrowserRouter>
)