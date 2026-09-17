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
      let token = localStorage.getItem('access_token');
      
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.warn('Skipping auth token due to timeout or error:', error.message);
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
