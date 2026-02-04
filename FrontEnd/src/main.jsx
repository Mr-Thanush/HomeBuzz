import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom"
import { AuthProvider } from './Components/authContext.jsx'
import { CartProvider } from './Components/cartContext.jsx'
import './index.css'
import App from './App.jsx'
import { WishlistContext } from './Components/wishlistContext.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AuthProvider>
      <CartProvider>
        <WishlistContext>
          <App />
        </WishlistContext>
      </CartProvider>
    </AuthProvider>
  </BrowserRouter>
)
