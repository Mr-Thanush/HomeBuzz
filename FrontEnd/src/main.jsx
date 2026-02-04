import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom"
import { AuthProvider } from './components/authContext.jsx'
import { CartProvider } from './components/cartContext.jsx'
import './index.css'
import App from './App.jsx'
import { WishlistProvider } from './components/wishlistContext.jsx'

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
