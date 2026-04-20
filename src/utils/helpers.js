/**
 * Format price to USD currency string
 */
export const formatPrice = (price) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);

/**
 * Truncate text to a given length
 */
export const truncateText = (text, maxLength = 60) => {
  if (!text) return '';
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
};

/**
 * Calculate cart totals
 */
export const calculateCartTotals = (cartItems) => {
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const tax = subtotal * 0.1;
  const total = subtotal + tax;
  return { subtotal, tax, total };
};

/**
 * Get star rating array [filled, half, empty]
 */
export const getRatingStars = (rating) => {
  const stars = [];
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  stars.push(...Array(full).fill('full'));
  if (half) stars.push('half');
  stars.push(...Array(empty).fill('empty'));
  return stars;
};

/**
 * Price range filter helper
 */
export const filterByPriceRange = (products, range) => {
  const ranges = {
    '0-100': [0, 100],
    '100-500': [100, 500],
    '500-1000': [500, 1000],
    '1000+': [1000, Infinity],
  };
  if (!range || !ranges[range]) return products;
  const [min, max] = ranges[range];
  return products.filter((p) => p.price >= min && p.price <= max);
};

/**
 * Sort products by given option
 */
export const sortProducts = (products, sortBy) => {
  const sorted = [...products];
  switch (sortBy) {
    case 'price-asc':
      return sorted.sort((a, b) => a.price - b.price);
    case 'price-desc':
      return sorted.sort((a, b) => b.price - a.price);
    case 'rating':
      return sorted.sort((a, b) => b.rating - a.rating);
    case 'newest':
      return sorted.sort((a, b) => b.id - a.id);
    default:
      return sorted;
  }
};

/**
 * Get/set localStorage item safely
 */
export const getLocalStorage = (key, fallback = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
};

export const setLocalStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('localStorage error:', e);
  }
};
