import { useCartContext } from '../context/CartContext';

/**
 * Convenience hook exposing only wishlist-related state & actions.
 */
const useWishlist = () => {
  const { wishlistItems, toggleWishlist, isInWishlist } = useCartContext();

  return { wishlistItems, toggleWishlist, isInWishlist };
};

export default useWishlist;
