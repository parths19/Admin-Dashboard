import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Authentication Store using Zustand
 * 
 * Why Zustand?
 * - Simpler API than Redux - no boilerplate, no actions/reducers
 * - Built-in async action support without middleware
 * - Small bundle size (~1KB) vs Redux (~20KB)
 * - Perfect for small-medium apps with straightforward state needs
 * - Easy to use persist middleware for localStorage integration
 */

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
      error: null,

      // Login action with async API call
      login: async (username, password) => {
        set({ loading: true, error: null });
        try {
          const response = await fetch('https://dummyjson.com/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password, expiresInMins: 60 })
          });

          if (!response.ok) {
            throw new Error('Invalid credentials');
          }

          const data = await response.json();
          
          set({
            user: data,
            token: data.token,
            isAuthenticated: true,
            loading: false,
            error: null
          });

          return { success: true };
        } catch (error) {
          set({ 
            loading: false, 
            error: error.message,
            isAuthenticated: false,
            user: null,
            token: null
          });
          return { success: false, error: error.message };
        }
      },

      // Logout action
      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null
        });
      },

      // Clear error
      clearError: () => set({ error: null })
    }),
    {
      name: 'auth-storage', // localStorage key
      partialize: (state) => ({ 
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);

export default useAuthStore;