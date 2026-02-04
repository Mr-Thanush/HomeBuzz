import { createContext, useContext, useState } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (product) => {
  setCartItems((prev) => {
    const exists = prev.find((item) => item._id === product._id);

    if (exists) {
      const newQty = (exists.quantity || 0) + (product.quantity || 1);
      if (newQty <= 0) return prev.filter((i) => i._id !== product._id);
      return prev.map((item) =>
        item._id === product._id
          ? { ...item, quantity: newQty }
          : item
      );
    }

    // New item
    return [...prev, { ...product, quantity: product.quantity || 1 }];
  });
};

  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => item._id !== id));
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);