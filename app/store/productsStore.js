import { create } from 'zustand';

/**
 * Products Store using Zustand
 * 
 * Manages products list and single product data with client-side caching
 * Caching Strategy:
 * - Cache products list results based on filters (limit, skip, search, category)
 * - Cache single product details
 * - 5-minute cache expiration
 * - This reduces API calls and improves performance
 */

const useProductsStore = create((set, get) => ({
  products: [],
  currentProduct: null,
  categories: [],
  total: 0,
  loading: false,
  error: null,
  // Cache to store API responses
  cache: {},

  // Fetch categories
  fetchCategories: async () => {
    const cached = get().cache['categories'];
    if (cached && Date.now() - cached.timestamp < 10 * 60 * 1000) {
      set({ categories: cached.categories });
      return;
    }

    try {
      const response = await fetch('https://dummyjson.com/products/categories');
      if (!response.ok) throw new Error('Failed to fetch categories');
      
      const data = await response.json();
      
      set(state => ({
        categories: data,
        cache: {
          ...state.cache,
          categories: {
            categories: data,
            timestamp: Date.now()
          }
        }
      }));
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  },

  // Fetch products with filters
  fetchProducts: async (limit = 12, skip = 0, searchQuery = '', category = '') => {
    const cacheKey = `products-${limit}-${skip}-${searchQuery}-${category}`;
    
    // Check cache
    const cached = get().cache[cacheKey];
    if (cached && Date.now() - cached.timestamp < 5 * 60 * 1000) {
      set({ 
        products: cached.products, 
        total: cached.total,
        loading: false 
      });
      return;
    }

    set({ loading: true, error: null });
    try {
      let url;
      
      if (category) {
        url = `https://dummyjson.com/products/category/${category}?limit=${limit}&skip=${skip}`;
      } else if (searchQuery) {
        url = `https://dummyjson.com/products/search?q=${searchQuery}&limit=${limit}&skip=${skip}`;
      } else {
        url = `https://dummyjson.com/products?limit=${limit}&skip=${skip}`;
      }

      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch products');
      
      const data = await response.json();
      
      set(state => ({
        products: data.products,
        total: data.total,
        loading: false,
        cache: {
          ...state.cache,
          [cacheKey]: {
            products: data.products,
            total: data.total,
            timestamp: Date.now()
          }
        }
      }));
    } catch (error) {
      set({ loading: false, error: error.message });
    }
  },

  // Fetch single product
  fetchProduct: async (id) => {
    const cacheKey = `product-${id}`;
    
    // Check cache
    const cached = get().cache[cacheKey];
    if (cached && Date.now() - cached.timestamp < 5 * 60 * 1000) {
      set({ currentProduct: cached.product, loading: false });
      return;
    }

    set({ loading: true, error: null });
    try {
      const response = await fetch(`https://dummyjson.com/products/${id}`);
      if (!response.ok) throw new Error('Product not found');
      
      const data = await response.json();
      
      set(state => ({
        currentProduct: data,
        loading: false,
        cache: {
          ...state.cache,
          [cacheKey]: {
            product: data,
            timestamp: Date.now()
          }
        }
      }));
    } catch (error) {
      set({ loading: false, error: error.message });
    }
  },

  // Clear cache
  clearCache: () => set({ cache: {} }),
  
  // Clear error
  clearError: () => set({ error: null })
}));

export default useProductsStore;