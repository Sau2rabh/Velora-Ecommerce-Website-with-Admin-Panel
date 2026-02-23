import { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const startCart = JSON.parse(localStorage.getItem('cartItems')) || [];
    setCartItems(startCart);
  }, []);

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, qty = 1, size = '') => {
    const existItem = cartItems.find((x) => x._id === product._id && x.size === size);

    if (existItem) {
      setCartItems(
        cartItems.map((x) =>
          (x._id === existItem._id && x.size === size) ? { ...existItem, qty: Number(qty) } : x
        )
      );
    } else {
      setCartItems([...cartItems, { ...product, qty: Number(qty), size }]);
    }
  };

  const removeFromCart = (id, size = '') => {
    setCartItems(cartItems.filter((x) => !(x._id === id && x.size === size)));
  };

  const clearCart = () => {
      setCartItems([]);
  }

  const getCartCount = () => {
    return cartItems.reduce((qty, item) => Number(item.qty) + qty, 0);
  };

  const updateQuantity = (productId, qty, size = '') => {
      const item = cartItems.find(x => x._id === productId && x.size === size);
      if (item) {
          addToCart(item, qty, size);
      }
  };

  const [isCartOpen, setIsCartOpen] = useState(false);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const toggleCart = () => setIsCartOpen(!isCartOpen);

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    clearCart,
    getCartCount,
    updateQuantity,
    isCartOpen,
    openCart,
    closeCart,
    toggleCart
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
