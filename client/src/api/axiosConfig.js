import axios from 'axios';
import { supabase } from '../supabase';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Create axios instance
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to attach JWT token
api.interceptors.request.use(
  async (config) => {
    try {
      // Get current session from Supabase
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.access_token) {
        config.headers.Authorization = `Bearer ${session.access_token}`;
      }
    } catch (error) {
      console.error('Error getting auth token:', error);
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      console.warn('Authentication failed - token may be expired');
      // Optional: redirect to login
    }
    
    if (error.response?.status === 403) {
      console.warn('Authorization failed - access denied');
    }
    
    return Promise.reject(error);
  }
);

// Export as default for compatibility
export default api;
