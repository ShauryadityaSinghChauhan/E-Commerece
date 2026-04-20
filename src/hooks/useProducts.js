import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchProducts, fetchCategories, fetchProductsByCategory } from '../services/api';

// Simple in-memory cache to avoid re-fetching
const cache = {};

const useProducts = (category = '') => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const mountedRef = useRef(true);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    const cacheKey = category || 'all';

    try {
      if (cache[cacheKey]) {
        if (mountedRef.current) {
          setProducts(cache[cacheKey]);
          setLoading(false);
        }
        return;
      }

      const res = category
        ? await fetchProductsByCategory(category)
        : await fetchProducts();

      // DummyJSON wraps list results in { products: [...] }
      const data = res.data?.products ?? res.data;

      if (mountedRef.current) {
        cache[cacheKey] = data;
        setProducts(data);
      }
    } catch (err) {
      if (mountedRef.current) setError(err.message || 'Failed to fetch products');
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, [category]);

  const loadCategories = useCallback(async () => {
    if (cache['categories']) {
      setCategories(cache['categories']);
      return;
    }
    try {
      const res = await fetchCategories();
      // DummyJSON /category-list returns a plain string[]
      const cats = Array.isArray(res.data) ? res.data : [];
      cache['categories'] = cats;
      if (mountedRef.current) setCategories(cats);
    } catch (err) {
      console.error('Failed to load categories:', err);
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    loadProducts();
    loadCategories();
    return () => { mountedRef.current = false; };
  }, [loadProducts, loadCategories]);

  const refetch = () => {
    delete cache[category || 'all'];
    loadProducts();
  };

  return { products, categories, loading, error, refetch };
};

export default useProducts;
