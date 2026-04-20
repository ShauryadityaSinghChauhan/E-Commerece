import { createContext, useContext, useReducer, useEffect } from 'react';
import { getLocalStorage, setLocalStorage } from '../utils/helpers';

// ── Initial State ──────────────────────────────────────────────────────────────
const initialState = {
  cartItems: getLocalStorage('cartItems', []),
  wishlistItems: getLocalStorage('wishlistItems', []),
  recentlyViewed: getLocalStorage('recentlyViewed', []),
  darkMode: getLocalStorage('darkMode', false),
};

// ── Reducer ────────────────────────────────────────────────────────────────────
const cartReducer = (state, action) => {
  let updated;
  switch (action.type) {
    case 'ADD_TO_CART': {
      const exists = state.cartItems.find((i) => i.id === action.payload.id);
      if (exists) {
        updated = state.cartItems.map((i) =>
          i.id === action.payload.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      } else {
        updated = [...state.cartItems, { ...action.payload, quantity: 1 }];
      }
      return { ...state, cartItems: updated };
    }
    case 'REMOVE_FROM_CART':
      updated = state.cartItems.filter((i) => i.id !== action.payload);
      return { ...state, cartItems: updated };

    case 'UPDATE_QUANTITY':
      updated = state.cartItems.map((i) =>
        i.id === action.payload.id
          ? { ...i, quantity: Math.max(1, action.payload.quantity) }
          : i
      );
      return { ...state, cartItems: updated };

    case 'CLEAR_CART':
      return { ...state, cartItems: [] };

    case 'TOGGLE_WISHLIST': {
      const inWishlist = state.wishlistItems.find(
        (i) => i.id === action.payload.id
      );
      if (inWishlist) {
        updated = state.wishlistItems.filter((i) => i.id !== action.payload.id);
      } else {
        updated = [...state.wishlistItems, action.payload];
      }
      return { ...state, wishlistItems: updated };
    }

    case 'ADD_RECENTLY_VIEWED': {
      const filtered = state.recentlyViewed.filter(
        (p) => p.id !== action.payload.id
      );
      const updated = [action.payload, ...filtered].slice(0, 8);
      return { ...state, recentlyViewed: updated };
    }

    case 'TOGGLE_DARK_MODE':
      return { ...state, darkMode: !state.darkMode };

    default:
      return state;
  }
};

// ── Context ────────────────────────────────────────────────────────────────────
const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Persist to localStorage on every state change
  useEffect(() => {
    setLocalStorage('cartItems', state.cartItems);
  }, [state.cartItems]);

  useEffect(() => {
    setLocalStorage('wishlistItems', state.wishlistItems);
  }, [state.wishlistItems]);

  useEffect(() => {
    setLocalStorage('recentlyViewed', state.recentlyViewed);
  }, [state.recentlyViewed]);

  useEffect(() => {
    setLocalStorage('darkMode', state.darkMode);
    // Apply dark class to root
    document.documentElement.classList.toggle('dark', state.darkMode);
  }, [state.darkMode]);

  // ── Actions ────────────────────────────────────────────────────────────────
  const addToCart = (product) =>
    dispatch({ type: 'ADD_TO_CART', payload: product });

  const removeFromCart = (id) =>
    dispatch({ type: 'REMOVE_FROM_CART', payload: id });

  const updateQuantity = (id, quantity) =>
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });

  const clearCart = () => dispatch({ type: 'CLEAR_CART' });

  const toggleWishlist = (product) =>
    dispatch({ type: 'TOGGLE_WISHLIST', payload: product });

  const addRecentlyViewed = (product) =>
    dispatch({ type: 'ADD_RECENTLY_VIEWED', payload: product });

  const toggleDarkMode = () => dispatch({ type: 'TOGGLE_DARK_MODE' });

  const cartTotal = () =>
    state.cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const cartCount = () =>
    state.cartItems.reduce((sum, i) => sum + i.quantity, 0);

  const isInWishlist = (id) =>
    state.wishlistItems.some((i) => i.id === id);

  const isInCart = (id) => state.cartItems.some((i) => i.id === id);

  return (
    <CartContext.Provider
      value={{
        ...state,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        toggleWishlist,
        addRecentlyViewed,
        toggleDarkMode,
        cartTotal,
        cartCount,
        isInWishlist,
        isInCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCartContext = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCartContext must be inside CartProvider');
  return ctx;
};

export default CartContext;
