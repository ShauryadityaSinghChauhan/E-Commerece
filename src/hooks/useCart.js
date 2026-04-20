import { useCartContext } from '../context/CartContext';

/**
 * Convenience hook exposing only cart-related state & actions.
 */
const useCart = () => {
  const {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartTotal,
    cartCount,
    isInCart,
  } = useCartContext();

  return {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartTotal,
    cartCount,
    isInCart,
  };
};

export default useCart;
