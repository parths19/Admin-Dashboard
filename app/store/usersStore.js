import { create } from 'zustand';

/**
 * Users Store using Zustand
 * 
 * Manages users list and single user data with client-side caching
 * Caching Strategy:
 * - Cache users list results to avoid repeated API calls
 * - Cache single user details for quick access
 * - Manual cache invalidation when needed
 */

const useUsersStore = create((set, get) => ({
  users: [],
  currentUser: null,
  total: 0,
  loading: false,
  error: null,
  // Cache object to store fetched data
  cache: {},

  // Fetch users list with pagination and search
  fetchUsers: async (limit = 10, skip = 0, searchQuery = '') => {
    const cacheKey = `users-${limit}-${skip}-${searchQuery}`;
    
    // Check cache first
    const cached = get().cache[cacheKey];
    if (cached && Date.now() - cached.timestamp < 5 * 60 * 1000) { // 5 min cache
      set({ 
        users: cached.users, 
        total: cached.total,
        loading: false 
      });
      return;
    }

    set({ loading: true, error: null });
    try {
      const url = searchQuery
        ? `https://dummyjson.com/users/search?q=${searchQuery}&limit=${limit}&skip=${skip}`
        : `https://dummyjson.com/users?limit=${limit}&skip=${skip}`;

      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch users');
      
      const data = await response.json();
      
      // Update cache
      set(state => ({
        users: data.users,
        total: data.total,
        loading: false,
        cache: {
          ...state.cache,
          [cacheKey]: {
            users: data.users,
            total: data.total,
            timestamp: Date.now()
          }
        }
      }));
    } catch (error) {
      set({ loading: false, error: error.message });
    }
  },

  // Fetch single user
  fetchUser: async (id) => {
    const cacheKey = `user-${id}`;
    
    // Check cache
    const cached = get().cache[cacheKey];
    if (cached && Date.now() - cached.timestamp < 5 * 60 * 1000) {
      set({ currentUser: cached.user, loading: false });
      return;
    }

    set({ loading: true, error: null });
    try {
      const response = await fetch(`https://dummyjson.com/users/${id}`);
      if (!response.ok) throw new Error('User not found');
      
      const data = await response.json();
      
      set(state => ({
        currentUser: data,
        loading: false,
        cache: {
          ...state.cache,
          [cacheKey]: {
            user: data,
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

export default useUsersStore;