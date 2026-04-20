import axios from 'axios';

const BASE_URL = 'https://dummyjson.com';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

// Intercept responses for global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.message);
    return Promise.reject(error);
  }
);

// DummyJSON returns { products: [], total, skip, limit } for list endpoints
export const fetchProducts = (limit = 194, skip = 0) =>
  api.get(`/products?limit=${limit}&skip=${skip}`);

export const fetchProductById = (id) => api.get(`/products/${id}`);

// DummyJSON category list endpoint returns a flat string array
export const fetchCategories = () => api.get('/products/category-list');

export const fetchProductsByCategory = (category) =>
  api.get(`/products/category/${category}?limit=100`);

export default api;
